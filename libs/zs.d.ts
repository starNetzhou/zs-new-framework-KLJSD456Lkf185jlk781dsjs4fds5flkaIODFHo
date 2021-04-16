declare module zs {
    /**
     * Talking Data 配置参数
     */
    interface tdParams {
        /**
         * 事件名称
         */
        label: string,
        /**
         * （可选）参数列表
         */
        params?: string[],
        /**
         * （可选）严格模式，参数需严格按照配置使用
         */
        strict?: boolean
    }

    /**
     * 资源加载配置
     */
    interface resourceCfg {
        /**
         * 参数配置表
         */
        configs: { [key: string]: any[] },
        /**
         * 预制体配置表
         */
        prefabs: { [key: string]: any[] }
    }

    interface userInfo {
        user_id: number,
        user_type: number,
        update_time: number,
        is_new: number
    }

    /**
     * 游戏配置
     */
    interface gameCfg {
        /**
         * 测试开关
         * 上线必须为false! 
         * 上线必须为false! 
         * 上线必须为false!
         */
        debug: boolean,
        /**
         * 纯净模式开关
         */
        pure: boolean,
        /**
         * 版本号
         */
        version: string;
        /**
         * 项目名称
         */
        appName: string,
        /**
         * 游戏标识
         */
        gameId: string,
        /**
         * 项目Id
         */
        appId: string,
        /**
         * Talking Data 密钥
         */
        tdKey: string,
        /**
         * 阿拉丁密钥
         */
        aldKey: string,
        /**
         * 指色密钥
         */
        secret: string,
        /**
         * Talking Data 配置
         */
        tdConfig: string,
        /**
         * 预加载FGUI资源包
         */
        fguiPacks: string[],
        /**
         * 组件自动缩放适应
         */
        autoScaleFit: boolean,
        /**
         * 设计宽度
         */
        designWidth: number,
        /**
         * 设计高度
         */
        designHeight: number,
        /**
         * 默认网络参数
         */
        network: { [key: string]: any },
        /**
         * 分包配置表
         */
        subpackages: { [key: string]: string },
        /**
         * 预加载资源表
         */
        resources: resourceCfg
    }

    interface bannerCfg {
        switch?: string,
        delay?: boolean,
        auto?: boolean,
        left?: number,
        bottom?: number,
        length?: number
    }

    interface exporterCfg {
        type: string,
        config: any
    }

    interface productCfg {
        banner?: bannerCfg,
        exporter?: exporterCfg[]
    }

    /**
     * 资源包状态
     */
    enum PackageState {
        /**
         * 其他
         */
        Other = 0,
        /**
         * 分包
         */
        SubPackage = 1,
        /**
         * 已加载
         */
        Loaded = 2
    }

    /**
     * 资源类型
     */
    enum ResourceType {
        /**
         * 常规
         */
        Common = 0,
        /**
         * 2D场景
         */
        Scene = 1,
        /**
         * 3D场景
         */
        Scene3D = 2,
        /**
         * 3D精灵
         */
        Sprite3D = 3,
        /**
         * FGUI资产
         */
        FGUIPack = 4
    }

    /**
     * 网络模式
     */
    enum NetworkMode {
        /**
         * 本地
         */
        Local = 0,
        /**
         * 异步
         */
        Async = 1,
        /**
         * 同步
         */
        Sync = 2
    }
    /**
     * 显示消息提示框
     * @param params 提示框信息
     */
    function showMsgBox(params: msgboxParams);
    /**
     * 隐藏消息提示框
     * @param isClear 清空消息队列
     */
    function hideMsgBox(isClear?: boolean);
    /**
     * 工作流
     */
    class workflow {
        /**
         * 列表导出位模板名称
         */
        static readonly exporterList: string;
        /**
         * 卡片导出位模板名称
         */
        static readonly exporterCard: string;
        /**
         * 导出位忽略列表
         */
        exporterIgnoreList: string[];
        /**
         *  横幅广告忽略列表
         */
        bannerIgnoreList: string[];
        /**
         * 导出开关名称
         */
        switchExporter: string;
        /**
         * 状态机实例
         */
        fsm: zs.fsm;
        /**
         * 导出包路径
         */
        exporterPack: string;
        /**
         * 获取工作流状态
         */
        get state(): string;
        /**
         * 获取工作流子状态
         */
        get childState(): string;
        /**
         * 注册方法（无需主动调用），虚方法，用于自定义工作流
         */
        registe();
        /**
         * 开始方法（无需主动调用）
         */
        start();
        /**
         * 设置子状态机
         * @param key 父状态名
         * @param fsm 子状态机
         */
        setFSM(key: string, fsm: zs.fsm);
        /**
         * 注册工作流监听，用于监听工作流状态改变
         * @param key 状态名
         * @param handler 监听事件
         * @param isBefore （可选）是否在状态开始改变前响应，默认为否
         */
        on(key: string, handler: Laya.Handler, isBefore?: boolean);
        /**
         * 注销工作流监听
         * @param key 状态名
         * @param handler 监听事件
         * @param isBefore （可选）是否在状态开始改变前响应，默认为否
         */
        off(key: string, handler: Laya.Handler, isBefore?: boolean);
        /**
         * 注销状态内全部监听
         * @param key 状态名
         * @param isBefore （可选）是否在状态开始改变前响应，默认为否
         */
        offAll(key: string, isBefore?: boolean);
        /**
         * 注销指定调用者监听
         * @param caller 调用者
         * @param key （可选）状态名
         * @param isBefore （可选）是否在状态开始改变前响应，默认为否
         */
        offAllCaller(caller: any, key?: string, isBefore?: boolean);
        /**
         * 清空所有监听事件
         * @param isBefore （可选）是否在状态开始改变前响应，默认为否
         */
        clear(isBefore?: boolean);
        /**
         * 状态跳转
         * @param target （可选）目标状态名，默认自动跳转
         */
        next(target?: string);
        /**
         * 子状态跳转 
         * @param target （可选）目标状态名，默认自动跳转
         */
        childNext(target?: string);
    }

    /**
     * 框架核心
     */
    class core {
        /**
         * 项目名称
         */
        static get appName(): string;
        /**
         * 项目ID
         */
        static get appId(): string;
        /**
         * Talking Data 密钥
         */
        static get tdKey(): string;
        /**
         * 阿拉丁密钥
         */
        static get aldKey(): string;
        /**
         * 用户ID
         */
        static readonly userId: string;
        /**
         * 设置初始化事件
         */
        static onConfigInit: Laya.Handler;
        /**
         * FGUI绑定事件
         */
        static onFGUIBind: Laya.Handler;
        /**
         * 框架准备事件，完成初始化后响应
         * 未设置将自动开始游戏工作流
         * 设置后需调用zs.core.readyFinish()来手动开始游戏工作流
         */
        static onPrepare: Laya.Handler;
        /**
         * 框架开始事件，开始游戏工作流后响应
         */
        static onStart: Laya.Handler;
        /**
         * 自定义游戏入口类
         * 未设置将默认使用模板入口类
         */
        static entry: typeof zs.base.entry;
        /**
         * 自定义游戏工作流
         * 未设置将默认使用模板工作流类
         */
        static workflow: workflow;
        /**
         * 自定义加载页面类
         * 未设置将默认使用模板加载页面
         */
        static loadingPage: typeof zs.ui.Loading;
        /**
         * 自定义LayaUI加载页面类（优先级低于loadingPage）
         * 未设置将默认使用模板加载页面
         */
        static layaLoadingPage: typeof zs.ui.LayaLoading;

        /**
         * 框架初始化方法
         * @param productDef 运营产品接口定义
         */
        static init(productDef: any): Promise<void>;
        /**
         * 初始化完成方法，在onPrepare中最后调用以开始游戏工作流
         */
        static readyFinish();
        /**
         * 开始游戏工作流（无需主动调用）
         */
        static start();
        /**
         * 监听工作流事件
         * @param key 状态名
         * @param handler 监听事件
         * @param isBefore （可选）是否在状态开始改变前响应，默认为否
         */
        static onWorkflow(key: string, handler: Laya.Handler, isBefore?: boolean);
        /**
         * 单次监听工作流事件
         * @param key 状态名
         * @param handler 监听事件
         * @param isBefore （可选）是否在状态开始改变前响应，默认为否
         */
        static onceWorkflow(key: string, handler: Laya.Handler, isBefore?: boolean);
        /**
         * 添加应用展示监听
         * @param handler 监听事件
         */
        static addAppShow(handler);
        /**
         * 移除应用展示监听
         * @param handler 监听事件
         */
        static removeAppShow(handler);
        /**
         * 添加应用隐藏监听
         * @param handler 监听事件
         */
        static addAppHide(handler);
        /**
         * 移除应用隐藏监听
         * @param handler 监听事件
         */
        static removeAppHide(handler);

        static userInfo: userInfo;
    }

    /**
     * 状态机
     */
    class fsm {
        /**
         * 状态变化事件（开始前）
         * 返回目标状态名， 当前状态名 (target, current) => {}
         */
        onBeforeChange: Laya.Handler;
        /**
         * 状态变化事件（已完成）
         * 返回当前状态名 (current) => {}
         */
        onChanged: Laya.Handler;
        /**
         * 状态机初始化
         * @param state 初始状态名
         * @param auto 自动状态，开启后将自动转换状态
         */
        init(state: string, auto?: boolean);
        /**
         * 注册状态
         * @param from 开始状态名
         * @param to 目标状态名
         * @param priority （可选）优先级
         * @param auto （可选）自动状态，开启后将自动转换状态
         * @param thisObj （可选）事件主体
         * @param transition （可选）转换事件，需主动调用complete.run()完成状态转换
         * @param condition （可选）条件判断<返回boolean>
         * @param canBreak （可选）状态是否可被中途打断
         */
        registe(from: string, to: string, priority?: number, auto?: boolean, thisObj?: any, transition?: (complete: Laya.Handler) => void, condition?: () => boolean, canBreak?: boolean): fsm;
        /**
         * 设置状态机默认值
         * @param state 默认状态
         * @param auto 默认自动状态
         */
        setDefault(state: string, auto?: boolean): fsm;
        /**
         * 注销状态
         * @param from 开始状态名
         * @param to 目标状态名
         */
        unregiste(from: string, to: string): fsm;
        /**
         * 切换状态
         * @param target 目标状态名
         */
        runTransition(target: string): boolean;
        /**
         * 切换到下一状态
         */
        runNext(): string;
    }

    /**
     * 资源管理
     */
    class resource {
        /**
         * 初始化方法（无需主动调用）
         */
        static init();
        /**
         * 检查资源分包
         * @param url 资源包名
         */
        static check(url: string): string;
        /**
         * 是否处于资源加载中
         */
        static isLoading(): boolean;
        /**
         * 分包是否加载
         * @param key 分包关键词
         */
        static isPackLoaded(key: string): boolean;
        /**
         * 加载资源（自动加载分包）
         * @param url 资源URL
         * @param type 资源类型
         */
        static load<T>(url: string, type?: ResourceType): Promise<T>;
        /**
         * 原生加载（不自动加载分包）
         * @param url 资源URL
         * @param type 资源类型
         */
        static nativeLoad<T>(url: string, type?: ResourceType): Promise<T>;
        /**
         * 销毁FGUI资源包
         * @param pack UI资源包
         */
        static destroyFGUIPackage(pack: fairygui.UIPackage);
        /**
         * 根据名称销毁FGUI资源包
         * @param name 名称
         */
        static destroyFGUIPackageByName(name: string);
    }

    /**
     * 工具类
     */
    class utils {
        /**
         * 获取或添加组件
         * @param node 节点
         * @param type 组件类型
         */
        static getOrAddComponent<T extends Laya.Component>(node: Laya.Node, type: typeof Laya.Component): T;
        /**
         * 休眠
         * @param timeout 休眠时长
         */
        static sleep(timeout: number): Promise<void>;
        /**
         * 是否为今天
         * @param timestamp 时间戳
         */
        static isToday(timestamp: number): boolean;
        /**
         * 整数随机数
         * @param min 最小数
         * @param max 最大数
         */
        static randInt(min: number, max: number): number;
        /**
         * 整数种子随机数
         * @param min 最小数
         * @param max 最大数
         */
        static srandInt(min: number, max: number): number;
        /**
         * 浮点随机数
         * @param min 最小数
         * @param max 最大数
         */
        static rand(min: number, max: number): number;
        /**
         * 浮点种子随机数
         * @param min 最小数
         * @param max 最大数
         */
        static srand(min: number, max: number): number;
        /**
         * 设置随机种子值
         * @param seed 种子值
         */
        static setRandSeed(seed: number);
        /**
         * 随机捡取数组
         * @param from 起点
         * @param to 终点
         * @param numPick 捡取数量
         */
        static pickNumbers(from: number, to: number, numPick: number): number[];
        /**
         * 随机种子捡取数组
         * @param from 起点
         * @param to 终点
         * @param numPick 捡取数量
         * @param seed （可选）种子值
         */
        static spickNumbers(from: number, to: number, numPick: number, seed?: number): number[];
        /**
         * 随机捡取列表元素
         * @param array 列表
         * @param numPick 捡取数量
         */
        static pickArray<T>(array: T[], numPick: number): T[];
        /**
         * 随机种子捡取列表元素
         * @param array 列表
         * @param numPick 捡取数量
         * @param seed （可选）种子值
         */
        static spickArray<T>(array: T[], numPick: number, seed?: number): T[];
        /**
         * 是否为数字
         * @param value 字符串
         */
        static isNumber(value: string): boolean;
        /**
         * 字符串对比
         * @param str1 原始字符串
         * @param str2 对比字符串
         */
        static startwith(str1: string, str2: string): boolean;
        /**
         * 展平Key-Value Json数据
         * @param jsonObj json对象
         * @param numParse （可选）是否尽量转换为数值
         */
        static flatKVJson(jsonObj, numParse): any;
    }

    /**
     * 配置类
     */
    class configs {
        /**
         * 基础游戏配置
         */
        static readonly gameCfg: gameCfg;
        /**
         *  基础产品配置
         */
        static readonly productCfg: { [key: string]: productCfg };
        /**
         * 加载配置表
         * @param key 表名 
         * @param path 本地路径
         * @param url （可选）网络路径
         * @param isAsync （可选）异步加载模式，默认为否
         */
        static load(key: string, path: string, url?: string, isAsync?: boolean): Promise<any>;
        /**
         * 获取配置表
         * @param key 表名
         */
        static get(key: string): any;
    }

    /**
     * 预制体类
     */
    class prefabs {
        /**
         * 加载预制体
         * @param key 表名 
         * @param path 本地路径
         * @param url （可选）网络路径
         * @param isAsync （可选）异步加载模式，默认为否
         */
        static load(key: string, path: string, url?: string, isAsync?: boolean): Promise<Laya.Sprite3D>;
        /**
         * 获取预制体
         * @param key 表名
         */
        static get(key: string): Laya.Sprite3D;
    }

    /**
     * 运营接口
     */
    class product {
        /**
         * 初始化方法（无需主动调用）
         * @param productDef 运营接口定义
         */
        static init(productDef: any);
        /**
         * 注册运营接口
         * @param key 接口名
         * @param define 接口定义
         */
        static registe(key: string, define: any);
        /**
         * 获取接口值
         * @param key 接口名 
         */
        static get(key: string): any;
        /**
         * 时间段检查
         * @param value 时间值
         */
        static timeCheck(value: string): number;
    }

    /**
     * 场景管理类
     */
    class scene {
        /**
         * 基础路径
         */
        static basePath: string;
        /**
         * 场景节点定义
         */
        static nodesDef: any;
        /**
         * 自定义构建预制体事件，返回prefab预制体
         * Laya.Handler.create(this, (prefab) => { ... })
         */
        static onBuildPrefab: Laya.Handler;
        /**
         * 自定义放置预制体事件，返回prefab预制体和放置节点
         * Laya.Handler.create(this, (prefab, node) => { ... })
         */
        static onPlacePrefab: Laya.Handler;
        /**
         * 自定义世界构建事件
         * Laya.Handler.create(this, () => { ... })
         */
        static onBuildWorld: Laya.Handler;
        /**
         *  场景单例
         */
        static get inst(): scene;
        /**
         * 当前场景
         */
        get current(): Laya.Scene3D;
        /**
         * 下一场景
         */
        get next(): Laya.Scene3D;
        /**
         * 静态根节点
         */
        get staticNode(): Laya.Node;
        /**
         * 动态根节点
         */
        get dynamicNode(): Laya.Node;
        /**
         * 预加载根节点
         */
        get preloadNode(): Laya.Node;
        /**
         * 是否正在加载场景
         */
        get isSceneLoading(): boolean;
        /**
         * 是否正在预加载场景
         */
        get isPreloading(): boolean;
        /**
         * 拼合URL
         * @param url 场景名
         * @param suffix （可选）后缀
         */
        static URLCombine(url: string, suffix?: string): string;
        /**
         * 加载场景
         * @param inScene 场景或场景名
         * @param fullpath （可选）是否为完全路径
         * @param index （可选）场景序列
         */
        load(inScene: Laya.Scene3D | string, fullpath?: boolean, index?: number): Promise<void>;
        /**
         * 加载下一场景
         * @param isNext 是否加载下一场景，否时重置当前场景
         * @param index （可选）场景序列
         */
        loadNext(isNext: boolean, index?: number): Promise<void>;
        /**
         * 预加载场景
         * @param inScene 场景名
         * @param fullpath （可选）是否为完全路径
         */
        preload(inScene: string, fullpath?: boolean): Promise<void>;
        /**
         * 构建场景
         */
        build();
    }

    /**
     * 网络通讯类
     */
    class network {
        /**
         * 初始化方法（无需主动调用）
         */
        static init(): Promise<void>;
        /**
         * 获取完整URL路径
         * @param route 路径名
         */
        static getUrl(route: string): string;
        /**
         * 对象转换通讯参数
         * @param obj 上传对象
         */
        static obj2arg(obj: any): string;
        /**
         * POST通讯
         * @param url 通讯URL
         * @param params 参数
         * @param timeout （可选）超时时长
         */
        static post(url: string, params: any, timeout?: number): Promise<any>;
        /**
         * GET通讯
         * @param url 通讯URL
         * @param params 参数
         * @param timeout （可选）超时时长
         */
        static get(url: string, params: any, timeout?: number): Promise<any>;
        /**
         * 原生REQUEST
         * @param url 通讯URL
         * @param data 数据参数
         * @param method 通讯方法
         */
        static nativeRequest(url: string, data: any, method: string, needSign?: boolean, ignoreSecret?: boolean): Promise<any>;
        /**
         * REQUEST通讯（POST）
         * @param route 路径名
         * @param params 参数
         * @param mode 通讯模式
         */
        static request(route: string, params: any, mode?: NetworkMode): Promise<any>;
        /**
         * 读取本地数据
         * @param route 路径名
         * @param key （可选）关键字
         */
        static getLocalData(route: string, key?: string): string;
        /**
         * 写入本地数据
         * @param route 路径名
         * @param data 数据
         * @param key （可选）关键字
         */
        static setLocalData(route: string, data: any, key?: string);
        /**
         * PING测试接口
         */
        static ping(): Promise<void>;
        /**
         * 登录接口
         * @param params （可选）参数
         * @param mode （可选）通讯模式
         */
        static login(params?: any, mode?: NetworkMode): Promise<any>;
        /**
         * 配置接口
         * @param isSwitch （可选）是否为开关类型（默认模块）
         * @param module (可选）模块名称（默认为base_moudle）
         * @param table (可选）配置表名,不填写获取模块下所有表
         * @param mode （可选）通讯模式
         */
        static config(isSwitch?: boolean, module?: string, table?: string, mode?: NetworkMode): Promise<any>;
        /**
         * 更新接口
         * @param key 关键词
         * @param data 数据
         * @param mode （可选）通讯模式
         */
        static update(key: string, data: string, mode?: NetworkMode): Promise<any>;
        /**
         * 下载接口
         * @param key 关键词
         * @param mode （可选）通讯模式
         */
        static download(key: string, mode?: NetworkMode): Promise<any>;

        /**
         * 网络状态
         */
        static readonly bEnable: boolean;
        /**
         * 默认网络数据
         */
        static readonly defaultData: any;
        /**
         * 网络域名表
         */
        static listDomain: string[];
        /**
         * 网络版本号
         */
        static version: string;
        /**
         * 网络接口映射
         */
        static mapWebApi: { [key: string]: string };
    }

    /**
     * Talking Data管理类
     */
    class td {
        /**
         * 初始化方法（无需主动调用）
         */
        static init();
        /**
         * 注册事件
         * @param evt 事件名
         * @param info 参数配置
         */
        static registeInfo(evt: string, info: tdParams);
        /**
         * 注册配置表
         * @param path 配置表路径
         */
        static registeConfig(path: string);
        /**
         * 触发事件
         * @param evtId 事件ID
         * @param params （可选）参数
         */
        static track(evtId: string, params?: any);
    }
}

