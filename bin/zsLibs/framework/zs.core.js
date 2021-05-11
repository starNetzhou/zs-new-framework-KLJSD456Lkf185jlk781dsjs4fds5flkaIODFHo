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
        get eventList() {
            if (this._eventList == null) {
                this._eventList = {};
            }
            return this._eventList;
        }
        constructor() {
            this.switchExporter = "zs_jump_switch";
            this.exporterPack = null;
        }
        registe() {
            this.fsm = new zs.fsm()
                .registe(zs.workflow.PRODUCT_START, zs.workflow.PRODUCT_BEGIN)
                .registe(zs.workflow.PRODUCT_BEGIN, zs.workflow.GAME_HOME)
                .registe(zs.workflow.GAME_HOME, zs.workflow.PRODUCT_HOME_PLAY)
                .registe(zs.workflow.PRODUCT_HOME_PLAY, zs.workflow.GAME_PLAY)
                .registe(zs.workflow.GAME_PLAY, zs.workflow.PRODUCT_PLAY_END)
                .registe(zs.workflow.PRODUCT_PLAY_END, zs.workflow.GAME_END)
                .registe(zs.workflow.GAME_END, zs.workflow.PRODUCT_FINISH)
                .registe(zs.workflow.PRODUCT_FINISH, zs.workflow.PRODUCT_BEGIN)
                .setDefault(zs.workflow.PRODUCT_START);
            this.registeEvent(workflow.eventNext, this, (target) => { this.next(target); });
            this.registeEvent(workflow.eventChildNext, this, (target) => { this.childNext(target); });
        }
        start() {
            if (this.fsm) {
                this.fsm.onBeforeChange = Laya.Handler.create(this, this.onBeforeChange, null, false);
                this.fsm.onChanged = Laya.Handler.create(this, this.onChanged, null, false);
            }
            zs.fgui.configs.registeBase(workflow.exporterList, zs.exporter.list);
            zs.fgui.configs.registeBase(workflow.exporterCard, zs.exporter.card);
            zs.fgui.configs.registeBase(workflow.exporterBackground, zs.exporter.background);
            zs.fgui.configs.registeBase(workflow.exporterLoader, zs.exporter.loader);
            zs.fgui.configs.registeBase(workflow.exporterButton, zs.exporter.button);
            core.addAppShow(Laya.Handler.create(this, zs.platform.sync.clearDelayBanner, null, false));
            this.fsm.init();
        }
        setFSM(key, fsm) {
            this.fsmList[key.trim()] = fsm;
        }
        registeEvent(key, caller, func, ...args) {
            this.eventList[key.trim()] = {
                caller: caller,
                func: func,
                args: args
            }
        }
        applyEvent(key, args) {
            let event = this.eventList[key.trim()];
            event && event.func && event.func.apply(event.caller, (args && args.length > 0) ? args : event.args);
        }
        applyEventReturn(key, args) {
            let event = this.eventList[key.trim()];
            if (event && event.func) {
                return event.func.apply(event.caller, (args && args.length > 0) ? args : event.args);
            }
            return null;
        }
        callEvent(key, ...args) {
            this.applyEvent(key, args);
        }
        callEventReturn(key, ...args) {
            return this.applyEventReturn(key, args);
        }
        readConfigReturn(config) {
            if (config == null || config == undefined) { return null; }
            let result = null;
            let configType = typeof config;
            if (configType === 'number' || configType === 'boolean' || Array.isArray(config)) {
                result = config;
            } else if (configType === 'object') {
                for (let evt in config) {
                    let args = config[evt];
                    if (args != null && args != undefined && !Array.isArray(args)) {
                        args = [args];
                    }
                    result = this.applyEventReturn(evt, args);
                    break;
                }
            } else if (configType === 'string') {
                result = this.applyEventReturn(config);
            }
            return result;
        }
        runEventConfig(event) {
            if (event == null || event == undefined) { return; }
            let eventType = typeof event;
            if (eventType === 'string') {
                this.callEvent(event);
            } else if (Array.isArray(event)) {
                for (let i = 0, n = event.length; i < n; i++) {
                    this.runEventConfig(event[i]);
                }
            } else if (eventType == 'object') {
                for (let evt in event) {
                    let args = event[evt];
                    if (!Array.isArray(args) && args != null && args != undefined) {
                        args = [args];
                    }
                    this.applyEvent(evt, args);
                }
            }
        }
        registeChildFSM() {
            let config = zs.configs.productCfg;
            for (let key in config) {
                key = key.trim();
                if (this.fsmList[key]) { continue; }
                let states = config[key].states;
                if (!states || states.length <= 0) { continue; }
                let defaultState = null;
                let lastState = null;
                let fsm = new zs.fsm();
                for (let i = 0, n = states.length; i < n; i++) {
                    let state = states[i];
                    if (state == null || typeof state !== 'string') { continue; }
                    state = state.trim();
                    if (state.length <= 0) { continue; }
                    if (!defaultState) {
                        defaultState = state;
                        lastState = state;
                        continue;
                    }
                    fsm.registe(lastState, state);
                    lastState = state;
                }
                if (defaultState) {
                    fsm.setDefault(defaultState);
                    let substates = config[key].substates;
                    if (substates && Array.isArray(substates)) {
                        for (let i = 0, n = substates.length; i < n; i++) {
                            let list = substates[i];
                            if (list == null || !Array.isArray(list) || list.length <= 1) { continue; }
                            let lastState = null;
                            for (let j = 0, m = list.length; j < m; j++) {
                                let state = list[j];
                                if (state == null || typeof state !== 'string') { continue; }
                                state = state.trim();
                                if (state.length <= 0 || fsm.getState(lastState, state)) { continue; }
                                lastState && fsm.registe(lastState, state, fsm.list[lastState] != null ? -1 : 0);
                                lastState = state;
                            }
                        }
                    }
                    this.fsmList[key] = fsm;
                }
            }
        }
        on(key, handler, isBefore, priority) {
            if (key == null || key.trim().length <= 0 || handler == null) { return; }
            key = key.trim();
            handler.once = false;
            priority = priority || 0;
            handler.priority = priority;
            let insertIdx = -1;
            let listener = null;
            if (isBefore) {
                if (this.preListeners == null) {
                    this.preListeners = {};
                }
                if (this.preListeners[key] == null) {
                    this.preListeners[key] = [];
                }
                listener = this.preListeners[key];
            } else {
                if (this.listeners == null) {
                    this.listeners = {};
                }
                if (this.listeners[key] == null) {
                    this.listeners[key] = [];
                }
                listener = this.listeners[key];
            }
            if (listener) {
                for (let i = 0, n = listener.length; i < n; i++) {
                    if (listener[i]._id == handler._id) { return; }
                    let p = listener[i].priority || 0;
                    if (insertIdx < 0 && priority > p) {
                        insertIdx = i;
                        break;
                    }
                }
                if (insertIdx < 0) {
                    listener.push(handler);
                } else {
                    listener.splice(insertIdx, 0, handler);
                }
            }
        }
        onLater(key, handler, isBefore, priority) {
            if (key == null || key.trim().length <= 0 || handler == null) { return; }
            key = key.trim();
            handler.once = false;
            priority = priority || 0;
            handler.priority = priority;
            let insertIdx = -1;
            let listener = null;
            if (isBefore) {
                if (this.laterPreListeners == null) {
                    this.laterPreListeners = {};
                }
                if (this.laterPreListeners[key] == null) {
                    this.laterPreListeners[key] = [];
                }
                listener = this.laterPreListeners[key];
            } else {
                if (this.laterListeners == null) {
                    this.laterListeners = {};
                }
                if (this.laterListeners[key] == null) {
                    this.laterListeners[key] = [];
                }
                listener = this.laterListeners[key];
            }
            if (listener) {
                for (let i = 0, n = listener.length; i < n; i++) {
                    if (listener[i]._id == handler._id) { return; }
                    let p = listener[i].priority || 0;
                    if (insertIdx < 0 && priority > p) {
                        insertIdx = i;
                        break;
                    }
                }
                if (insertIdx < 0) {
                    listener.push(handler);
                } else {
                    listener.splice(insertIdx, 0, handler);
                }
            }
        }
        once(key, handler, isBefore, priority) {
            this.on(key, handler, isBefore, priority);
            if (handler) { handler.once = true; }
        }
        onceLater(key, handler, isBefore, priority) {
            this.onLater(key, handler, isBefore, priority);
            if (handler) { handler.once = true; }
        }
        off(key, handler, isBefore) {
            if (key == null || key.trim().length <= 0 || handler == null) { return; }
            key = key.trim();
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
        offLater(key, handler, isBefore) {
            if (key == null || key.trim().length <= 0 || handler == null) { return; }
            key = key.trim();
            if (isBefore) {
                if (this.laterPreListeners == null) { return; }
                if (this.laterPreListeners[key] == null) { return; }
                let listener = this.laterPreListeners[key];
                for (let i = 0, n = listener.length; i < n; i++) {
                    if (listener[i]._id == handler._id) {
                        listener.splice(i, 1);
                        return;
                    }
                }
            } else {
                if (this.laterListeners == null) { return; }
                if (this.laterListeners[key] == null) { return; }
                let listener = this.laterListeners[key];
                for (let i = 0, n = listener.length; i < n; i++) {
                    if (listener[i]._id == handler._id) {
                        listener.splice(i, 1);
                        return;
                    }
                }
            }
        }
        offAll(key, isBefore) {
            if (key == null || key.trim().length <= 0) { return; }
            key = key.trim();
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
        offAllLater(key, isBefore) {
            if (key == null || key.trim().length <= 0) { return; }
            key = key.trim();
            if (isBefore) {
                if (this.laterPreListeners == null) { return; }
                if (this.laterPreListeners[key] == null) { return; }
                delete this.laterPreListeners[key];
            } else {
                if (this.laterListeners == null) { return; }
                if (this.laterListeners[key] == null) { return; }
                delete this.laterListeners[key];
            }
        }
        offAllCaller(caller, key, isBefore) {
            if (caller == null) { return; }
            if (key == null || key.trim().length <= 0) {
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
                key = key.trim();
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
        offAllCallerLater(caller, key, isBefore) {
            if (caller == null) { return; }
            if (key == null || key.trim().length <= 0) {
                if (isBefore) {
                    for (let k in this.laterPreListeners) {
                        let listener = this.laterPreListeners[k];
                        for (let i = 0, n = listener.length; i < n; i++) {
                            if (listener[i].caller == caller) {
                                listener.splice(i, 1);
                                i--;
                                n--;
                            }
                        }
                    }
                } else {
                    for (let k in this.laterListeners) {
                        let listener = this.laterListeners[k];
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
                key = key.trim();
                if (isBefore) {
                    let listener = this.laterPreListeners[key];
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
                    let listener = this.laterListeners[key];
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
        clearLater(isBefore) {
            if (isBefore) {
                this.laterPreListeners = null;
            } else {
                this.laterListeners = null;
            }
        }
        next(target) {
            this.wantNext = 1;
            this.nextTarget = target;
            this.step();
        }
        childNext(target) {
            if (this.wantNext) { return; }
            this.wantNext = 2;
            this.nextTarget = target;
            this.step();
        }
        step() {
            if (this.lockStep) { return; }
            let target = this.nextTarget;
            let nextCmd = this.wantNext;
            this.wantNext = 0;
            this.nextTarget = null;
            switch (nextCmd) {
                case 1:
                    if (this.fsm != null) {
                        let lastState = this.fsm.current;
                        if (target) {
                            if (!this.fsm.runTransition(target)) {
                                zs.log.error("无法执行从 " + lastState + " 到 " + target + " 的工作流，请检查是否完整注册流程!", "Core");
                            }
                        } else {
                            if (!this.fsm.runNext()) {
                                zs.log.error("无法执行 " + lastState + " 的后续工作流，请检查是否完整注册流程!", "Core");
                            }
                        }
                    }
                    break;
                case 2:
                    if (this.fsm != null) {
                        let childFSM = this.fsmList[this.fsm.current];
                        let isRunNext = false;
                        if (childFSM && ((target && !childFSM.runTransition(target)) || !childFSM.runNext())) {
                            this.onChildFSMBeforeChanged(null, childFSM.current);
                            isRunNext = true;
                        }
                        if (!childFSM || isRunNext) {
                            let lastState = this.fsm.current;
                            if (!this.fsm.runNext()) {
                                zs.log.error("无法执行 " + lastState + " 的后续工作流，请检查是否完整注册流程!", "Core");
                            }
                        }
                    }
                    break;
            }
        }
        onBeforeChange(target, current) {
            this.lockStep = true;
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
            this.checkExitEvent(current);
            this.exportWindow.clear();
            // banner销毁
            zs.platform.sync.hideBanner();
            zs.platform.sync.clearDelayBanner();
            if (this.laterPreListeners != null && this.laterPreListeners[target] != null) {
                let list = this.laterPreListeners[target];
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
            this.lockStep = false;
            this.step();
        }
        checkSwitch(config, check) {
            let isPassed = true;
            if (config) {
                if (Array.isArray(config)) {
                    for (let i = 0, n = config.length; i < n; i++) {
                        let sw = config[i];
                        if (!sw || sw.length <= 0) { continue; }
                        if (sw[0] == '!' || sw[0] == '！') {
                            if (sw.length > 1) {
                                sw = sw.slice(1, sw.length);
                                if (zs.product.get(sw)) {
                                    isPassed = false;
                                    break;
                                }
                            } else {
                                isPassed = false;
                                break;
                            }
                        } else if (!zs.product.get(sw)) {
                            isPassed = false;
                            break;
                        }
                    }
                } else {
                    let sw = config;
                    if (sw && sw.length > 0) {
                        if (sw[0] == '!' || sw[0] == '！') {
                            if (sw.length > 1) {
                                sw = sw.slice(1, sw.length);
                                if (zs.product.get(sw)) { isPassed = false; }
                            } else {
                                isPassed = false;
                            }
                        } else if (!zs.product.get(sw)) {
                            isPassed = false;
                        }
                    }
                }
            }
            if (!isPassed) { return false; }
            if (check) {
                isPassed = this.readConfigReturn(check);
            }
            return isPassed;
        }
        onChanged(current) {
            this.lockStep = true;
            zs.td.justTrack(zs.td.workflowKey + current, zs.td.workflowDesc + current);
            let productData = zs.configs.productCfg[current];
            let isSkip = false;
            if (productData && (productData.switch || productData.check)) {
                isSkip = !this.checkSwitch(productData.switch, productData.check);
            }
            let childFSM = this.fsmList[current];
            if (isSkip) {
                this.next();
            } else {
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
                this.checkEvent(current);
                if (childFSM) {
                    childFSM.onBeforeChange = Laya.Handler.create(this, this.onChildFSMBeforeChanged, null, false);
                    childFSM.onChanged = Laya.Handler.create(this, this.onChildFSMChanged, null, false);
                    childFSM.init();
                    let productData = zs.configs.productCfg[current];
                    if (productData) {
                        zs.log.info(current + " 状态存在子状态机，无法自动创建应用运营配置，请使用子状态进行配置!", "Workflow", childFSM.list);
                    }
                } else {
                    this.checkBase(current);
                    zs.product.get(this.switchExporter) && this.checkExporter(current);
                    this.checkBanner(current);
                }
                this.checkLaterEvent(current);
                if (this.laterListeners != null && this.laterListeners[current] != null) {
                    let list = this.laterListeners[current];
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
            }
            this.lockStep = false;
            this.step();
        }
        onChildFSMBeforeChanged(target, current) {
            if (this.fsm == null) { return; }
            this.lockStep = true;
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
            this.checkExitEvent(this.fsm.current + '.' + current);
            this.exportWindow.clear();
            // banner销毁
            zs.platform.sync.hideBanner();
            zs.platform.sync.clearDelayBanner();
            if (this.laterPreListeners != null && this.laterPreListeners[childKey] != null) {
                let list = this.laterPreListeners[childKey];
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
            this.lockStep = false;
            this.step();
        }
        onChildFSMChanged(current) {
            if (this.fsm == null) { return; }
            this.lockStep = true;
            let childKey = this.fsm.current + '.' + current;
            zs.td.justTrack(zs.td.workflowKey + childKey, zs.td.workflowDesc + childKey);
            let productData = zs.configs.productCfg[childKey];
            let isSkip = false;
            if (productData && (productData.switch || productData.check)) {
                isSkip = !this.checkSwitch(productData.switch, productData.check);
            }
            if (isSkip) {
                this.childNext();
            } else {
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
                this.checkEvent(childKey);
                this.checkBase(childKey);
                zs.product.get(this.switchExporter) && this.checkExporter(childKey);
                this.checkBanner(childKey);
                this.checkLaterEvent(childKey);
                if (this.laterListeners != null && this.laterListeners[childKey] != null) {
                    let list = this.laterListeners[childKey];
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
            }
            this.lockStep = false;
            this.step();
        }
        checkEvent(current) {
            let data = zs.configs.productCfg[current];
            if (data && data.event) {
                this.runEventConfig(data.event);
            }
        }
        checkLaterEvent(current) {
            let data = zs.configs.productCfg[current];
            if (data && data.laterevent) {
                this.runEventConfig(data.laterevent);
            }
        }
        checkExitEvent(current) {
            let data = zs.configs.productCfg[current];
            if (data && data.exitevent) {
                this.runEventConfig(data.exitevent);
            }
        }
        checkBanner(current) {
            let data = zs.configs.productCfg[current];
            if (this.bannerIgnoreList && this.bannerIgnoreList.indexOf(current) >= 0) {
                if (data && data.banner) {
                    zs.log.info("状态 " + current + " 在横幅广告忽略列表中，无法自动生成，请自主管理横幅广告展示或将该状态移出忽略列表", "Workflow");
                }
                return;
            }
            data && (zs.platform.sync.checkBanner({ data: data }));
        }
        checkExporter(current) {
            let data = zs.configs.productCfg[current];
            if (this.exporterIgnoreList && this.exporterIgnoreList.indexOf(current) >= 0) {
                if (data && data.exporter && data.exporter.length > 0) {
                    zs.log.info("状态 " + current + " 在导出忽略列表中，无法自动生成，请自主管理导出展示或将该状态移出忽略列表", "Workflow");
                }
                return;
            }
            if (data && data.exporter && data.exporter.length > 0) {
                for (let i = 0, n = data.exporter.length; i < n; i++) {
                    let config = data.exporter[i];
                    if (!config) { continue; }
                    if ((config.switch || config.check) && !this.checkSwitch(config.switch, config.check)) {
                        continue;
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
                    if (!config) { continue; }
                    if ((config.switch || config.check) && !this.checkSwitch(config.switch, config.check)) {
                        continue;
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
    workflow.exporterBackground = "export_background";
    workflow.exporterLoader = "export_loader";
    workflow.exporterButton = "export_button";

    workflow.eventNext = "event_next";
    workflow.eventChildNext = "event_childnext";

    workflow.PRODUCT_START = "PRODUCT_START";
    workflow.PRODUCT_BEGIN = "PRODUCT_BEGIN";
    workflow.GAME_HOME = "GAME_HOME";
    workflow.PRODUCT_HOME_PLAY = "PRODUCT_HOME_PLAY";
    workflow.GAME_PLAY = "GAME_PLAY";
    workflow.PRODUCT_PLAY_END = "PRODUCT_PLAY_END";
    workflow.GAME_END = "GAME_END";
    workflow.PRODUCT_FINISH = "PRODUCT_FINISH";
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
            zs.ui.UIScene.init();
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
            zs.log.debug("web 设置", 'Core');
            core.userInfo = await zs.network.init();
            core.userId = core.userInfo.user_id;
            zs.exporter.dataMgr.collectSource();
            this.progress = 10;
            zs.log.debug("初始化数据统计", 'Core');
            await zs.td.registeConfig(zs.configs.gameCfg.tdConfig);
            this.progress = 20;
            zs.log.debug("初始化广告与导出组件", 'Core');
            let basicExportPack = await zs.fgui.loadPack(zs.fgui.configs.pack_basic);
            zs.ui.FGUI_msgbox.bind(basicExportPack);
            zs.ui.FGUI_list.bind(basicExportPack);
            this.progress = 30;
            zs.log.debug("加载必要分包", 'Core');
            await zs.resource.preload();
            this.progress = 40;
            zs.log.debug("加载 main", 'Core');
            await zs.fgui.loadPacks(zs.configs.gameCfg.fguiPacks, true);
            this.onFGUIBind && this.onFGUIBind.run();
            this.progress = 50;
            zs.log.debug("运营设置", 'Core');
            let switchs = await zs.network.config(true);
            zs.product.sync(switchs);
            if (zs.EggKnock) {
                zs.EggKnock.init();
                zs.core.onWorkflow(zs.workflow.PRODUCT_PLAY_END, Laya.Handler.create(this, () => {
                    zs.EggKnock.markGameNum(true);
                }), true);
            }
            this.progress = 60;
            zs.log.debug("加载基础配置", 'Core');
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
            zs.log.debug("广告组件初始化", 'Core');
            zs.platform.initAds();
            this.progress = 85;

            zs.log.debug("业务流程拼装", 'Core');
            this.progress = 95;
            if (this.workflow == null) {
                this.workflow = new zs.workflow();
            }
            if (this.workflow.exporterPack) {
                if (Array.isArray(this.workflow.exporterPack)) {
                    await zs.fgui.loadPacks(this.workflow.exporterPack);
                } else {
                    await zs.fgui.loadPack(this.workflow.exporterPack);
                }
            }
            this.workflow.registe();
            this.workflow.registeChildFSM();

            if (this.workListeners) {
                for (let i = 0, n = this.workListeners.length; i < n; i++) {
                    let workListener = this.workListeners[i];
                    if (workListener.handler.once) {
                        if (workListener.later) {
                            this.workflow.onceLater(workListener.key, workListener.handler, workListener.isBefore);
                        } else {
                            this.workflow.once(workListener.key, workListener.handler, workListener.isBefore);
                        }
                    } else {
                        if (workListener.later) {
                            this.workflow.onLater(workListener.key, workListener.handler, workListener.isBefore);
                        } else {
                            this.workflow.on(workListener.key, workListener.handler, workListener.isBefore);
                        }
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
            Laya.timer.frameLoop(1, this, this.step);
            this.progress = 100;
            this._readyStart = true;
        }
        static step() {
            this.checkPanelSort();
        }
        static start() {
            zs.log.debug("启动业务", 'Core');
            if (this.readyStart) {
                this.workflow.start();
                this.onStart && this.onStart.run();
                zs.td.justTrack(zs.td.gameStartKey, zs.td.gameStartDesc, { uid: core.userId });
            }
        }
        static onWorkflow(key, handler, isBefore, priority) {
            if (key == null || key.length <= 0 || handler == null) { return; }
            if (this.workListeners == null) {
                this.workListeners = [];
            }
            if (this.workflow) {
                this.workflow.on(key, handler, isBefore, priority);
            } else {
                handler.once = false;
                this.workListeners.push({
                    key: key,
                    handler: handler,
                    priority: priority,
                    isBefore: isBefore
                });
            }
        }
        static onWorkflowLater(key, handler, isBefore, priority) {
            if (key == null || key.length <= 0 || handler == null) { return; }
            if (this.workListeners == null) {
                this.workListeners = [];
            }
            if (this.workflow) {
                this.workflow.onLater(key, handler, isBefore, priority);
            } else {
                handler.once = false;
                this.workListeners.push({
                    key: key,
                    handler: handler,
                    priority: priority,
                    isBefore: isBefore,
                    later: true
                });
            }
        }
        static onceWorkflow(key, handler, isBefore, priority) {
            if (key == null || key.length <= 0 || handler == null) { return; }
            if (this.workListeners == null) {
                this.workListeners = [];
            }
            if (this.workflow) {
                this.workflow.once(key, handler, isBefore, priority);
            } else {
                handler.once = true;
                this.workListeners.push({
                    key: key,
                    handler: handler,
                    priority: priority,
                    isBefore: isBefore
                });
            }
        }
        static onceWorkflowLater(key, handler, isBefore, priority) {
            if (key == null || key.length <= 0 || handler == null) { return; }
            if (this.workListeners == null) {
                this.workListeners = [];
            }
            if (this.workflow) {
                this.workflow.onceLater(key, handler, isBefore, priority);
            } else {
                handler.once = true;
                this.workListeners.push({
                    key: key,
                    handler: handler,
                    priority: priority,
                    isBefore: isBefore,
                    later: true
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
            if (zs.ui.UIScene.scene) {
                if (Laya.stage.getChildIndex(zs.ui.UIScene.scene) < Laya.stage.numChildren - sortIndex) {
                    Laya.stage.setChildIndex(zs.ui.UIScene.scene, Laya.stage.numChildren - sortIndex);
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
                    title: "提示",
                    content: "未填写appName，请在config/gameCfg.json中准确填写",
                    hideCancel: true
                });
            }
            if (gamecfg.gameId == null || gamecfg.gameId.trim().length <= 0) {
                return showMsgBox({
                    title: "提示",
                    content: "未填写gameId，请在config/gameCfg.json中准确填写",
                    hideCancel: true
                });
            }
            if (gamecfg.appId == null || gamecfg.appId.trim().length <= 0) {
                return showMsgBox({
                    title: "提示",
                    content: "未填写appId，请在config/gameCfg.json中准确填写",
                    hideCancel: true
                });
            }
            if (!gamecfg.cp && (gamecfg.aldKey == null || gamecfg.aldKey.trim().length <= 0) && zs.platform.config.platformMark == 'wx_') {
                return showMsgBox({
                    title: "提示",
                    content: "未填写阿拉丁密钥aldKey，请在config/gameCfg.json中准确填写",
                    hideCancel: true
                });
            }
            if (!gamecfg.cp && (gamecfg.tdKey == null || gamecfg.tdKey.trim().length <= 0) && zs.platform.config.platformMark == 'wx_') {
                return showMsgBox({
                    title: "提示",
                    content: "未填写TalkingData密钥tdKey，请在config/gameCfg.json中准确填写",
                    hideCancel: true
                });
            }
            if (gamecfg.secret == null || gamecfg.secret.trim().length <= 0) {
                return showMsgBox({
                    title: "提示",
                    content: "未填写导出密钥secret，请在config/gameCfg.json中准确填写",
                    hideCancel: true
                });
            }
            if (gamecfg.version == null || gamecfg.version.trim().length <= 0) {
                return showMsgBox({
                    title: "提示",
                    content: "未填写版本号version，请在config/gameCfg.json中准确填写",
                    hideCancel: true
                });
            } else if (switchs == null || switchs.length < 0) {
                return showMsgBox({
                    title: "提示",
                    content: "无法获取配置数据，请在config/gameCfg.json中检查版本号version",
                    hideCancel: true
                });
            }
            if (gamecfg.pure) {
                return showMsgBox({
                    title: "提示",
                    content: "当前处于纯净模式，将不会展示广告与导出，可在config/gameCfg.json中修改配置",
                    hideCancel: true
                });
            }
            if (gamecfg.debug) {
                return showMsgBox({
                    title: "提示",
                    content: "当前处于测试模式，将会影响部分上线功能，可在config/gameCfg.json中修改配置",
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