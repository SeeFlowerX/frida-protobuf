import { generate_enum, generate_message } from "./wire/generate"
import { generate_messagelite } from "./google/generate"
import { send_log } from "./common"
import { InitClsClz } from "./libjava"
import { 
    WireMessageClz,
    GeneratedMessageLiteClz,
    ModifierCls,
    EnumClz,
 } from "./libjava"

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

function skipAbstract(clsLoader: any, className: string){
    // let ModifierCls = Java.use("java.lang.reflect.Modifier")
    // 跳过抽象类
    let clz = null;
    try{
        clz = clsLoader.loadClass(className);
    }
    catch(e){
    }
    return clz && ModifierCls.isAbstract(clz.getModifiers())
}

function getCls(className: string){
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

export const GetAllMessageCls = (use_default_any: boolean, keyword_expected: string, keyword_unexpected: string = ""): Promise<void> => {
    return wrapJavaPerform(() => {
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
                            let className: string = entries.nextElement().toString();
                            if (!className.includes(".")){
                                // 跳过没有 . 的类名
                                // send_log(`[-] skip ${className}`)
                                continue
                            }
                            if(SkipclassNameSet.has(`${className}`)) continue;
                            // send_log(`className ==> ${className}`)
                            // 某些类通过Java.use会卡死 过滤掉
                            let unexpected_flag = false;
                            for (let i = 0; i < keywords_unexpected.length; i++){
                                if (className.includes(keywords_unexpected[i])){
                                    unexpected_flag = true;
                                    break
                                }
                            }
                            // send_log(`unexpected_flag => ${unexpected_flag}`)
                            if (unexpected_flag) {
                                // send_log(`[-] skip ${className}`);
                                continue
                            };
                            // 如果预设了关键词 必须包含关键词才检查 没有预设则会全部检查
                            let expected_flag = false;
                            for (let i = 0; i < keywords_expected.length; i++){
                                if (className.includes(keywords_expected[i])){
                                    expected_flag = true;
                                    break
                                }
                            }
                            // send_log(`expected_flag => ${expected_flag}`)
                            if (!expected_flag) continue;
                            if(skipAbstract(clsLoader, className)) continue
                            // 尝试根据类名加载类
                            // send_log(`className => ${className}`)
                            let [cls, cls_super] = getCls(className);
                            // send_log(`className => ${cls} ${cls_super}`)
                            if (!cls || !cls_super) continue;
                            if (WireMessageClz && WireMessageClz.equals(cls_super)) {
                                nameSet.add(className)
                                send_log(`[+] ${`${nameSet.size}`.padStart(5, ' ')} ${className}`)
                                send(generate_message(cls, use_default_any));
                            }
                            else if (EnumClz.equals(cls_super) && !cls.class.getEnclosingClass() && IsVaildEnumCls(cls)){
                                // 这里不能用WireEnum判断 因为编译器实际上把它优化成Enum了 via @zsh
                                // Internal$EnumLite 同样是被优化了的
                                nameSet.add(className)
                                send_log(`[+] ${`${nameSet.size}`.padStart(5, ' ')} ${className}`)
                                send(generate_enum(cls));
                            }
                            else if (GeneratedMessageLiteClz && GeneratedMessageLiteClz.equals(cls_super)){
                                nameSet.add(className)
                                send_log(`[+] ${`${nameSet.size}`.padStart(5, ' ')} ${className}`)
                                send(generate_messagelite(cls, SkipclassNameSet));
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


InitClsClz();

rpc.exports = {
    dump: GetAllMessageCls,
}