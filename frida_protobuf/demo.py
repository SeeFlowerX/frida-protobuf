from pathlib import Path
from google.protobuf.json_format import MessageToDict
from pyproto.ChangeSectionResponse_pb2 import ChangeSectionResponse

resp = Path(r'frida_protobuf/sample/qqlive_ChangeSectionResponse.txt').read_bytes()
change_section_response = ChangeSectionResponse()
change_section_response.ParseFromString(resp)

print(MessageToDict(change_section_response))