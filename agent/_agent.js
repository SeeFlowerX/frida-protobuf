(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_log = exports.logAllProperties = void 0;
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

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllMessageCls = exports.wrapJavaPerform = void 0;
const generate_1 = require("./wire/generate");
const common_1 = require("./common");
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
const GetAllMessageCls = (use_default_any, keyword_expected, keyword_unexpected = "") => {
    return exports.wrapJavaPerform(() => {
        let keywords_expected = keyword_expected.split(",");
        let keywords_unexpected = keyword_unexpected.split(",");
        let nameSet = new Set();
        let dexfileSet = new Set();
        let ModifierCls = Java.use("java.lang.reflect.Modifier");
        let WireMessageClz = Java.use("com.squareup.wire.Message").class;
        let EnumClz = Java.use("java.lang.Enum").class;
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
                            // send_log(className)
                            // 某些类通过Java.use会卡死 过滤掉
                            let unexpected_flag = false;
                            for (let i = 0; i < keywords_unexpected.length; i++) {
                                if (className.includes(keywords_unexpected[i])) {
                                    unexpected_flag = true;
                                    break;
                                }
                            }
                            if (unexpected_flag)
                                continue;
                            // 如果预设了关键词 必须包含关键词才检查 没有预设则会全部检查
                            let expected_flag = false;
                            for (let i = 0; i < keywords_expected.length; i++) {
                                if (className.includes(keywords_expected[i])) {
                                    expected_flag = true;
                                    break;
                                }
                            }
                            if (!expected_flag)
                                continue;
                            // 跳过抽象类
                            let clz = null;
                            try {
                                clz = clsLoader.loadClass(className);
                            }
                            catch (e) {
                            }
                            if (clz && ModifierCls.isAbstract(clz.getModifiers()))
                                continue;
                            // 尝试根据类名加载类
                            let cls = null;
                            try {
                                cls = Java.use(className);
                            }
                            catch (e) {
                            }
                            if (!cls) {
                                continue;
                            }
                            let cls_super = cls.class.getSuperclass();
                            if (!cls_super) {
                                continue;
                            }
                            if (WireMessageClz.equals(cls_super)) {
                                nameSet.add(className);
                                common_1.send_log(`[+] ${`${nameSet.size}`.padStart(5, ' ')} ${className}`);
                                send(generate_1.generate_message(cls, use_default_any));
                            }
                            else if (EnumClz.equals(cls_super) && !cls.class.getEnclosingClass() && IsVaildEnumCls(cls)) {
                                // 这里不能用WireEnum判断 因为编译器实际上把它优化成Enum了 via @zsh
                                nameSet.add(className);
                                common_1.send_log(`[+] ${`${nameSet.size}`.padStart(5, ' ')} ${className}`);
                                send(generate_1.generate_enum(cls));
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
rpc.exports = {
    dump: exports.GetAllMessageCls,
};

},{"./common":1,"./wire/generate":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_enum = exports.generate_message = void 0;
const common_1 = require("../common");
function generate_message(cls, use_default_any) {
    let cls_config = {};
    Java.perform(function () {
        cls_config["type"] = "message";
        cls_config["package"] = generate_package(cls);
        cls_config["cls_name"] = `${cls.class.getSimpleName()}`;
        cls_config["fields_config"] = generate_message_fields(cls, use_default_any);
    });
    return cls_config;
}
exports.generate_message = generate_message;
function generate_package(cls) {
    let name = `${cls.class.getName()}`;
    return name.substring(0, name.lastIndexOf('.'));
}
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
                    }
                    else {
                        common_1.send_log(`[*] unhandled adapter => ${adapter}`);
                    }
                }
                ;
                return { "need_import": need_import, "type": type };
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
            cls_config["package"] = generate_package(cls);
            cls_config["cls_name"] = `${cls.class.getSimpleName()}`;
            cls_config["fields_config"] = generate_enum_fields(cls);
        });
    });
    return cls_config;
}
exports.generate_enum = generate_enum;
function generate_enum_fields(cls) {
    let fields_config = {};
    Java.perform(function () {
        let enum_values = cls.values();
        enum_values.forEach(function name(params) {
            fields_config[`${params}`] = params.getValue();
        });
    });
    return fields_config;
}

},{"../common":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tbW9uLnRzIiwic3JjL2luZGV4LnRzIiwic3JjL3dpcmUvZ2VuZXJhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSxTQUFnQixnQkFBZ0IsQ0FBQyxHQUFRO0lBQ3JDLElBQUksR0FBRyxJQUFJLElBQUk7UUFBRSxPQUFPO0lBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hELGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNqRCxDQUFDO0FBSkQsNENBSUM7QUFFRCxTQUFnQixRQUFRLENBQUMsR0FBVztJQUNoQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztJQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLENBQUM7QUFIRCw0QkFHQzs7Ozs7O0FDVEQsOENBQWlFO0FBQ2pFLHFDQUFtQztBQUU1QixNQUFNLGVBQWUsR0FBRyxDQUFDLEVBQU8sRUFBZ0IsRUFBRTtJQUNyRCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFO1lBQ2QsSUFBSTtnQkFDQSxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQzthQUNqQjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNSLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNiO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQztBQVZXLFFBQUEsZUFBZSxtQkFVMUI7QUFFRixTQUFTLGNBQWMsQ0FBQyxHQUFR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QUUsRUFBRSxDQUFDO1lBQ3hELFVBQVUsQ0FBQyxlQUFlLENBQUMsR0FBRyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1RCxDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUMsQ0FBQyxDQUFBO0lBQ0YsT0FBTyxVQUFVLENBQUM7QUFDdEIsQ0FBQztBQVhELHNDQVdDO0FBRUQsU0FBUyxvQkFBb0IsQ0FBQyxHQUFRO0lBQ2xDLElBQUksYUFBYSxHQUF3QixFQUFFLENBQUM7SUFDNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNULElBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUMvQixXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSxDQUFDLE1BQVc7WUFDekMsYUFBYSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDLENBQUMsQ0FBQTtJQUNGLE9BQU8sYUFBYSxDQUFDO0FBQ3pCLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiJ9
