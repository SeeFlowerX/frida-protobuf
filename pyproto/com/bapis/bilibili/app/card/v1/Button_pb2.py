# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: pyproto/com.bapis.bilibili.app.card.v1.Button.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


from pyproto.com.bapis.bilibili.app.card.v1 import Relation_pb2 as pyproto_dot_com_dot_bapis_dot_bilibili_dot_app_dot_card_dot_v1_dot_Relation__pb2


DESCRIPTOR = _descriptor.FileDescriptor(
  name='pyproto/com.bapis.bilibili.app.card.v1.Button.proto',
  package='com.bapis.bilibili.app.card.v1',
  syntax='proto3',
  serialized_options=None,
  create_key=_descriptor._internal_create_key,
  serialized_pb=b'\n3pyproto/com.bapis.bilibili.app.card.v1.Button.proto\x12\x1e\x63om.bapis.bilibili.app.card.v1\x1a\x35pyproto/com.bapis.bilibili.app.card.v1.Relation.proto\"\x88\x02\n\x06\x42utton\x12\x11\n\x04text\x18\x01 \x01(\tH\x00\x88\x01\x01\x12\x12\n\x05param\x18\x02 \x01(\tH\x01\x88\x01\x01\x12\x10\n\x03uri\x18\x03 \x01(\tH\x02\x88\x01\x01\x12\x12\n\x05\x65vent\x18\x04 \x01(\tH\x03\x88\x01\x01\x12\x15\n\x08selected\x18\x05 \x01(\x05H\x04\x88\x01\x01\x12\x11\n\x04type\x18\x06 \x01(\x05H\x05\x88\x01\x01\x12?\n\x08relation\x18\x08 \x01(\x0b\x32(.com.bapis.bilibili.app.card.v1.RelationH\x06\x88\x01\x01\x42\x07\n\x05_textB\x08\n\x06_paramB\x06\n\x04_uriB\x08\n\x06_eventB\x0b\n\t_selectedB\x07\n\x05_typeB\x0b\n\t_relationb\x06proto3'
  ,
  dependencies=[pyproto_dot_com_dot_bapis_dot_bilibili_dot_app_dot_card_dot_v1_dot_Relation__pb2.DESCRIPTOR,])




_BUTTON = _descriptor.Descriptor(
  name='Button',
  full_name='com.bapis.bilibili.app.card.v1.Button',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='text', full_name='com.bapis.bilibili.app.card.v1.Button.text', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='param', full_name='com.bapis.bilibili.app.card.v1.Button.param', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='uri', full_name='com.bapis.bilibili.app.card.v1.Button.uri', index=2,
      number=3, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='event', full_name='com.bapis.bilibili.app.card.v1.Button.event', index=3,
      number=4, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='selected', full_name='com.bapis.bilibili.app.card.v1.Button.selected', index=4,
      number=5, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='type', full_name='com.bapis.bilibili.app.card.v1.Button.type', index=5,
      number=6, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='relation', full_name='com.bapis.bilibili.app.card.v1.Button.relation', index=6,
      number=8, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
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
      name='_text', full_name='com.bapis.bilibili.app.card.v1.Button._text',
      index=0, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_param', full_name='com.bapis.bilibili.app.card.v1.Button._param',
      index=1, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_uri', full_name='com.bapis.bilibili.app.card.v1.Button._uri',
      index=2, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_event', full_name='com.bapis.bilibili.app.card.v1.Button._event',
      index=3, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_selected', full_name='com.bapis.bilibili.app.card.v1.Button._selected',
      index=4, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_type', full_name='com.bapis.bilibili.app.card.v1.Button._type',
      index=5, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_relation', full_name='com.bapis.bilibili.app.card.v1.Button._relation',
      index=6, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
  ],
  serialized_start=143,
  serialized_end=407,
)

_BUTTON.fields_by_name['relation'].message_type = pyproto_dot_com_dot_bapis_dot_bilibili_dot_app_dot_card_dot_v1_dot_Relation__pb2._RELATION
_BUTTON.oneofs_by_name['_text'].fields.append(
  _BUTTON.fields_by_name['text'])
_BUTTON.fields_by_name['text'].containing_oneof = _BUTTON.oneofs_by_name['_text']
_BUTTON.oneofs_by_name['_param'].fields.append(
  _BUTTON.fields_by_name['param'])
_BUTTON.fields_by_name['param'].containing_oneof = _BUTTON.oneofs_by_name['_param']
_BUTTON.oneofs_by_name['_uri'].fields.append(
  _BUTTON.fields_by_name['uri'])
_BUTTON.fields_by_name['uri'].containing_oneof = _BUTTON.oneofs_by_name['_uri']
_BUTTON.oneofs_by_name['_event'].fields.append(
  _BUTTON.fields_by_name['event'])
_BUTTON.fields_by_name['event'].containing_oneof = _BUTTON.oneofs_by_name['_event']
_BUTTON.oneofs_by_name['_selected'].fields.append(
  _BUTTON.fields_by_name['selected'])
_BUTTON.fields_by_name['selected'].containing_oneof = _BUTTON.oneofs_by_name['_selected']
_BUTTON.oneofs_by_name['_type'].fields.append(
  _BUTTON.fields_by_name['type'])
_BUTTON.fields_by_name['type'].containing_oneof = _BUTTON.oneofs_by_name['_type']
_BUTTON.oneofs_by_name['_relation'].fields.append(
  _BUTTON.fields_by_name['relation'])
_BUTTON.fields_by_name['relation'].containing_oneof = _BUTTON.oneofs_by_name['_relation']
DESCRIPTOR.message_types_by_name['Button'] = _BUTTON
_sym_db.RegisterFileDescriptor(DESCRIPTOR)

Button = _reflection.GeneratedProtocolMessageType('Button', (_message.Message,), {
  'DESCRIPTOR' : _BUTTON,
  '__module__' : 'pyproto.com.bapis.bilibili.app.card.v1.Button_pb2'
  # @@protoc_insertion_point(class_scope:com.bapis.bilibili.app.card.v1.Button)
  })
_sym_db.RegisterMessage(Button)


# @@protoc_insertion_point(module_scope)
