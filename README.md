# 指色SDK接入指南
## 1. 导入框架库

> 框架库文件  
> - bin/zsLibs

> 描述文件
> - libs/zs.d.ts  
> - libs/fairygui.d.ts

> 配置文件
> - bin/config/gameCfg.json  
> - bin/config/productCfg.json  

> 模版文件
> - src/template/ProductKey.ts  
> - src/template/workflow.ts  

> 资源文件
> - bin/fgui/zs_basic.bin  
> - bin/fgui/zs_basic_atlas0.png

> tslib异步支持
> - node_modules
> - tsconfig.json 
 
导入SDK文件后在bin/index.js中添加`loadLib("zsLibs/index.js")`,同时删除`loadLib（"js/bundle.js")`

## 2. API接入
### - 新建工作流
工作流是支撑框架全局运作的状态机。  
通过使用 `zs.core.workflow = new workflow();` 来创建一个工作流，当SDK初始化完成后，整个框架将按照工作流注册好的状态持续运作。
### - 初始化监听
- onFGUIBind  
FGUI绑定，使用FGUI资源时，在该监听中调用binder方法，加载时将会自动调用，否则需要在使用时自主调用binder方法。  
不使用FGUI开发时可忽略该监听。

- onPrepare  
准备监听，该监听将会在框架完成初始化、loading界面准备关闭时调用。如果使用该监听，需要主动调用zs.core.readyFinish()来通知框架完成初始化流程，同时关闭loading界面。
不使用onPrepare时框架将会在框架初始化完成后自动关闭loading界面。

- onStart  
开始监听，该监听将会在框架正式开始后调用，时序晚于onPrepare。
### - 工作流监听
SDK提供了一个 HOME-PLAY-END 三个状态循环的默认状态机用于通用的游戏流程管理。
- GAME_HOME 首页  
- GAME_PLAY 正式游戏  
- GAME_END 游戏结束  

调用状态监听的方法如下：
``` typescript
// 进入HOME状态时执行相应的方法
zs.core.onWorkflow(workflow.GAME_HOME, Laya.Handler.create(this, () => {
    console.log("Workflow ====== GAME_HOME");
    // 打开首页场景
}));
// 另一种注册工作流监听方法,注意该用法在workflow未完成实例化（zs.core.workflow = new workflow();）时会报错
zs.core.workflow.on(workflow.GAME_PLAY, Laya.Handler.create(this, () => {
    console.log("Workflow Dynamic ===== GAME_PLAY");
}));
```
如果需要注销工作流监听可以使用off，offAll，offAllCaller和clear进行操作
注销状态监听的方法如下：
``` typescript
// 注销 GAME_HOME 状态中的单个事件，需要在注册监听时保存 handler
zs.core.workflow.off(workflow.GAME_HOME, handler);
// 注销 GAME_HOME 状态中的所有事件
zs.core.workflow.offAll(workflow.GAME_HOME);
// 注销 GAME_HOME 状态中的所有由 this 发起的监听
zs.core.workflow.offAllCaller(this, workflow.GAME_HOME);
// 注销所有状态中的所有由 this 发起的监听
zs.core.workflow.offAllCaller(this);
// 清空所有状态中的所有监听
zs.core.workflow.clear();
```

### - 子状态机设置
由于SDK的工作流状态原则上是不能改变的，为了满足前端自定义状态的开发需求，SDK可以在工作流指定状态中自行设置子状态机。  
子状态机与主状态机各自独立运作，互不影响，同时子状态机的状态也能通过工作流监听发出响应事件。
``` typescript
// 在GAME_PLAY主状态中设置 START-READY-PLAY-SETTLE-END 的子状态机
zs.core.workflow.setFSM(workflow.GAME_PLAY,
    new zs.fsm()
        .registe("START", "READY")
        // READY同时存在两个跳转状态时，建议设置优先级，以避免自动跳转出现问题
        .registe("READY", "PLAY") // 默认优先级为 0
        .registe("READY", "PREPARE", -1) // 手动设置优先级到 -1
        .registe("PLAY", "SETTLE")
        .registe("SETTLE", "END")
        .setDefault("START")
);

// 切换子状态机状态
// 当状态为READY时使用childNext()，将会自动跳转到优先级最高的PLAY状态
zs.core.workflow.childNext();
// 要将READY状态跳转到PREPARE状态，需要在childNext中填入指定状态
zs.core.workflow.childNext("PREPARE");

// 使用onWorkflow来监听子状态机的事件变化
zs.core.onWorkflow(workflow.GAME_PLAY + '.PLAY', Laya.Handler.create(this, () => {
    console.log("Workflow ====== GAME_PLAY PLAY");
}));
```

