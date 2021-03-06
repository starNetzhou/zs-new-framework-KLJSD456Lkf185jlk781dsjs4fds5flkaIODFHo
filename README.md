# 1. 框架设计思维
新框架的设计思维有着四个核心设计原则：  

- 高灵活性是框架具备快速接入或移除的特性，同时在框架使用过程中也能够技术人员高度的自由和可操作空间
- 高可扩展性是框架具备快速移植平台和更改版式的特性，使产品项目能够以最短的速度来响应业务变化
- 高稳定性使框架具有稳定的运作流程和安全机制，以保证框架在运行过程中不出现严重问题
- 高可用性是框架具备大量节省前端开发流程的模块和为业务导入提供便利的工具，以保证整个产品开发流畅运作

# 2. 框架结构
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

# 3. 配置文件

## 游戏配置 gameCfg
游戏配置是整个框架最重要的配置，开发过程中必须准确填写内容才能保证项目正常运作

``` json
{
    "debug": true,      // Debug测试开关，测试时开启，上线必须为false
    "packgeTime": 20210224000000,   // 打包时间，上线时必须填写
    "appName": "开车撞僵尸",    // 项目名称
    "gameId": "kczjs",  // 游戏标志位，后台获取
    "appId": "wxa2df5b7d70ffadd1", // appId 
    "tdKey": "85C4C654EC184EA984CD3D62CB646ADD", // td密钥
    "tdVersion": "1.0.0", // td版本
    "aldKey": "3d2a2aa3e82651cc2b74df3a47b96e21",  // 阿拉丁密钥
    "secret": "dZPIQ6FCAyvVGzFK",  // 产品密钥
    "tdConfig": {   // td设置
        "gameComplete": {
            "label": "完成游戏",
            "params": [
                "uid",
                "isWin",
                "level"
            ],
            "strict": true
        },
        "levelComplete_": {
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
                "type": "export_list", // 默认有 export_list 和 export_card 两种类型，其他类型可在模版模块注册使用
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

