# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: pyproto/com.bapis.bilibili.app.card.v1.LargeCoverV4.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


from pyproto.com.bapis.bilibili.app.card.v1 import Up_pb2 as pyproto_dot_com_dot_bapis_dot_bilibili_dot_app_dot_card_dot_v1_dot_Up__pb2
from pyproto.com.bapis.bilibili.app.card.v1 import Base_pb2 as pyproto_dot_com_dot_bapis_dot_bilibili_dot_app_dot_card_dot_v1_dot_Base__pb2


DESCRIPTOR = _descriptor.FileDescriptor(
  name='pyproto/com.bapis.bilibili.app.card.v1.LargeCoverV4.proto',
  package='com.bapis.bilibili.app.card.v1',
  syntax='proto3',
  serialized_options=None,
  create_key=_descriptor._internal_create_key,
  serialized_pb=b'\n9pyproto/com.bapis.bilibili.app.card.v1.LargeCoverV4.proto\x12\x1e\x63om.bapis.bilibili.app.card.v1\x1a/pyproto/com.bapis.bilibili.app.card.v1.Up.proto\x1a\x31pyproto/com.bapis.bilibili.app.card.v1.Base.proto\"\xc0\x04\n\x0cLargeCoverV4\x12\x37\n\x04\x62\x61se\x18\x01 \x01(\x0b\x32$.com.bapis.bilibili.app.card.v1.BaseH\x00\x88\x01\x01\x12\x1e\n\x11\x63over_left_text_1\x18\x02 \x01(\tH\x01\x88\x01\x01\x12\x1e\n\x11\x63over_left_text_2\x18\x03 \x01(\tH\x02\x88\x01\x01\x12\x1e\n\x11\x63over_left_text_3\x18\x04 \x01(\tH\x03\x88\x01\x01\x12\x18\n\x0b\x63over_badge\x18\x05 \x01(\tH\x04\x88\x01\x01\x12\x15\n\x08\x63\x61n_play\x18\x06 \x01(\x05H\x05\x88\x01\x01\x12\x33\n\x02up\x18\x07 \x01(\x0b\x32\".com.bapis.bilibili.app.card.v1.UpH\x06\x88\x01\x01\x12\x17\n\nshort_link\x18\x08 \x01(\tH\x07\x88\x01\x01\x12\x1b\n\x0eshare_subtitle\x18\t \x01(\tH\x08\x88\x01\x01\x12\x18\n\x0bplay_number\x18\n \x01(\tH\t\x88\x01\x01\x12\x11\n\x04\x62vid\x18\x0b \x01(\tH\n\x88\x01\x01\x12\x16\n\tsub_param\x18\x0c \x01(\tH\x0b\x88\x01\x01\x42\x07\n\x05_baseB\x14\n\x12_cover_left_text_1B\x14\n\x12_cover_left_text_2B\x14\n\x12_cover_left_text_3B\x0e\n\x0c_cover_badgeB\x0b\n\t_can_playB\x05\n\x03_upB\r\n\x0b_short_linkB\x11\n\x0f_share_subtitleB\x0e\n\x0c_play_numberB\x07\n\x05_bvidB\x0c\n\n_sub_paramb\x06proto3'
  ,
  dependencies=[pyproto_dot_com_dot_bapis_dot_bilibili_dot_app_dot_card_dot_v1_dot_Up__pb2.DESCRIPTOR,pyproto_dot_com_dot_bapis_dot_bilibili_dot_app_dot_card_dot_v1_dot_Base__pb2.DESCRIPTOR,])




_LARGECOVERV4 = _descriptor.Descriptor(
  name='LargeCoverV4',
  full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='base', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4.base', index=0,
      number=1, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='cover_left_text_1', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4.cover_left_text_1', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='cover_left_text_2', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4.cover_left_text_2', index=2,
      number=3, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='cover_left_text_3', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4.cover_left_text_3', index=3,
      number=4, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='cover_badge', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4.cover_badge', index=4,
      number=5, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='can_play', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4.can_play', index=5,
      number=6, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='up', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4.up', index=6,
      number=7, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='short_link', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4.short_link', index=7,
      number=8, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='share_subtitle', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4.share_subtitle', index=8,
      number=9, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='play_number', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4.play_number', index=9,
      number=10, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='bvid', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4.bvid', index=10,
      number=11, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='sub_param', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4.sub_param', index=11,
      number=12, type=9, cpp_type=9, label=1,
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
      name='_base', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4._base',
      index=0, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_cover_left_text_1', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4._cover_left_text_1',
      index=1, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_cover_left_text_2', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4._cover_left_text_2',
      index=2, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_cover_left_text_3', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4._cover_left_text_3',
      index=3, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_cover_badge', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4._cover_badge',
      index=4, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_can_play', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4._can_play',
      index=5, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_up', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4._up',
      index=6, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_short_link', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4._short_link',
      index=7, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_share_subtitle', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4._share_subtitle',
      index=8, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_play_number', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4._play_number',
      index=9, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_bvid', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4._bvid',
      index=10, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_sub_param', full_name='com.bapis.bilibili.app.card.v1.LargeCoverV4._sub_param',
      index=11, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
  ],
  serialized_start=194,
  serialized_end=770,
)