### - 在配置表中设置子状态机
除了在代码中调用接口定义子状态机，SDK也支持在productCfg.json中设置来自动创建子状态机，使用方式如下
``` json
"GAME_PLAY": {
        "states": [
            "START",
            "READY",
            ["PLAY", "PREPARE"],
            "SETTLE",
            "END"
        ]
    }
```

### - 框架初始化
通过执行`zs.core.init(ProductKey);`来启动SDK，之后整个SDK将按照既定的工作流开始运行。
### - 完整实例
``` typescript
import mainBinder from "./fgui/mainBinder";
import mainPage from "./fgui/mainPage";
import GameNode from "./GameNode";
import ProductKey from "./template/ProductKey";
import workflow from "./template/workflow";

export default class GameLogic extends Laya.Script {

    constructor() {
        super();
        this.init();
    }

    // 框架初始化
    init() {
        // 新建工作流
        zs.core.workflow = new workflow();
        // 设置子状态机
        zs.core.workflow.setFSM(workflow.GAME_PLAY,
            new zs.fsm()
                .registe("START", "READY")
                .registe("READY", "PLAY")
                .registe("PLAY", "SETTLE")
                .registe("SETTLE", "END")
                .setDefault("START")
        );
        // 绑定FGUI实例
        zs.core.onFGUIBind = Laya.Handler.create(this, () => {
            mainBinder.bindAll();
        });
        // 设置自定义准备事件
        zs.core.onPrepare = Laya.Handler.create(this, async () => {
            zs.scene.nodesDef = GameNode;
            zs.scene.inst.load('3dres/Conventional/TestScene.ls', true).then(() => {
                zs.core.readyFinish();
            });
        });
        // 设置各个状态的监听事件
        zs.core.onWorkflow(workflow.GAME_HOME, Laya.Handler.create(this, () => {
            console.log("Workflow ====== GAME_HOME");
            zs.fgui.manager.show(true, mainPage);
        }));

        zs.core.onWorkflow(workflow.GAME_PLAY, Laya.Handler.create(this, () => {
            console.log("Workflow ===== GAME_PLAY");
        }));

        zs.core.onWorkflow(workflow.GAME_PLAY + '.START', Laya.Handler.create(this, () => {
            console.log("Workflow ===== GAME_PLAY START");
        }));

        zs.core.onWorkflow(workflow.GAME_PLAY + '.READY', Laya.Handler.create(this, () => {
            console.log("Workflow ===== GAME_PLAY READY");
        }));

        zs.core.onWorkflow(workflow.GAME_PLAY + '.PLAY', Laya.Handler.create(this, () => {
            console.log("Workflow ===== GAME_PLAY PLAY");
        }));

        zs.core.onWorkflow(workflow.GAME_PLAY + '.SETTLE', Laya.Handler.create(this, () => {
            console.log("Workflow ===== GAME_PLAY SETTLE");
        }));

        zs.core.onWorkflow(workflow.GAME_PLAY + '.END', Laya.Handler.create(this, () => {
            console.log("Workflow ===== GAME_PLAY END");
        }));

        zs.core.onWorkflow(workflow.GAME_END, Laya.Handler.create(this, () => {
            console.log("Workflow ====== GAME_END");
        }));
        // 启动SDK
        zs.core.init(ProductKey);
    }
}
```
# 3. 自定义加载界面
SDK支持FGUI和LayaUI两种自定义加载界面，通过继承`zs.ui.Loading`(FGUI)或`zs.ui.LayaLoaidng`(LayaUI)来创建自定义的加载界面逻辑。
自定义加载界面主要有以下方法用于继承实现:
- `static make()`  
UI创建,用于执行UI的创建逻辑
- `preload()`  
预加载，用于预加载UI展示所需的资源
- `updateProgress(value:number)`  
更新显示进度，用于控制显示UI的变化
- `run(progress)`  
更新逻辑进度，用于控制UI逻辑，没有特殊需求时可以不用覆写，如果覆写请一定要主动调用`updateProgress`来更新显示UI