/**
 * UI模块
 */
declare module zs.ui {

    /**
     * 绑定FGUI组件
     * @param pack FGUI资产包
     * @param itemName 组件名
     * @param type 组件类
     */
    function bind(pack: fairygui.UIPackage, itemName: string, type: any);

    /**
     * 获取组件URL
     * @param pack FGUI资产包 
     * @param itemName 组件名
     */
    function readURL(pack: fairygui.UIPackage, itemName: string);

    /**
     * 导出卡片
     */
    class FGUI_card extends fairygui.GComponent {
        /**
         * 卡片加载器
         */
        loader: fairygui.GLoader;
        /**
         * 创建实例
         */
        static createInstance();
    }
    /**
     * 导出部件
     */
    class FGUI_item extends fairygui.GComponent {
        /**
         * 图片
         */
        picture: fairygui.GLabel;
        /**
         * 描述
         */
        desc: fairygui.GTextField;
        /**
         * 标题
         */
        title: fairygui.GTextField;
        /**
         * 数据
         */
        data: ExporterData;
        /**
         * 创建实例
         */
        static createInstance();
        /**
         * FGUI URL
         */
        static readonly URL: string;
    }
    /**
     * 导出列表
     */
    class FGUI_list extends fairygui.GComponent {
        /**
         * 部件名
         */
        static itemName: string;
        /**
         * 背景加载器
         */
        background: fairygui.GLoader;
        /**
         * 列表
         */
        list: fairygui.GList;
        /**
         * 绑定方法
         * @param pack FGUI资源包
         */
        static bind(pack: fairygui.UIPackage);
        /**
         * 创建实例
         */
        static createInstance();
    }
    /**
     * 加载页面
     */
    class Loading extends zs.fgui.base {
        /**
         * 加载进度
         */
        progress: number;
        /**
         * （虚方法）预加载方法，主要用于预加载loading资源包
         */
        preload(): Promise<void>;
        /**
         * 更新进度
         * @param value 
         */
        updateProgress(value: number);
        /**
         * 执行进度
         */
        run(progress);
    }