_LARGECOVERV4.fields_by_name['base'].message_type = pyproto_dot_com_dot_bapis_dot_bilibili_dot_app_dot_card_dot_v1_dot_Base__pb2._BASE
_LARGECOVERV4.fields_by_name['up'].message_type = pyproto_dot_com_dot_bapis_dot_bilibili_dot_app_dot_card_dot_v1_dot_Up__pb2._UP
_LARGECOVERV4.oneofs_by_name['_base'].fields.append(
  _LARGECOVERV4.fields_by_name['base'])
_LARGECOVERV4.fields_by_name['base'].containing_oneof = _LARGECOVERV4.oneofs_by_name['_base']
_LARGECOVERV4.oneofs_by_name['_cover_left_text_1'].fields.append(
  _LARGECOVERV4.fields_by_name['cover_left_text_1'])
_LARGECOVERV4.fields_by_name['cover_left_text_1'].containing_oneof = _LARGECOVERV4.oneofs_by_name['_cover_left_text_1']
_LARGECOVERV4.oneofs_by_name['_cover_left_text_2'].fields.append(
  _LARGECOVERV4.fields_by_name['cover_left_text_2'])
_LARGECOVERV4.fields_by_name['cover_left_text_2'].containing_oneof = _LARGECOVERV4.oneofs_by_name['_cover_left_text_2']
_LARGECOVERV4.oneofs_by_name['_cover_left_text_3'].fields.append(
  _LARGECOVERV4.fields_by_name['cover_left_text_3'])
_LARGECOVERV4.fields_by_name['cover_left_text_3'].containing_oneof = _LARGECOVERV4.oneofs_by_name['_cover_left_text_3']
_LARGECOVERV4.oneofs_by_name['_cover_badge'].fields.append(
  _LARGECOVERV4.fields_by_name['cover_badge'])
_LARGECOVERV4.fields_by_name['cover_badge'].containing_oneof = _LARGECOVERV4.oneofs_by_name['_cover_badge']
_LARGECOVERV4.oneofs_by_name['_can_play'].fields.append(
  _LARGECOVERV4.fields_by_name['can_play'])
_LARGECOVERV4.fields_by_name['can_play'].containing_oneof = _LARGECOVERV4.oneofs_by_name['_can_play']
_LARGECOVERV4.oneofs_by_name['_up'].fields.append(
  _LARGECOVERV4.fields_by_name['up'])
_LARGECOVERV4.fields_by_name['up'].containing_oneof = _LARGECOVERV4.oneofs_by_name['_up']
_LARGECOVERV4.oneofs_by_name['_short_link'].fields.append(
  _LARGECOVERV4.fields_by_name['short_link'])
_LARGECOVERV4.fields_by_name['short_link'].containing_oneof = _LARGECOVERV4.oneofs_by_name['_short_link']
_LARGECOVERV4.oneofs_by_name['_share_subtitle'].fields.append(
  _LARGECOVERV4.fields_by_name['share_subtitle'])
_LARGECOVERV4.fields_by_name['share_subtitle'].containing_oneof = _LARGECOVERV4.oneofs_by_name['_share_subtitle']
_LARGECOVERV4.oneofs_by_name['_play_number'].fields.append(
  _LARGECOVERV4.fields_by_name['play_number'])
_LARGECOVERV4.fields_by_name['play_number'].containing_oneof = _LARGECOVERV4.oneofs_by_name['_play_number']
_LARGECOVERV4.oneofs_by_name['_bvid'].fields.append(
  _LARGECOVERV4.fields_by_name['bvid'])
_LARGECOVERV4.fields_by_name['bvid'].containing_oneof = _LARGECOVERV4.oneofs_by_name['_bvid']
_LARGECOVERV4.oneofs_by_name['_sub_param'].fields.append(
  _LARGECOVERV4.fields_by_name['sub_param'])
_LARGECOVERV4.fields_by_name['sub_param'].containing_oneof = _LARGECOVERV4.oneofs_by_name['_sub_param']
DESCRIPTOR.message_types_by_name['LargeCoverV4'] = _LARGECOVERV4
_sym_db.RegisterFileDescriptor(DESCRIPTOR)

LargeCoverV4 = _reflection.GeneratedProtocolMessageType('LargeCoverV4', (_message.Message,), {
  'DESCRIPTOR' : _LARGECOVERV4,
  '__module__' : 'pyproto.com.bapis.bilibili.app.card.v1.LargeCoverV4_pb2'
  # @@protoc_insertion_point(class_scope:com.bapis.bilibili.app.card.v1.LargeCoverV4)
  })
_sym_db.RegisterMessage(LargeCoverV4)


# @@protoc_insertion_point(module_scope)
