# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: pyproto/com.bapis.bilibili.app.card.v1.Args.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor.FileDescriptor(
  name='pyproto/com.bapis.bilibili.app.card.v1.Args.proto',
  package='com.bapis.bilibili.app.card.v1',
  syntax='proto3',
  serialized_options=None,
  create_key=_descriptor._internal_create_key,
  serialized_pb=b'\n1pyproto/com.bapis.bilibili.app.card.v1.Args.proto\x12\x1e\x63om.bapis.bilibili.app.card.v1\"\xdc\x02\n\x04\x41rgs\x12\x11\n\x04type\x18\x01 \x01(\x05H\x00\x88\x01\x01\x12\x12\n\x05up_id\x18\x02 \x01(\x03H\x01\x88\x01\x01\x12\x14\n\x07up_name\x18\x03 \x01(\tH\x02\x88\x01\x01\x12\x10\n\x03rid\x18\x04 \x01(\x05H\x03\x88\x01\x01\x12\x12\n\x05rname\x18\x05 \x01(\tH\x04\x88\x01\x01\x12\x10\n\x03tid\x18\x06 \x01(\x03H\x05\x88\x01\x01\x12\x12\n\x05tname\x18\x07 \x01(\tH\x06\x88\x01\x01\x12\x15\n\x08track_id\x18\x08 \x01(\tH\x07\x88\x01\x01\x12\x12\n\x05state\x18\t \x01(\tH\x08\x88\x01\x01\x12\x1a\n\rconverge_type\x18\n \x01(\x05H\t\x88\x01\x01\x12\x10\n\x03\x61id\x18\x0b \x01(\x03H\n\x88\x01\x01\x42\x07\n\x05_typeB\x08\n\x06_up_idB\n\n\x08_up_nameB\x06\n\x04_ridB\x08\n\x06_rnameB\x06\n\x04_tidB\x08\n\x06_tnameB\x0b\n\t_track_idB\x08\n\x06_stateB\x10\n\x0e_converge_typeB\x06\n\x04_aidb\x06proto3'
)




_ARGS = _descriptor.Descriptor(
  name='Args',
  full_name='com.bapis.bilibili.app.card.v1.Args',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='type', full_name='com.bapis.bilibili.app.card.v1.Args.type', index=0,
      number=1, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='up_id', full_name='com.bapis.bilibili.app.card.v1.Args.up_id', index=1,
      number=2, type=3, cpp_type=2, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='up_name', full_name='com.bapis.bilibili.app.card.v1.Args.up_name', index=2,
      number=3, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='rid', full_name='com.bapis.bilibili.app.card.v1.Args.rid', index=3,
      number=4, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='rname', full_name='com.bapis.bilibili.app.card.v1.Args.rname', index=4,
      number=5, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='tid', full_name='com.bapis.bilibili.app.card.v1.Args.tid', index=5,
      number=6, type=3, cpp_type=2, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='tname', full_name='com.bapis.bilibili.app.card.v1.Args.tname', index=6,
      number=7, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='track_id', full_name='com.bapis.bilibili.app.card.v1.Args.track_id', index=7,
      number=8, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='state', full_name='com.bapis.bilibili.app.card.v1.Args.state', index=8,
      number=9, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='converge_type', full_name='com.bapis.bilibili.app.card.v1.Args.converge_type', index=9,
      number=10, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='aid', full_name='com.bapis.bilibili.app.card.v1.Args.aid', index=10,
      number=11, type=3, cpp_type=2, label=1,
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
      name='_type', full_name='com.bapis.bilibili.app.card.v1.Args._type',
      index=0, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_up_id', full_name='com.bapis.bilibili.app.card.v1.Args._up_id',
      index=1, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_up_name', full_name='com.bapis.bilibili.app.card.v1.Args._up_name',
      index=2, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_rid', full_name='com.bapis.bilibili.app.card.v1.Args._rid',
      index=3, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_rname', full_name='com.bapis.bilibili.app.card.v1.Args._rname',
      index=4, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_tid', full_name='com.bapis.bilibili.app.card.v1.Args._tid',
      index=5, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_tname', full_name='com.bapis.bilibili.app.card.v1.Args._tname',
      index=6, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_track_id', full_name='com.bapis.bilibili.app.card.v1.Args._track_id',
      index=7, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_state', full_name='com.bapis.bilibili.app.card.v1.Args._state',
      index=8, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_converge_type', full_name='com.bapis.bilibili.app.card.v1.Args._converge_type',
      index=9, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_aid', full_name='com.bapis.bilibili.app.card.v1.Args._aid',
      index=10, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
  ],
  serialized_start=86,
  serialized_end=434,
)