在启动SDK前调用`zs.core.loadingPage = Loading;`(FGUI)或`zs.core.layaLoadingPage = LayaLoading;`(LayaUI)来设置自定义的加载界面。

## FGUI自定义加载界面示例
``` typescript
import entryBinder from "./fgui/entryBinder";
import fgui_loading from "./fgui/fgui_loading";

export default class Loading extends zs.ui.Loading {
    // 设置FGUI资源类型
    static typeDefine = fgui_loading;
    // 预加载FGUI资源包并绑定实例
    static preload(): Promise<void> {
        return new Promise((resolve, reject) => {
            zs.resource.load('fgui/sub_fgui/entry', zs.ResourceType.FGUIPack).then(() => {
                entryBinder.bindAll();
                resolve();
            });
        });
    }
    // 更新显示进度
    updateProgress(value) {
        let loadingView = this.view as fgui_loading;
        if (loadingView) {
            loadingView.loadingbar.value = value;
        }
    }
}
```
## LayaUI自定义加载界面示例
``` typescript
export default class LayaLoading extends zs.ui.LayaLoading {
    static url: string = 'test/Loading.scene';

    static loadedScene: Laya.Scene;

    progressText: Laya.Label;

    // 预加载Laya UI加载场景资源
    static preload(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.loadedScene) { return resolve(); }
            Laya.Scene.load(this.url, Laya.Handler.create(this, (scene) => {
                this.loadedScene = scene as Laya.Scene;
                resolve();
            }));
        });
    }
    // 创建Laya UI加载场景并初始化
    static make(): LayaLoading {
        if (this.loadedScene == null) { return null; }
        Laya.stage.addChild(this.loadedScene);
        let layaLoading = this.loadedScene.getComponent(LayaLoading);
        if (layaLoading == null) {
            layaLoading = this.loadedScene.addComponent(LayaLoading);
        }

        this.loadedScene.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, '#000000', '#000000');
        layaLoading.progressText = this.loadedScene.getChildByName("progressText") as Laya.Label;
        return layaLoading;
    }
    // 更新Laya UI显示进度
    updateProgress(value: number) {
        this.progressText.text = value + '%';
    }
}
```
# 4. 平台切换（暂定）
1. SDK切换平台整体替换或添加以下文件：  
- src/template  
- bin/zsLibs/adapter  
- bin/zsLibs/index.js  
- bin/fgui/export  

2. 修改 bin/config/gameCfg.json 中的平台相关配置，建议为先前平台配置做个备份
3. 根据需求调整 bin/config/prodfuctCfg.json 来调整导出和广告等配置

# 5. 打包注意
- Laya压缩代码会导致fairygui.js在开发工具报错，需要发布设置添加压缩排除 `!$basePath/zsLibs/fairygui/*.js`
- 部分平台增强编译会增加库文件包体大小，可以将libs进行分包，并在game.js中添加加载分包回调。
- Laya中的ls、lh、lmat本质都是json文件，可以在发布设置压缩json中添加 `$basePath/**/*.{ls,lh,lmat}`

