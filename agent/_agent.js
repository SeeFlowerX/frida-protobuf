(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_enum_fields = exports.generate_package = exports.send_log = exports.logAllProperties = void 0;
function logAllProperties(obj) {
    if (obj == null)
        return;
    console.log(Object.getOwnPropertyNames(obj).join("\n"));
    logAllProperties(Object.getPrototypeOf(obj));
}
exports.logAllProperties = logAllProperties;
function send_log(msg) {
    send({ "log": msg });
    console.log(msg);
}
exports.send_log = send_log;
function generate_package(cls) {
    let name = `${cls.class.getName()}`;
    return name.slice(0, name.lastIndexOf('.'));
}
exports.generate_package = generate_package;
function generate_enum_fields(cls) {
    let fields_config = {};
    Java.perform(function () {
        let enum_values = cls.values();
        let methods = cls.class.getDeclaredMethods();
        let flag_getNumber = false;
        let flag_getValue = false;
        for (let i = 0; i < methods.length; i++) {
            if (`${methods[i].getName()}` == "getValue") {
                flag_getValue = true;
                break;
            }
            if (`${methods[i].getName()}` == "getNumber") {
                flag_getNumber = true;
                break;
            }
        }
        if (!flag_getNumber && !flag_getValue) {
            console.log("没有发现enum获取元素的方法");
            return;
        }
        enum_values.forEach(function name(params) {
            if (`${params}`.endsWith("_NOT_SET"))
                return;
            if (flag_getNumber) {
                fields_config[`${params}`] = params.getNumber();
            }
            else if (flag_getValue) {
                fields_config[`${params}`] = params.getValue();
            }
        });
    });
    return fields_config;
}
exports.generate_enum_fields = generate_enum_fields;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_messagelite = void 0;
const common_1 = require("../common");
const libjava_1 = require("../libjava");
function generate_oneof(cls, CaseCls) {
    let case_fields_config = common_1.generate_enum_fields(CaseCls);
    let case_fields_name_map = {};
    for (const [name, tag] of Object.entries(case_fields_config)) {
        case_fields_name_map[name.toUpperCase().replaceAll("_", "")] = name;
    }
    // 每一个元素 都会有一个对应的方法 返回值类型是对应proto的元素类型
    let methods = cls.class.getDeclaredMethods();
    let fields_config = [];
    methods.forEach(function (method) {
        let method_name = `${method.getName()}`;
        if (!method_name.startsWith("get"))
            return;
        let excepted_name = method_name.slice(3, method_name.length).toUpperCase();
        let matched_name = case_fields_name_map[excepted_name];
        if (matched_name) {
            let name = matched_name.toLowerCase();
            let field_type = method.getReturnType().getSimpleName();
            let import_pkg = "";
            let need_import = true;
            let real_field_type = field_type;
            if (TypeConfig[field_type]) {
                real_field_type = TypeConfig[field_type];
                need_import = false;
            }
            else {
                import_pkg = method.getReturnType().getCanonicalName();
                import_pkg = import_pkg.slice(0, import_pkg.lastIndexOf("."));
            }
            let type_1 = { "need_import": need_import, "type": real_field_type, "package": import_pkg };
            let tag = case_fields_config[matched_name];
            // 由于这里是oneof类型 所以不会有 List Map 的情况
            let field_config = {
                "label": "",
                "type_1": type_1,
                "type_2": {},
                "name": name,
                "tag": tag,
            };
            fields_config.push(field_config);
        }
    });
    return fields_config;
}
function generate_messagelite(cls, SkipclassNameSet) {
    let cls_config = {};
    let oneof_config = {};
    function try_generate_oneof(cls) {
        let fields = cls.class.getDeclaredFields();
        let fields_name = [];
        let case_flag = false;
        let field_flag = false;
        let case_cls_flag = false;
        let excepted_field_name = "";
        fields.forEach(function (field) {
            let field_name = `${field.getName()}`;
            fields_name.push(field_name);
            if (field_name[0] == field_name[0].toLowerCase() && field_name.endsWith("Case_")) {
                case_flag = true;
                excepted_field_name = field_name.slice(0, field_name.lastIndexOf("Case_")) + "_";
            }
            if (!field_flag && excepted_field_name && fields_name.includes(excepted_field_name)) {
                // let ObjectClz = Java.use("java.lang.Object").class;
                let excepted_field = cls.class.getDeclaredField(excepted_field_name);
                if (libjava_1.ObjectClz.equals(excepted_field.getType())) {
                    field_flag = true;
                }
            }
        });
        if (case_flag && field_flag && excepted_field_name) {
            // 检查有没有特定的内部类
            let in_case_cls = null;
            let in_case_name = excepted_field_name.slice(0, excepted_field_name.lastIndexOf("_"));
            oneof_config["name"] = in_case_name;
            in_case_name = in_case_name.replace(in_case_name[0], in_case_name[0].toUpperCase());
            in_case_name = `${cls.class.getName()}$${in_case_name}Case`;
            try {
                in_case_cls = Java.use(in_case_name);
            }
            catch (e) {
            }
            if (in_case_cls) {
                oneof_config["fields_config"] = generate_oneof(cls, in_case_cls);
                SkipclassNameSet.add(in_case_name);
                case_cls_flag = true;
            }
            // console.log("in_case_cls", `${cls.class.getName()}$${in_case_name}Case`, in_case_cls)
        }
        // console.log(`OneOfCheck -> case_flag ${case_flag} field_flag ${field_flag} excepted_field_name ${excepted_field_name} case_cls_flag ${case_cls_flag}`)
        return case_cls_flag;
    }
    // 首先检查是不是message嵌套oneof类型 有以下特征
    // - 有一个内部类 xxxCase 枚举类型 并且有一个是 XXX_NOT_SET(0)
    // - 有一个阈值是 xxxCase_
    // - 有一个类 当前类名+OrBuilder的类
    // - 有多个 xxx_FIELD_NUMBER 但是没有对应的proto字段
    // - 嵌套的oneof的名字 xxx_ 同时它的类型是 Object
    // 更多特征参考 src/google/protobuf/compiler/java/java_message.cc
    try_generate_oneof(cls);
    ;
    cls_config["type"] = "message";
    cls_config["package"] = common_1.generate_package(cls);
    cls_config["cls_name"] = `${cls.class.getSimpleName()}`;
    cls_config["fields_config"] = generate_messagelite_fields(cls);
    cls_config["oneof"] = oneof_config;
    // console.log(JSON.stringify(cls_config, null, 4))
    return cls_config;
}
exports.generate_messagelite = generate_messagelite;
let TypeConfig = {
    "int": "int32",
    "long": "int64",
    "String": "string",
    "boolean": "bool",
    "Boolean": "bool",
};
function generate_messagelite_fields(cls) {
    let fields_config = [];
    Java.perform(function () {
        function try_convert_name(name) {
            let nameArr = [];
            let last_char = "";
            for (let j = 0; j < name.length; j++) {
                let char = name[j];
                if (last_char && char == char.toUpperCase()) {
                    nameArr.push("_");
                    nameArr.push(char.toLowerCase());
                }
                else {
                    nameArr.push(char);
                }
                last_char = char;
            }
            let excepted_field_name = nameArr.join("");
            if (field_number_cache.includes(excepted_field_name.toUpperCase())) {
                let fname = excepted_field_name.toUpperCase() + "_FIELD_NUMBER";
                let tag = Java.cast(cls.class.getDeclaredField(fname).get(null), Java.use("java.lang.Integer"));
                return [excepted_field_name, `${tag}`];
            }
            else {
                return ["", "0"];
            }
        }
        function handler_field(field, name, tagstr) {
            let tag = parseInt(tagstr);
            function get_type(sign) {
                let sign_type_name = sign.slice(sign.lastIndexOf("/") + 1, sign.lastIndexOf(";"));
                if (TypeConfig[sign_type_name]) {
                    return { "type": TypeConfig[sign_type_name], "need_import": false, "package": "", "tag": tag };
                }
                else {
                    let import_pkg = sign.slice(1, sign.lastIndexOf("/")).replaceAll("/", ".");
                    return { "type": sign_type_name, "need_import": true, "package": import_pkg, "tag": tag };
                }
            }
            let type_name = field.getType().getSimpleName();
            let import_pkg = field.getType().getCanonicalName();
            import_pkg = import_pkg.slice(0, import_pkg.lastIndexOf("."));
            let field_config = { "label": "optional", "type_1": {}, "type_2": { "type": "" }, "tag": tag };
            if (TypeConfig[type_name]) {
                field_config['type_1'] = { "need_import": false, "type": TypeConfig[type_name], "package": "" };
            }
            else if (type_name == "ByteString") {
                field_config['type_1']["need_import"] = true;
                field_config["package"] = "google.protobuf.any";
                field_config["type_1"]["type"] = "google.protobuf.Any";
            }
            else if (type_name == "ProtobufList") {
                field_config["label"] = "repeated";
                field_config["type_1"] = get_type(`${field.getSignatureAnnotation()[1]}`);
            }
            else if (type_name == "MapFieldLite") {
                field_config["label"] = "";
                field_config["type_1"] = get_type(`${field.getSignatureAnnotation()[1]}`);
                field_config["type_2"] = get_type(`${field.getSignatureAnnotation()[2]}`);
            }
            else {
                field_config['type_1']["need_import"] = true;
                field_config['type_1']["type"] = type_name;
                field_config['type_1']["package"] = import_pkg;
            }
            field_config["name"] = name;
            return field_config;
        }
        let field_cache = [];
        let field_number_cache = [];
        let fields = cls.class.getDeclaredFields();
        fields.forEach(function (field) {
            let field_name = `${field.getName()}`;
            if (field_name == field_name.toUpperCase(), field_name.endsWith("_FIELD_NUMBER")) {
                // 参考 src/google/protobuf/compiler/java/java_helpers.cc FieldConstantName
                field_number_cache.push(field_name.slice(0, field_name.lastIndexOf("_FIELD_NUMBER")));
            }
            else if (field_name[0] == field_name[0].toLowerCase() && field_name.endsWith("_")) {
                // 参考 src/google/protobuf/compiler/java/java_helpers.cc ToCamelCase
                field_cache.push(field);
            }
        });
        // 对于某些扩展类型的 暂时不管...
        if (field_number_cache.length == 0)
            return;
        for (let i = 0; i < field_cache.length; i++) {
            let field = field_cache[i];
            let field_name = `${field.getName()}`;
            let [name, tag] = try_convert_name(field_name.slice(0, field_name.lastIndexOf("_")));
            // console.log("name ===>", name)
            if (!name) {
                continue;
            }
            // tag
            let field_config = handler_field(field, name, tag);
            if (field_config) {
                fields_config.push(field_config);
            }
        }
    });
    // console.log("------------------>", JSON.stringify(fields_config, null, 4))
    return fields_config;
}

},{"../common":1,"../libjava":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllMessageCls = exports.wrapJavaPerform = void 0;
const generate_1 = require("./wire/generate");
const generate_2 = require("./google/generate");
const common_1 = require("./common");
const libjava_1 = require("./libjava");
const libjava_2 = require("./libjava");
const wrapJavaPerform = (fn) => {
    return new Promise((resolve, reject) => {
        Java.perform(() => {
            try {
                resolve(fn());
            }
            catch (e) {
                reject(e);
            }
        });
    });
};
exports.wrapJavaPerform = wrapJavaPerform;
function IsVaildEnumCls(cls) {
    let annotations = cls.class.getSignatureAnnotation();
    if (annotations.length != 4)
        return false;
    return annotations[3].includes("Internal$EnumLite") || annotations[3].includes("WireEnum");
}
function skipAbstract(clsLoader, className) {
    // let ModifierCls = Java.use("java.lang.reflect.Modifier")
    // 跳过抽象类
    let clz = null;
    try {
        clz = clsLoader.loadClass(className);
    }
    catch (e) {
    }
    return clz && libjava_2.ModifierCls.isAbstract(clz.getModifiers());
}
function getCls(className) {
    let cls = null;
    let cls_super = null;
    try {
        cls = Java.use(className);
    }
    catch (e) {
    }
    if (!cls) {
        return [cls, cls_super];
    }
    cls_super = cls.class.getSuperclass();
    return [cls, cls_super];
}
const GetAllMessageCls = (use_default_any, keyword_expected, keyword_unexpected = "") => {
    return exports.wrapJavaPerform(() => {
        let keywords_expected = keyword_expected.split(",");
        let keywords_unexpected = keyword_unexpected.split(",");
        let nameSet = new Set();
        let dexfileSet = new Set();
        let SkipclassNameSet = new Set();
        // let ModifierCls = Java.use("java.lang.reflect.Modifier")
        // let WireMessageClz = Java.use("com.squareup.wire.Message").class;
        // let EnumClz = Java.use("java.lang.Enum").class;
        let DexFileCls = Java.use("dalvik.system.DexFile");
        let BaseDexClassLoaderCls = Java.use("dalvik.system.BaseDexClassLoader");
        let DexPathListCls = Java.use("dalvik.system.DexPathList");
        Java.enumerateClassLoaders({
            onMatch: function (clsLoader) {
                if (clsLoader.$className == "java.lang.BootClassLoader")
                    return;
                let clsLoaderObj = Java.cast(clsLoader, BaseDexClassLoaderCls);
                let pathListObj = clsLoaderObj.pathList.value;
                let DexPathListObj = Java.cast(pathListObj, DexPathListCls);
                let dexElementsObj = DexPathListObj.dexElements.value;
                for (let index = 0; index < dexElementsObj.length; index++) {
                    let dexElement = dexElementsObj[index];
                    try {
                        let dexfile = dexElement.dexFile.value;
                        let dexfile_name = `${dexfile}`;
                        if (!dexfile || dexfileSet.has(`${dexfile_name}`)) {
                            // send_log(`[+] dexfile ==> ${dexElement} ${dexfile}`)
                            continue;
                        }
                        if (dexfile_name.includes("/system"))
                            continue;
                        dexfileSet.add(`${dexfile_name}`);
                        common_1.send_log(`[-] start enumerate ${dexfile_name} dexfile_name include /system => ${dexfile_name.includes("/system")}`);
                        let dexfileobj = Java.cast(dexfile, DexFileCls);
                        let entries = dexfileobj.entries();
                        while (entries.hasMoreElements()) {
                            let className = entries.nextElement().toString();
                            if (!className.includes(".")) {
                                // 跳过没有 . 的类名
                                // send_log(`[-] skip ${className}`)
                                continue;
                            }
                            if (SkipclassNameSet.has(`${className}`))
                                continue;
                            // send_log(`className ==> ${className}`)
                            // 某些类通过Java.use会卡死 过滤掉
                            let unexpected_flag = false;
                            for (let i = 0; i < keywords_unexpected.length; i++) {
                                if (className.includes(keywords_unexpected[i])) {
                                    unexpected_flag = true;
                                    break;
                                }
                            }
                            // send_log(`unexpected_flag => ${unexpected_flag}`)
                            if (unexpected_flag) {
                                // send_log(`[-] skip ${className}`);
                                continue;
                            }
                            ;
                            // 如果预设了关键词 必须包含关键词才检查 没有预设则会全部检查
                            let expected_flag = false;
                            for (let i = 0; i < keywords_expected.length; i++) {
                                if (className.includes(keywords_expected[i])) {
                                    expected_flag = true;
                                    break;
                                }
                            }
                            // send_log(`expected_flag => ${expected_flag}`)
                            if (!expected_flag)
                                continue;
                            if (skipAbstract(clsLoader, className))
                                continue;
                            // 尝试根据类名加载类
                            // send_log(`className => ${className}`)
                            let [cls, cls_super] = getCls(className);
                            // send_log(`className => ${cls} ${cls_super}`)
                            if (!cls || !cls_super)
                                continue;
                            if (libjava_2.WireMessageClz && libjava_2.WireMessageClz.equals(cls_super)) {
                                nameSet.add(className);
                                common_1.send_log(`[+] ${`${nameSet.size}`.padStart(5, ' ')} ${className}`);
                                send(generate_1.generate_message(cls, use_default_any));
                            }
                            else if (libjava_2.EnumClz.equals(cls_super) && !cls.class.getEnclosingClass() && IsVaildEnumCls(cls)) {
                                // 这里不能用WireEnum判断 因为编译器实际上把它优化成Enum了 via @zsh
                                // Internal$EnumLite 同样是被优化了的
                                nameSet.add(className);
                                common_1.send_log(`[+] ${`${nameSet.size}`.padStart(5, ' ')} ${className}`);
                                send(generate_1.generate_enum(cls));
                            }
                            else if (libjava_2.GeneratedMessageLiteClz && libjava_2.GeneratedMessageLiteClz.equals(cls_super)) {
                                nameSet.add(className);
                                common_1.send_log(`[+] ${`${nameSet.size}`.padStart(5, ' ')} ${className}`);
                                send(generate_2.generate_messagelite(cls, SkipclassNameSet));
                            }
                        }
                        common_1.send_log(`[+] enumerate ${dexfile} end`);
                    }
                    catch (e) {
                        console.trace(e);
                    }
                }
            },
            onComplete: function () {
                console.log("[*] enumerateClassLoaders complete !");
            }
        });
    });
};
exports.GetAllMessageCls = GetAllMessageCls;
libjava_1.InitClsClz();
rpc.exports = {
    dump: exports.GetAllMessageCls,
};

},{"./common":1,"./google/generate":2,"./libjava":4,"./wire/generate":5}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitClsClz = exports.ObjectClz = exports.EnumClz = exports.GeneratedMessageLiteClz = exports.WireMessageClz = exports.ModifierCls = void 0;
exports.ModifierCls = null;
exports.WireMessageClz = null;
exports.GeneratedMessageLiteClz = null;
exports.EnumClz = null;
exports.ObjectClz = null;
function InitClsClz() {
    Java.perform(function () {
        exports.ModifierCls = Java.use("java.lang.reflect.Modifier");
        exports.EnumClz = Java.use("java.lang.Enum").class;
        exports.ObjectClz = Java.use("java.lang.Object").class;
        try {
            exports.WireMessageClz = Java.use("com.squareup.wire.Message").class;
        }
        catch (e) {
        }
        try {
            exports.GeneratedMessageLiteClz = Java.use("com.google.protobuf.GeneratedMessageLite").class;
        }
        catch (e) {
        }
    });
}
exports.InitClsClz = InitClsClz;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_enum = exports.generate_message = void 0;
const common_1 = require("../common");
function generate_message(cls, use_default_any) {
    let cls_config = {};
    Java.perform(function () {
        cls_config["type"] = "message";
        cls_config["package"] = common_1.generate_package(cls);
        cls_config["cls_name"] = `${cls.class.getSimpleName()}`;
        cls_config["fields_config"] = generate_message_fields(cls, use_default_any);
    });
    return cls_config;
}
exports.generate_message = generate_message;
function generate_message_fields(cls, use_default_any) {
    let fields_config = [];
    let WireFieldCls = Java.use("com.squareup.wire.WireField");
    Java.perform(function () {
        function get_label(obj) {
            return `${obj.label()}`.toLowerCase();
        }
        function get_tag(obj) {
            return obj.tag();
        }
        function get_adapter(obj) {
            return obj.adapter();
        }
        function get_keyAdapter(obj) {
            return obj.keyAdapter();
        }
        function handler_annotation(field, annotation) {
            function get_type(adapter) {
                let need_import = false;
                let type = "";
                let import_pkg = "";
                if (adapter.includes("#")) {
                    let infos = adapter.split("#");
                    if (infos[0] == "com.squareup.wire.ProtoAdapter") {
                        type = infos[1].toLowerCase();
                    }
                    else if (infos[1] == "ADAPTER") {
                        type = infos[0].split(".").pop();
                        if (use_default_any && type == "Any") {
                            type = "google.protobuf.Any";
                        }
                        need_import = true;
                        import_pkg = infos[0].slice(0, infos[0].lastIndexOf("."));
                    }
                    else {
                        common_1.send_log(`[*] unhandled adapter => ${adapter}`);
                    }
                }
                ;
                return { "need_import": need_import, "type": type, "package": import_pkg };
            }
            let obj = Java.cast(annotation, WireFieldCls);
            let name = field.getName();
            let label = get_label(obj);
            let tag = get_tag(obj);
            let adapter = get_adapter(obj);
            let keyAdapter = get_keyAdapter(obj);
            let first = null;
            let second = null;
            if (keyAdapter) {
                // map类型 proto文件定义则没有label
                label = "";
                first = keyAdapter;
                second = adapter;
            }
            else {
                first = adapter;
                second = keyAdapter;
            }
            let type_1 = get_type(first);
            let type_2 = get_type(second);
            return {
                "label": label,
                "type_1": type_1,
                "type_2": type_2,
                "name": name,
                "tag": tag,
            };
        }
        let fields = cls.class.getDeclaredFields();
        fields.forEach(function (field) {
            let annotation = field.getAnnotation(WireFieldCls.class);
            if (!annotation)
                return;
            let field_config = handler_annotation(field, annotation);
            fields_config.push(field_config);
        });
    });
    return fields_config;
}
function generate_enum(cls) {
    let cls_config = {};
    Java.perform(function () {
        Java.perform(function () {
            cls_config["type"] = "enum";
            cls_config["package"] = common_1.generate_package(cls);
            cls_config["cls_name"] = `${cls.class.getSimpleName()}`;
            cls_config["fields_config"] = common_1.generate_enum_fields(cls);
        });
    });
    return cls_config;
}
exports.generate_enum = generate_enum;
// function generate_enum_fields(cls: any){
//     let fields_config:{[key: string]: any} = {};
//     Java.perform(function(){
//         let enum_values = cls.values();
//         enum_values.forEach(function name(params: any) {
//             fields_config[`${params}`] = params.getValue();
//         })
//     })
//     return fields_config;
// }

},{"../common":1}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tbW9uLnRzIiwic3JjL2dvb2dsZS9nZW5lcmF0ZS50cyIsInNyYy9pbmRleC50cyIsInNyYy9saWJqYXZhLnRzIiwic3JjL3dpcmUvZ2VuZXJhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSxTQUFnQixnQkFBZ0IsQ0FBQyxHQUFRO0lBQ3JDLElBQUksR0FBRyxJQUFJLElBQUk7UUFBRSxPQUFPO0lBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hELGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNqRCxDQUFDO0FBSkQsNENBSUM7QUFFRCxTQUFnQixRQUFRLENBQUMsR0FBVztJQUNoQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztJQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLENBQUM7QUFIRCw0QkFHQztBQUVELFNBQWdCLGdCQUFnQixDQUFDLEdBQVE7SUFDckMsSUFBSSxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7SUFDcEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDaEQsQ0FBQztBQUhELDRDQUdDO0FBRUQsU0FBZ0Isb0JBQW9CLENBQUMsR0FBUTtJQUN6QyxJQUFJLGFBQWEsR0FBd0IsRUFBRSxDQUFDO0lBQzVDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDVCxJQUFJLFdBQVcsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7UUFD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Q0FBQyxHQUFHLE1BQU0sQ0FBQztZQUM1QixVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcseUJBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDO1lBQ3hELFVBQVUsQ0FBQyxlQUFlLENBQUMsR0FBRyw2QkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1RCxDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUMsQ0FBQyxDQUFBO0lBQ0YsT0FBTyxVQUFVLENBQUM7QUFDdEIsQ0FBQztBQVhELHNDQVdDO0FBRUQsMkNBQTJDO0FBQzNDLG1EQUFtRDtBQUNuRCwrQkFBK0I7QUFDL0IsMENBQTBDO0FBQzFDLDJEQUEyRDtBQUMzRCw4REFBOEQ7QUFDOUQsYUFBYTtBQUNiLFNBQVM7QUFDVCw0QkFBNEI7QUFDNUIsSUFBSSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIn0=
