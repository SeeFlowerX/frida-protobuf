import { generate_enum, generate_message } from "./wire/generate"
import { send_log } from "./common"

export const wrapJavaPerform = (fn: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        Java.perform(() => {
            try {
                resolve(fn());
            } catch (e) {
                reject(e);
            }
        });
    });
};

function IsVaildEnumCls(cls: any){
    let annotations = cls.class.getSignatureAnnotation();
    if (annotations.length != 4) return false;
    return annotations[3].includes("Internal$EnumLite") || annotations[3].includes("WireEnum");
}

export const GetAllMessageCls = (use_default_any: boolean, keyword_includes: string): Promise<void> => {
    return wrapJavaPerform(() => {
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
                if (clsLoader.$className == "java.lang.BootClassLoader") return;
                let clsLoaderObj = Java.cast(clsLoader, BaseDexClassLoaderCls);
                let pathListObj = clsLoaderObj.pathList.value;
                let DexPathListObj = Java.cast(pathListObj, DexPathListCls)
                let dexElementsObj = DexPathListObj.dexElements.value;
                for (let index = 0; index < dexElementsObj.length; index++) {
                    let dexElement = dexElementsObj[index];
                    try {
                        let dexfile = dexElement.dexFile.value;
                        let dexfile_name = `${dexfile}`;
                        if (!dexfile || dexfileSet.has(`${dexfile_name}`)){
                            // send_log(`[+] dexfile ==> ${dexElement} ${dexfile}`)
                            continue
                        }
                        if (dexfile_name.includes("/system")) continue;
                        dexfileSet.add(`${dexfile_name}`)
                        send_log(`[-] start enumerate ${dexfile_name} dexfile_name include /system => ${dexfile_name.includes("/system")}`);
                        let dexfileobj = Java.cast(dexfile, DexFileCls);
                        let entries = dexfileobj.entries();
                        while (entries.hasMoreElements()) {
                            let className = entries.nextElement().toString();
                            // send_log(className)
                            let include_flag = false;
                            for (let i = 0; i < keywords.length; i++){
                                if (className.includes(keywords[i])){
                                    include_flag = true;
                                    break
                                }
                            }
                            if (!include_flag) continue;
                            let cls = null;
                            try {
                                cls = Java.use(className);
                                // cls = clsLoader.loadClass(className);
                            }
                            catch (e) {
                            }
                            if (!cls) {
                                continue
                            }
                            let cls_super = cls.class.getSuperclass();
                            if (!cls_super) {
                                continue
                            }

                            if (WireMessageClz.equals(cls_super)) {
                                nameSet.add(className)
                                send_log(`[+] ${`${nameSet.size}`.padStart(5, ' ')} ${className}`)
                                send(generate_message(cls, use_default_any));
                            }
                            else if (EnumClz.equals(cls_super) && !cls.class.getEnclosingClass() && IsVaildEnumCls(cls)){
                                // 这里不能用WireEnum判断 因为编译器实际上把它优化成Enum了 via @zsh
                                nameSet.add(className)
                                send_log(`[+] ${`${nameSet.size}`.padStart(5, ' ')} ${className}`)
                                send(generate_enum(cls));
                            }
                        }
                        send_log(`[+] enumerate ${dexfile} end`);
                    } catch (e) {
                        console.trace(e)
                    }
                }
            },
            onComplete: function () {
                console.log("[*] enumerateClassLoaders complete !");
            }
        })
    })
};


rpc.exports = {
    dump: GetAllMessageCls,
}