# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: pyproto/com.bapis.bilibili.app.card.v1.TwoItemHV1Item.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


from pyproto.com.bapis.bilibili.app.card.v1 import Args_pb2 as pyproto_dot_com_dot_bapis_dot_bilibili_dot_app_dot_card_dot_v1_dot_Args__pb2


DESCRIPTOR = _descriptor.FileDescriptor(
  name='pyproto/com.bapis.bilibili.app.card.v1.TwoItemHV1Item.proto',
  package='com.bapis.bilibili.app.card.v1',
  syntax='proto3',
  serialized_options=None,
  create_key=_descriptor._internal_create_key,
  serialized_pb=b'\n;pyproto/com.bapis.bilibili.app.card.v1.TwoItemHV1Item.proto\x12\x1e\x63om.bapis.bilibili.app.card.v1\x1a\x31pyproto/com.bapis.bilibili.app.card.v1.Args.proto\"\x82\x03\n\x0eTwoItemHV1Item\x12\x12\n\x05title\x18\x01 \x01(\tH\x00\x88\x01\x01\x12\x12\n\x05\x63over\x18\x02 \x01(\tH\x01\x88\x01\x01\x12\x10\n\x03uri\x18\x03 \x01(\tH\x02\x88\x01\x01\x12\x12\n\x05param\x18\x04 \x01(\tH\x03\x88\x01\x01\x12\x37\n\x04\x61rgs\x18\x05 \x01(\x0b\x32$.com.bapis.bilibili.app.card.v1.ArgsH\x04\x88\x01\x01\x12\x11\n\x04goto\x18\x06 \x01(\tH\x05\x88\x01\x01\x12\x1e\n\x11\x63over_left_text_1\x18\x07 \x01(\tH\x06\x88\x01\x01\x12\x1e\n\x11\x63over_left_icon_1\x18\x08 \x01(\x05H\x07\x88\x01\x01\x12\x1d\n\x10\x63over_right_text\x18\t \x01(\tH\x08\x88\x01\x01\x42\x08\n\x06_titleB\x08\n\x06_coverB\x06\n\x04_uriB\x08\n\x06_paramB\x07\n\x05_argsB\x07\n\x05_gotoB\x14\n\x12_cover_left_text_1B\x14\n\x12_cover_left_icon_1B\x13\n\x11_cover_right_textb\x06proto3'
  ,
  dependencies=[pyproto_dot_com_dot_bapis_dot_bilibili_dot_app_dot_card_dot_v1_dot_Args__pb2.DESCRIPTOR,])




_TWOITEMHV1ITEM = _descriptor.Descriptor(
  name='TwoItemHV1Item',
  full_name='com.bapis.bilibili.app.card.v1.TwoItemHV1Item',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='title', full_name='com.bapis.bilibili.app.card.v1.TwoItemHV1Item.title', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='cover', full_name='com.bapis.bilibili.app.card.v1.TwoItemHV1Item.cover', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='uri', full_name='com.bapis.bilibili.app.card.v1.TwoItemHV1Item.uri', index=2,
      number=3, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='param', full_name='com.bapis.bilibili.app.card.v1.TwoItemHV1Item.param', index=3,
      number=4, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='args', full_name='com.bapis.bilibili.app.card.v1.TwoItemHV1Item.args', index=4,
      number=5, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='goto', full_name='com.bapis.bilibili.app.card.v1.TwoItemHV1Item.goto', index=5,
      number=6, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='cover_left_text_1', full_name='com.bapis.bilibili.app.card.v1.TwoItemHV1Item.cover_left_text_1', index=6,
      number=7, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='cover_left_icon_1', full_name='com.bapis.bilibili.app.card.v1.TwoItemHV1Item.cover_left_icon_1', index=7,
      number=8, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='cover_right_text', full_name='com.bapis.bilibili.app.card.v1.TwoItemHV1Item.cover_right_text', index=8,
      number=9, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
    _descriptor.OneofDescriptor(
      name='_title', full_name='com.bapis.bilibili.app.card.v1.TwoItemHV1Item._title',
      index=0, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_cover', full_name='com.bapis.bilibili.app.card.v1.TwoItemHV1Item._cover',
      index=1, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_uri', full_name='com.bapis.bilibili.app.card.v1.TwoItemHV1Item._uri',
      index=2, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_param', full_name='com.bapis.bilibili.app.card.v1.TwoItemHV1Item._param',
      index=3, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_args', full_name='com.bapis.bilibili.app.card.v1.TwoItemHV1Item._args',
      index=4, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_goto', full_name='com.bapis.bilibili.app.card.v1.TwoItemHV1Item._goto',
      index=5, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_cover_left_text_1', full_name='com.bapis.bilibili.app.card.v1.TwoItemHV1Item._cover_left_text_1',
      index=6, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_cover_left_icon_1', full_name='com.bapis.bilibili.app.card.v1.TwoItemHV1Item._cover_left_icon_1',
      index=7, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_cover_right_text', full_name='com.bapis.bilibili.app.card.v1.TwoItemHV1Item._cover_right_text',
      index=8, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
  ],
  serialized_start=147,
  serialized_end=533,
)

