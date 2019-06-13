# app开发指引及规范

---

## 目录

* [快速启动](#fast)
* [架构](#frame)
* [代码规范](#standard)
* [cli](#cli)
* [投入生产](#prod)

## <span id="fast">快速启动</span>

1. svn管理

    svn地址：svn://192.168.1.107/SZOM-IGLMS/trunk/app

2. 环境准备

    * node 版本号：v8.9.0
    * npm 版本号：6.0.1
    * ioinic 版本号：3.20.0
    * cordova 版本号：8.0.0
    * angular 版本号：6.0.0

    1. windows环境

        1. 在`环境准备`文件夹中下载并安装node-v8.9.0-x64.msi。进入cmd，执行：

                npm -v
        
            检查node是否安装成功。若安装的npm的版本非6.0.1版本，可执行以下命令：

                npm install npm@6.0.1 -g

        2. 为保证代码的格式风格一致性，建议使用visual studio code开发。在`环境准备`文件夹有`VSCodeSetup-x64-1.23.0.exe`安装包。

        3. 安装ionic和cordova：

                npm install ionic@3.20.0 -g
                npm install cordova@8.0.0 -g


3. 项目启动

    1. cmd进入app根目录，下载依赖npm包（这一步最好先删除node_modules目录）：

            npm i

    2. 配置项目：

        1. 配置项目代理：

            修改`app/ionic.config.json`：

                "proxies": [
                    {
                        "path": "/ionic", 
                        "proxyUrl": "http://localhost:9999" // 修改为代理url，根据实际情况改为后端提供的地址。
                    },
                    {
                      "path": "/ws",
                      "proxyUrl": "http://localhost:8900"// 修改为代理url，根据实际情况改为后端提供的websocket地址。
                    }
                ]

        2. 是否启动测试：

            修改`app/src/app/app.module.ts`：

                import * as Test from '../test/mock';
                Test;

            加入以上两行则启动测试，注释则关闭测试。

        3. 是否开启调试

            修改`app/src/app/app.module.ts`：

                import * as VConsole from 'vconsole';
                new VConsole();

            加入以上两行则启动调试，注释则关闭调试。

    4. 在app根目录下，运行项目：

            ionic serve

## <span id="frame">架构</span>
* `.gradle` 用于gradle配置（打包生成）
* `.sourcemaps` map资源映射（打包生成）
* `config` 配置文件夹
  * `copy.config.js` ionic打包注入项目的静态资源配置
* `node_modules` 项目依赖包目录
* `platforms` 对应手机平台的资源文件（打包生成）
* `plugins` cordova插件存储目录（打包生成）
* `resources` 对应手机平台的资源文件（打包生成）
* `src` 开发目录
  * `app` 入口
  * `assets` 静态资源
  * `components` 组件
  * `directives` 指令
  * `pages` 页面
  * `pipes` 管道
  * `providers` 服务
  * `test` 测试
  * `theme` 风格配置
  * `config.ts` 全局配置
  * `index.html` 入口
  * `manifest.json` app配置
* `www` 网页可访问资源（打包生成）
* `.editorconfig` 编辑器配置
* `.gitignore` git提交忽略文件
* `app.js` 代理服务器
* `config.xml` 打包app配置
* `ionic.config.json` ionic cli配置文件
* `ionic.starter.json` ionic cli配置文件
* `package-lock.json` 包管理配置文件
* `package.json` 包管理配置文件
* `tsconfig.json` ts配置
* `tslint.json` tslint代码检查配置

## <span id="standard">代码规范</span>

为保证目录的可读及快速查找，有如下规范请务必遵守：

1. 在`pages`文件夹下：

    如果明确知道页面是属于哪个模块的，请加上此模块前缀，例如：用户模块的添加用户页面：user-add文件夹。

2. 在`providers`文件夹下：

    创建相关的service，比如用户service统一放在：user文件夹。

3. 自定义iconfont图标引用：
    
    1.使用\<ion-icon class="crciwms" name="md-sousuo">\</ion-icon>指令引用图标，需在该标签上增加class="crciwms" name="sousuo"(ion-md-sousuo使用样式名ion-后面的字符串即可);

    2.使用<ion-tab [root]="workspace" tabUrlPath="workspace" tabTitle="工作台" tabIcon="md-sousuo" tabsHideOnSubPages>\</ion-tab>引用图标，tabIcon="sousuo"(ion-md-sousuo使用样式名ion-后面的字符串即可).<br>
    除此之外还需在样式中定义，表示tab下的icon使用自定义的icon而不是默认的ionic中的icon：<br>
    .tab-button{
        ion-icon{
            font-family:"crciwms" !important;
        }
    }

    3.直接用原生H5标签使用自定义iconfont图标：\<span class="crciwms ion-md-sousuo">\</span>

4. 测试代码编写：

    使用mockjs测试http请求。

    详细资料参照：[mockjs](https://github.com/nuysoft/Mock/wiki/Getting-Started)

    如用户登陆接口：

    在src/test/mock.ts文件夹中自行创建接口：

        let login = `${BASE_URL}/login`;
        Mock.mock(login, 'post', {
            code: 0,
            message: 'success',
            data: {
                token: Math.random().toString(22).substr(2)
            }
        });


## <span id="cli">cli</span>

下面列出项目常用的cli。

**快捷命令**
```
ionic g component 组件名
ionic g directive 指令名
ionic g page 页面名
ionic g page 页面名 --no-module
ionic g pipe 管道名
ionic g provider 管道名
```

详细文档参照[ionic cli官方文档](https://ionicframework.com/docs/cli/commands.html)

1. ionic serve

        > ionic serve 启动项目。
        > ionic serve -p 3001 修改启动端口为3001。
        > ionic serve -c 在命令行打印console信息。

2. ionic g

        > ionic g page login 创建app/src/pages/login页面相关文件。
        > ionic g provider user 创建app/src/providers/user依赖注入类。
        > ionic g directires autosize 创建app/src/directives/autosize指令类。
        > ionic g pipe power 创建app/src/pipes/power管道类。

3. ionic cordova

        > ionic cordova run android -l 运行安卓包。

## <span id="prod">投入生产</span>

**打包步骤**：

1. 移除android平台
```
ionic cordova platform rm android
```
2. 删除plugins文件夹

3. 添加android平台
```
ionic cordova platform add android
```
4. 由于外部原因，一些plugin没有成功安装，需要手动安装：
```
ionic cordova plugin add cordova-plugin-photo-library --force
cordova plugin add https://github.com/pwlin/cordova-plugin-file-opener2
cordova plugin add https://github.com/phonegap/phonegap-mobile-accessibility.git
```
5. 修改图片选择器的提示信息
* 修改`platforms\android\app\src\main\java\com\synconse\MultiImageChooserActivity.java`文件第200-202行：
```
.setTitle("最多选择 " + maxImageCount + " 张图片")
// .setMessage("You can only select " + maxImageCount + " photos at a time.")
.setPositiveButton("确认", new DialogInterface.OnClickListener() {
```
* 在`plugins\cordova-plugin-telerik-imagepicker\src\android\Library\res`下添加文件夹`values-zh`，再添加文件`multiimagechooser_strings_zh.xml`，文件内容：
```
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="multi_app_name">图片选择</string>
    <string name="free_version_label">版本 - Images left: %d</string>
    <string name="error_database">打开图片失败</string>
    <string name="requesting_thumbnails">请求缩略图, 请稍等...</string>
    <string name="multi_image_picker_processing_images_title">正在选择...</string>
    <string name="multi_image_picker_processing_images_message">请稍等</string>
    <string name="discard" translatable="false">取消</string>
    <string name="done" translatable="false">确认</string>
 </resources>
```
6. 修改`src/config.ts`：
```
const BASE_URL = 后台服务地址;
const WEBSOCKET_URL = 后台websocket地址;
```
7. 打包
```
ionic cordova build android --minifyjs --minifycss --optimizejs
```