    /**
     * LayaUI加载页面
     * 用于兼容Laya UI
     **/
    class LayaLoading extends Laya.Script {
        /**
         * Loading创建方法
         */
        static make(): LayaLoading;
        /**
         * 加载进度
         */
        progress: number;
        /**
         * （虚方法）预加载方法，主要用于预加载loading资源包
         */
        preload(): Promise<void>;
        /**
         * 更新进度
         * @param value 
         */
        updateProgress(value: number);
        /**
         * 执行进度
         */
        run(progress);
    }

    /**
     * UI场景管理
     */
    class uiScene {
        /**
         * UI场景节点
         */
        static scene: Laya.Scene3D;
        /**
         * UI场景镜头
         */
        static camera: Laya.Camera;
        /**
         * UI场景灯光
         */
        static light: Laya.DirectionLight;
        /**
         * 初始化方法（不用主动调用）
         */
        static init();
        /**
         * 同步镜头或灯光配置
         * @param object 镜头或灯光对象
         */
        static sync(object: Laya.Camera | Laya.DirectionLight);
        /**
         * 重置镜头
         */
        static resetCamera();
        /**
         * 重置灯光
         */
        static resetLight();
        /**
         * 添加物体
         * @param sprite 物体
         * @param position （可选）位置
         * @param rotationEuler （可选）旋转
         */
        static add(sprite: Laya.Sprite3D, position?: Laya.Vector3, rotationEuler?: Laya.Vector3): Laya.Sprite3D;
        /**
         * 克隆添加物体
         * @param sprite 物体
         * @param position （可选）位置
         * @param rotationEuler （可选）旋转
         */
        static cloneAdd(sprite: Laya.Sprite3D, position?: Laya.Vector3, rotationEuler?: Laya.Vector3): Laya.Sprite3D;
        /**
         * 清空场景物体
         */
        static clear();
        /**
         * 根据索引移除物体
         * @param index 索引
         */
        static removeAt(index: number);
        /**
         * 移除物体
         * @param sprite 物体
         */
        static remove(sprite: Laya.Sprite3D);
    }
}
/**
 * 模板类
 */
