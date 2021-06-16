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
                                cls = Java.use(className);
                            }
                            catch (e) {
                            }
                            if (!cls) {
                                return;
                            }
                            let cls_super = cls.class.getSuperclass();
                            if (!cls_super) {
                                return;
                            }
                            if (WireMessageClz.equals(cls_super)) {
                                nameSet.add(className);
                                common_1.send_log(`[+] ${`${nameSet.size}`.padStart(5, ' ')} ${className}`);
                                send(generate_1.generate_message(cls, use_default_any));
                            }
                            else if (EnumClz.equals(cls_super)) {
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
            return `${obj.label()}`.toLocaleLowerCase();
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
                        type = infos[1].toLocaleLowerCase();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tbW9uLnRzIiwic3JjL2luZGV4LnRzIiwic3JjL3dpcmUvZ2VuZXJhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSxTQUFnQixnQkFBZ0IsQ0FBQyxHQUFRO0lBQ3JDLElBQUksR0FBRyxJQUFJLElBQUk7UUFBRSxPQUFPO0lBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hELGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNqRCxDQUFDO0FBSkQsNENBSUM7QUFFRCxTQUFnQixRQUFRLENBQUMsR0FBVztJQUNoQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztJQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLENBQUM7QUFIRCw0QkFHQzs7Ozs7O0FDVEQsOENBQWlFO0FBQ2pFLHFDQUFtQztBQUU1QixNQUFNLGVBQWUsR0FBRyxDQUFDLEVBQU8sRUFBZ0IsRUFBRTtJQUNyRCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFO1lBQ2QsSUFBSTtnQkFDQSxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQzthQUNqQjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNSLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNiO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQztBQVZXLFFBQUEsZUFBZSxtQkFVMUI7QUFFSyxNQUFNLGdCQUFnQixHQUFHLENBQUMsZUFBd0IsRUFBRSxnQkFBd0IsRUFBaUIsRUFBRTtJQUNsRyxPQUFPLHVCQUFlLENBQUMsR0FBRyxFQUFFO1FBQ3hCLElBQUksUUFBUSxHQUFHLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQyxJQUFJLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLElBQUksVUFBVSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7UUFDM0IsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNqRSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUMsS0FBSyxDQUFDO1FBQy9DLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNuRCxJQUFJLHFCQUFxQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsa0NBQWtDLENBQUMsQ0FBQztRQUN6RSxJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLHFCQUFxQixDQUFDO1lBQ3ZCLE9BQU8sRUFBRSxVQUFVLFNBQVM7Z0JBQ3hCLElBQUksU0FBUyxDQUFDLFVBQVUsSUFBSSwyQkFBMkI7b0JBQUUsT0FBTztnQkFDaEUsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUscUJBQXFCLENBQUMsQ0FBQztnQkFDL0QsSUFBSSxXQUFXLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7Z0JBQzlDLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQyxDQUFBO2dCQUMzRCxJQUFJLGNBQWMsR0FBRyxjQUFjLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztnQkFDdEQsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLGNBQWMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7b0JBQ3hELElBQUksVUFBVSxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDdkMsSUFBSTt3QkFDQSxJQUFJLE9BQU8sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQzt3QkFDdkMsSUFBSSxZQUFZLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQzt3QkFDaEMsSUFBSSxDQUFDLE9BQU8sSUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsWUFBWSxFQUFFLENBQUMsRUFBQzs0QkFDOUMsdURBQXVEOzRCQUN2RCxTQUFRO3lCQUNYO3dCQUNELElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7NEJBQUUsU0FBUzt3QkFDL0MsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFlBQVksRUFBRSxDQUFDLENBQUE7d0JBQ2pDLGlCQUFRLENBQUMsdUJBQXVCLFlBQVksb0NBQW9DLFlBQVksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUNwSCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQzt3QkFDaEQsSUFBSSxPQUFPLEdBQUcsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUNuQyxPQUFPLE9BQU8sQ0FBQyxlQUFlLEVBQUUsRUFBRTs0QkFDOUIsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDOzRCQUNqRCxzQkFBc0I7NEJBQ3RCLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQzs0QkFDekIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUM7Z0NBQ3JDLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQztvQ0FDaEMsWUFBWSxHQUFHLElBQUksQ0FBQztvQ0FDcEIsTUFBSztpQ0FDUjs2QkFDSjs0QkFDRCxJQUFJLENBQUMsWUFBWTtnQ0FBRSxTQUFTOzRCQUM1QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7NEJBQ2YsSUFBSTtnQ0FDQSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQzs2QkFDN0I7NEJBQ0QsT0FBTyxDQUFDLEVBQUU7NkJBQ1Q7NEJBQ0QsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQ0FDTixPQUFNOzZCQUNUOzRCQUNELElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUM7NEJBQzFDLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0NBQ1osT0FBTTs2QkFDVDs0QkFFRCxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0NBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUE7Z0NBQ3RCLGlCQUFRLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLFNBQVMsRUFBRSxDQUFDLENBQUE7Z0NBQ2xFLElBQUksQ0FBQywyQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQzs2QkFDaEQ7aUNBQ0ksSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFDO2dDQUMvQiw4Q0FBOEM7Z0NBQzlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUE7Z0NBQ3RCLGlCQUFRLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLFNBQVMsRUFBRSxDQUFDLENBQUE7Z0NBQ2xFLElBQUksQ0FBQyx3QkFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7NkJBQzVCO3lCQUNKO3dCQUNELGlCQUFRLENBQUMsaUJBQWlCLE9BQU8sTUFBTSxDQUFDLENBQUM7cUJBQzVDO29CQUFDLE9BQU8sQ0FBQyxFQUFFO3dCQUNSLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7cUJBQ25CO2lCQUNKO1lBQ0wsQ0FBQztZQUNELFVBQVUsRUFBRTtnQkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7WUFDeEQsQ0FBQztTQUNKLENBQUMsQ0FBQTtJQUNOLENBQUMsQ0FBQyxDQUFBO0FBQ04sQ0FBQyxDQUFDO0FBL0VXLFFBQUEsZ0JBQWdCLG9CQStFM0I7QUFHRixHQUFHLENBQUMsT0FBTyxHQUFHO0lBQ1YsSUFBSSxFQUFFLHdCQUFnQjtDQUN6QixDQUFBOzs7Ozs7QUNuR0Qsc0NBQW9DO0FBRXBDLFNBQWdCLGdCQUFnQixDQUFDLEdBQVEsRUFBRSxlQUF3QjtJQUMvRCxJQUFJLFVBQVUsR0FBd0IsRUFBRSxDQUFDO0lBQ3pDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDVCxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsU0FBUyxDQUFDO1FBQy9CLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QyxVQUFVLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUM7UUFDeEQsVUFBVSxDQUFDLGVBQWUsQ0FBQyxHQUFHLHVCQUF1QixDQUFDLEdBQUcsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNoRixDQUFDLENBQUMsQ0FBQTtJQUNGLE9BQU8sVUFBVSxDQUFDO0FBQ3RCLENBQUM7QUFURCw0Q0FTQztBQUVELFNBQVMsZ0JBQWdCLENBQUMsR0FBUTtJQUM5QixJQUFJLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztJQUNwQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBRUQsU0FBUyx1QkFBdUIsQ0FBQyxHQUFRLEVBQUUsZUFBd0I7SUFDL0QsSUFBSSxhQUFhLEdBQWEsRUFBRSxDQUFDO0lBQ2pDLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztJQUMzRCxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ1QsU0FBUyxTQUFTLENBQUMsR0FBUTtZQUN2QixPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUMvQyxDQUFDO1FBQ0QsU0FBUyxPQUFPLENBQUMsR0FBUTtZQUNyQixPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUNwQixDQUFDO1FBQ0QsU0FBUyxXQUFXLENBQUMsR0FBUTtZQUN6QixPQUFPLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtRQUN4QixDQUFDO1FBQ0QsU0FBUyxjQUFjLENBQUMsR0FBUTtZQUM1QixPQUFPLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtRQUMzQixDQUFDO1FBQ0QsU0FBUyxrQkFBa0IsQ0FBQyxLQUFVLEVBQUUsVUFBZTtZQUNuRCxTQUFTLFFBQVEsQ0FBQyxPQUFZO2dCQUMxQixJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUM7Z0JBQ3hCLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztnQkFDZCxJQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUM7b0JBQ3JCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQy9CLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLGdDQUFnQyxFQUFDO3dCQUM3QyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUM7cUJBQ3ZDO3lCQUNJLElBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLFNBQVMsRUFBQzt3QkFDMUIsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7d0JBQ2pDLElBQUksZUFBZSxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUM7NEJBQ2pDLElBQUksR0FBRyxxQkFBcUIsQ0FBQzt5QkFDaEM7d0JBQ0QsV0FBVyxHQUFHLElBQUksQ0FBQztxQkFDdEI7eUJBQ0c7d0JBQ0EsaUJBQVEsQ0FBQyw0QkFBNEIsT0FBTyxFQUFFLENBQUMsQ0FBQTtxQkFDbEQ7aUJBQ0o7Z0JBQUEsQ0FBQztnQkFDRixPQUFPLEVBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDLENBQUE7WUFDckQsQ0FBQztZQUNELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQzlDLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUMzQixJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0IsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksT0FBTyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQixJQUFJLFVBQVUsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDckMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQztZQUNsQixJQUFHLFVBQVUsRUFBQztnQkFDViwwQkFBMEI7Z0JBQzFCLEtBQUssR0FBRyxFQUFFLENBQUE7Z0JBQ1YsS0FBSyxHQUFHLFVBQVUsQ0FBQztnQkFDbkIsTUFBTSxHQUFHLE9BQU8sQ0FBQzthQUNwQjtpQkFDRztnQkFDQSxLQUFLLEdBQUcsT0FBTyxDQUFDO2dCQUNoQixNQUFNLEdBQUcsVUFBVSxDQUFDO2FBQ3ZCO1lBQ0QsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdCLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5QixPQUFPO2dCQUNILE9BQU8sRUFBRSxLQUFLO2dCQUNkLFFBQVEsRUFBRSxNQUFNO2dCQUNoQixRQUFRLEVBQUUsTUFBTTtnQkFDaEIsTUFBTSxFQUFFLElBQUk7Z0JBQ1osS0FBSyxFQUFFLEdBQUc7YUFDYixDQUFBO1FBRUwsQ0FBQztRQUNELElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUMzQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsS0FBVTtZQUMvQixJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6RCxJQUFHLENBQUMsVUFBVTtnQkFBRSxPQUFPO1lBQ3ZCLElBQUksWUFBWSxHQUFHLGtCQUFrQixDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztZQUN6RCxhQUFhLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLGFBQWEsQ0FBQztBQUN6QixDQUFDO0FBRUQsU0FBZ0IsYUFBYSxDQUFDLEdBQVE7SUFDbEMsSUFBSSxVQUFVLEdBQXdCLEVBQUUsQ0FBQztJQUN6QyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ1QsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUNULFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDNUIsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlDLFVBQVUsQ0FBQyxVQUFVLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQztZQUN4RCxVQUFVLENBQUMsZUFBZSxDQUFDLEdBQUcsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDLENBQUMsQ0FBQTtJQUNGLE9BQU8sVUFBVSxDQUFDO0FBQ3RCLENBQUM7QUFYRCxzQ0FXQztBQUVELFNBQVMsb0JBQW9CLENBQUMsR0FBUTtJQUNsQyxJQUFJLGFBQWEsR0FBd0IsRUFBRSxDQUFDO0lBQzVDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDVCxJQUFJLFdBQVcsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDL0IsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxNQUFXO1lBQ3pDLGFBQWEsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQyxDQUFDLENBQUE7SUFDRixPQUFPLGFBQWEsQ0FBQztBQUN6QixDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIifQ==
