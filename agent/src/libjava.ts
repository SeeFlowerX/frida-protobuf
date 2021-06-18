export let ModifierCls: any = null;
export let WireMessageClz: any = null;
export let GeneratedMessageLiteClz: any = null;
export let EnumClz: any = null;
export let ObjectClz: any = null;

export function InitClsClz(){
    Java.perform(function(){
        ModifierCls = Java.use("java.lang.reflect.Modifier")
        EnumClz = Java.use("java.lang.Enum").class;
        ObjectClz = Java.use("java.lang.Object").class;
        try{
            WireMessageClz = Java.use("com.squareup.wire.Message").class;
        }
        catch(e){
        }
        try{
            GeneratedMessageLiteClz = Java.use("com.google.protobuf.GeneratedMessageLite").class;
        }
        catch(e){
        }
    })
}