declare module zs.base {
    /**
     * 模板入口类
     */
    class entry {
        constructor(type: typeof zs.ui.Loading, thisArg: any, event: (loading: zs.ui.Loading) => void, complete: () => void);
        /**
         * 初始化方法
         * @param type Loading类型
         * @param thisArg 事件主体
         * @param event 事件方法
         * @param complete 完成事件
         */
        static init(type: typeof zs.ui.Loading, thisArg: any, event: (loading: zs.ui.Loading) => void, complete: () => void): zs.base.entry;
    }
    /**
     * 模板工作流类
     */
    class workflow extends zs.workflow {
        static readonly GAME_HOME: string;
        static readonly GAME_PLAY: string;
        static readonly GAME_END: string;
    }
}

interface msgboxParams {
    title: string,
    content: string,
    confirmText?: string,
    cancelText?: string,
    confirmHandler?: Laya.Handler,
    cancelHandler?: Laya.Handler,
    hideCancel?: boolean
}
/**
 * FGUI类
 */
declare module zs.fgui {
    /**
     * 对齐类型
     */
    enum AlignType {
        /**
         * 中心对齐
         */
        Center,
        /**
         * 上端对齐
         */
        Top,
        /**
         * 下端对齐
         */
        Bottom,
        /**
         * 左端对齐
         */
        Left,
        /**
         * 右端对齐
         */
        Right,
        /**
         * 左上对齐
         */
        TopLeft,
        /**
         * 左下对齐
         */
        BottomLeft,
        /**
         * 右上对齐
         */
        TopRight,
        /**
         * 右下对齐
         */
        BottomRight
    }
    /**
     * 全屏适配模式
     */
    enum FitType {
        /**
         * 不进行全屏适配
         */
        None,
        /**
         * 尺寸适配
         */
        Fit,
        /**
         * 缩放适配
         */
        ScaleFit,
        /**
         * 尺寸与缩放适配
         */
        Both
    }
    /**
     * 配置类
     */
    class configs {
        /**
         * 注册FGUI控制器
         * @param key 控制器名
         * @param type 控制器类型
         */
        static registeBase(key: string, type: any);
        /**
         * 注销FGUI控制器
         * @param key 
         */
        static unregisteBase(key: string);
        /**
         * 注册FGUI组件
         * @param key 组件名 
         * @param type 组件类型
         */
        static registeItem(key: string, type: any);
        /**
         * 注销FGUI组件
         * @param key 组件名
         */
        static unregisteItem(key: string);
        /**
         * 自定义初始化事件
         */
        public static onInit: Laya.Handler;
        /**
         * FGUI资源根路径
         */
        public static path_root: string;
        /**
         * 导出资源包名称
         */
        public static pack_exporter: string;
    }
    /**
     * 初始化方法（无需主动调用）
     */
    function init();
    /**
     * 加载资源包
     * @param pack 资源包名
     * @param fullpath （可选）是否为全路径
     */
    function loadPack(pack: string, fullpath?: boolean): Promise<fairygui.UIPackage>;
    /**
     * 批量加载资源包
     * @param packs 资源包列表
     * @param fullpath （可选）是否为全路径
     */
    function loadPacks(packs: string[], fullpath?: boolean): Promise<fairygui.UIPackage[]>;

    /**
     * FGUI基类
     */
    class base {
        /**
         * 类型定义
         */
        static typeDefine: typeof fairygui.GComponent;
        /**
         * 显示组件
         */
        get view(): fairygui.GComponent;
        /**
         * 控件是否被销毁
         */
        disposed: boolean;
        /**
         * 构造方法
         * @param component 构造FGUI组件
         */
        constructor(component: fairygui.GComponent);
        /**
         * 构建方法
         * @param type （可选）控件构建类型
         */
        static make(type?: typeof fairygui.GComponent): fairygui.GComponent;
        /**
         * 类型
         */
        static type(): typeof fairygui.GComponent;
        /**
         * 显示组件
         */
        show(): base;
        /**
         * 隐藏组件
         */
        hide(): base;
        /**
         * 检查方法
         * @param component 组件
         */
        check(component: fairygui.GComponent): boolean;
        /**
         * 销毁方法
         */
        dispose();
        /**
         * 初始化方法
         */
        init();
        /**
         * 执行方法
         */
        apply(): base;
        /**
         * 执行配置方法
         */
        applyConfig(): base;
    }
    /**
     * FGUI泛型基类
     */
    class baseGeneric<T extends fairygui.GComponent> extends base {
        get view(): T;
    }
    /**
     * FGUI窗口管理类
     */
    class window {
        /**
         * 创建窗口
         * @param x （可选）X轴位置 
         * @param y （可选）Y轴位置
         * @param width （可选）窗口宽度
         * @param height （可选）窗口高度
         */
        static create(x?: number, y?: number, width?: number, height?: number): window;
        /**
         * 附加部件
         * @param ctr 部件类型
         * @param index (可选) 索引号
         */
        attach(ctr: typeof base, index?: number): window;
        /**
         * 释放部件
         * @param ctr 部件类型或索引号
         */
        detach(ctr: base | number): window;
        /**
         * 设置当前UI控件
         * @param ctr UI控件 
         */
        setBase(ctr: zs.fgui.base): window;
        /**
         * 获取当前UI控件
         */
        getBase(): zs.fgui.base;
        /**
         * 清空UI控件
         */
        clearBase(): window;
        /**
         * 对齐窗口
         * @param type 对齐类型
         * @param xOffset （可选）X偏移
         * @param yOffset （可选）Y偏移
         */
        align(type: AlignType, xOffset?: number, yOffset?: number): window;
        /**
         * 设置X轴位置
         * @param x X数值
         */
        setX(x: number): window;
        /**
         * 设置窗口X轴位置
         * @param x X数值
         */
        setWindowX(x: number): window;
        /**
         * 设置Y轴位置
         * @param y Y数值
         */
        setY(y: number): window;
        /**
         * 设置窗口Y轴位置
         * @param y Y数值
         */
        setWindowY(y: number): window;
        /**
         * 设置XY轴位置
         * @param x X数值
         * @param y Y数值
         */
        setXY(x: number, y: number): window;
        /**
         * 设置窗口XY轴位置
         * @param x X数值
         * @param y Y数值
         */
        setWindowXY(x: number, y: number): window;
        /**
         * 设置宽度
         * @param width 宽度值
         */
        setWidth(width: number): window;
        /**
         * 设置窗口宽度
         * @param width 宽度值 
         */
        setWindowWidth(width: number): window;
        /**
         * 设置高度
         * @param height 高度值
         */
        setHeight(height: number): window;
        /**
         * 设置窗口高度
         * @param height 高度值
         */
        setWindowHeight(height: number): window;
        /**
         * 窗口缩放适应
         * @param designWidth 设计宽度
         * @param designHeight 设计高度
         */
        scaleFitWindow(designWidth: number, designHeight: number): window;
        /**
         * 缩放适应
         * @param designWidth 设计宽度
         * @param designHeight 设计高度
         */
        scaleFit(designWidth: number, designHeight: number): window;
        /**
         * 窗口设置缩放
         * @param x X缩放
         * @param y Y缩放
         */
        scaleWindow(x: number, y: number): window;
        /**
         * 设置缩放
         * @param x X缩放
         * @param y Y缩放
         */
        scale(x: number, y: number): window;
        /**
         * 全屏适应
         */
        fit(): window;
        /**
         * 适应宽度
         * @param keepRatio 保持比例
         */
        fitWidth(keepRatio?: boolean): window;
        /**
         * 适应高度
         * @param keepRatio 保持比例
         */
        fitHeight(keepRatio?: boolean): window;
        /**
         * 点击穿透
         * @param value 是否穿透
         */
        block(value: boolean): window;
        /**
         * 点击自动置顶
         * @param value 是否自动置顶
         */
        autoFront(value: boolean): window;
        /**
         * 窗口置前，将覆盖置顶的窗口
         */
        front(): window;
        /**
         * 组件置顶
         */
        top(): window;
        /**
         * 更新部件
         * @param type 部件类型
         * @param func 更新事件，(unit,window) => {}
         * @param thisArg 事件主体
         */
        update<T extends base>(type: typeof base, func: (unit: T, window?: fairygui.Window) => void, thisArg?: any): window;
        /**
         * 显示窗口
         */
        show(): window;
        /**
         * 隐藏窗口
         */
        hide(): window;
        /**
         * 清空窗口
         */
        clear(): window;
        /**
         * 应用窗口设置
         * @param config 
         */
        applyConfig(config: any): window;
        /**
         * 销毁窗口
         */
        dispose();
        /**
         * 窗口是否显示
         */
        isShowing(): boolean;
    }
    /**
     * FGUI面板管理类
     */
    class manager {
        /**
         * 打开FGUI面板，将覆盖已有面板
         * @param type（可选）面板UI控件类型
         * @param key （可选）面板关键词
         * @param fit （可选）全屏适配类型
         */
        static open(type?: typeof zs.fgui.base, key?: string, fit?: FitType): zs.fgui.window;
        /**
         * 展示FGUI面板，不会覆盖已有面板
         * @param autoCreate （可选）不存在面板时是否自动创建
         * @param type（可选）面板UI控件类型
         * @param key （可选）面板关键词
         * @param fit （可选）全屏适配类型
         */
        static show(autoCreate?: boolean, type?: typeof zs.fgui.base, key?: string, fit?: FitType): zs.fgui.window;
        /**
         * 隐藏FGUI面板
         * @param key （可选）面板关键词
         */
        static hide(key?: string): zs.fgui.window;
    }
}

