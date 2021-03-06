# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: pyproto/com.tencent.qqlive.protocol.pb.CalendarItem.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor.FileDescriptor(
  name='pyproto/com.tencent.qqlive.protocol.pb.CalendarItem.proto',
  package='com.tencent.qqlive.protocol.pb',
  syntax='proto3',
  serialized_options=None,
  create_key=_descriptor._internal_create_key,
  serialized_pb=b'\n9pyproto/com.tencent.qqlive.protocol.pb.CalendarItem.proto\x12\x1e\x63om.tencent.qqlive.protocol.pb\"\xdb\x03\n\x0c\x43\x61lendarItem\x12\x17\n\nstart_time\x18\x01 \x01(\x03H\x00\x88\x01\x01\x12\x18\n\x0bis_full_day\x18\x02 \x01(\x08H\x01\x88\x01\x01\x12\x18\n\x0b\x64\x65scription\x18\x03 \x01(\tH\x02\x88\x01\x01\x12\x12\n\x05title\x18\x04 \x01(\tH\x03\x88\x01\x01\x12\x15\n\x08\x65nd_time\x18\x05 \x01(\x03H\x04\x88\x01\x01\x12\x1b\n\x0e\x62\x65\x66ore_seconds\x18\x06 \x01(\x03H\x05\x88\x01\x01\x12\x15\n\x08jump_url\x18\x07 \x01(\tH\x06\x88\x01\x01\x12\x1c\n\x0fjump_url_scheme\x18\x08 \x01(\tH\x07\x88\x01\x01\x12S\n\x0cservice_type\x18\t \x03(\x0b\x32=.com.tencent.qqlive.protocol.pb.CalendarItem.ServiceTypeEntry\x1a\x32\n\x10ServiceTypeEntry\x12\x0b\n\x03key\x18\x01 \x01(\t\x12\r\n\x05value\x18\x02 \x01(\t:\x02\x38\x01\x42\r\n\x0b_start_timeB\x0e\n\x0c_is_full_dayB\x0e\n\x0c_descriptionB\x08\n\x06_titleB\x0b\n\t_end_timeB\x11\n\x0f_before_secondsB\x0b\n\t_jump_urlB\x12\n\x10_jump_url_schemeb\x06proto3'
)




_CALENDARITEM_SERVICETYPEENTRY = _descriptor.Descriptor(
  name='ServiceTypeEntry',
  full_name='com.tencent.qqlive.protocol.pb.CalendarItem.ServiceTypeEntry',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='key', full_name='com.tencent.qqlive.protocol.pb.CalendarItem.ServiceTypeEntry.key', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='value', full_name='com.tencent.qqlive.protocol.pb.CalendarItem.ServiceTypeEntry.value', index=1,
      number=2, type=9, cpp_type=9, label=1,
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
  serialized_options=b'8\001',
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=397,
  serialized_end=447,
)

_CALENDARITEM = _descriptor.Descriptor(
  name='CalendarItem',
  full_name='com.tencent.qqlive.protocol.pb.CalendarItem',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='start_time', full_name='com.tencent.qqlive.protocol.pb.CalendarItem.start_time', index=0,
      number=1, type=3, cpp_type=2, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='is_full_day', full_name='com.tencent.qqlive.protocol.pb.CalendarItem.is_full_day', index=1,
      number=2, type=8, cpp_type=7, label=1,
      has_default_value=False, default_value=False,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='description', full_name='com.tencent.qqlive.protocol.pb.CalendarItem.description', index=2,
      number=3, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='title', full_name='com.tencent.qqlive.protocol.pb.CalendarItem.title', index=3,
      number=4, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='end_time', full_name='com.tencent.qqlive.protocol.pb.CalendarItem.end_time', index=4,
      number=5, type=3, cpp_type=2, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='before_seconds', full_name='com.tencent.qqlive.protocol.pb.CalendarItem.before_seconds', index=5,
      number=6, type=3, cpp_type=2, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='jump_url', full_name='com.tencent.qqlive.protocol.pb.CalendarItem.jump_url', index=6,
      number=7, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='jump_url_scheme', full_name='com.tencent.qqlive.protocol.pb.CalendarItem.jump_url_scheme', index=7,
      number=8, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='service_type', full_name='com.tencent.qqlive.protocol.pb.CalendarItem.service_type', index=8,
      number=9, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[_CALENDARITEM_SERVICETYPEENTRY, ],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
    _descriptor.OneofDescriptor(
      name='_start_time', full_name='com.tencent.qqlive.protocol.pb.CalendarItem._start_time',
      index=0, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_is_full_day', full_name='com.tencent.qqlive.protocol.pb.CalendarItem._is_full_day',
      index=1, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_description', full_name='com.tencent.qqlive.protocol.pb.CalendarItem._description',
      index=2, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_title', full_name='com.tencent.qqlive.protocol.pb.CalendarItem._title',
      index=3, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_end_time', full_name='com.tencent.qqlive.protocol.pb.CalendarItem._end_time',
      index=4, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_before_seconds', full_name='com.tencent.qqlive.protocol.pb.CalendarItem._before_seconds',
      index=5, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_jump_url', full_name='com.tencent.qqlive.protocol.pb.CalendarItem._jump_url',
      index=6, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_jump_url_scheme', full_name='com.tencent.qqlive.protocol.pb.CalendarItem._jump_url_scheme',
      index=7, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
  ],
  serialized_start=94,
  serialized_end=569,
)

