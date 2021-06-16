import logging
import datetime
from typing import List
from pathlib import Path

from frida_protobuf.config import current_package


def setup_logger(name: str) -> List[logging.Logger]:
    formatter = logging.Formatter('%(asctime)s %(name)s %(filename)s %(lineno)s : %(levelname)s  %(message)s')
    log_time = datetime.datetime.now().strftime("%Y-%m-%d_%H%M%S")
    log_folder_path = Path(current_package, 'logs')
    if log_folder_path.exists() is False:
        log_folder_path.mkdir()
    log_file_path = log_folder_path / f'{name}-{log_time}.log'
    fh = logging.FileHandler(log_file_path.resolve().as_posix(), encoding='utf-8')
    fh.setLevel(logging.DEBUG)
    fh.setFormatter(formatter)
    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    ch.setFormatter(formatter)
    lt = logging.getLogger(f'{name}')
    lt.setLevel(logging.DEBUG)
    lt.addHandler(ch)
    lt.addHandler(fh)
    lf = logging.getLogger(f'{name}-file')
    lf.setLevel(logging.DEBUG)
    lf.addHandler(fh)
    lt.info(f'创建 -> {log_file_path}')
    return [lt, lf]