/**
 * 导出信息
 */
interface exportInfo {
    /**
     * 产品ID
     */
    appid: string;
    /**
     * 链接地址
     */
    link_path: string;
    /**
     * 额外数据
     */
    extraData: any;
}

/**
 * 平台模块
 */
declare module zs.platform {
    /**
     * 初始化方法（无需主动调用）
     */
    function init();
    /**
     * 初始化广告接口（无需主动调用）
     */
    function initAds();

    /**
     * 异步调用类
     */
    class async {
        /**
         * 登录接口 (wx,op,vv,tt)
         * wx,op,vv
         * then 成功信息
         * catch 失败信息
         */
        static login(params?: any): Promise<any>;
        /**
         * 获取登录参数 (wx,op,vv,qq,tt)
         * wx,op,vv,qq
         * then 登录信息
         */
        static getLoginParams(params?: any): Promise<any>;
        /**
         * 网络请求 (wx,op,vv,tt)
         * wx,op,vv,tt
         * url string URL地址
         * data any 参数信息
         * method string 请求方法（POST、GET等）
         */
        static request(params?: any): Promise<any>;
        /**
         * 播放视频广告 (wx,op,vv,qq,tt)
         * wx,op,vv,qq,tt
         * then 播放关闭，返回bool， true为完成播放，false为中断播放
         * catch 播放失败， 返回错误信息
         */
        static playVideo(params?: any): Promise<any>;
        /**
         * 写入云存储 (wx)
         * wx
         * kvPair any 存储键值对
         */
        static setCloudStorage(params?: any): Promise<any>;
        /**
         * 读取云存储 (wx)
         * wx
         * keyList string[] 键列表
         */
        static getCloudStorage(params?: any): Promise<any>;
        /**
         * 创建用户信息权限 (wx)
         * wx
         * rect { 弹出窗口尺寸
         *  x number X偏移百分比
         *  y number Y偏移百分比
         *  width number 宽度百分比
         *  height number 高度百分比
         * }
         */
        static userInfoCreate(params?: any): Promise<any>;
        /**
         * 导出跳转 (wx)
         * wx
         * appInfo { 导出信息
         *  appid string 导出ID
         *  link_path string 链接路径
         *  extraData any 额外数据
         * }
         */
        static navigateToOther(params?: any): Promise<any>;
        /**
         * 加载分包 (wx,op,vv,qq,tt)
         * wx,op,vv,qq,tt
         * pkgName string 分包名称
         * progressHandler? Handler 分包加载进度回调,返回进度number
         */
        static loadSubpackage(params?: any): Promise<any>;
        /**
         * 
         * @param params 
         */
        static openAwemeUserProfile(params?: any): Promise<any>;
        /**
         * 
         * @param params 
         */
        static checkFollowAwemeSta(params?: any): Promise<any>;
        /**
         * 加载原生广告 (op,vv)
         * op,vv
         * then 返回广告数据
         * catch 返回错误信息
         */
        static loadNativeAd(): Promise<any>;
        /**
         * 是否在游戏之前展示 (op)
         * then 确认
         * catch 拒绝
         */
        static isBeforeGameAccount(): Promise<any>;
        /**
         * 获取上报状态 (op)
         * op
         * then 确认
         * catch 拒绝
         */
        static getAdReporteStatus(adUnit): Promise<any>;
        /**
         * 显示原生更多好玩 (op)
         * op
         * then 确认
         * catch 拒绝
         */
        static showGamePortalAd(): Promise<any>;
        /**
         * 判断是否有桌面图标 (op,vv)
         * op,vv
         * then boolean 结果 true 有 false 无
         * catch 错误
         */
        static hasDesktopIcon(): Promise<any>;
        /**
         * 创建桌面图标 (op,vv)
         * op,vv
         * then 创建成功
         * catch 创建失败
         */
        static createDesktopIcon(): Promise<any>;
        /**
         * 获取网络类型 (vv)
         * then 成功
         */
        static getNetworkType(): Promise<any>;
        /**
         * 弹出头条小游戏盒子界面 (tt)
         */
        static showMoreGamesModalSimple(): Promise<any>;
        /**
         * 分享录屏 (tt)
         */
        static shareRecorderVideo(): Promise<any>;
    }

