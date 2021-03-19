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
     * 工作流
     */
    class workflow {
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
    title?: string,
    content?: string,
    comfireText?: string,
    cancelText?: string,
    comfireHandler?: Laya.Handler,
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
         * 显示组件
         */
        get view(): fairygui.GComponent;
        constructor(component: fairygui.GComponent);
        /**
         * 构建方法
         */
        static make(): fairygui.GComponent;
        /**
         * 类型
         */
        static type(): typeof fairygui.GComponent;
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
        apply();
        /**
         * 执行配置方法
         */
        applyConfig();
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
         * 设置UI控件
         * @param ctr UI控件 
         */
        setBase(ctr: zs.fgui.base): window;
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
     * 异步调用类
     */
    class async {
        /**
         * 登录接口
         * @param params 
         */
        static login(params?: any): Promise<any>;
        /**
         * 写入云存储
         * @param params 
         */
        static setCloudStorage(params?: any): Promise<any>;
        /**
         * 读取云存储
         * @param params 
         */
        static getCloudStorage(params?: any): Promise<any>;
        /**
         * 创建用户信息权限
         * @param params 
         */
        static userInfoCreate(params?: any): Promise<any>;
        /**
         * 加载分包
         * @param params 
         */
        static loadSubpackage(params?: any): Promise<any>;
        /**
         * 显示模态
         * @param params 
         */
        static showModel(params?: any): Promise<any>;
        /**
         * 获取用户信息
         * @param params 
         */
        static getUserInfo(params?: any): Promise<any>;
        /**
         * 验证接口
         * @param params 
         */
        static authorize(params?: any): Promise<any>;
        /**
         * 
         * @param params 
         */
        static addShortcut(params?: any): Promise<any>;
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
         * 导出跳转
         * @param params 
         */
        static navigateToOther(params?: any): any;
        /**
         * 播放视频广告
         * @param params 
         */
        static playVideo(params?: any): any;
        /**
         * oppo 加载原生
         */
        static loadNativeAd(): Promise<any>;
        /**
         * oppo 是否在游戏之前展示
         */
        static isBeforeGameAccount(): Promise<any>;
        /**
         * oppo 获取上报状态
         */
        static getAdReporteStatus(adUnit): Promise<any>;
        /**
         * oppo 显示原生更多好玩
         */
        static showGamePortalAd(): Promise<any>;
        /**
         * 判断是否有桌面图标
         */
        static hasDesktopIcon(): Promise<any>;
        /**
         * 创建桌面图标
         */
        static createDesktopIcon(): Promise<any>;
    }

    /**
     * 同步调用类
     */
    class sync {
        /**
         * 分享接口
         * @param params 
         */
        static share(params?: any): any;
        /**
         * 隐藏用户信息窗口
         * @param params 
         */
        static userInfoHide(params?: any): any;
        /**
         * 显示用户信息窗口
         * @param params 
         */
        static userInfoShow(params?: any): any;
        /**
         * 销毁用户信息窗口
         * @param params 
         */
        static userInfoDestroy(params?: any): any;
        /**
         * 初始化视频广告
         * @param params 
         */
        static initVideo(params?: any): any;
        /**
         * 视频广告是否已开启
         * @param params 
         */
        static isVideoEnable(params?: any): any;
        /**
         * 初始化插屏广告
         * @param params 
         */
        static initInsert(params?: any): any;
        /**
         * 加载插屏广告
         * @param params 
         */
        static loadInsert(params?: any): any;
        /**
         * 创建横幅广告
         * @param params 
         */
        static createBanner(params?: any): any;
        /**
         * 初始化横幅广告
         * @param params 
         */
        static initBanner(params?: any): any;
        /**
         * 显示横幅广告
         * @param params 
         */
        static showBanner(params?: any): any;
        /**
         * 隐藏横幅广告
         * @param params 
         */
        static hideBanner(params?: any): any;
        /**
         * 开始录像
         * @param params 
         */
        static recorderStart(params?: any): any;
        /**
         * 停止录像
         * @param params 
         */
        static recorderStop(params?: any): any;
        /**
         * 暂停录像
         * @param params 
         */
        static recorderPause(params?: any): any;
        /**
         * 恢复录像
         * @param params 
         */
        static recorderResume(params?: any): any;
        /**
         * 创建录像
         * @param params 
         */
        static recorderCreate(params?: any): any;
        /**
         * 隐藏录像
         * @param params 
         */
        static recorderHide(params?: any): any;
        /**
         * 是否支持录像
         * @param params 
         */
        static canShareRecorder(params?: any): any;
        /**
         * 状态栏高度
         * @param params 
         */
        static statusBarHeight(params?: any): any;
        /**
         * 屏幕宽度
         * @param params 
         */
        static screenWidth(params?: any): any;
        /**
         * 屏幕高度
         * @param params 
         */
        static screenHeight(params?: any): any;
        /**
         * 震动
         * @param params 
         */
        static vibrate(params?: any): any;
        /**
         * 网络是否正常
         * @param params 
         */
        static isNetValid(params?: any): any;
        /**
         * 添加显示事件
         * @param params 
         */
        static addEventShow(params?: any): any;
        /**
         * 添加隐藏事件
         * @param params 
         */
        static addEventHide(params?: any): any;
        /**
         * 录像片段
         * @param params 
         */
        static recorderClip(params?: any): any;
        /**
         * 分享录像
         * @param params 
         */
        static recorderShare(params?: any): any;
        /**
         * 
         * @param params 
         */
        static showFavoriteGuide(params?: any): any;
        /**
         * 
         * @param params 
         */
        static setDefaultShare(params?: any): any;
        /**
         * 
         * @param type 
         */
        static updateReviveTypeInfo(type);
        /**
         * 设置原生最后显示的时间
         * @param time 
         */
        static setNativeLastShowTime(time: Number);
        /**
        * oppo 初始化原生
        */
        static initNativeAd({ id: any });
        /**
        * oppo 原生请求显示上报
        * @param adIcon 
        * @param adId 
        */
        static sendReqAdShowReport(adIcon, adId);
        /**
         * oppo 原生请求点击上报
         * @param adIcon 
         * @param adId 
         */
        static sendReqAdClickReport(adIcon, adId);
        /**
         * 原生平台弹窗
         * @param val 
         * @param time 
         */
        static showToast(val, time?);
        /**
         * oppo 设置一分钟内展不展示广告
         * @param val 
         */
        static setIsInOneMin(val);
        /**
         * oppo 获取一分钟之内展示不展示广告
         * @returns bool = true 不展示广告 false 正常展示广告
         */
        static getIsInOneMin(): boolean;
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