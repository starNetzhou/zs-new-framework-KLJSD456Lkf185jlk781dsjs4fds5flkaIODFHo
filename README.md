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