    /**
     * 同步调用类
     */
    class sync {
        /**
         * 分享接口 (wx)
         * wx 
         * title string 标题
         * imgUrl string 图片URL
         */
        static share(params?: any): any;
        /**
         * 隐藏用户信息窗口 (wx)
         */
        static userInfoHide(params?: any): any;
        /**
         * 显示用户信息窗口 (wx)
         */
        static userInfoShow(params?: any): any;
        /**
         * 销毁用户信息窗口 (wx)
         */
        static userInfoDestroy(params?: any): any;
        /**
         * 初始化视频广告 (wx,op,qq,tt)
         * wx,op,qq,tt
         * id string 广告ID
         */
        static initVideo(params?: any): any;
        /**
         * 视频广告是否已开启 (wx,op,qq,tt)
         * 返回 bool
         */
        static isVideoEnable(params?: any): any;
        /**
         * 初始化插屏广告 (wx,vv,tt)
         * wx,tt
         * id string 广告ID
         * vv
         * insertAdUnitId string 广告ID
         */
        static initInsert(params?: any): any;
        /**
         * 加载插屏广告 (wx,vv,tt)
         * wx,tt
         * closeHandler Handler 关闭事件
         * errorHandler Handler 错误事件
         * vv
         * loadFunc Handler 加载事件
         * errFunc  Handler 错误事件
         */
        static loadInsert(params?: any): any;
        /**
         * 创建横幅广告 (op)
         * op
         * id string 广告ID
         * onError Handler 错误事件
         */
        static createBanner(params?: any): any;
        /**
        * 是否已存在banner
        * @param params 
        */
        static hasBanner(params?: any): any;
        /**
         * 初始化横幅广告 (wx,op,vv,qq,tt)
         */
        static initBanner(params?: any): any;
        /**
         * 检查横幅广告 (wx,op,vv,qq)
         * wx,op,vv,qq
         * data any 广告配置，参照productCfg banner配置格式
         */
        static checkBanner(params?: any): any;
        /**
         * 清理延迟展示横幅广告 (wx,qq)
         */
        static clearDelayBanner(params?: any): any;
        /**
         * 显示横幅广告 (wx,op,vv,qq,tt)
         * wx
         * left? number 左部偏移,默认0
         * bottom? number 底部偏移，默认0
         * length? number 长度，默认1
         * op
         * onError Handler 错误事件
         * qq
         * position? { 展示位置
         *  centerX X位置
         *  centerY Y位置
         * }
         */
        static showBanner(params?: any): any;
        /**
         * 更新横幅广告 (wx,qq)
         * wx
         * isWait? boolean 等待展示
         * pos? { 展示位置
         *  left? 左偏移
         *  right? 右偏移
         *  top? 顶偏移
         *  bottom? 底偏移
         *  centerX? X位置
         *  centerY? Y位置
         * }
         * length? number 长度，默认1
         * qq
         * isWait? boolean 等待展示
         * position? { 展示位置
         *  left? 左偏移
         *  right? 右偏移
         *  top? 顶偏移
         *  bottom? 底偏移
         *  centerX? X位置
         *  centerY? Y位置
         * }
         */
        static updateBanner(params?: any): any;
        /**
         * 隐藏横幅广告 (wx,op,vv,qq,tt)
         */
        static hideBanner(params?: any): any;
        /**
         * 开始录像 (wx,tt)
         * tt
         * maxTime number 最长录屏时间
         */
        static recorderStart(params?: any): any;
        /**
         * 停止录像 (wx,tt)
         */
        static recorderStop(params?: any): any;
        /**
         * 暂停录像 (wx,tt)
         */
        static recorderPause(params?: any): any;
        /**
         * 恢复录像 (wx,tt)
         */
        static recorderResume(params?: any): any;
        /**
         * 创建录像 (wx)
         * wx
         * data { 分享录屏参数
         *  percentY? number(0-1) Y轴偏移百分比，默认为 0.7
         *  btnText? string 分享按钮文本，默认为 分享录屏
         *  query? string 分享参数
         *  bgm? string 分享背景音乐
         *  buttonType? string 分享按钮类型，默认为 challenge
         *  titleType? string 分享标题类型，默认为 default.level
         *  score number 分享分数
         *  successHandler? Handler 分享成功事件
         * }
         */
        static recorderCreate(params?: any): any;
        /**
         * 隐藏录像 (wx)
         */
        static recorderHide(params?: any): any;
        /**
         * 是否支持录像 (wx,tt)
         * 返回 bool
         */
        static canShareRecorder(params?: any): any;
        /**
         * 状态栏高度 (wx,op,vv,tt)
         * 返回 number
         */
        static statusBarHeight(params?: any): any;
        /**
         * 屏幕宽度 (wx,op,vv,tt)
         * 返回 number
         * @param params 
         */
        static screenWidth(params?: any): any;
        /**
         * 屏幕高度 (wx,op,vv,tt)
         * 返回 number
         */
        static screenHeight(params?: any): any;
        /**
         * 震动 (wx,op,vv,qq,tt)
         * wx,op,vv,qq
         * isLong? boolean 是否为长震
         */
        static vibrate(params?: any): any;
        /**
         * 网络是否正常 (wx,op,vv,tt)
         * 返回 bool
         */
        static isNetValid(params?: any): any;
        /**
         * 显示单像素banner (tt)
         */
        static showOnePixelBanner(params?: any): any;
        /**
         * 裁剪高光时刻 (tt)
         * tt
         * beforeTime 开始时间
         * laterTime 结束时间
         */
        static recorderClip(params?: any): any;
        /**
         * 分享录像
         */
        static recorderShare(params?: any): any;
        /**
         * 调起关注小程序的引导组件
         */
        static showFavoriteGuide(params?: any): any;
        /**
         * 设置自动分享参数 (wx,qq,tt)
         * wx,qq
         * title string 标题
         * imgUrl string 图片URL
         */
        static setDefaultShare(params?: any): any;
        /**
         * 更新复活类型信息 (op)
         * @param type 复活类型
         */
        static updateReviveTypeInfo(type: string);
        /**
         * 设置原生最后显示的时间 (op)
         * @param time 时间
         */
        static setNativeLastShowTime(time: number);
        /**
        * 初始化原生广告 (op,vv)
        * op
        * id string 广告ID
        * vv
        * adUnitId1 string 广告ID1
        * adUnitId2 string 广告ID2
        */
        static initNativeAd(params?: any): any;
        /**
        * 原生请求显示上报 (op,vv)
        * @param adIcon 广告Icon
        * @param adId 广告ID
        */
        static sendReqAdShowReport(adIcon: string, adId: string | number);
        /**
         * 原生请求点击上报 (op,vv)
         * @param adIcon 广告Icon
         * @param adId 广告ID
         */
        static sendReqAdClickReport(adIcon: string, adId: string | number);
        /**
         * 初始化互推盒子 (op)
         * @param adUnitId 盒子ID
         */
        static initGamePortalAd(adUnitId: string);
        /**
         * 原生平台弹窗 (op)
         * @param title 标题
         * @param duration 时间
         */
        static showToast(title: string, time?: number);
        /**
         * 获取平台登陆信息 (wx)
         * wx
         * 返回 any 登入信息
         */
        static getLaunchOptions(): any;
        /**
         * 获取平台场景值 (wx,qq)
         * wx,qq
         * 返回 string 场景值
         */
        static getScene(): string;
        /**
         * 显示插屏广告 (vv,qq)
         * vv,qq
         * closeFunc Handler 关闭事件回调
         */
        static showInsertAd(params: any): any;
        /**
         * 初始化横幅广告ID (vv)
         * vv
         * bannerAdUnit string 广告Unit
         * bannerAdUnit2 string 广告Unit2
         * bannerLiveTime number 广告存活时间
         */
        static initBannerId(params: any): any;
        /**
        * 初始化分享菜单
        * @param title 标题
        * @param imageUrl 图片地址
        */
        static showShareMenu(title, imageUrl): any;
        /**
        * 打开分享 (qq)
        * @param title 标题
        * @param imageUrl 图片地址
        * @param failedFunc 失败函数
        */
        static openShare(title: string, imageUrl: string, failedFunc: Laya.Handler): any;
        /**
        * 
        * @param params 
        */
        static isVideoEnable(params?: any): any;
        /**
        * 获取订阅消息 (qq)
        * @param typeArr 订阅列表
        */
        static getReadSetting(typeArr: string[]): any;
        /**
        * 播放音效 (qq)
        * @param url 音效路径
        * @param loop 循环模式
        * @param completeHandler 完成事件
        */
        static playSound(url: string, loop: boolean, completeHandler: Laya.Handler): any;
        /**
         * 初始化盒子广告 (qq)
         * id string 盒子ID
         */
        static initAppBox(params?: any): any;
        /**
         * 展示盒子广告 (qq)
         * @params closeFunc 关闭事件 
         * @params errFunc 错误事件
         */
        static showAppBox(closeFunc?: Laya.Handler, errFunc?: Laya.Handler): any;
        /**
         * 初始化积木广告 (qq)
         * @param blockAdUnit ID
         * @param orient 方向 landscape或null 横 vertical 竖
         * @param numShow 展示数量
         * @param pos 适配信息 （laya.stage 坐标 left,right,centerX,top,bottom,centerY)
         * @param loadFunc 加载后的回调
         */
        static checkBlockAd(blockAdUnit: string, orient: string, numShow: number, pos: any, loadFunc: Laya.Handler): any;
        /**
          * 展示格子广告 (qq)
          * position { 位置偏移
          *  left 左偏移
          *  top 顶偏移
          * }
          */
        static showBlockAd(position: any): any;
        /**
          * 隐藏格子广告 (qq)
          */
        static hideBlockAd(params?: any): any;
        /**
         * 销毁插屏广告 (qq)
         * @param params 
         */
        static destroyInsertAd(params?: any): any;
        /**
        * 暂停音效 (qq)
        * url string 音效路径
        */
        static pauseSound(url: string): any;
        /**
         * 获取广告位置 (qq)
         * @params pos {left?,right?,top?,bottom?} 左偏移
         * @params width 宽度
         * @params height 高度
         */
        static getAdPos(pos: any, width: number, height: number): { left: number, top: number };
    }
}

