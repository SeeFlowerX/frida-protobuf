import os
import shutil
from argparse import ArgumentParser

from frida_protobuf.cmd import CmdArgs
from frida_protobuf.version import __version__
from frida_protobuf.config import PROTOS_PATH, PYPROTO_PATH, current_package


def proto2py(args: CmdArgs):
    os.chdir(current_package)
    tmp_proto_folder = PROTOS_PATH / args.python_import_prefix
    if tmp_proto_folder.exists() is False:
        tmp_proto_folder.mkdir()

    for proto_path in PROTOS_PATH.iterdir():
        if proto_path.is_dir():
            continue
        if proto_path.stem == args.proto:
            continue
        if proto_path.suffix != ".proto":
            continue
        shutil.move(proto_path.resolve().as_posix(), (tmp_proto_folder / proto_path.name).resolve().as_posix())
    os.system(f'python -m grpc_tools.protoc -I {PROTOS_PATH.name} --python_out=../{args.python_import_prefix} {PROTOS_PATH.name}/{args.proto}.proto')
    os.system(f'python -m grpc_tools.protoc -I {PROTOS_PATH.name} --python_out=../{args.python_import_prefix} {PROTOS_PATH.name}/{args.python_import_prefix}/*.proto')
    py_folder = PYPROTO_PATH / f'{args.python_import_prefix}'
    for py_path in py_folder.iterdir():
        if py_path.is_dir():
            continue
        if py_path.suffix != ".py":
            continue
        shutil.move(py_path.resolve().as_posix(), (PYPROTO_PATH / py_path.name).resolve().as_posix())
    shutil.rmtree(py_folder.resolve().as_posix())
    os.chdir('..')


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
    parser.add_argument('--python-import-prefix', default='pyproto', help='python import prefix')
    args = parser.parse_args() # type: CmdArgs
    proto2py(args)

if __name__ == '__main__':
    main()