import { generate_enum_fields, generate_package, send_log } from "../common"
import { tsMap, javaMethod, javaField } from "../interface"
import { ObjectClz } from "../libjava"

function generate_oneof(cls: any, CaseCls: any){
    let case_fields_config = generate_enum_fields(CaseCls);
    let case_fields_name_map:{[key: string]: any} = {};
    for (const [name, tag] of Object.entries(case_fields_config)) {
        case_fields_name_map[name.toUpperCase().replaceAll("_", "")] = name
    }
    // 每一个元素 都会有一个对应的方法 返回值类型是对应proto的元素类型
    let methods = cls.class.getDeclaredMethods();
    let fields_config: any[] = []
    methods.forEach(function(method: javaMethod){
        let method_name = `${method.getName()}`;
        if (!method_name.startsWith("get")) return;
        let excepted_name = method_name.slice(3, method_name.length).toUpperCase();
        let matched_name = case_fields_name_map[excepted_name];
        if(matched_name){
            let name = matched_name.toLowerCase();
            let field_type = method.getReturnType().getSimpleName();
            let import_pkg = ""
            let need_import = true
            let real_field_type: string = field_type
            if(TypeConfig[field_type]){
                real_field_type = TypeConfig[field_type]
                need_import = false
            }
            else{
                import_pkg = method.getReturnType().getCanonicalName()
                import_pkg = import_pkg.slice(0, import_pkg.lastIndexOf("."));
            }
            let type_1 = {"need_import": need_import, "type": real_field_type, "package": import_pkg};
            let tag = case_fields_config[matched_name];
            // 由于这里是oneof类型 所以不会有 List Map 的情况
            let field_config = {
                "label": "",
                "type_1": type_1,
                "type_2": {},
                "name": name,
                "tag": tag,
            }
            fields_config.push(field_config)
        }
    })
    return fields_config;
}

