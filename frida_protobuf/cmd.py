class CmdArgs:

    def __init__(self, args: 'CmdArgs'):
        self.help: str = args.help
        self.version: str = args.version
        self.proto: str = args.proto
        self.extra_import = args.extra_import
        self.proto_folder: str = args.proto_folder
        self.python_import_prefix: str = args.python_import_prefix


class MainCmdArgs:

    def __init__(self, args: 'MainCmdArgs'):
        self.help: str = args.help
        self.version: str = args.version
        self.attach_name: str = args.attach_name
        self.attach_pid: str = args.attach_pid
        self.host: str = args.host
        self.includes: str = args.includes
        self.use_default_any: bool = args.use_default_any