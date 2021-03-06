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
            handler.once = false;
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
        once(key, handler, isBefore) {
            this.on(key, handler, isBefore);
            if (handler) { handler.once = true; }
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
        offAllCaller(caller, key, isBefore) {
            if (caller == null) { return; }
            if (key == null || key.length <= 0) {
                if (isBefore) {
                    for (let k in this.preListeners) {
                        let listener = this.preListeners[k];
                        for (let i = 0, n = listener.length; i < n; i++) {
                            if (listener[i].caller == caller) {
                                listener.splice(i, 1);
                                i--;
                                n--;
                            }
                        }
                    }
                } else {
                    for (let k in this.listeners) {
                        let listener = this.listeners[k];
                        for (let i = 0, n = listener.length; i < n; i++) {
                            if (listener[i].caller == caller) {
                                listener.splice(i, 1);
                                i--;
                                n--;
                            }
                        }
                    }
                }
            } else {
                if (isBefore) {
                    let listener = this.preListeners[key];
                    if (listener) {
                        for (let i = 0, n = listener.length; i < n; i++) {
                            if (listener[i].caller == caller) {
                                listener.splice(i, 1);
                                i--;
                                n--;
                            }
                        }
                    }
                } else {
                    let listener = this.listeners[key];
                    if (listener) {
                        for (let i = 0, n = listener.length; i < n; i++) {
                            if (listener[i].caller == caller) {
                                listener.splice(i, 1);
                                i--;
                                n--;
                            }
                        }
                    }
                }
            }
        }
        clear(isBefore) {
            if (isBefore) {
                this.preListeners = null;
            } else {
                this.listeners = null;
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
            // banner??????
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
                    zs.log.info(current + " ????????????????????????????????????????????????????????????????????????????????????????????????!", "Workflow", childFSM.list);
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
            // banner??????
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
                    zs.log.info("?????? " + current + " ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????", "Workflow");
                }
                return;
            }
            data && (zs.platform.sync.checkBanner({ data: data }));
        }
        checkExporter(current) {
            let data = zs.configs.productCfg[current];
            if (this.exporterIgnoreList && this.exporterIgnoreList.indexOf(current) >= 0) {
                if (data && data.exporter && data.exporter.length > 0) {
                    zs.log.info("?????? " + current + " ????????????????????????????????????????????????????????????????????????????????????????????????????????????", "Workflow");
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
            zs.ui.uiScene.init();
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
            zs.log.debug("?????????????????????", 'Core');
            await zs.td.registeConfig(zs.configs.gameCfg.tdConfig);
            this.progress = 15;
            zs.log.debug("??????????????????????????????", 'Core');
            let basicExportPack = await zs.fgui.loadPack(zs.fgui.configs.pack_basic);
            zs.ui.FGUI_msgbox.bind(basicExportPack);
            zs.ui.FGUI_list.bind(basicExportPack);
            zs.ui.FGUI_card.bind(basicExportPack);
            this.progress = 20;
            zs.log.debug("??????????????????", 'Core');
            await zs.resource.preload();
            this.progress = 30;
            zs.log.debug("?????? main", 'Core');
            await zs.fgui.loadPacks(zs.configs.gameCfg.fguiPacks, true);
            this.onFGUIBind && this.onFGUIBind.run();
            this.progress = 40;
            zs.log.debug("web ??????", 'Core');
            core.userInfo = await zs.network.init();
            core.userId = core.userInfo.user_id;
            this.progress = 50;
            zs.log.debug("????????????", 'Core');
            let switchs = await zs.network.config(true);
            zs.product.sync(switchs);
            this.progress = 60;
            zs.log.debug("??????????????????", 'Core');
            if (zs.configs.gameCfg && zs.configs.gameCfg.resources && zs.configs.gameCfg.resources.configs) {
                let cfgs = zs.configs.gameCfg.resources.configs;
                for (let key in cfgs) {
                    let cfg = cfgs[key];
                    if (cfg) {
                        if (Array.isArray(cfg)) {
                            cfg.length > 0 && cfg[0] != null && cfg[0].trim().length > 0 && (await zs.configs.load(key, cfg[0], cfg.length > 1 ? cfg[1] : null, cfg.length > 2 ? cfg[2] : true));
                        } else if (typeof cfg === 'string') {
                            await zs.configs.load(key, cfg, null, true);
                        }
                    }
                }
            }
            this.progress = 70;
            if (zs.configs.gameCfg && zs.configs.gameCfg.resources && zs.configs.gameCfg.resources.prefabs) {
                let cfgs = zs.configs.gameCfg.resources.prefabs;
                for (let key in cfgs) {
                    let cfg = cfgs[key];
                    if (cfg) {
                        if (Array.isArray(cfg)) {
                            cfg.length > 0 && cfg[0] != null && cfg[0].trim().length > 0 && (await zs.prefabs.load(key, cfg[0], cfg.length > 1 ? cfg[1] : null, cfg.length > 2 ? cfg[2] : true));
                        } else if (typeof cfg === 'string') {
                            await zs.prefabs.load(key, cfg, null, true);
                        }
                    }
                }
            }
            this.progress = 80;
            zs.log.debug("?????????????????????", 'Core');
            zs.platform.initAds();
            this.progress = 85;

            zs.log.debug("??????????????????", 'Core');
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
                    if (workListener.handler.once) {
                        this.workflow.once(workListener.key, workListener.handler, workListener.isBefore);
                    } else {
                        this.workflow.on(workListener.key, workListener.handler, workListener.isBefore);
                    }
                }
                this.workListeners = null;
            }

            if (zs.platform.proxy) {
                this.checkGameCfg(switchs);
            }

            if (this.onPrepare) {
                this.onPrepare.run();
            } else {
                this.readyFinish();
            }
        }
        static readyFinish() {
            this.checkPanelSort();
            Laya.timer.frameLoop(1, null, () => { this.checkPanelSort(); });
            this.progress = 100;
            this._readyStart = true;
        }
        static start() {
            zs.log.debug("????????????", 'Core');
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
            if (this.workflow) {
                this.workflow.on(key, handler, isBefore);
            } else {
                handler.once = false;
                this.workListeners.push({
                    key: key,
                    handler: handler,
                    isBefore: isBefore
                });
            }
        }
        static onceWorkflow(key, handler, isBefore) {
            if (key == null || key.length <= 0 || handler == null) { return; }
            if (this.workListeners == null) {
                this.workListeners = [];
            }
            if (this.workflow) {
                this.workflow.once(key, handler, isBefore);
            } else {
                handler.once = true;
                this.workListeners.push({
                    key: key,
                    handler: handler,
                    isBefore: isBefore
                });
            }
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
        static checkPanelSort() {
            let sortIndex = 1
            if (zs.ui.uiScene.scene) {
                if (Laya.stage.getChildIndex(zs.ui.uiScene.scene) < Laya.stage.numChildren - sortIndex) {
                    Laya.stage.setChildIndex(zs.ui.uiScene.scene, Laya.stage.numChildren - sortIndex);
                }
                sortIndex++;
            }
            if (Laya.stage.getChildIndex(fairygui.GRoot.inst.displayObject) != Laya.stage.numChildren - sortIndex) {
                Laya.stage.setChildIndex(fairygui.GRoot.inst.displayObject, Laya.stage.numChildren - sortIndex);
            }
            if (this.entryInst && this.entryInst.loading && this.entryInst.loading.owner && Laya.stage.getChildIndex(this.entryInst.loading.owner) != Laya.stage.numChildren - sortIndex) {
                Laya.stage.setChildIndex(this.entryInst.loading.owner, Laya.stage.numChildren - sortIndex);
            }
        }
        static checkGameCfg(switchs) {
            let gamecfg = zs.configs.gameCfg;
            if (gamecfg.appName == null || gamecfg.appName.trim().length <= 0) {
                return showMsgBox({
                    title: "??????",
                    content: "?????????appName?????????config/gameCfg.json???????????????",
                    hideCancel: true
                });
            }
            if (gamecfg.gameId == null || gamecfg.gameId.trim().length <= 0) {
                return showMsgBox({
                    title: "??????",
                    content: "?????????gameId?????????config/gameCfg.json???????????????",
                    hideCancel: true
                });
            }
            if (gamecfg.appId == null || gamecfg.appId.trim().length <= 0) {
                return showMsgBox({
                    title: "??????",
                    content: "?????????appId?????????config/gameCfg.json???????????????",
                    hideCancel: true
                });
            }
            if (!gamecfg.cp && (gamecfg.aldKey == null || gamecfg.aldKey.trim().length <= 0) && zs.platform.config.platformMark == 'wx_') {
                return showMsgBox({
                    title: "??????",
                    content: "????????????????????????aldKey?????????config/gameCfg.json???????????????",
                    hideCancel: true
                });
            }
            if (!gamecfg.cp && (gamecfg.tdKey == null || gamecfg.tdKey.trim().length <= 0) && zs.platform.config.platformMark == 'wx_') {
                return showMsgBox({
                    title: "??????",
                    content: "?????????TalkingData??????tdKey?????????config/gameCfg.json???????????????",
                    hideCancel: true
                });
            }
            if (gamecfg.secret == null || gamecfg.secret.trim().length <= 0) {
                return showMsgBox({
                    title: "??????",
                    content: "?????????????????????secret?????????config/gameCfg.json???????????????",
                    hideCancel: true
                });
            }
            if (gamecfg.version == null || gamecfg.version.trim().length <= 0) {
                return showMsgBox({
                    title: "??????",
                    content: "??????????????????version?????????config/gameCfg.json???????????????",
                    hideCancel: true
                });
            } else if (switchs == null || switchs.length < 0) {
                return showMsgBox({
                    title: "??????",
                    content: "?????????????????????????????????config/gameCfg.json??????????????????version",
                    hideCancel: true
                });
            }
            if (gamecfg.pure) {
                return showMsgBox({
                    title: "??????",
                    content: "??????????????????????????????????????????????????????????????????config/gameCfg.json???????????????",
                    hideCancel: true
                });
            }
            if (gamecfg.debug) {
                return showMsgBox({
                    title: "??????",
                    content: "??????????????????????????????????????????????????????????????????config/gameCfg.json???????????????",
                    hideCancel: true
                });
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