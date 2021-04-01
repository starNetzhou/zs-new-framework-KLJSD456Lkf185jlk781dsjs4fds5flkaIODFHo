window.zs = window.zs || {};

(function (exports) {
    'use strict';

    function showMsgBox(params) {
        zs.fgui.msgbox.show(params);
    }

    function hideMsgBox(isClear) {
        if (isClear) { zs.fgui.msgbox.clear(); }
        zs.fgui.msgbox.hide();
    }

    class workflow {
        get exportWindow() {
            if (this._exportWindow == null) {
                this._exportWindow = zs.fgui.window
                    .create()
                    .show();
            }
            return this._exportWindow;
        }
        get fsmList() {
            if (this._fsmList == null) {
                this._fsmList = {};
            }
            return this._fsmList;
        }
        get state() {
            if (this.fsm) {
                return this.fsm.current;
            }
            return null;
        }
        get childState() {
            if (this.fsm && this.fsmList[this.fsm.current]) {
                return this.fsmList[this.fsm.current].current;
            }

            return null;
        }
        constructor() {
            this.switchExporter = "zs_jump_switch";
            this.exporterPack = null;
        }
        registe() { }
        start() {
            if (this.fsm) {
                this.fsm.onBeforeChange = Laya.Handler.create(this, this.onBeforeChange, null, false);
                this.fsm.onChanged = Laya.Handler.create(this, this.onChanged, null, false);
            }
            zs.fgui.configs.registeBase(workflow.exporterList, zs.exporter.list);
            zs.fgui.configs.registeBase(workflow.exporterCard, zs.exporter.card);
            core.addAppShow(Laya.Handler.create(this, zs.platform.sync.clearDelayBanner, null, false));
            this.fsm.init();
        }
        setFSM(key, fsm) {
            this.fsmList[key] = fsm;
        }
        on(key, handler, isBefore) {
            if (key == null || key.length <= 0 || handler == null) { return; }
            if (isBefore) {
                if (this.preListeners == null) {
                    this.preListeners = {};
                }
                if (this.preListeners[key] == null) {
                    this.preListeners[key] = [];
                }
                let listener = this.preListeners[key];
                for (let i = 0, n = listener.length; i < n; i++) {
                    if (listener[i]._id == handler._id) { return; }
                }
                this.preListeners[key].push(handler);
            } else {
                if (this.listeners == null) {
                    this.listeners = {};
                }
                if (this.listeners[key] == null) {
                    this.listeners[key] = [];
                }
                let listener = this.listeners[key];
                for (let i = 0, n = listener.length; i < n; i++) {
                    if (listener[i]._id == handler._id) { return; }
                }
                this.listeners[key].push(handler);
            }
        }
        off(key, handler, isBefore) {
            if (key == null || key.length <= 0 || handler == null) { return; }
            if (isBefore) {
                if (this.preListeners == null) { return; }
                if (this.preListeners[key] == null) { return; }
                let listener = this.preListeners[key];
                for (let i = 0, n = listener.length; i < n; i++) {
                    if (listener[i]._id == handler._id) {
                        listener.splice(i, 1);
                        return;
                    }
                }
            } else {
                if (this.listeners == null) { return; }
                if (this.listeners[key] == null) { return; }
                let listener = this.listeners[key];
                for (let i = 0, n = listener.length; i < n; i++) {
                    if (listener[i]._id == handler._id) {
                        listener.splice(i, 1);
                        return;
                    }
                }
            }
        }
        offAll(key, isBefore) {
            if (key == null || key.length <= 0) { return; }
            if (isBefore) {
                if (this.preListeners == null) { return; }
                if (this.preListeners[key] == null) { return; }
                delete this.preListeners[key];
            } else {
                if (this.listeners == null) { return; }
                if (this.listeners[key] == null) { return; }
                delete this.listeners[key];
            }
        }
        next(target) {
            if (this.fsm == null) { return; }
            if (target) {
                this.fsm.runTransition(target);
            } else {
                this.fsm.runNext();
            }
        }
        childNext(target) {
            if (this.fsm == null) { return; }
            let childFSM = this.fsmList[this.fsm.current];
            if (childFSM) {
                if (target) {
                    childFSM.runTransition(target);
                } else {
                    childFSM.runNext();
                }
            }
        }
        onBeforeChange(target, current) {
            if (this.preListeners != null && this.preListeners[target] != null) {
                let list = this.preListeners[target];
                for (let i = 0, n = list.length; i < n; i++) {
                    let once = list[i].once;
                    list[i].run();
                    if (once) {
                        list.splice(i, 1);
                        i--;
                        n--;
                    }
                }
            }
            this.exportWindow.clear();
            // banner销毁
            zs.platform.sync.hideBanner();
            zs.platform.sync.clearDelayBanner();
        }
        onChanged(current) {
            zs.td.justTrack(zs.td.workflowKey + current, zs.td.workflowDesc + current);
            if (this.listeners != null && this.listeners[current] != null) {
                let list = this.listeners[current];
                for (let i = 0, n = list.length; i < n; i++) {
                    let once = list[i].once;
                    list[i].run();
                    if (once) {
                        list.splice(i, 1);
                        i--;
                        n--;
                    }
                }
            }
            let childFSM = this.fsmList[current];
            if (childFSM) {
                childFSM.onBeforeChange = Laya.Handler.create(this, this.onChildFSMBeforeChanged, null, false);
                childFSM.onChanged = Laya.Handler.create(this, this.onChildFSMChanged, null, false);
                childFSM.init();
                let productData = zs.configs.productCfg[current];
                if (productData) {
                    zs.log.warn(current + " 状态存在子状态机，无法自动创建应用运营配置，请使用子状态进行配置!", "Workflow", childFSM.list);
                }
            } else {
                this.checkBase(current);
                zs.product.get(this.switchExporter) && this.checkExporter(current);
                this.checkBanner(current);
            }
        }
        onChildFSMBeforeChanged(target, current) {
            if (this.fsm == null) { return; }
            let childKey = this.fsm.current + '.' + target;
            if (this.preListeners != null && this.preListeners[childKey] != null) {
                let list = this.preListeners[childKey];
                for (let i = 0, n = list.length; i < n; i++) {
                    let once = list[i].once;
                    list[i].run();
                    if (once) {
                        list.splice(i, 1);
                        i--;
                        n--;
                    }
                }
            }
            this.exportWindow.clear();
            // banner销毁
            zs.platform.sync.hideBanner();
            zs.platform.sync.clearDelayBanner();
        }
        onChildFSMChanged(current) {
            if (this.fsm == null) { return; }
            let childKey = this.fsm.current + '.' + current;
            zs.td.justTrack(zs.td.workflowKey + childKey, zs.td.workflowDesc + childKey);
            if (this.listeners != null && this.listeners[childKey] != null) {
                let list = this.listeners[childKey];
                for (let i = 0, n = list.length; i < n; i++) {
                    let once = list[i].once;
                    list[i].run();
                    if (once) {
                        list.splice(i, 1);
                        i--;
                        n--;
                    }
                }
            }
            this.checkBase(childKey);
            zs.product.get(this.switchExporter) && this.checkExporter(childKey);
            this.checkBanner(childKey);
        }
        checkBanner(current) {
            let data = zs.configs.productCfg[current];
            if (this.bannerIgnoreList && this.bannerIgnoreList.indexOf(current) >= 0) {
                if (data && data.banner) {
                    zs.log.warn("状态 " + current + " 在横幅广告忽略列表中，无法自动生成，请自主管理横幅广告展示或将该状态移出忽略列表", "Workflow");
                }
                return;
            }
            data && (zs.platform.sync.checkBanner({ data: data }));
        }
        checkExporter(current) {
            let data = zs.configs.productCfg[current];
            if (this.exporterIgnoreList && this.exporterIgnoreList.indexOf(current) >= 0) {
                if (data && data.exporter && data.exporter.length > 0) {
                    zs.log.warn("状态 " + current + " 在导出忽略列表中，无法自动生成，请自主管理导出展示或将该状态移出忽略列表", "Workflow");
                }
                return;
            }
            if (data && data.exporter && data.exporter.length > 0) {
                for (let i = 0, n = data.exporter.length; i < n; i++) {
                    let config = data.exporter[i];
                    if (config.switch) {
                        if (Array.isArray(config.switch)) {
                            let skip = false;
                            for (let i = 0, n = config.switch.length; i < n; i++) {
                                if (!zs.product.get(config.switch[i])) {
                                    skip = true;
                                    break;
                                }
                            }
                            if (skip) { continue; }
                        } else if (!zs.product.get(config.switch)) {
                            continue;
                        }
                    }
                    this.exportWindow
                        .applyConfig(config)
                        .front();
                }
            }
        }
        checkBase(current) {
            let data = zs.configs.productCfg[current];
            if (data && data.base && data.base.length > 0) {
                for (let i = 0, n = data.base.length; i < n; i++) {
                    let config = data.base[i];
                    if (config.switch) {
                        if (Array.isArray(config.switch)) {
                            let skip = false;
                            for (let i = 0, n = config.switch.length; i < n; i++) {
                                if (!zs.product.get(config.switch[i])) {
                                    skip = true;
                                    break;
                                }
                            }
                            if (skip) { continue; }
                        } else if (!zs.product.get(config.switch)) {
                            continue;
                        }
                    }
                    this.exportWindow
                        .applyConfig(config)
                        .front();
                }
            }
        }
    }
    workflow.exporterList = "export_list";
    workflow.exporterCard = "export_card";

    class core {
        static async init(productDef) {
            zs.platform.init();
            zs.platform.sync.addEventShow({
                showHandler: (result) => {
                    core.onAppShow(result);
                }
            });
            zs.platform.sync.addEventHide({
                hideHandler: (result) => {
                    core.onAppHide(result);
                }
            });
            await zs.configs.init();
            zs.td.appKey = this.tdKey;
            zs.td.appName = this.appName;
            zs.td.appId = this.appId;
            zs.configs.gameCfg.tdVersion && (zs.td.versionName = zs.configs.gameCfg.tdVersion);
            zs.td.init();
            zs.td.justTrack(zs.td.startupKey, zs.td.startupDesc);
            zs.resource.init();
            if (zs.configs.gameCfg.debug) {
                zs.log.Configs.logLevel = zs.log.Level.DEBUG;
            }
            this.onConfigInit && this.onConfigInit.run();
            zs.product.init(productDef);
            this._readyStart = false;
            zs.fgui.init();
            let entry = this.entry ? this.entry : zs.base.entry;
            if (this.loadingPage) {
                await this.loadingPage.preload();
                this.entryInst = entry.init(this.loadingPage, this, this.ready);
            } else if (this.layaLoadingPage) {
                await this.layaLoadingPage.preload();
                this.entryInst = entry.init(this.layaLoadingPage, this, this.ready);
            } else {
                this.entryInst = entry.init(zs.ui.Loading, this, this.ready);
            }
            if (zs.platform.config.platformMark == 'wx_' && typeof wx !== 'undefined') {
                loadLib("zsLibs/adapter/ald-game.js");
                loadLib("zsLibs/adapter/h.js");
            }
        }
        static get appName() {
            return zs.configs.gameCfg ? zs.configs.gameCfg.appName : null;
        }
        static get appId() {
            return zs.configs.gameCfg ? zs.configs.gameCfg.appId : null;
        }
        static get tdKey() {
            return zs.configs.gameCfg ? zs.configs.gameCfg.tdKey : null;
        }
        static get aldKey() {
            return zs.configs.gameCfg ? zs.configs.gameCfg.aldKey : null;
        }
        static get readyStart() {
            return this.entryInst && this.entryInst.progress >= 100 && this._readyStart;
        }
        static async ready() {
            zs.log.debug("初始化数据统计", 'Core');
            await zs.td.registeConfig(zs.configs.gameCfg.tdConfig);
            this.progress = 15;
            zs.log.debug("初始化广告与导出组件", 'Core');
            let basicExportPack = await zs.fgui.loadPack(zs.fgui.configs.pack_basic_exporter);
            zs.ui.FGUI_msgbox.bind(basicExportPack);
            zs.ui.FGUI_list.bind(basicExportPack);
            zs.ui.FGUI_card.bind(basicExportPack);
            this.progress = 20;
            zs.log.debug("加载必要分包", 'Core');
            await zs.resource.preload();
            this.progress = 30;
            zs.log.debug("加载 main", 'Core');
            await zs.fgui.loadPacks(zs.configs.gameCfg.fguiPacks, true);
            this.onFGUIBind && this.onFGUIBind.run();
            this.progress = 40;
            zs.log.debug("加载基础配置", 'Core');
            if (zs.configs.gameCfg && zs.configs.gameCfg.resources && zs.configs.gameCfg.resources.configs) {
                let cfgs = zs.configs.gameCfg.resources.configs;
                for (let key in cfgs) {
                    let cfg = cfgs[key];
                    if (cfg && cfg.length > 0) {
                        await zs.configs.load(key, cfg[0], cfg.length > 1 ? cfg[1] : null, cfg.length > 2 ? cfg[2] : true);
                    }
                }
            }
            this.progress = 50;
            zs.log.debug("加载基础资产", 'Core');
            if (zs.configs.gameCfg && zs.configs.gameCfg.resources && zs.configs.gameCfg.resources.prefabs) {
                let cfgs = zs.configs.gameCfg.resources.prefabs;
                for (let key in cfgs) {
                    let cfg = cfgs[key];
                    if (cfg && cfg.length > 0) {
                        await zs.prefabs.load(key, cfg[0], cfg.length > 1 ? cfg[1] : null, cfg.length > 2 ? cfg[2] : true);
                    }
                }
            }
            this.progress = 60;
            zs.log.debug("web 设置", 'Core');
            core.userInfo = await zs.network.init();
            core.userId = core.userInfo.user_id;
            this.progress = 70;
            zs.log.debug("运营设置", 'Core');
            let switchs = await zs.network.config(true);
            zs.product.sync(switchs);
            this.progress = 80;
            zs.log.debug("广告组件初始化", 'Core');
            zs.platform.initAds();
            this.progress = 85;

            zs.log.debug("业务流程拼装", 'Core');
            this.progress = 95;
            if (this.workflow == null) {
                this.workflow = new zs.base.workflow();
            }
            if (this.workflow.exporterPack) {
                await zs.fgui.loadPack(this.workflow.exporterPack);
            }
            this.workflow.registe();

            if (this.workListeners) {
                for (let i = 0, n = this.workListeners.length; i < n; i++) {
                    let workListener = this.workListeners[i];
                    this.workflow.on(workListener.key, workListener.handler, workListener.isBefore);
                }
                this.workListeners = null;
            }

            if (this.onPrepare) {
                this.onPrepare.run();
            } else {
                this.readyFinish();
            }
        }
        static readyFinish() {
            this.progress = 100;
            this._readyStart = true;
        }
        static start() {
            zs.log.debug("启动业务", 'Core');
            if (this.readyStart) {
                this.workflow.start();
                this.onStart && this.onStart.run();
                zs.td.justTrack(zs.td.gameStartKey, zs.td.gameStartDesc, { uid: core.userId });
            }
        }
        static onWorkflow(key, handler, isBefore) {
            if (key == null || key.length <= 0 || handler == null) { return; }
            if (this.workListeners == null) {
                this.workListeners = [];
            }
            handler.once = false;
            this.workListeners.push({
                key: key,
                handler: handler,
                isBefore: isBefore
            });
        }
        static onceWorkflow(key, handler, isBefore) {
            if (key == null || key.length <= 0 || handler == null) { return; }
            if (this.workListeners == null) {
                this.workListeners = [];
            }
            handler.once = true;
            this.workListeners.push({
                key: key,
                handler: handler,
                isBefore: isBefore
            });
        }
        static onAppShow(result) {
            if (this.appShowListeners == null || this.appShowListeners.length <= 0) { return; }
            for (let i = 0, n = this.appShowListeners.length; i < n; i++) {
                let listener = this.appShowListeners[i];
                listener && (listener.runWith(result));
                if (!listener || listener.once) {
                    this.appShowListeners.splice(i, 1);
                    i--;
                    n--;
                }
            }
        }
        static onAppHide(result) {
            if (this.appHideListeners == null || this.appHideListeners.length <= 0) { return; }
            for (let i = 0, n = this.appHideListeners.length; i < n; i++) {
                let listener = this.appHideListeners[i];
                listener && (listener.runWith(result));
                if (!listener || listener.once) {
                    this.appHideListeners.splice(i, 1);
                    i--;
                    n--;
                }
            }
        }
        static addAppShow(handler) {
            if (handler == null) { return; }
            if (this.appShowListeners == null) {
                this.appShowListeners = [];
            }
            this.appShowListeners.push(handler);
        }
        static removeAppShow(handler) {
            if (handler == null || this.appShowListeners == null || this.appShowListeners.length <= 0) { return; }
            let caller = handler.caller;
            let method = handler.method;
            let onceOnly = handler.once;
            for (let i = 0, n = this.appShowListeners.length; i < n; i++) {
                let listener = this.appShowListeners[i];
                if (listener && (!caller || listener.caller === caller) && (method == null || listener.method === method) && (!onceOnly || listener.once)) {
                    this.appShowListeners.splice(i, 1);
                    i--;
                    n--;
                    listener.recover();
                }
            }
        }
        static addAppHide(handler) {
            if (handler == null) { return; }
            if (this.appHideListeners == null) {
                this.appHideListeners = [];
            }
            this.appHideListeners.push(handler);
        }
        static removeAppHide(handler) {
            if (handler == null || this.appHideListeners == null || this.appHideListeners.length <= 0) { return; }
            let caller = handler.caller;
            let method = handler.method;
            let onceOnly = handler.once;
            for (let i = 0, n = this.appHideListeners.length; i < n; i++) {
                let listener = this.appHideListeners[i];
                if (listener && (!caller || listener.caller === caller) && (method == null || listener.method === method) && (!onceOnly || listener.once)) {
                    this.appHideListeners.splice(i, 1);
                    i--;
                    n--;
                    listener.recover();
                }
            }
        }
    }
    core.userInfo = null;
    core.userId = null;
    core.entry = null;
    core.onConfigInit = null;
    core.onFGUIBind = null;
    core.onPrepare = null;
    core.onStart = null;
    core.overrideWorkflow = null;
    core.workflow = null;
    core.loadingPage = null;
    core.layaLoadingPage = null;

    exports.showMsgBox = showMsgBox;
    exports.hideMsgBox = hideMsgBox;
    exports.workflow = workflow;
    exports.core = core;

}(window.zs = window.zs || {}));