# 6. 接入规范
- 为避免后续平台接入困难，项目研发原则上绝不能更改任何SDK源代码。如果必须更改，请上报需求再讨论解决方案。
- 研发如果需要自定义流程，请使用子状态机来实现功能。
- 既定的平台工作流尽量不要随意改动，如果需要跳过流程，可以通过在指定状态的onWorkflow中设置自动跳过。
- 接口开关会额外受到时间、地区与场景值影响，测试时可在bin/config/gameCfg.json配置中打开debug开关来绕开。
- SDK中提供了状态机功能，绝大部分情况研发不需要额外添加状态机。
- 为保证兼容性，一般使用`zs.core.workflow.next()`进行状态跳转，研发禁止修改template中的任何代码，以避免后续调优接入困难。
- 子状态机有单独接口获取和控制相关状态，研发可以在业务中自由调用接口进行需要的业务。
- 框架禁止写入任何业务相关的内容。

# 7. 框架设计思维
新框架的设计思维有着四个核心设计原则：  

- 高灵活性是框架具备快速接入或移除的特性，同时在框架使用过程中也能够技术人员高度的自由和可操作空间
- 高可扩展性是框架具备快速移植平台和更改版式的特性，使产品项目能够以最短的速度来响应业务变化
- 高稳定性使框架具有稳定的运作流程和安全机制，以保证框架在运行过程中不出现严重问题
- 高可用性是框架具备大量节省前端开发流程的模块和为业务导入提供便利的工具，以保证整个产品开发流畅运作

# 8. 框架结构
新框架主要分为核心模块、适配器模块和模板模块三大部分

- 核心模块是整个框架最重要的部分，承担着整个框架的基本运作功能  
- 适配器模块是框架适配多平台的部分，不同平台将有着不同的适配器模块  
- 模板模块是框架业务实现的部分，可以为多变的业务运营需求提供多变的版式  

## 核心模块结构  

- zs.core.js  
核心模块，承载整个框架运作  

- zs.base.js  
基本模版模块

- zs.fsm.js  
状态机模块  

- zs.fgui.js  
FGUI模块，驱动FGUI运作  

- zs.exporter.js  
导出位模块  

- zs.log.js  
日志模块  

- zs.network.js  
网络通讯模块  

- zs.platform.js  
平台模块，用于适配多平台接口  

- zs.product.js  
运营模块，用于管理运营开关  

- zs.resouce.js  
资源模块，用于管理各类资源  

- zs.td.js  
Talking Data统计模块  

- zs.ui.js  
UI模版模块  

- zs.utils.js  
工具类模块  

## 适配器模块

zs.platform.**.js 适配器核心模块，不同平台需要配套使用不同文件
其他文件可根据平台需求自由添加

## 模板模块

工作流（workflow）的理解与使用，新框架的整个运作是基于可高度自定义的工作流来运作的。技术人员可以根据需求随意更改整个程序工作的状态流程，并由此来对每一个工作流程进行应用实现。

``` typescript
 class workflow extends zs.workflow {
        // 注册工作流
        registe() {
            this.fsm = new zs.fsm()
                .registe(workflow.GAME_HOME, workflow.GAME_PLAY, 0, false, this, (c) => { c.run(); })
                .registe(workflow.GAME_PLAY, workflow.GAME_END, 0, false, this, (c) => { c.run(); })
                .registe(workflow.GAME_END, workflow.GAME_HOME, 0, false, this, (c) => { c.run(); });
        }
        // 初始化工作流
        init() {
            super.init();
            this.fsm.init(workflow.GAME_HOME);
        }
    }
```

工作流在程序本质上就是一套流程状态机，技术人员可以监听响应每一个状态的更改变化，并在每个状态中实现对应的功能需求。新框架的模板模块就是基于工作流来实现的，大概实现方法是通过工作流来定义整个业务的运作流程，并在每个具体状态中来实现特定业务逻辑。
具体的使用方法可以参照代码仓库的模版工程来使用。

# 9. 配置文件

## 游戏配置 gameCfg
游戏配置是整个框架最重要的配置，开发过程中必须准确填写内容才能保证项目正常运作

