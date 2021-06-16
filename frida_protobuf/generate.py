import sys
import json

from argparse import ArgumentParser

from frida_protobuf.cmd import CmdArgs
from frida_protobuf.version import __version__
from frida_protobuf.config import CONFIGS_PATH, PROTOS_PATH


def generate_enum_proto(config: dict):
    lines = ['syntax = "proto3";', '\n\n']
    if config['package'] != '':
        lines.append(f'package {config["package"]};')
        lines.append('\n\n')
    if config['cls_name'] != '':
        lines.append(f'enum {config["cls_name"]} {{\n')
    fields_config = config['fields_config'] # type: dict
    _ = [lines.append(f'    {key} = {value};\n') for key, value in fields_config.items()]
    lines.append('}')
    proto_path = PROTOS_PATH / f'{config["cls_name"]}.proto'
    proto_path.write_text(''.join(lines), encoding='utf-8')


def generate_message_proto(args: CmdArgs, config: dict):
    _import = ''
    if args.python_import_prefix != '':
        _import = f'{args.python_import_prefix}/'
    lines = ['syntax = "proto3";', '\n\n']
    if config['package'] != '':
        lines.append(f'package {config["package"]};')
        lines.append('\n\n')
    fields_config = config['fields_config'] # type: list
    fields_config = sorted(fields_config, key=lambda field_config: field_config['tag'])
    _imports = set()
    for field_config in fields_config:
        if field_config['type_1']['type'] != '' and field_config['type_1']['need_import']:
            _imports.add(field_config["type_1"]["type"])
        if field_config['type_2']['type'] != '' and field_config['type_2']['need_import']:
            _imports.add(field_config["type_2"]["type"])
    if args.extra_import != '':
        for extra_import in args.extra_import.split(','):
            _imports.add(extra_import)
    for _import_proto in _imports:
        if _import_proto == 'google.protobuf.Any':
            lines.append(f'import "google/protobuf/any.proto";\n')
            continue
        lines.append(f'import "{_import}{_import_proto}.proto";\n')
        _args = CmdArgs(args)
        _args.proto = _import_proto
        _args.extra_import = ''
        generate(_args)
    if len(_imports) > 0:
        lines.append('\n')
    if config['cls_name'] != '':
        lines.append(f'message {config["cls_name"]} {{\n')
    for field_config in fields_config:
        line = '    '
        if field_config['label'] != '':
            line += f'{field_config["label"]} '
        if field_config['type_2']['type'] != '':
            line += f"map<{field_config['type_1']['type']}, {field_config['type_2']['type']}> "
        else:
            line += f"{field_config['type_1']['type']} "
        line += f'{field_config["name"]} = {field_config["tag"]};'
        lines.append(line)
        lines.append('\n')
    lines.append('}')
    proto_path = PROTOS_PATH / f'{config["cls_name"]}.proto'
    proto_path.write_text(''.join(lines), encoding='utf-8')


def generate(args: CmdArgs):
    config_path = CONFIGS_PATH / f'{args.proto}.json'
    if config_path.exists() is False:
        sys.exit(f'can not find {config_path.resolve().as_posix()}')
    config = json.loads(config_path.read_text(encoding='utf-8'))
    if config['type'] == 'enum':
        generate_enum_proto(config)
    elif config['type'] == 'message':
        generate_message_proto(args, config)
    else:
        sys.exit(f'unknow type for [{args.proto}] config')


def main():
    def print_version():
        print(f'version {__version__}, frida-protobuf proto configs generator.')

    parser = ArgumentParser(
        prog='frida-protobuf generator',
        usage='python -m frida_protobuf.generator [OPTION]...',
        description='frida-protobuf proto configs generator',
        add_help=False,
    )
    parser.add_argument('-v', '--version', action='store_true', help='print version and exit')
    parser.add_argument('-h', '--help', action='store_true', help='print help message and exit')
    parser.add_argument('--proto', default='', required=True, help='main proto file name (without suffix)')
    parser.add_argument('--extra-import', default='', help='extra import for main proto')
    parser.add_argument('--proto-folder', default='protos', help='proto files folder')
    parser.add_argument('--python-import-prefix', default='pyproto', help='python import prefix')
    args = parser.parse_args() # type: CmdArgs
    if args.help:
        print_version()
        parser.print_help()
        sys.exit()
    if args.version:
        print_version()
        sys.exit()
    generate(args)


if __name__ == '__main__':
    main()