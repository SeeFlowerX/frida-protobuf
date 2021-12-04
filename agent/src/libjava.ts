export let ModifierCls: any = null;
export let WireMessageClz: any = null;
export let WireFieldCls: any = null;
export let WireProtoFieldCls: any = null;
export let Wire2MessageClz: any = null;
export let Wire2FieldCls: any = null;
export let Wire2ProtoFieldCls: any = null;
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
        catch(error){
        }
        try {
            WireFieldCls = Java.use("com.squareup.wire.WireField");
        } catch (error) {
        }
        try {
            WireProtoFieldCls = Java.use("com.squareup.wire.ProtoField");
        } catch (error) {
        }
        try{
            Wire2MessageClz = Java.use("com.squareup.wire2.Message").class;
        }
        catch(e){
        }
        try{
            Wire2FieldCls = Java.use("com.squareup.wire2.WireField");
        }
        catch(e){
        }
        try{
            Wire2ProtoFieldCls = Java.use("com.squareup.wire2.ProtoField");
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