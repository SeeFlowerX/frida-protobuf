from pathlib import Path
from google.protobuf.json_format import MessageToDict
from pyproto.com.bapis.bilibili.app.show.popular.v1.PopularReply_pb2 import PopularReply

resp = Path(r'frida_protobuf/sample/bilibili_PopularReply.txt').read_bytes()
popular_reply = PopularReply()
popular_reply.ParseFromString(resp)

print(MessageToDict(popular_reply))