/**
 * 缓存数据
 */
interface CacheData {
    /**
     * 数据
     */
    data: any,
    /**
     * 更新时间
     */
    timestamp: number,
    /**
     * 过期时长
     */
    expire: number
}

/**
 * 导出数据
 */
interface ExporterData {
    /**
     * 导出描述
     */
    app_desc: string,
    /**
     * 图标URL
     */
    app_icon: string,
    /**
     * 图标字符串
     */
    app_icon_str: string,
    /**
     * 导出ID
     */
    app_id: string,
    /**
     * 导出QR码
     */
    app_qrcode: string,
    /**
     * 导出标题
     */
    app_title: string,
    /**
     * 导出类型
     */
    app_type: number,
    /**
     * 游戏appid
     */
    appid: string,
    /**
     * 跳转路径
     */
    link_path: string,
    /**
     * 跳转文本
     */
    link_text: string,
    /**
     * 开放广告
     */
    open_ad: number,
    /**
     * 位置类型
     */
    position_type: number,
    /**
     * 类型
     */
    type: number
}

/**
 * 导出数据清单
 */
interface ExporterDataList {
    /**
     * 个人中心的广告 现已经不用了
     */
    more: ExporterData[],
    /**
     * 首页开始按钮下的广告
     */
    promotion: ExporterData[],
    /**
     * 首页右上的浮动广告
     */
    indexFloat: ExporterData[],
    /**
     * 横幅广告
     */
    banner: ExporterData[],
    /**
     * 首页侧栏
     */
    indexLeft: ExporterData[],
    /**
     * 游戏页浮动广告
     */
    gameFloat: ExporterData[],
    /**
     * 结束页广告
     */
    endPage: ExporterData[],
    /**
     * 首页左侧浮动广告
     */
    indexLeftFloat: ExporterData[],
    /**
     * 返回页广告
     */
    backAd: ExporterData[],
    /**
     * ios跳转列表
     */
    iosLinkAd: ExporterData[]
}

declare module zs.ad {
    class egg extends zs.fgui.base {
        setCloseCallback(callback: Laya.Handler): egg;
        apply(): egg;
    }
}

/**
 * 导出模块
 */
declare module zs.exporter {
    /**
     * 适配类型
     */
    enum AdaptType {
        /**
         * 无适配
         */
        None,
        /**
         * 横向适配
         */
        Horizontal,
        /**
         * 纵向适配
         */
        Vertical
    }
    /**
     * 导出工具类
     */
    class utils {
        static navigateErrorHandler: Laya.Handler;
        static checkScroll(x: number, y: number, distance: number): boolean;
        static navigateToMiniProgram(appInfo: any, forbidA2B?: boolean);
    }
    /**
     * 导出数据
     */
    class dataMgr {
        /**
         * 默认过期时长
         */
        static expireTime: number;
        /**
         * 导出数据缓存关键词
         */
        static readonly exportCache: string;
        /**
         * 缓存
         */
        static get cache(): { [key: string]: CacheData };
        /**
         * 设置缓存
         * @param key 关键词
         * @param data 数据
         * @param expire （可选）过期时长
         */
        static setCache(key: string, data: any, expire?: number);
        /**
         * 获取缓存
         * @param key 关键词
         */
        static getCache(key: string): any;
        /**
         * 获取导出数据
         */
        static load(): Promise<ExporterDataList>;
        /**
         * 导出统计
         * @param appid 导出appid
         */
        static collectExport(appid: string);
    }
    /**
     * 导出列表管理
     */
    class list extends zs.fgui.base {
        /**
         * 顶对齐
         */
        static readonly AlignTop;
        /**
         * 底对齐
         */
        static readonly AlignBottom;
        /**
         * 上下居中
         */
        static readonly AlignMiddle;
        /**
         * 左对齐
         */
        static readonly AlignLeft;
        /**
         * 右对齐
         */
        static readonly AlignRight;
        /**
         * 左右居中
         */
        static readonly AlignCenter;
        /**
         * 左摇晃动效
         */
        static readonly transitionShakeLeft;
        /**
         * 右摇晃动效
         */
        static readonly transitionShakeRight;

