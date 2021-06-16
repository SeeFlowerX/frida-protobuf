from pathlib import Path

current_package = __name__.split('.')[0]
CONFIGS_PATH = Path((Path(current_package) / 'configs').resolve().as_posix())
if CONFIGS_PATH.exists() is False:
    CONFIGS_PATH.mkdir()
PROTOS_PATH = Path((Path(current_package) / 'protos').resolve().as_posix())
if PROTOS_PATH.exists() is False:
    PROTOS_PATH.mkdir()
PYPROTO_PATH = Path((Path(current_package).parent / 'pyproto').resolve().as_posix())
if PYPROTO_PATH.exists() is False:
    PYPROTO_PATH.mkdir()