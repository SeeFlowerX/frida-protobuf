# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: pyproto/com.bapis.bilibili.app.card.v1.EntranceItem.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


from pyproto.com.bapis.bilibili.app.card.v1 import Bubble_pb2 as pyproto_dot_com_dot_bapis_dot_bilibili_dot_app_dot_card_dot_v1_dot_Bubble__pb2


DESCRIPTOR = _descriptor.FileDescriptor(
  name='pyproto/com.bapis.bilibili.app.card.v1.EntranceItem.proto',
  package='com.bapis.bilibili.app.card.v1',
  syntax='proto3',
  serialized_options=None,
  create_key=_descriptor._internal_create_key,
  serialized_pb=b'\n9pyproto/com.bapis.bilibili.app.card.v1.EntranceItem.proto\x12\x1e\x63om.bapis.bilibili.app.card.v1\x1a\x33pyproto/com.bapis.bilibili.app.card.v1.Bubble.proto\"\xc4\x02\n\x0c\x45ntranceItem\x12\x11\n\x04goto\x18\x01 \x01(\tH\x00\x88\x01\x01\x12\x11\n\x04icon\x18\x02 \x01(\tH\x01\x88\x01\x01\x12\x12\n\x05title\x18\x03 \x01(\tH\x02\x88\x01\x01\x12\x16\n\tmodule_id\x18\x04 \x01(\tH\x03\x88\x01\x01\x12\x10\n\x03uri\x18\x05 \x01(\tH\x04\x88\x01\x01\x12\x18\n\x0b\x65ntrance_id\x18\x06 \x01(\x03H\x05\x88\x01\x01\x12;\n\x06\x62ubble\x18\x07 \x01(\x0b\x32&.com.bapis.bilibili.app.card.v1.BubbleH\x06\x88\x01\x01\x12\x1a\n\rentrance_type\x18\x08 \x01(\x05H\x07\x88\x01\x01\x42\x07\n\x05_gotoB\x07\n\x05_iconB\x08\n\x06_titleB\x0c\n\n_module_idB\x06\n\x04_uriB\x0e\n\x0c_entrance_idB\t\n\x07_bubbleB\x10\n\x0e_entrance_typeb\x06proto3'
  ,
  dependencies=[pyproto_dot_com_dot_bapis_dot_bilibili_dot_app_dot_card_dot_v1_dot_Bubble__pb2.DESCRIPTOR,])




_ENTRANCEITEM = _descriptor.Descriptor(
  name='EntranceItem',
  full_name='com.bapis.bilibili.app.card.v1.EntranceItem',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='goto', full_name='com.bapis.bilibili.app.card.v1.EntranceItem.goto', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='icon', full_name='com.bapis.bilibili.app.card.v1.EntranceItem.icon', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='title', full_name='com.bapis.bilibili.app.card.v1.EntranceItem.title', index=2,
      number=3, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='module_id', full_name='com.bapis.bilibili.app.card.v1.EntranceItem.module_id', index=3,
      number=4, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='uri', full_name='com.bapis.bilibili.app.card.v1.EntranceItem.uri', index=4,
      number=5, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='entrance_id', full_name='com.bapis.bilibili.app.card.v1.EntranceItem.entrance_id', index=5,
      number=6, type=3, cpp_type=2, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='bubble', full_name='com.bapis.bilibili.app.card.v1.EntranceItem.bubble', index=6,
      number=7, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='entrance_type', full_name='com.bapis.bilibili.app.card.v1.EntranceItem.entrance_type', index=7,
      number=8, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
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
      name='_goto', full_name='com.bapis.bilibili.app.card.v1.EntranceItem._goto',
      index=0, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_icon', full_name='com.bapis.bilibili.app.card.v1.EntranceItem._icon',
      index=1, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_title', full_name='com.bapis.bilibili.app.card.v1.EntranceItem._title',
      index=2, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_module_id', full_name='com.bapis.bilibili.app.card.v1.EntranceItem._module_id',
      index=3, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_uri', full_name='com.bapis.bilibili.app.card.v1.EntranceItem._uri',
      index=4, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_entrance_id', full_name='com.bapis.bilibili.app.card.v1.EntranceItem._entrance_id',
      index=5, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_bubble', full_name='com.bapis.bilibili.app.card.v1.EntranceItem._bubble',
      index=6, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_entrance_type', full_name='com.bapis.bilibili.app.card.v1.EntranceItem._entrance_type',
      index=7, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
  ],
  serialized_start=147,
  serialized_end=471,
)