``` json
{
    "debug": true,      // Debug测试开关，测试时开启，上线必须为false
    "version": "1.0",   // 版本号
    "appName": "开车撞僵尸",    // 项目名称
    "gameId": "kczjs",  // 游戏标志位，后台获取
    "appId": "wxa2df5b7d70ffadd1", // appId 
    "tdKey": "85C4C654EC184EA984CD3D62CB646ADD", // td密钥
    "tdVersion": "1.0.0", // td版本
    "aldKey": "3d2a2aa3e82651cc2b74df3a47b96e21",  // 阿拉丁密钥
    "secret": "dZPIQ6FCAyvVGzFK",  // 产品密钥***非特殊需求，默认可不填***
    "tdConfig": {   // td设置
        "gameComplete": {          // 事件名
            "label": "完成游戏",    // 事件描述
            "params": [           // 参数列表
                "uid",
                "isWin",
                "level"
            ],
            "strict": true        // 严格模式，开启则必须填入指定参数
        },
        "levelComplete_": {       // 后缀之间，可以在事件名中添加后缀，如levelComplete_1
            "label": "关卡完成-"
        }
    },
    "fguiPacks": [ // fgui预加载包
        "fgui/main"
    ],
    "autoScaleFit": true,   // ui自动缩放开关，作用于导出位
    "designWidth": 1080, // 设计分辨率宽度
    "designHeight": 1920, // 设计分辨率高度
    "network": {    // 网络默认数据
        "login": {
            "user_id": 1,
            "is_new": 0,
            "user_type": 1
        },
        "config>>switch": {
            "zs_version": 0,
            "zs_switch": 0,
            "zs_start_game_video_switch": 0,
            "zs_banner_vertical_enable": 0,
            "zs_jump_switch": 0,
            "zs_full_screen1_jump": 0,
            "zs_full_screen2_jump": 0,
            "zs_finish_jump": 0,
            "zs_history_list_jump": 0,
            "zs_auto_full_screen_jump_switch": 0,
            "zs_auto_jump_switch": 0,
            "zs_friends_playing_switch": 0,
            "zs_reminder_switch": 0,
            "zs_false_news_switch": 0,
            "zs_slide_jump_switch": 0,
            "zs_share_title": "这个是分享标题",
            "zs_share_img": "这个是分享图片地址",
            "zs_banner_adunit": "",
            "zs_banner_adunit2": "",
            "zs_banner_adunit3": "",
            "zs_video_adunit": "",
            "zs_full_screen_adunit": "",
            "zs_gridAd_id": "",
            "zs_click_award_num": "0",
            "zs_ready_click_num": "0",
            "zs_click_award_since": 0,
            "zs_button_delay_time": 0,
            "zs_scene_value": "1005|1006|1011|1012|1013|1014|1017|1019|1020|1023|1024|1025|1030|1031|1032|1036|1042|1047|1048|1049|1053|1102|1129",
            "zs_revive_way": "",
            "zs_revive_num": 0,
            "zs_system": "",
            "zs_city": "上海市|广州市|深圳市|成都市|北京市",
            "zs_time": 0,
            "zs_banner_banner_time": 1000,
            "zs_full_screen_banner_time": 3,
            "zs_banner_refresh_time": 30000
        },
        "download>>LevelInfo": {
            "level": 0
        }
    },
    "subpackages": { // 分包设置，前缀带星将在loading页面自动加载，否则将在使用时自动加载
        "*3dres": "3dres/",
        "*sound": "sound/",
        "*main": "fgui/main/",
        "*entry": "fgui/entry/"
    },
    "resources": {  // 资源设置，loading页面自动加载
        "configs": {
            "nick": [
                "config/nickname.json",
                null,
                true
            ]
        },
        "prefabs": {}
    }
}
```


## 运营配置 productCfg
运营配置主要设计广告和导出位展示的设置，配置基于工作流来运作，可以为每一个工作流程定制特定的广告和导出样式

