# 简介

本项目用于**辅助**逆向开发人员，快速获取和转换Android APP中所使用的protobuf协议的proto文件

**当前仅支持基于以下包生成protobuf的相关类**

- `com.squareup.wire`
- `com.google.protobuf`

**原生通用的脚本编写√**

特性

- string int32 int64 bool 常规类型转换
- 识别第三方proto导入，自动转换
- 判定`com.google.protobuf.ByteString`为`Any`
- `oneof`类型识别和转换

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

### 使用注意

- 当前版本生成的proto配置均包含完整包名，转换时指定proto也请完整指定
    - 使用包名的原因是可能存在同名的proto文件

1. 注入frida脚本，获取proto配置
2. 将proto的配置文件转换为proto文件
3. 将proto文件转换为对应的py文件
4. 样本测试

执行前请删除原来的`protos`文件夹

当主要proto文件中想额外引用特定的proto时，需要指定对应的包名，多个则使用`|`隔开，形式如下

```bash
--extra-import "package1:proto1,proto2|package2:proto3,proto4"
```

### 案例一

- `com.tencent.qqlive` 版本号 `21854`

```bash
python -m frida_protobuf.main -H 172.16.13.146:22222 -n com.tencent.qqlive --use-default-any --keywords-expected "com.tencent.qqlive.protocol.pb,com.tencent.spp_rpc"
python -m frida_protobuf.generate --proto com.tencent.qqlive.protocol.pb.ChangeSectionResponse --extra-import "com.tencent.qqlive.protocol.pb:Poster,Action,Attent,VideoIdKeyValueSet"
python -m frida_protobuf.proto2py --proto com.tencent.qqlive.protocol.pb.ChangeSectionResponse
python -m frida_protobuf.demo
```

[效果演示](http://pan.iqiyi.com/file/paopao/_8BryDtYjocn91iI9UdL0E--gVQG8baazNgLbbSEzOGCdNxscmbI3WwLs25hj1BmU5PUqpuQpVEvH-eQz0-Vog.gif)

[演示视频](http://pan.iqiyi.com/file/paopao/rGdGDYUdK_LSwzMWJD4X8fZvkFIAdHTfGQIvpcXMmuOAa1KCZKqTx3kNih6CCp59A-XR-d91R3n2uHzmg-PrVw.mp4)

### 案例二

- `tv.danmaku.bili` 版本号 `6070600`

```bash
python -m frida_protobuf.main -H 172.16.13.146:22222 -n tv.danmaku.bili --use-default-any --keywords-expected "bili"
python -m frida_protobuf.generate --proto com.bapis.bilibili.app.show.popular.v1.PopularReply
python -m frida_protobuf.proto2py --proto com.bapis.bilibili.app.show.popular.v1.PopularReply
python -m frida_protobuf.demo2
```

[效果演示](http://pan.iqiyi.com/file/paopao/-wM1eKewn9snMIg6XqAZnoiN-u5RIEQ9tacPZ-O3-ntZz6WUzK-nCgGd2VnSsl0rRB3g3fxzardI5ZtwvkiNpg.gif)

[效果视频](http://pan.iqiyi.com/file/paopao/VjPzEqNkQt16avGaqcWwfMRHTZ71KTvpCKCddL80Tc73fxOT5rA5angpGnvmVPPKCVBwn6nV5TDFGLembmg2_Q.mp4)

# 补充

- Q: 为何需要分三步进行
- A: 当遭遇某些字段类型为Any时，需要根据自己的需求对proto进行补充