import { send_log, generate_package, generate_enum_fields } from "../common"
import {Wire2FieldCls, Wire2ProtoFieldCls} from "../libjava"

export function generate_message_2(cls: any, use_default_any: boolean){
    let cls_config:{[key: string]: any} = {};
    Java.perform(function(){
        cls_config["type"] = "message";
        cls_config["package"] = generate_package(cls);
        cls_config["cls_name"] = `${cls.class.getSimpleName()}`;
        cls_config["fields_config"] = generate_message_fields_WireField(cls, use_default_any);
        if (cls_config["fields_config"].length == 0){
            cls_config["fields_config"] = generate_message_fields_ProtoField(cls, use_default_any);
        }
    })
    return cls_config;
}

function generate_message_fields_WireField(cls: any, use_default_any: boolean){
    let fields_config: object[] = [];
    if(!Wire2FieldCls) return fields_config;
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
            let obj = Java.cast(annotation, Wire2FieldCls);
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
            let annotation = field.getAnnotation(Wire2FieldCls.class);
            if(!annotation) return;
            let field_config = handler_annotation(field, annotation);
            fields_config.push(field_config);
        });
    });
    return fields_config;
}

export function generate_enum_2(cls: any){
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

function generate_message_fields_ProtoField(cls: any, use_default_any: boolean){
    let fields_config: object[] = [];
    if(!Wire2ProtoFieldCls) return fields_config;
    Java.perform(function(){
        function get_label(obj: any) {
            return `${obj.label()}`.toLowerCase()
        }
        function get_tag(obj: any) {
            return obj.tag()
        }
        function get_adapter(obj: any) {
            return obj.type()
        }
        function handler_annotation(field: any, annotation: any) {
            function get_type(type: any) {
                let need_import = false;
                let import_pkg = "";
                if (type != ""){
                    type = type.name().toLowerCase();
                }
                if (type == "message"){
                    need_import = true;
                    import_pkg = field.getType().getCanonicalName();
                    import_pkg = import_pkg.slice(0, import_pkg.lastIndexOf("."));
                    type = field.getType().getSimpleName();
                    if(type == "List"){
                        let sign = field.getSignatureAnnotation()[1];
                        type = sign.slice(sign.lastIndexOf("/") + 1, sign.lastIndexOf(";"));
                        import_pkg = sign.slice(1, sign.lastIndexOf("/")).replaceAll("/", ".");
                    }
                }
                return {"need_import": need_import, "type": type, "package": import_pkg};
            }
            let obj = Java.cast(annotation, Wire2ProtoFieldCls);
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
            }

        }
        let fields = cls.class.getDeclaredFields();
        fields.forEach(function (field: any) {
            let annotation = field.getAnnotation(Wire2ProtoFieldCls.class);
            if(!annotation) return;
            let field_config = handler_annotation(field, annotation);
            fields_config.push(field_config);
        });
    });
    return fields_config;
}