_CALENDARITEM_SERVICETYPEENTRY.containing_type = _CALENDARITEM
_CALENDARITEM.fields_by_name['service_type'].message_type = _CALENDARITEM_SERVICETYPEENTRY
_CALENDARITEM.oneofs_by_name['_start_time'].fields.append(
  _CALENDARITEM.fields_by_name['start_time'])
_CALENDARITEM.fields_by_name['start_time'].containing_oneof = _CALENDARITEM.oneofs_by_name['_start_time']
_CALENDARITEM.oneofs_by_name['_is_full_day'].fields.append(
  _CALENDARITEM.fields_by_name['is_full_day'])
_CALENDARITEM.fields_by_name['is_full_day'].containing_oneof = _CALENDARITEM.oneofs_by_name['_is_full_day']
_CALENDARITEM.oneofs_by_name['_description'].fields.append(
  _CALENDARITEM.fields_by_name['description'])
_CALENDARITEM.fields_by_name['description'].containing_oneof = _CALENDARITEM.oneofs_by_name['_description']
_CALENDARITEM.oneofs_by_name['_title'].fields.append(
  _CALENDARITEM.fields_by_name['title'])
_CALENDARITEM.fields_by_name['title'].containing_oneof = _CALENDARITEM.oneofs_by_name['_title']
_CALENDARITEM.oneofs_by_name['_end_time'].fields.append(
  _CALENDARITEM.fields_by_name['end_time'])
_CALENDARITEM.fields_by_name['end_time'].containing_oneof = _CALENDARITEM.oneofs_by_name['_end_time']
_CALENDARITEM.oneofs_by_name['_before_seconds'].fields.append(
  _CALENDARITEM.fields_by_name['before_seconds'])
_CALENDARITEM.fields_by_name['before_seconds'].containing_oneof = _CALENDARITEM.oneofs_by_name['_before_seconds']
_CALENDARITEM.oneofs_by_name['_jump_url'].fields.append(
  _CALENDARITEM.fields_by_name['jump_url'])
_CALENDARITEM.fields_by_name['jump_url'].containing_oneof = _CALENDARITEM.oneofs_by_name['_jump_url']
_CALENDARITEM.oneofs_by_name['_jump_url_scheme'].fields.append(
  _CALENDARITEM.fields_by_name['jump_url_scheme'])
_CALENDARITEM.fields_by_name['jump_url_scheme'].containing_oneof = _CALENDARITEM.oneofs_by_name['_jump_url_scheme']
DESCRIPTOR.message_types_by_name['CalendarItem'] = _CALENDARITEM
_sym_db.RegisterFileDescriptor(DESCRIPTOR)

CalendarItem = _reflection.GeneratedProtocolMessageType('CalendarItem', (_message.Message,), {

  'ServiceTypeEntry' : _reflection.GeneratedProtocolMessageType('ServiceTypeEntry', (_message.Message,), {
    'DESCRIPTOR' : _CALENDARITEM_SERVICETYPEENTRY,
    '__module__' : 'pyproto.com.tencent.qqlive.protocol.pb.CalendarItem_pb2'
    # @@protoc_insertion_point(class_scope:com.tencent.qqlive.protocol.pb.CalendarItem.ServiceTypeEntry)
    })
  ,
  'DESCRIPTOR' : _CALENDARITEM,
  '__module__' : 'pyproto.com.tencent.qqlive.protocol.pb.CalendarItem_pb2'
  # @@protoc_insertion_point(class_scope:com.tencent.qqlive.protocol.pb.CalendarItem)
  })
_sym_db.RegisterMessage(CalendarItem)
_sym_db.RegisterMessage(CalendarItem.ServiceTypeEntry)


_CALENDARITEM_SERVICETYPEENTRY._options = None
# @@protoc_insertion_point(module_scope)