_TWOITEMHV1ITEM.fields_by_name['args'].message_type = pyproto_dot_com_dot_bapis_dot_bilibili_dot_app_dot_card_dot_v1_dot_Args__pb2._ARGS
_TWOITEMHV1ITEM.oneofs_by_name['_title'].fields.append(
  _TWOITEMHV1ITEM.fields_by_name['title'])
_TWOITEMHV1ITEM.fields_by_name['title'].containing_oneof = _TWOITEMHV1ITEM.oneofs_by_name['_title']
_TWOITEMHV1ITEM.oneofs_by_name['_cover'].fields.append(
  _TWOITEMHV1ITEM.fields_by_name['cover'])
_TWOITEMHV1ITEM.fields_by_name['cover'].containing_oneof = _TWOITEMHV1ITEM.oneofs_by_name['_cover']
_TWOITEMHV1ITEM.oneofs_by_name['_uri'].fields.append(
  _TWOITEMHV1ITEM.fields_by_name['uri'])
_TWOITEMHV1ITEM.fields_by_name['uri'].containing_oneof = _TWOITEMHV1ITEM.oneofs_by_name['_uri']
_TWOITEMHV1ITEM.oneofs_by_name['_param'].fields.append(
  _TWOITEMHV1ITEM.fields_by_name['param'])
_TWOITEMHV1ITEM.fields_by_name['param'].containing_oneof = _TWOITEMHV1ITEM.oneofs_by_name['_param']
_TWOITEMHV1ITEM.oneofs_by_name['_args'].fields.append(
  _TWOITEMHV1ITEM.fields_by_name['args'])
_TWOITEMHV1ITEM.fields_by_name['args'].containing_oneof = _TWOITEMHV1ITEM.oneofs_by_name['_args']
_TWOITEMHV1ITEM.oneofs_by_name['_goto'].fields.append(
  _TWOITEMHV1ITEM.fields_by_name['goto'])
_TWOITEMHV1ITEM.fields_by_name['goto'].containing_oneof = _TWOITEMHV1ITEM.oneofs_by_name['_goto']
_TWOITEMHV1ITEM.oneofs_by_name['_cover_left_text_1'].fields.append(
  _TWOITEMHV1ITEM.fields_by_name['cover_left_text_1'])
_TWOITEMHV1ITEM.fields_by_name['cover_left_text_1'].containing_oneof = _TWOITEMHV1ITEM.oneofs_by_name['_cover_left_text_1']
_TWOITEMHV1ITEM.oneofs_by_name['_cover_left_icon_1'].fields.append(
  _TWOITEMHV1ITEM.fields_by_name['cover_left_icon_1'])
_TWOITEMHV1ITEM.fields_by_name['cover_left_icon_1'].containing_oneof = _TWOITEMHV1ITEM.oneofs_by_name['_cover_left_icon_1']
_TWOITEMHV1ITEM.oneofs_by_name['_cover_right_text'].fields.append(
  _TWOITEMHV1ITEM.fields_by_name['cover_right_text'])
_TWOITEMHV1ITEM.fields_by_name['cover_right_text'].containing_oneof = _TWOITEMHV1ITEM.oneofs_by_name['_cover_right_text']
DESCRIPTOR.message_types_by_name['TwoItemHV1Item'] = _TWOITEMHV1ITEM
_sym_db.RegisterFileDescriptor(DESCRIPTOR)

TwoItemHV1Item = _reflection.GeneratedProtocolMessageType('TwoItemHV1Item', (_message.Message,), {
  'DESCRIPTOR' : _TWOITEMHV1ITEM,
  '__module__' : 'pyproto.com.bapis.bilibili.app.card.v1.TwoItemHV1Item_pb2'
  # @@protoc_insertion_point(class_scope:com.bapis.bilibili.app.card.v1.TwoItemHV1Item)
  })
_sym_db.RegisterMessage(TwoItemHV1Item)


# @@protoc_insertion_point(module_scope)
