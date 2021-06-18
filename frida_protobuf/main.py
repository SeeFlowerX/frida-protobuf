import sys
import json
import frida
import signal
from pathlib import Path
from argparse import ArgumentParser

from frida_protobuf.cmd import MainCmdArgs
from frida_protobuf.log import setup_logger
from frida_protobuf.config import CONFIGS_PATH
from frida_protobuf.version import __version__

# lt -> file & terminal logger
# lf -> file only logger
lt, lf = setup_logger('main')


def dump_config(config: dict):
    (CONFIGS_PATH / f'{config["cls_name"]}.json').write_text(json.dumps(config, ensure_ascii=False, indent=4), encoding='utf-8')


def on_detached(reason, *args):
    if reason == 'application-requested':
        print(f'主动断开rpc -> {reason}')
    elif reason == 'process-terminated':
        print(f'被动断开rpc -> {reason}')
        print(f'args -> {args}')
    else:
        print(f'未知原因断开rpc -> {reason}')


def on_message(message: dict, data: bytes):
    # print(f'recv message -> {message}')
    if message['type'] == 'send':
        if message['payload'].get('log'):
            lf.info(message['payload']['log'])
        else:
            dump_config(message['payload'])


def handle_exit(signum, frame):
    lt.info(f'-> {signum} -> {frame}')
    sys.exit('Ctrl+C again to exit')


def main():
    def print_version():
        print(f'version {__version__}, frida-protobuf proto configs generator.')
    # <------ 处理手动Ctrl+C退出 ------>
    signal.signal(signal.SIGINT, handle_exit)
    signal.signal(signal.SIGTERM, handle_exit)
    # <------ 正文 ------>
    parser = ArgumentParser(
        prog='frida-protobuf generator',
        usage='python -m frida_protobuf.generator [OPTION]...',
        description='frida-protobuf proto configs generator',
        add_help=False,
    )
    parser.add_argument('-v', '--version', action='store_true', help='print version and exit')
    parser.add_argument('-h', '--help', action='store_true', help='print help message and exit')
    parser.add_argument('-n', '--attach-name', help='attach to NAME', metavar='NAME', default=None)
    parser.add_argument('-p', '--attach-pid', help='attach to PID', metavar='PID', default=None)
    parser.add_argument('-H', '--host', help='connect to remote frida-server on HOST', metavar='HOST', default=None)
    parser.add_argument('-expected', '--keywords-expected', help='expected keywords in class name, separator is <,>', metavar='expected', default="")
    parser.add_argument('-unexpected', '--keywords-unexpected', help='unexpected keywords in class name, separator is <,>', metavar='unexpected', default="cyjh.ddy.net")
    parser.add_argument('--use-default-any', help='use google.protobuf.Any when Any type field matched ', action='store_true')
    parser.add_argument('--runtime', default='qjs', help='only qjs know')
    args = parser.parse_args() # type: MainCmdArgs
    if args.help:
        print_version()
        parser.print_help()
        sys.exit()
    if args.version:
        print_version()
        sys.exit()
    if args.attach_name is None and args.attach_pid is None:
        sys.exit('set NAME or PID, plz')
    if args.attach_name and args.attach_pid:
        sys.exit('set NAME or PID only one, plz')
    target = args.attach_name
    if args.attach_pid:
        target = args.attach_pid
    lt.info(f'start attach {target}')
    try:
        if args.host:
            device = frida.get_device_manager().add_remote_device(args.host)
        else:
            # device = frida.get_local_device()
            device = frida.get_usb_device(timeout=10)
        session = device.attach(target)
    except Exception as e:
        lt.error(f'attach to {target} failed', exc_info=e)
        sys.exit()

    lt.info(f'attach {target} success, inject script now')
    try:
        jscode = Path(r'agent/_agent.js').read_text(encoding='utf-8')
        script = session.create_script(jscode, runtime='qjs')
        script.load()
        session.on('detached', on_detached)
        script.on('message', on_message)
    except Exception as e:
        lt.error(f'inject scrip failed', exc_info=e)
        sys.exit()
    rpc = script.exports
    rpc.dump(args.use_default_any, args.keywords_expected, args.keywords_unexpected)

    # wait
    sys.stdin.read()


if __name__ == '__main__':
    main()