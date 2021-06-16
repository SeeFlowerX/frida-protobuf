# 简介

本项目用于**辅助**逆向开发人员，快速获取和转换Android APP中所使用的protobuf协议的proto文件

**当前仅支持基于`com.squareup.wire`生成protobuf的相关类**

**原生通用的脚本编写ing**

[效果演示](http://pan.iqiyi.com/file/paopao/_8BryDtYjocn91iI9UdL0E--gVQG8baazNgLbbSEzOGCdNxscmbI3WwLs25hj1BmU5PUqpuQpVEvH-eQz0-Vog.gif)

[演示视频](http://pan.iqiyi.com/file/paopao/rGdGDYUdK_LSwzMWJD4X8fZvkFIAdHTfGQIvpcXMmuOAa1KCZKqTx3kNih6CCp59A-XR-d91R3n2uHzmg-PrVw.mp4)

# 原理

- 通过frida枚举全部类，根据类特征得到原proto中的字段名、字段类型、字段tag等信息
- 将信息转换、存储为特定的配置文件
- 按需求和规则转换proto至对应的py文件

# 环境

- **frida-server必须是14.x.x版本**
    - 因为`runtime`是`qjs`，测试使用`v8`会卡死，如果有人知道原因请告诉我
- **python 3.8.5**

### 安装python包

```bash
pip install -r requirements.txt
```

### 【可选】安装npm包

**有手动编译_agent.js需求**

- `agent`目录下安装

```bash
cd agent
npm install
```

- 编译_agent.js

```bash
npm run build
```

# 使用

### 手机端开启frida-server

- 首先将frida-server推送至手机（只用做一次）

```bash
adb push frida-server-14.2.18-android-arm64 /data/local/tmp/fs14218
adb shell
su
chmod +x /data/local/tmp/fs14218
```

- 开启服务

```bash
/data/local/tmp/fs14218 -l 0.0.0.0:33333
```

### 注入frida脚本，获取proto配置

```bash
python -m frida_protobuf.main -H 172.16.13.146:22222 -n com.tencent.qqlive --includes "com.tencent.qqlive.protocol.pb,com.tencent.spp_rpc"
```

### 将proto的配置文件转换为proto文件

```bash
python -m frida_protobuf.generate --proto ChangeSectionResponse --extra-import "Poster,Action,Attent,VideoIdKeyValueSet"
```

### 将proto文件转换为对应的py文件

```bash
python -m frida_protobuf.proto2py --proto ChangeSectionResponse --extra-import "Poster,Action,Attent,VideoIdKeyValueSet"
python -m frida_protobuf.demo
```

# 补充

- Q: 为何需要分三步进行
- A: 当遭遇某些字段类型为Any时，需要根据自己的需求对proto进行补充