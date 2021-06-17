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
const GetAllMessageCls = (use_default_any, keyword_includes) => {
    return exports.wrapJavaPerform(() => {
        let keywords = keyword_includes.split(",");
        let nameSet = new Set();
        let dexfileSet = new Set();
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
                            let include_flag = false;
                            for (let i = 0; i < keywords.length; i++) {
                                if (className.includes(keywords[i])) {
                                    include_flag = true;
                                    break;
                                }
                            }
                            if (!include_flag)
                                continue;
                            let cls = null;
                            try {
                                // cls = Java.use(className);
                                cls = clsLoader.loadClass(className);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tbW9uLnRzIiwic3JjL2luZGV4LnRzIiwic3JjL3dpcmUvZ2VuZXJhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSxTQUFnQixnQkFBZ0IsQ0FBQyxHQUFRO0lBQ3JDLElBQUksR0FBRyxJQUFJLElBQUk7UUFBRSxPQUFPO0lBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hELGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNqRCxDQUFDO0FBSkQsNENBSUM7QUFFRCxTQUFnQixRQUFRLENBQUMsR0FBVztJQUNoQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztJQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLENBQUM7QUFIRCw0QkFHQzs7Ozs7O0FDVEQsOENBQWlFO0FBQ2pFLHFDQUFtQztBQUU1QixNQUFNLGVBQWUsR0FBRyxDQUFDLEVBQU8sRUFBZ0IsRUFBRTtJQUNyRCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFO1lBQ2QsSUFBSTtnQkFDQSxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQzthQUNqQjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNSLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNiO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQztBQVZXLFFBQUEsZUFBZSxtQkFVMUI7QUFFRixTQUFTLGNBQWMsQ0FBQyxHQUFRO0lBQzVCLElBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUNyRCxJQUFJLFdBQVcsQ0FBQyxNQUFNLElBQUksQ0FBQztRQUFFLE9BQU8sS0FBSyxDQUFDO0lBQzFDLE9BQU8sV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDL0YsQ0FBQztBQUVNLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxlQUF3QixFQUFFLGdCQUF3QixFQUFpQixFQUFFO0lBQ2xHLE9BQU8sdUJBQWUsQ0FBQyxHQUFHLEVBQUU7UUFDeEIsSUFBSSxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNDLElBQUksT0FBTyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7UUFDeEIsSUFBSSxVQUFVLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUMzQixJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ2pFLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDL0MsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQ25ELElBQUkscUJBQXFCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1FBQ3pFLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMscUJBQXFCLENBQUM7WUFDdkIsT0FBTyxFQUFFLFVBQVUsU0FBUztnQkFDeEIsSUFBSSxTQUFTLENBQUMsVUFBVSxJQUFJLDJCQUEyQjtvQkFBRSxPQUFPO2dCQUNoRSxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO2dCQUMvRCxJQUFJLFdBQVcsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztnQkFDOUMsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsY0FBYyxDQUFDLENBQUE7Z0JBQzNELElBQUksY0FBYyxHQUFHLGNBQWMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO2dCQUN0RCxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtvQkFDeEQsSUFBSSxVQUFVLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN2QyxJQUFJO3dCQUNBLElBQUksT0FBTyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO3dCQUN2QyxJQUFJLFlBQVksR0FBRyxHQUFHLE9BQU8sRUFBRSxDQUFDO3dCQUNoQyxJQUFJLENBQUMsT0FBTyxJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxZQUFZLEVBQUUsQ0FBQyxFQUFDOzRCQUM5Qyx1REFBdUQ7NEJBQ3ZELFNBQVE7eUJBQ1g7d0JBQ0QsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQzs0QkFBRSxTQUFTO3dCQUMvQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsWUFBWSxFQUFFLENBQUMsQ0FBQTt3QkFDakMsaUJBQVEsQ0FBQyx1QkFBdUIsWUFBWSxvQ0FBb0MsWUFBWSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQ3BILElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO3dCQUNoRCxJQUFJLE9BQU8sR0FBRyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQ25DLE9BQU8sT0FBTyxDQUFDLGVBQWUsRUFBRSxFQUFFOzRCQUM5QixJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7NEJBQ2pELHNCQUFzQjs0QkFDdEIsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDOzRCQUN6QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQztnQ0FDckMsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDO29DQUNoQyxZQUFZLEdBQUcsSUFBSSxDQUFDO29DQUNwQixNQUFLO2lDQUNSOzZCQUNKOzRCQUNELElBQUksQ0FBQyxZQUFZO2dDQUFFLFNBQVM7NEJBQzVCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQzs0QkFDZixJQUFJO2dDQUNBLDZCQUE2QjtnQ0FDN0IsR0FBRyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7NkJBQ3hDOzRCQUNELE9BQU8sQ0FBQyxFQUFFOzZCQUNUOzRCQUNELElBQUksQ0FBQyxHQUFHLEVBQUU7Z0NBQ04sU0FBUTs2QkFDWDs0QkFDRCxJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDOzRCQUMxQyxJQUFJLENBQUMsU0FBUyxFQUFFO2dDQUNaLFNBQVE7NkJBQ1g7NEJBRUQsSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dDQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFBO2dDQUN0QixpQkFBUSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxTQUFTLEVBQUUsQ0FBQyxDQUFBO2dDQUNsRSxJQUFJLENBQUMsMkJBQWdCLENBQUMsR0FBRyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7NkJBQ2hEO2lDQUNJLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUM7Z0NBQ3hGLDhDQUE4QztnQ0FDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtnQ0FDdEIsaUJBQVEsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksU0FBUyxFQUFFLENBQUMsQ0FBQTtnQ0FDbEUsSUFBSSxDQUFDLHdCQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs2QkFDNUI7eUJBQ0o7d0JBQ0QsaUJBQVEsQ0FBQyxpQkFBaUIsT0FBTyxNQUFNLENBQUMsQ0FBQztxQkFDNUM7b0JBQUMsT0FBTyxDQUFDLEVBQUU7d0JBQ1IsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtxQkFDbkI7aUJBQ0o7WUFDTCxDQUFDO1lBQ0QsVUFBVSxFQUFFO2dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLENBQUMsQ0FBQztZQUN4RCxDQUFDO1NBQ0osQ0FBQyxDQUFBO0lBQ04sQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDLENBQUM7QUFoRlcsUUFBQSxnQkFBZ0Isb0JBZ0YzQjtBQUdGLEdBQUcsQ0FBQyxPQUFPLEdBQUc7SUFDVixJQUFJLEVBQUUsd0JBQWdCO0NBQ3pCLENBQUE7Ozs7OztBQzFHRCxzQ0FBb0M7QUFFcEMsU0FBZ0IsZ0JBQWdCLENBQUMsR0FBUSxFQUFFLGVBQXdCO0lBQy9ELElBQUksVUFBVSxHQUF3QixFQUFFLENBQUM7SUFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNULFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxTQUFTLENBQUM7UUFDL0IsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlDLFVBQVUsQ0FBQyxVQUFVLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQztRQUN4RCxVQUFVLENBQUMsZUFBZSxDQUFDLEdBQUcsdUJBQXVCLENBQUMsR0FBRyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ2hGLENBQUMsQ0FBQyxDQUFBO0lBQ0YsT0FBTyxVQUFVLENBQUM7QUFDdEIsQ0FBQztBQVRELDRDQVNDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxHQUFRO0lBQzlCLElBQUksSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO0lBQ3BDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3BELENBQUM7QUFFRCxTQUFTLHVCQUF1QixDQUFDLEdBQVEsRUFBRSxlQUF3QjtJQUMvRCxJQUFJLGFBQWEsR0FBYSxFQUFFLENBQUM7SUFDakMsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0lBQzNELElBQUksQ0FBQyxPQUFPLENBQUM7UUFDVCxTQUFTLFNBQVMsQ0FBQyxHQUFRO1lBQ3ZCLE9BQU8sR0FBRyxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUN6QyxDQUFDO1FBQ0QsU0FBUyxPQUFPLENBQUMsR0FBUTtZQUNyQixPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUNwQixDQUFDO1FBQ0QsU0FBUyxXQUFXLENBQUMsR0FBUTtZQUN6QixPQUFPLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtRQUN4QixDQUFDO1FBQ0QsU0FBUyxjQUFjLENBQUMsR0FBUTtZQUM1QixPQUFPLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtRQUMzQixDQUFDO1FBQ0QsU0FBUyxrQkFBa0IsQ0FBQyxLQUFVLEVBQUUsVUFBZTtZQUNuRCxTQUFTLFFBQVEsQ0FBQyxPQUFZO2dCQUMxQixJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUM7Z0JBQ3hCLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztnQkFDZCxJQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUM7b0JBQ3JCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQy9CLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLGdDQUFnQyxFQUFDO3dCQUM3QyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO3FCQUNqQzt5QkFDSSxJQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxTQUFTLEVBQUM7d0JBQzFCLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO3dCQUNqQyxJQUFJLGVBQWUsSUFBSSxJQUFJLElBQUksS0FBSyxFQUFDOzRCQUNqQyxJQUFJLEdBQUcscUJBQXFCLENBQUM7eUJBQ2hDO3dCQUNELFdBQVcsR0FBRyxJQUFJLENBQUM7cUJBQ3RCO3lCQUNHO3dCQUNBLGlCQUFRLENBQUMsNEJBQTRCLE9BQU8sRUFBRSxDQUFDLENBQUE7cUJBQ2xEO2lCQUNKO2dCQUFBLENBQUM7Z0JBQ0YsT0FBTyxFQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBQyxDQUFBO1lBQ3JELENBQUM7WUFDRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUM5QyxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDM0IsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN2QixJQUFJLE9BQU8sR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDL0IsSUFBSSxVQUFVLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDbEIsSUFBRyxVQUFVLEVBQUM7Z0JBQ1YsMEJBQTBCO2dCQUMxQixLQUFLLEdBQUcsRUFBRSxDQUFBO2dCQUNWLEtBQUssR0FBRyxVQUFVLENBQUM7Z0JBQ25CLE1BQU0sR0FBRyxPQUFPLENBQUM7YUFDcEI7aUJBQ0c7Z0JBQ0EsS0FBSyxHQUFHLE9BQU8sQ0FBQztnQkFDaEIsTUFBTSxHQUFHLFVBQVUsQ0FBQzthQUN2QjtZQUNELElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM3QixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUIsT0FBTztnQkFDSCxPQUFPLEVBQUUsS0FBSztnQkFDZCxRQUFRLEVBQUUsTUFBTTtnQkFDaEIsUUFBUSxFQUFFLE1BQU07Z0JBQ2hCLE1BQU0sRUFBRSxJQUFJO2dCQUNaLEtBQUssRUFBRSxHQUFHO2FBQ2IsQ0FBQTtRQUVMLENBQUM7UUFDRCxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDM0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEtBQVU7WUFDL0IsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekQsSUFBRyxDQUFDLFVBQVU7Z0JBQUUsT0FBTztZQUN2QixJQUFJLFlBQVksR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDekQsYUFBYSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxhQUFhLENBQUM7QUFDekIsQ0FBQztBQUVELFNBQWdCLGFBQWEsQ0FBQyxHQUFRO0lBQ2xDLElBQUksVUFBVSxHQUF3QixFQUFFLENBQUM7SUFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNULElBQUksQ0FBQyxPQUFPLENBQUM7WUFDVCxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDO1lBQzVCLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM5QyxVQUFVLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUM7WUFDeEQsVUFBVSxDQUFDLGVBQWUsQ0FBQyxHQUFHLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVELENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQyxDQUFDLENBQUE7SUFDRixPQUFPLFVBQVUsQ0FBQztBQUN0QixDQUFDO0FBWEQsc0NBV0M7QUFFRCxTQUFTLG9CQUFvQixDQUFDLEdBQVE7SUFDbEMsSUFBSSxhQUFhLEdBQXdCLEVBQUUsQ0FBQztJQUM1QyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ1QsSUFBSSxXQUFXLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQy9CLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLENBQUMsTUFBVztZQUN6QyxhQUFhLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNuRCxDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUMsQ0FBQyxDQUFBO0lBQ0YsT0FBTyxhQUFhLENBQUM7QUFDekIsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIn0=