``` json
{
    "GAME_START": {},
    "START_FULL_1": {
        "banner": {
            // 可用参数
            // delay 布尔值，延迟展示
            // auto 布尔值，自动展示
            // switch 字符串或字符串列表，控制banner开关展示
            // left 左位置偏移
            // right 右位置偏移
            // length 长度
        }
    },
    "START_FULL_2": {
        "banner": {
            
        }
    },
    "GAME_HOME": {
        "banner": {},
        "exporter": [
            {
                "type": "export_list", // 默认有 export_list 一种类型，其他类型可在模版模块注册使用
                "window": { // 窗口设置
                    "align": "topleft", // 对齐设置，可设置屏幕对齐
                    // align可用类型有 center（中心） top（顶部） bottom（底部） 
                    // left（左部） right（右部） topleft（顶左） bottomleft（底左） topright（顶右） bottomright（底右）
                    "alignoffsety": 500 // 对齐Y偏移
                    // alignoffsetx 数值，对齐X偏移
                    // x 数值，x轴位置
                    // y 数值，y轴位置
                    // block 布尔值，阻挡点击穿透
                    // autofront 布尔值，自动置顶
                    // front 布尔值，窗口置顶
                    // top 布尔值，控件置顶

                },
                "base": { // 控件设置，不同类型导出具有不同设置项
                    "item": "export_item_2", // 导出item样式
                    "mode": "side", // 列表类型 hlist（横条） vlist（竖条） hgrid（横网格） vgrid（竖网格） side（侧栏）
                    "width": 300, // 宽度
                    "max": 2, // 导出最大展示数量
                    "shaketime": 3000 // 甩动效果间隔
                    // adaptscale 布尔值，适应缩放
                    // listfit
                    // keepratio
                    // align
                    // linecount
                    // linegap
                    // columcount
                    // columngap
                    // layout
                    // cellwidth
                    // cellheight
                    // x 
                    // y
                    // snapwidth
                    // snapheight
                    // marginleft
                    // maringright
                    // margintop
                    // marginbottom
                    // background
                    // scrolltype
                    // autoscrollspeed
                    // dragrecovertime
                    // fit
                    // loop
                    // virtual
                    // bounce
                    // shaketime
                }
            },
            {
                "type": "export_list",
                "window": {
                    "align": "topright",
                    "alignoffsety": 500
                },
                "base": {
                    "item": "export_item_2",
                    "mode": "side",
                    "width": 300,
                    "max": 2,
                    "shaketime": 3000
                }
            },
            {
                "type": "export_list",
                "window": {
                    "align": "top",
                    "alignoffsety": 95
                },
                "base": {
                    "item": "export_item_7",
                    "mode": "hlist",
                    "height": 270,
                    "max": 10,
                    "marginleft": 10,
                    "marginright": 10
                }
            },
            {
                "type": "export_side",
                "window": {
                    "align": "left",
                    "alignoffsety": 100
                }
            }
        ]
    },
    "GAME_PREPARE": {},
    "EXPORT_COMMON_EGG": {
        "banner": {}
    },
    "GAME_PLAY": {
        "banner": {
            "switch": "zs_game_banner_show_switch"
        },
        "exporter": [
            {
                "type": "export_list",
                "window": {
                    "align": "top",
                    "alignoffsety": 140
                },
                "base": {
                    "item": "export_item_7",
                    "mode": "hlist",
                    "height": 270,
                    "max": 10,
                    "marginleft": 10,
                    "marginright": 10
                }
            }
        ]
    },
    "EXPORT_GAME_EGG": {
        "banner": {}
    },
    "OVER_FULL_1": {
        "banner": {
            
        }
    },
    "GAME_SETTLE": {
        "banner": {
            "delay": true
        },
        "exporter": [
            {
                "type": "export_knock",
                "switch": "zs_finish_jump",
                "window": {
                    "align": "center",
                    "alignoffsety": -30
                }
            }
        ]
    },
    "OVER_FULL_2": {
        "banner": {
            
        }
    },
    "GAME_END": {}
}
```