export function logAllProperties(obj: any) {
    if (obj == null) return;
    console.log(Object.getOwnPropertyNames(obj).join("\n"));
    logAllProperties(Object.getPrototypeOf(obj));
}

export function send_log(msg: string){
    send({"log": msg});
    console.log(msg);
}

export function generate_package(cls: any){
    let name = `${cls.class.getName()}`;
    return name.slice(0, name.lastIndexOf('.'));
}

export function generate_enum_fields(cls: any){
    let fields_config:{[key: string]: any} = {};
    Java.perform(function(){
        let enum_values = cls.values();
        let methods = cls.class.getDeclaredMethods();
        let flag_getNumber = false;
        let flag_getValue = false;
        for (let i = 0; i< methods.length; i++){
            if (`${methods[i].getName()}` == "getValue"){
                flag_getValue = true;
                break
            }
            if (`${methods[i].getName()}` == "getNumber"){
                flag_getNumber = true;
                break
            }
        }
        if (!flag_getNumber && !flag_getValue){
            console.log("没有发现enum获取元素的方法")
            return
        }
        enum_values.forEach(function name(params: any) {
            if (`${params}`.endsWith("_NOT_SET")) return;
            if(flag_getNumber){
                fields_config[`${params}`] = params.getNumber();
            }
            else if(flag_getValue){
                fields_config[`${params}`] = params.getValue();
            }
        })
    })
    return fields_config;
}