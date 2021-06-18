import { send_log, generate_package, generate_enum_fields } from "../common"

export function generate_message(cls: any, use_default_any: boolean){
    let cls_config:{[key: string]: any} = {};
    Java.perform(function(){
        cls_config["type"] = "message";
        cls_config["package"] = generate_package(cls);
        cls_config["cls_name"] = `${cls.class.getSimpleName()}`;
        cls_config["fields_config"] = generate_message_fields(cls, use_default_any);
    })
    return cls_config;
}

function generate_message_fields(cls: any, use_default_any: boolean){
    let fields_config: object[] = [];
    let WireFieldCls = Java.use("com.squareup.wire.WireField");
    Java.perform(function(){
        function get_label(obj: any) {
            return `${obj.label()}`.toLowerCase()
        }
        function get_tag(obj: any) {
            return obj.tag()
        }
        function get_adapter(obj: any) {
            return obj.adapter()
        }
        function get_keyAdapter(obj: any) {
            return obj.keyAdapter()
        }
        function handler_annotation(field: any, annotation: any) {
            function get_type(adapter: any) {
                let need_import = false;
                let type: any = "";
                let import_pkg = "";
                if(adapter.includes("#")){
                    let infos: string[] = adapter.split("#");
                    if (infos[0] == "com.squareup.wire.ProtoAdapter"){
                        type = infos[1].toLowerCase();
                    }
                    else if(infos[1] == "ADAPTER"){
                        type = infos[0].split(".").pop();
                        if (use_default_any && type == "Any"){
                            type = "google.protobuf.Any";
                        }
                        need_import = true;
                        import_pkg = infos[0].slice(0, infos[0].lastIndexOf("."));
                    }
                    else{
                        send_log(`[*] unhandled adapter => ${adapter}`)
                    }
                };
                return {"need_import": need_import, "type": type, "package": import_pkg}
            }
            let obj = Java.cast(annotation, WireFieldCls);
            let name = field.getName();
            let label = get_label(obj);
            let tag = get_tag(obj);
            let adapter = get_adapter(obj);
            let keyAdapter = get_keyAdapter(obj);
            let first = null;
            let second = null;
            if(keyAdapter){
                // map类型 proto文件定义则没有label
                label = ""
                first = keyAdapter;
                second = adapter;
            }
            else{
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
            }

        }
        let fields = cls.class.getDeclaredFields();
        fields.forEach(function (field: any) {
            let annotation = field.getAnnotation(WireFieldCls.class);
            if(!annotation) return;
            let field_config = handler_annotation(field, annotation);
            fields_config.push(field_config);
        });
    });
    return fields_config;
}

export function generate_enum(cls: any){
    let cls_config:{[key: string]: any} = {};
    Java.perform(function(){
        Java.perform(function(){
            cls_config["type"] = "enum";
            cls_config["package"] = generate_package(cls);
            cls_config["cls_name"] = `${cls.class.getSimpleName()}`;
            cls_config["fields_config"] = generate_enum_fields(cls);
        })
    })
    return cls_config;
}

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