export function generate_messagelite(cls: any, SkipclassNameSet: any){
    let cls_config: {[key: string]: any} = {};
    let oneof_config: {[key: string]: any} = {};
    function try_generate_oneof(cls: any){
        let fields = cls.class.getDeclaredFields();
        let fields_name: string[] = [];
        let case_flag = false;
        let field_flag = false;
        let case_cls_flag = false;
        let excepted_field_name = "";
        fields.forEach(function (field: any) {
            let field_name = `${field.getName()}`;
            fields_name.push(field_name);
            if(field_name[0] == field_name[0].toLowerCase() && field_name.endsWith("Case_")){
                case_flag = true;
                excepted_field_name = field_name.slice(0, field_name.lastIndexOf("Case_")) + "_";
            }
            if(!field_flag && excepted_field_name && fields_name.includes(excepted_field_name)){
                // let ObjectClz = Java.use("java.lang.Object").class;
                let excepted_field = cls.class.getDeclaredField(excepted_field_name);
                if (ObjectClz.equals(excepted_field.getType())){
                    field_flag = true;
                }
            }
        });
        if (case_flag && field_flag && excepted_field_name){
            // 检查有没有特定的内部类
            let in_case_cls = null;
            let in_case_name: string = excepted_field_name.slice(0, excepted_field_name.lastIndexOf("_"));
            oneof_config["name"] = in_case_name
            in_case_name = in_case_name.replace(in_case_name[0],in_case_name[0].toUpperCase())
            in_case_name = `${cls.class.getName()}$${in_case_name}Case`;
            try{
                in_case_cls = Java.use(in_case_name);
            }
            catch(e){
            }
            if(in_case_cls){
                oneof_config["fields_config"] = generate_oneof(cls, in_case_cls)
                SkipclassNameSet.add(in_case_name)
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
    try_generate_oneof(cls);;
    cls_config["type"] = "message";
    cls_config["package"] = generate_package(cls);
    cls_config["cls_name"] = `${cls.class.getSimpleName()}`;
    cls_config["fields_config"] = generate_messagelite_fields(cls);
    cls_config["oneof"] = oneof_config;
    // console.log(JSON.stringify(cls_config, null, 4))
    return cls_config
}

let TypeConfig: tsMap = {
    "int": "int32",
    "long": "int64",
    "String": "string",
    "boolean": "bool",
    "Boolean": "bool",
}

function generate_messagelite_fields(cls: any){
    let fields_config: {[key: string]: any} = [];
    Java.perform(function(){
        function try_convert_name(name: string){
            let nameArr = [];
            let last_char = "";
            for (let j = 0; j < name.length; j++){
                let char = name[j];
                if (last_char && char == char.toUpperCase()){
                    nameArr.push("_");
                    nameArr.push(char.toLowerCase());
                }
                else{
                    nameArr.push(char);
                }
                last_char = char;
            }
            let excepted_field_name = nameArr.join("");
            if (field_number_cache.includes(excepted_field_name.toUpperCase())){
                let fname = excepted_field_name.toUpperCase() + "_FIELD_NUMBER";
                let tag = Java.cast(cls.class.getDeclaredField(fname).get(null), Java.use("java.lang.Integer"))
                return [excepted_field_name, `${tag}`];
            }
            else{
                return ["", "0"];
            }
        }
        function handler_field(field: javaField, name: string, tagstr: string){
            let tag = parseInt(tagstr);
            function get_type(sign: string){
                let sign_type_name = sign.slice(sign.lastIndexOf("/") + 1, sign.lastIndexOf(";"))
                if(TypeConfig[sign_type_name]){
                    return {"type": TypeConfig[sign_type_name], "need_import": false, "package": "", "tag": tag}
                }
                else{
                    let import_pkg = sign.slice(1, sign.lastIndexOf("/")).replaceAll("/", ".");
                    return {"type": sign_type_name, "need_import": true, "package": import_pkg, "tag": tag}
                }
            }
            let type_name: string = field.getType().getSimpleName();
            let import_pkg: string = field.getType().getCanonicalName();
            import_pkg = import_pkg.slice(0, import_pkg.lastIndexOf("."));
            let field_config: {[key: string]: any} = {"label": "optional", "type_1": {}, "type_2": {"type": ""}, "tag": tag};
            if(TypeConfig[type_name]){
                field_config['type_1'] = {"need_import": false, "type": TypeConfig[type_name], "package": ""};
            }
            else if(type_name == "ByteString"){
                field_config['type_1']["need_import"] = true;
                field_config["package"] = "google.protobuf.any";
                field_config["type_1"]["type"] = "google.protobuf.Any";
            }
            else if(type_name == "ProtobufList"){
                field_config["label"] = "repeated";
                field_config["type_1"] = get_type(`${field.getSignatureAnnotation()[1]}`)
            }
            else if(type_name == "MapFieldLite"){
                field_config["label"] = "";
                field_config["type_1"] = get_type(`${field.getSignatureAnnotation()[1]}`)
                field_config["type_2"] = get_type(`${field.getSignatureAnnotation()[2]}`)
            }
            else{
                field_config['type_1']["need_import"] = true;
                field_config['type_1']["type"] = type_name;
                field_config['type_1']["package"] = import_pkg;
            }
            field_config["name"] = name;
            return field_config;
        }
        let field_cache: any[] = [];
        let field_number_cache: string[] = [];
        let fields = cls.class.getDeclaredFields();
        fields.forEach(function (field: any) {
            let field_name = `${field.getName()}`;
            if (field_name == field_name.toUpperCase(), field_name.endsWith("_FIELD_NUMBER")){
                // 参考 src/google/protobuf/compiler/java/java_helpers.cc FieldConstantName
                field_number_cache.push(field_name.slice(0, field_name.lastIndexOf("_FIELD_NUMBER")));
            }
            else if(field_name[0] == field_name[0].toLowerCase() && field_name.endsWith("_")){
                // 参考 src/google/protobuf/compiler/java/java_helpers.cc ToCamelCase
                field_cache.push(field);
            }
        });
        // 对于某些扩展类型的 暂时不管...
        if(field_number_cache.length == 0) return;
        for (let i = 0; i < field_cache.length; i++){
            let field = field_cache[i];
            let field_name = `${field.getName()}`;
            let [name, tag] = try_convert_name(field_name.slice(0, field_name.lastIndexOf("_")));
            // console.log("name ===>", name)
            if (!name){
                continue
            }
            // tag
            let field_config = handler_field(field, name, tag);
            if(field_config){
                fields_config.push(field_config);
            }
        }
    })
    // console.log("------------------>", JSON.stringify(fields_config, null, 4))
    return fields_config;
}