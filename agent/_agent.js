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
    "double": "double",
    "float": "float",
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
const generate_2 = require("./wire2/generate");
const generate_3 = require("./google/generate");
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
                            if (libjava_2.Wire2MessageClz && libjava_2.Wire2MessageClz.equals(cls_super)) {
                                nameSet.add(className);
                                common_1.send_log(`[+] ${`${nameSet.size}`.padStart(5, ' ')} ${className}`);
                                send(generate_2.generate_message_2(cls, use_default_any));
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
                                send(generate_3.generate_messagelite(cls, SkipclassNameSet));
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

},{"./common":1,"./google/generate":2,"./libjava":4,"./wire/generate":5,"./wire2/generate":6}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitClsClz = exports.ObjectClz = exports.EnumClz = exports.GeneratedMessageLiteClz = exports.Wire2ProtoFieldCls = exports.Wire2FieldCls = exports.Wire2MessageClz = exports.WireProtoFieldCls = exports.WireFieldCls = exports.WireMessageClz = exports.ModifierCls = void 0;
exports.ModifierCls = null;
exports.WireMessageClz = null;
exports.WireFieldCls = null;
exports.WireProtoFieldCls = null;
exports.Wire2MessageClz = null;
exports.Wire2FieldCls = null;
exports.Wire2ProtoFieldCls = null;
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
        catch (error) {
        }
        try {
            exports.WireFieldCls = Java.use("com.squareup.wire.WireField");
        }
        catch (error) {
        }
        try {
            exports.WireProtoFieldCls = Java.use("com.squareup.wire.ProtoField");
        }
        catch (error) {
        }
        try {
            exports.Wire2MessageClz = Java.use("com.squareup.wire2.Message").class;
        }
        catch (e) {
        }
        try {
            exports.Wire2FieldCls = Java.use("com.squareup.wire2.WireField");
        }
        catch (e) {
        }
        try {
            exports.Wire2ProtoFieldCls = Java.use("com.squareup.wire2.ProtoField");
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
const libjava_1 = require("../libjava");
function generate_message(cls, use_default_any) {
    let cls_config = {};
    Java.perform(function () {
        cls_config["type"] = "message";
        cls_config["package"] = common_1.generate_package(cls);
        cls_config["cls_name"] = `${cls.class.getSimpleName()}`;
        try {
            cls_config["fields_config"] = generate_message_fields_WireField(cls, use_default_any);
        }
        catch (error) {
        }
        if (cls_config["fields_config"].length == 0) {
            try {
                cls_config["fields_config"] = generate_message_fields_ProtoField(cls, use_default_any);
            }
            catch (error) {
                console.log("gdsccccg", error);
            }
        }
    });
    return cls_config;
}
exports.generate_message = generate_message;
function generate_message_fields_WireField(cls, use_default_any) {
    let fields_config = [];
    if (!libjava_1.WireFieldCls)
        return fields_config;
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
            let obj = Java.cast(annotation, libjava_1.WireFieldCls);
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
            let annotation = field.getAnnotation(libjava_1.WireFieldCls.class);
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
function generate_message_fields_ProtoField(cls, use_default_any) {
    let fields_config = [];
    if (!libjava_1.WireProtoFieldCls)
        return fields_config;
    Java.perform(function () {
        function get_label(obj) {
            return `${obj.label()}`.toLowerCase();
        }
        function get_tag(obj) {
            return obj.tag();
        }
        function get_adapter(obj) {
            return obj.type();
        }
        function handler_annotation(field, annotation) {
            function get_type(type) {
                let need_import = false;
                let import_pkg = "";
                if (type != "") {
                    type = type.name().toLowerCase();
                }
                if (type == "message") {
                    need_import = true;
                    import_pkg = field.getType().getCanonicalName();
                    import_pkg = import_pkg.slice(0, import_pkg.lastIndexOf("."));
                    type = field.getType().getSimpleName();
                    if (type == "List") {
                        let sign = field.getSignatureAnnotation()[1];
                        type = sign.slice(sign.lastIndexOf("/") + 1, sign.lastIndexOf(";"));
                        import_pkg = sign.slice(1, sign.lastIndexOf("/")).replaceAll("/", ".");
                    }
                }
                return { "need_import": need_import, "type": type, "package": import_pkg };
            }
            let obj = Java.cast(annotation, libjava_1.WireProtoFieldCls);
            let name = field.getName();
            let label = get_label(obj);
            let tag = get_tag(obj);
            let first = get_adapter(obj);
            let type_1 = get_type(first);
            let type_2 = get_type("");
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
            let annotation = field.getAnnotation(libjava_1.WireProtoFieldCls.class);
            if (!annotation)
                return;
            let field_config = handler_annotation(field, annotation);
            fields_config.push(field_config);
        });
    });
    return fields_config;
}

},{"../common":1,"../libjava":4}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_enum_2 = exports.generate_message_2 = void 0;
const common_1 = require("../common");
const libjava_1 = require("../libjava");
function generate_message_2(cls, use_default_any) {
    let cls_config = {};
    Java.perform(function () {
        cls_config["type"] = "message";
        cls_config["package"] = common_1.generate_package(cls);
        cls_config["cls_name"] = `${cls.class.getSimpleName()}`;
        cls_config["fields_config"] = generate_message_fields_WireField(cls, use_default_any);
        if (cls_config["fields_config"].length == 0) {
            cls_config["fields_config"] = generate_message_fields_ProtoField(cls, use_default_any);
        }
    });
    return cls_config;
}
exports.generate_message_2 = generate_message_2;
function generate_message_fields_WireField(cls, use_default_any) {
    let fields_config = [];
    if (!libjava_1.Wire2FieldCls)
        return fields_config;
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
            let obj = Java.cast(annotation, libjava_1.Wire2FieldCls);
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
            let annotation = field.getAnnotation(libjava_1.Wire2FieldCls.class);
            if (!annotation)
                return;
            let field_config = handler_annotation(field, annotation);
            fields_config.push(field_config);
        });
    });
    return fields_config;
}
function generate_enum_2(cls) {
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
exports.generate_enum_2 = generate_enum_2;
function generate_message_fields_ProtoField(cls, use_default_any) {
    let fields_config = [];
    if (!libjava_1.Wire2ProtoFieldCls)
        return fields_config;
    Java.perform(function () {
        function get_label(obj) {
            return `${obj.label()}`.toLowerCase();
        }
        function get_tag(obj) {
            return obj.tag();
        }
        function get_adapter(obj) {
            return obj.type();
        }
        function handler_annotation(field, annotation) {
            function get_type(type) {
                let need_import = false;
                let import_pkg = "";
                if (type != "") {
                    type = type.name().toLowerCase();
                }
                if (type == "message") {
                    need_import = true;
                    import_pkg = field.getType().getCanonicalName();
                    import_pkg = import_pkg.slice(0, import_pkg.lastIndexOf("."));
                    type = field.getType().getSimpleName();
                    if (type == "List") {
                        let sign = field.getSignatureAnnotation()[1];
                        type = sign.slice(sign.lastIndexOf("/") + 1, sign.lastIndexOf(";"));
                        import_pkg = sign.slice(1, sign.lastIndexOf("/")).replaceAll("/", ".");
                    }
                }
                return { "need_import": need_import, "type": type, "package": import_pkg };
            }
            let obj = Java.cast(annotation, libjava_1.Wire2ProtoFieldCls);
            let name = field.getName();
            let label = get_label(obj);
            let tag = get_tag(obj);
            let first = get_adapter(obj);
            let type_1 = get_type(first);
            let type_2 = get_type("");
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
            let annotation = field.getAnnotation(libjava_1.Wire2ProtoFieldCls.class);
            if (!annotation)
                return;
            let field_config = handler_annotation(field, annotation);
            fields_config.push(field_config);
        });
    });
    return fields_config;
}

},{"../common":1,"../libjava":4}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tbW9uLnRzIiwic3JjL2dvb2dsZS9nZW5lcmF0ZS50cyIsInNyYy9pbmRleC50cyIsInNyYy9saWJqYXZhLnRzIiwic3JjL3dpcmUvZ2VuZXJhdGUudHMiLCJzcmMvd2lyZTIvZ2VuZXJhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSxTQUFnQixnQkFBZ0IsQ0FBQyxHQUFRO0lBQ3JDLElBQUksR0FBRyxJQUFJLElBQUk7UUFBRSxPQUFPO0lBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hELGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNqRCxDQUFDO0FBSkQsNENBSUM7QUFFRCxTQUFnQixRQUFRLENBQUMsR0FBVztJQUNoQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztJQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLENBQUM7QUFIRCw0QkFHQztBQUVELFNBQWdCLGdCQUFnQixDQUFDLEdBQVE7SUFDckMsSUFBSSxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7SUFDcEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDaEQsQ0FBQztBQUhELDRDQUdDO0FBRUQsU0FBZ0Isb0JBQW9CLENBQUMsR0FBUTtJQUN6QyxJQUFJLGFBQWEsR0FBd0IsRUFBRSxDQUFDO0lBQzVDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDVCxJQUFJLFdBQVcsR0FBRyxHQUFH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QUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ3BFLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztxQkFDMUU7aUJBQ0o7Z0JBQ0QsT0FBTyxFQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFDLENBQUM7WUFDN0UsQ0FBQztZQUNELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLDRCQUFrQixDQUFDLENBQUM7WUFDcEQsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzNCLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzQixJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkIsSUFBSSxLQUFLLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdCLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM3QixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUIsT0FBTztnQkFDSCxPQUFPLEVBQUUsS0FBSztnQkFDZCxRQUFRLEVBQUUsTUFBTTtnQkFDaEIsUUFBUSxFQUFFLE1BQU07Z0JBQ2hCLE1BQU0sRUFBRSxJQUFJO2dCQUNaLEtBQUssRUFBRSxHQUFHO2FBQ2IsQ0FBQTtRQUVMLENBQUM7UUFDRCxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDM0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEtBQVU7WUFDL0IsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyw0QkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvRCxJQUFHLENBQUMsVUFBVTtnQkFBRSxPQUFPO1lBQ3ZCLElBQUksWUFBWSxHQUFHLGtCQUFrQixDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztZQUN6RCxhQUFhLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLGFBQWEsQ0FBQztBQUN6QixDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIifQ==