_ENTRANCEITEM.fields_by_name['bubble'].message_type = pyproto_dot_com_dot_bapis_dot_bilibili_dot_app_dot_card_dot_v1_dot_Bubble__pb2._BUBBLE
_ENTRANCEITEM.oneofs_by_name['_goto'].fields.append(
  _ENTRANCEITEM.fields_by_name['goto'])
_ENTRANCEITEM.fields_by_name['goto'].containing_oneof = _ENTRANCEITEM.oneofs_by_name['_goto']
_ENTRANCEITEM.oneofs_by_name['_icon'].fields.append(
  _ENTRANCEITEM.fields_by_name['icon'])
_ENTRANCEITEM.fields_by_name['icon'].containing_oneof = _ENTRANCEITEM.oneofs_by_name['_icon']
_ENTRANCEITEM.oneofs_by_name['_title'].fields.append(
  _ENTRANCEITEM.fields_by_name['title'])
_ENTRANCEITEM.fields_by_name['title'].containing_oneof = _ENTRANCEITEM.oneofs_by_name['_title']
_ENTRANCEITEM.oneofs_by_name['_module_id'].fields.append(
  _ENTRANCEITEM.fields_by_name['module_id'])
_ENTRANCEITEM.fields_by_name['module_id'].containing_oneof = _ENTRANCEITEM.oneofs_by_name['_module_id']
_ENTRANCEITEM.oneofs_by_name['_uri'].fields.append(
  _ENTRANCEITEM.fields_by_name['uri'])
_ENTRANCEITEM.fields_by_name['uri'].containing_oneof = _ENTRANCEITEM.oneofs_by_name['_uri']
_ENTRANCEITEM.oneofs_by_name['_entrance_id'].fields.append(
  _ENTRANCEITEM.fields_by_name['entrance_id'])
_ENTRANCEITEM.fields_by_name['entrance_id'].containing_oneof = _ENTRANCEITEM.oneofs_by_name['_entrance_id']
_ENTRANCEITEM.oneofs_by_name['_bubble'].fields.append(
  _ENTRANCEITEM.fields_by_name['bubble'])
_ENTRANCEITEM.fields_by_name['bubble'].containing_oneof = _ENTRANCEITEM.oneofs_by_name['_bubble']
_ENTRANCEITEM.oneofs_by_name['_entrance_type'].fields.append(
  _ENTRANCEITEM.fields_by_name['entrance_type'])
_ENTRANCEITEM.fields_by_name['entrance_type'].containing_oneof = _ENTRANCEITEM.oneofs_by_name['_entrance_type']
DESCRIPTOR.message_types_by_name['EntranceItem'] = _ENTRANCEITEM
_sym_db.RegisterFileDescriptor(DESCRIPTOR)

EntranceItem = _reflection.GeneratedProtocolMessageType('EntranceItem', (_message.Message,), {
  'DESCRIPTOR' : _ENTRANCEITEM,
  '__module__' : 'pyproto.com.bapis.bilibili.app.card.v1.EntranceItem_pb2'
  # @@protoc_insertion_point(class_scope:com.bapis.bilibili.app.card.v1.EntranceItem)
  })
_sym_db.RegisterMessage(EntranceItem)


# @@protoc_insertion_point(module_scope)
