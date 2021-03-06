# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: pyproto/com.bapis.bilibili.app.card.v1.ThreePoint.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


from pyproto.com.bapis.bilibili.app.card.v1 import DislikeReason_pb2 as pyproto_dot_com_dot_bapis_dot_bilibili_dot_app_dot_card_dot_v1_dot_DislikeReason__pb2


DESCRIPTOR = _descriptor.FileDescriptor(
  name='pyproto/com.bapis.bilibili.app.card.v1.ThreePoint.proto',
  package='com.bapis.bilibili.app.card.v1',
  syntax='proto3',
  serialized_options=None,
  create_key=_descriptor._internal_create_key,
  serialized_pb=b'\n7pyproto/com.bapis.bilibili.app.card.v1.ThreePoint.proto\x12\x1e\x63om.bapis.bilibili.app.card.v1\x1a:pyproto/com.bapis.bilibili.app.card.v1.DislikeReason.proto\"\xc0\x01\n\nThreePoint\x12\x46\n\x0f\x64islike_reasons\x18\x01 \x03(\x0b\x32-.com.bapis.bilibili.app.card.v1.DislikeReason\x12@\n\tfeedbacks\x18\x02 \x03(\x0b\x32-.com.bapis.bilibili.app.card.v1.DislikeReason\x12\x18\n\x0bwatch_later\x18\x03 \x01(\x05H\x00\x88\x01\x01\x42\x0e\n\x0c_watch_laterb\x06proto3'
  ,
  dependencies=[pyproto_dot_com_dot_bapis_dot_bilibili_dot_app_dot_card_dot_v1_dot_DislikeReason__pb2.DESCRIPTOR,])




_THREEPOINT = _descriptor.Descriptor(
  name='ThreePoint',
  full_name='com.bapis.bilibili.app.card.v1.ThreePoint',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='dislike_reasons', full_name='com.bapis.bilibili.app.card.v1.ThreePoint.dislike_reasons', index=0,
      number=1, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='feedbacks', full_name='com.bapis.bilibili.app.card.v1.ThreePoint.feedbacks', index=1,
      number=2, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='watch_later', full_name='com.bapis.bilibili.app.card.v1.ThreePoint.watch_later', index=2,
      number=3, type=5, cpp_type=1, label=1,
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
      name='_watch_later', full_name='com.bapis.bilibili.app.card.v1.ThreePoint._watch_later',
      index=0, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
  ],
  serialized_start=152,
  serialized_end=344,
)

_THREEPOINT.fields_by_name['dislike_reasons'].message_type = pyproto_dot_com_dot_bapis_dot_bilibili_dot_app_dot_card_dot_v1_dot_DislikeReason__pb2._DISLIKEREASON
_THREEPOINT.fields_by_name['feedbacks'].message_type = pyproto_dot_com_dot_bapis_dot_bilibili_dot_app_dot_card_dot_v1_dot_DislikeReason__pb2._DISLIKEREASON
_THREEPOINT.oneofs_by_name['_watch_later'].fields.append(
  _THREEPOINT.fields_by_name['watch_later'])
_THREEPOINT.fields_by_name['watch_later'].containing_oneof = _THREEPOINT.oneofs_by_name['_watch_later']
DESCRIPTOR.message_types_by_name['ThreePoint'] = _THREEPOINT
_sym_db.RegisterFileDescriptor(DESCRIPTOR)

ThreePoint = _reflection.GeneratedProtocolMessageType('ThreePoint', (_message.Message,), {
  'DESCRIPTOR' : _THREEPOINT,
  '__module__' : 'pyproto.com.bapis.bilibili.app.card.v1.ThreePoint_pb2'
  # @@protoc_insertion_point(class_scope:com.bapis.bilibili.app.card.v1.ThreePoint)
  })
_sym_db.RegisterMessage(ThreePoint)


# @@protoc_insertion_point(module_scope)