_ARGS.oneofs_by_name['_type'].fields.append(
  _ARGS.fields_by_name['type'])
_ARGS.fields_by_name['type'].containing_oneof = _ARGS.oneofs_by_name['_type']
_ARGS.oneofs_by_name['_up_id'].fields.append(
  _ARGS.fields_by_name['up_id'])
_ARGS.fields_by_name['up_id'].containing_oneof = _ARGS.oneofs_by_name['_up_id']
_ARGS.oneofs_by_name['_up_name'].fields.append(
  _ARGS.fields_by_name['up_name'])
_ARGS.fields_by_name['up_name'].containing_oneof = _ARGS.oneofs_by_name['_up_name']
_ARGS.oneofs_by_name['_rid'].fields.append(
  _ARGS.fields_by_name['rid'])
_ARGS.fields_by_name['rid'].containing_oneof = _ARGS.oneofs_by_name['_rid']
_ARGS.oneofs_by_name['_rname'].fields.append(
  _ARGS.fields_by_name['rname'])
_ARGS.fields_by_name['rname'].containing_oneof = _ARGS.oneofs_by_name['_rname']
_ARGS.oneofs_by_name['_tid'].fields.append(
  _ARGS.fields_by_name['tid'])
_ARGS.fields_by_name['tid'].containing_oneof = _ARGS.oneofs_by_name['_tid']
_ARGS.oneofs_by_name['_tname'].fields.append(
  _ARGS.fields_by_name['tname'])
_ARGS.fields_by_name['tname'].containing_oneof = _ARGS.oneofs_by_name['_tname']
_ARGS.oneofs_by_name['_track_id'].fields.append(
  _ARGS.fields_by_name['track_id'])
_ARGS.fields_by_name['track_id'].containing_oneof = _ARGS.oneofs_by_name['_track_id']
_ARGS.oneofs_by_name['_state'].fields.append(
  _ARGS.fields_by_name['state'])
_ARGS.fields_by_name['state'].containing_oneof = _ARGS.oneofs_by_name['_state']
_ARGS.oneofs_by_name['_converge_type'].fields.append(
  _ARGS.fields_by_name['converge_type'])
_ARGS.fields_by_name['converge_type'].containing_oneof = _ARGS.oneofs_by_name['_converge_type']
_ARGS.oneofs_by_name['_aid'].fields.append(
  _ARGS.fields_by_name['aid'])
_ARGS.fields_by_name['aid'].containing_oneof = _ARGS.oneofs_by_name['_aid']
DESCRIPTOR.message_types_by_name['Args'] = _ARGS
_sym_db.RegisterFileDescriptor(DESCRIPTOR)

Args = _reflection.GeneratedProtocolMessageType('Args', (_message.Message,), {
  'DESCRIPTOR' : _ARGS,
  '__module__' : 'pyproto.com.bapis.bilibili.app.card.v1.Args_pb2'
  # @@protoc_insertion_point(class_scope:com.bapis.bilibili.app.card.v1.Args)
  })
_sym_db.RegisterMessage(Args)


# @@protoc_insertion_point(module_scope)