        /**
         * 设置横向列表导出
         * @param type 部件类型
         * @param height 高度
         * @param max 最大部件数
         * @param autoApply （可选）自动应用
         */
        setHorizontalList(type: typeof zs.ui.FGUI_item, height: number, max: number, autoApply?: boolean): list;
        /**
         * 设置纵向列表导出
         * @param type 部件类型
         * @param width 宽度
         * @param max 最大部件数
         * @param autoApply （可选）自动应用
         */
        setVerticalList(type: typeof zs.ui.FGUI_item, width: number, max: number, autoApply?: boolean): list;
        /**
         * 设置侧栏导出
         * @param type 部件类型
         * @param width 宽度
         * @param max 最大部件数
         * @param autoApply （可选）自动应用
         */
        setSideList(type: typeof zs.ui.FGUI_item, width: number, max: number, autoApply?: boolean): list;
        /**
         * 设置横向网格
         * @param type 部件类型
         * @param width 宽度
         * @param height 高度
         * @param lineLimit 行数限制
         * @param max 最大部件数
         * @param autoApply （可选）自动应用
         */
        setHorizontalGrid(type: typeof zs.ui.FGUI_item, width: number, height: number, lineLimit: number, max: number, autoApply?: boolean): list;
        /**
         * 设置纵向网格
         * @param type 部件类型
         * @param width 宽度
         * @param height 高度
         * @param columnLimit 列数限制
         * @param max 最大部件数
         * @param autoApply （可选）自动应用
         */
        setVerticalGrid(type: typeof zs.ui.FGUI_item, width: number, height: number, columnLimit: number, max: number, autoApply?: boolean): list;
        /**
         * 适配缩放
         */
        get adaptScale(): boolean;
        /**
         * 自动适应尺寸
         */
        get listFit(): boolean;
        /**
         * 保持比例
         */
        get keepRatio(): AdaptType;
        /**
         * 对齐模式
         */
        get align(): zs.fgui.AlignType;
        /**
         * 行数
         */
        get lineCount(): number;
        /**
         * 行距
         */
        get lineGap(): number;
        /**
         * 列数
         */
        get columnCount(): number;
        /**
         * 列距
         */
        get columnGap(): number;
        /**
         * 布局类型
         */
        get layout(): fairygui.ListLayoutType;
        /**
         * 部件宽度
         */
        get cellWidth(): number;
        /**
         * 部件高度
         */
        get cellHeight(): number;
        /**
         * X位置
         */
        get x(): number;
        /**
         * Y位置
         */
        get y(): number;
        /**
         * X缩放
         */
        get scaleX(): number;
        /**
         * Y缩放
         */
        get scaleY(): number;
        /**
         * 网格宽度
         */
        get gridWidth(): number;
        /**
         * 网格高度
         */
        get gridHeight(): number;
        /**
         * 左边距
         */
        get marginLeft(): number;
        /**
         * 右边距
         */
        get marginRight(): number;
        /**
         * 上边距
         */
        get marginTop(): number;
        /**
         * 下边距
         */
        get marginBottom(): number;
        /**
         * 边距
         */
        get margin(): fairygui.Margin;
        /**
         * 背景URL
         */
        get background(): string;
        /**
         * 部件URL
         */
        get itemURL(): string;
        /**
         * 数据列表
         */
        get datas(): ExporterData[];
        /**
         * 最大部件数量
         */
        get maxItems(): number;
        /**
         * 滚动类型
         */
        get scrollType(): fairygui.ScrollType;
        /**
         * 自动滚动速度
         */
        get autoScrollSpeed(): number;
        /**
         * 拖拽恢复时间
         */
        get dragRecoverTime(): number;
        /**
         * 动效
         */
        get transition(): string;
        /**
         * 适配缩放
         * @param value 是否开启
         */
        setAdaptScale(value: boolean): list;
        /**
         * 自动适应尺寸
         * @param value 是否开启
         */
        setListFit(value: boolean): list;
        /**
         * 保持比例
         * @param value 是否开启
         */
        setKeepRatio(value: AdaptType): list;
        /**
         * 对齐模式
         * @param type 模式
         */
        setAlign(type: zs.fgui.AlignType): list;
        /**
         * 行数
         * @param count 行数
         */
        setLineCount(count: number): list;
        /**
         * 行距
         * @param gap 行距
         */
        setLineGap(gap: number): list;
        /**
         * 列数
         * @param count 列数
         */
        setColumnCount(count: number): list;
        /**
         * 列距
         * @param gap 列距
         */
        setColumnGap(gap: number): list;
        /**
         * 布局类型
         * @param type 类型
         */
        setLayout(type: fairygui.ListLayoutType): list;
        /**
         * 部件宽度
         * @param width 宽度
         */
        setCellWidth(width: number): list;
        /**
         * 部件高度
         * @param height 高度
         */
        setCellHeight(height: number): list;
        /**
         * 部件尺寸
         * @param width 宽度
         * @param height 高度
         */
        setCellSize(width: number, height: number): list;
        /**
         * X位置
         * @param x X位置
         */
        setX(x: number): list;
        /**
         * Y位置
         * @param y Y位置
         */
        setY(y: number): list;
        /**
         * XY位置
         * @param x X位置
         * @param y Y位置
         */
        setXY(x: number, y: number): list;
        /**
         * X缩放
         * @param x X缩放
         */
        setScaleX(x: number): list;
        /**
         * Y缩放
         * @param y Y缩放
         */
        setScaleY(y: number): list;
        /**
         * XY缩放
         * @param x X缩放
         * @param y Y缩放
         */
        setScaleXY(x: number, y: number): list;
        /**
         * 网格宽度
         * @param width 宽度
         */
        setGridWidth(width: number): list;
        /**
         * 适配宽度
         */
        snapWidth(): list;
        /**
         * 网格高度
         * @param height 高度
         */
        setGridHeight(height: number): list;
        /**
         * 适配宽度
         */
        snapHeight(): list;
        /**
         * 网格尺寸
         * @param width 宽度
         * @param height 高度
         */
        setGridSize(width: number, height: number): list;
        /**
         * 左边距
         * @param left 左边距
         */
        setMarginLeft(left: number): list;
        /**
         * 右边距
         * @param right 右边距
         */
        setMarginRight(right: number): list;
        /**
         * 上边距
         * @param top 上边距
         */
        setMarginTop(top: number): list;
        /**
         * 下边距
         * @param bottom 下边距
         */
        setMarginBottom(bottom: number): list;
        /**
         * 边距
         * @param left 左边距
         * @param right 右边距
         * @param top 顶边距
         * @param bottom 底边距 
         */
        setMargin(left: number, right: number, top: number, bottom: number): list;
        /**
         * 背景URL
         * @param url 图片URL
         */
        setBackground(url: string | string[]): list;
        /**
         * 部件URL
         * @param type 部件类型
         */
        setItem(type: typeof zs.ui.FGUI_item): list;
        /**
         * 数据列表
         * @param datas 数据表
         */
        setDatas(datas: ExporterData[]): list;
        /**
         * 最大部件数量
         * @param value 最大数
         */
        setMaxItems(value: number): list;
        /**
         * 滚动类型
         * @param type 滚动类型
         */
        setScrollType(type: fairygui.ScrollType): list;
        /**
         * 自动滚动速度
         * @param value 滚动速度
         */
        setAutoScrollSpeed(value: number): list;
        /**
         * 拖拽恢复时间
         * @param value 恢复时间
         */
        setDragRecoverTime(value: number): list;
        /**
         * 动效
         * @param transition 动效名称
         */
        setTransition(transition: string): list;
        /**
         * 设置自定义部件处理
         * @param handler 处理事件（(item, data) => {...}，data可能为null）
         */
        setDataHandler(handler: Laya.Handler): list;
        /**
         * 设置点击事件
         * @param handler 点击事件
         */
        setClickHandler(handler: Laya.Handler): list;
        /**
         * 适配尺寸
         */
        fit(): list;
        /**
         * 列表循环
         */
        loop(): list;
        /**
         * 虚拟列表
         */
        virtual(): list;
        /**
         * 拖动弹性
         * @param value 是否开启
         */
        bounce(value: boolean): list;
        /**
         * 设置抖动效果时间
         * @param value 时间值(毫秒值)
         */
        setShakeTime(value: number): list;
        /**
         * 应用设置 
         */
        apply(): list;
    }

    /**
     * 导出卡片
     */
    class card extends zs.fgui.base {
        /**
         * 部件URL
         */
        get itemURL(): string;
        /**
         * 自动尺寸
         */
        get autoSize(): boolean;
        /**
         * 宽度
         */
        get width(): number;
        /**
         * 高度
         */
        get height(): number;
        /**
         * 部件类型
         * @param type 
         */
        setItem(type: typeof zs.ui.FGUI_item): card;
        /**
         * 自动尺寸
         * @param value 
         */
        setAutoSize(value: boolean): card;
        /**
         * 宽度
         * @param width 宽度
         * @param keepRatio （可选）保持比例
         */
        setWidth(width: number, keepRatio?: boolean): card;
        /**
         * 高度
         * @param height 高度
         * @param keepRatio （可选）保持比例
         */
        setHeight(height: number, keepRatio?: boolean): card;
        /**
         * 动效
         * @param transition 动效
         * @param stop （可选）自动停止
         */
        setTransition(transition: string, stop?: boolean): card;
        /**
         * 数据
         * @param data 数据
         */
        setData(data: ExporterData): card;
        /**
         * 设置自定义卡片处理
         * @param handler 处理事件（(item, data) => {...}，data可能为空）
         */
        setDataHandler(handler: Laya.Handler): card;
        /**
         * 点击事件
         * @param clickHandler 事件
         */
        setClickHandler(clickHandler: Laya.Handler): card;
    }
    class full extends zs.fgui.base {
        setMistaken(): full;
        setClickContinue(handler: Laya.Handler): full;
        enterJumpExport(): full;
        apply(): full;

        onClickContinue();
    }
}

/**;
 * 日志模块
 */
declare module zs.log {
    /**
     * 日志等级
     */
    enum Level {
        /**
         * 调试
         */
        DEBUG = 0,
        /**
         * 信息
         */
        INFO = 1,
        /**
         * 警告
         */
        WARN = 2,
        /**
         * 错误
         */
        ERROR = 3,
        /**
         * 崩溃
         */
        FATAL = 4
    }

    /**
     * 日志设置
     */
    class Configs {
        /**
         * 输出等级开关
         */
        static logLevel: Level;

        /**
         * 时间开关
         */
        static logTime: boolean;

        /**
         * 时间毫秒开关
         */
        static logMilliseconds: boolean;

        /**
         * FATAL等级异常抛出开关
         */
        static fatalThrow: boolean;

        /**
         * DEBUG等级日志颜色
         */
        static color_Debug: string;

        /**
         * INFO等级日志颜色
         */
        static color_Info: string;

        /**
         * WARN等级日志颜色
         */
        static color_Warn: string;

        /**
         * ERROR等级日志颜色
         */
        static color_Error: string;

        /**
         * FATAL等级日志颜色
         */
        static color_Fatal: string;
    }

    /**
     * 日志输出
     * @param msg 日志消息
     * @param category （可选）日志类别
     * @param level 日志等级
     */
    function log(msg: string, category?: string, level?: Level, data?: any);

    /**
     * DEBUG日志输出
     * @param msg 日志消息
     * @param category （可选）日志类别
     */
    function debug(msg: string, category?: string, data?: any);

    /**
     * INFO日志输出
     * @param msg 日志消息
     * @param category （可选）日志类别
     */
    function info(msg: string, category?: string, data?: any);

    /**
     * WARN日志输出
     * @param msg 日志消息
     * @param category （可选）日志类别
     */
    function warn(msg: string, category?: string, data?: any);

    /**
     * ERROR日志输出
     * @param msg 日志消息
     * @param category （可选）日志类别
     */
    function error(msg: string, category?: string, data?: any);

    /**
     * FATAL日志输出
     * @param msg 日志消息
     * @param category （可选）日志类别
     */
    function fatal(msg: string, category?: string, data?: any);
}