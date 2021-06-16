export function logAllProperties(obj: any) {
    if (obj == null) return;
    console.log(Object.getOwnPropertyNames(obj).join("\n"));
    logAllProperties(Object.getPrototypeOf(obj));
}

export function send_log(msg: string){
    send({"log": msg});
    console.log(msg);
}