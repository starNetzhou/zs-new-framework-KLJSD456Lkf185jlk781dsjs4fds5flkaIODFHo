window.zs = window.zs || {};
window.zs.fgui = window.zs.fgui || {};
(function (exports) {
    'use strict';

    let AlignType;
    (function (AlignType) {
        AlignType[AlignType["Center"] = 0] = "Center";
        AlignType[AlignType["Top"] = 1] = "Top";
        AlignType[AlignType["Bottom"] = 2] = "Bottom";
        AlignType[AlignType["Left"] = 3] = "Left";
        AlignType[AlignType["Right"] = 4] = "Right";
        AlignType[AlignType["TopLeft"] = 5] = "TopLeft";
        AlignType[AlignType["BottomLeft"] = 6] = "BottomLeft";
        AlignType[AlignType["TopRight"] = 7] = "TopRight";
        AlignType[AlignType["BottomRight"] = 8] = "BottomRight";
    })(AlignType = AlignType || (AlignType = {}));

    let FitType;
    (function (FitType) {
        FitType[FitType["None"] = 0] = "None";
        FitType[FitType["Fit"] = 1] = "Fit";
        FitType[FitType["ScaleFit"] = 2] = "ScaleFit";
        FitType[FitType["Both"] = 3] = "Both";
    })(FitType = FitType || (FitType = {}));

    class configs {
        static get bases() {
            if (this._bases == null) {
                this._bases = {};
            }
            return this._bases;
        }
        static get items() {
            if (this._items == null) {
                this._items = {};
            }
            return this._items;
        }
        static registeBase(key, type) {
            this.bases[key] = type;
        }
        static unregisteBase(key) {
            if (this.bases[key]) {
                delete this.bases[key];
            }
        }
        static registeItem(key, type) {
            this.items[key] = type;
        }
        static unregisteItem(key) {
            if (this.items[key]) {
                delete this.items[key];
            }
        }
    }
    configs.onInit = null;
    configs.path_root = 'fgui';
    configs.pack_basic_exporter = 'basicExporter';

    function init() {
        fairygui.UIConfig.packageFileExtension = 'bin';
        fairygui.UIConfig.bringWindowToFrontOnClick = false;
        configs.onInit && configs.onInit.run();
        Laya.stage.addChild(fairygui.GRoot.inst.displayObject);
        Laya.timer.frameLoop(1, fairygui.GRoot.inst, () => {
            if (Laya.stage.getChildIndex(fairygui.GRoot.inst.displayObject) != Laya.stage.numChildren - 1) {
                Laya.stage.setChildIndex(fairygui.GRoot.inst.displayObject, Laya.stage.numChildren - 1);
            }
        });
    }
    function loadPack(url, fullpath) {
        if (!fullpath) {
            url = configs.path_root + '/' + url;
        }
        return zs.resource.load(url, zs.ResourceType.FGUIPack);
    }
    function loadPacks(packs, fullpath) {
        return new Promise(async (resolve, reject) => {
            if (packs == null || packs.length <= 0) {
                return resolve(null);
            }
            let result = [];
            for (let i = 0, n = packs.length; i < n; i++) {
                result.push(await loadPack(packs[i], fullpath));
            }
            resolve(result);
        });
    }
    class base {
        constructor(component) {
            this.disposed = false;
            this._view = component;
            component.baseCtrl = this;
            this.init();
        }
        get view() {
            return this._view;
        }
        static make(type) {
            if (type && type.prototype instanceof fairygui.GComponent) {
                return type.createInstance();
            }
            return null;
        }
        static type() {
            return fairygui.GComponent;
        }
        check(component) {
            return true;
        }
        dispose() {
            Laya.timer.clearAll(this);
            Laya.Tween.clearAll(this);
            this.disposed = true;
        }
        init() { }
        apply() { }
        applyConfig() { }
    }
    base.typeDefine = null;

    class baseGeneric extends base {
        get view() { return this._view; }
    }

    class window {
        static create(x, y, width, height) {
            if (x == null) {
                x = 0;
            }
            if (y == null) {
                y = 0;
            }
            if (width == null) {
                width = fairygui.GRoot.inst.width;
            }
            if (height == null) {
                height = fairygui.GRoot.inst.height;
            }
            let win = new window();
            win.window = new fairygui.Window();
            win.window.x = x;
            win.window.y = y;
            win.window.width = width;
            win.window.height = height;
            let panel = new fairygui.GComponent();
            win.window.contentPane = panel;
            panel.x = 0;
            panel.y = 0;
            panel.width = width;
            panel.height = height;
            return win;
        }
        attach(ctr, index) {
            this.lastBase = null;
            if (ctr == null || this.window == null) {
                return this;
            }
            let view = ctr.make(ctr.typeDefine || ctr.type());
            if (index) {
                this.window.contentPane.addChildAt(view, index);
            } else {
                this.window.contentPane.addChild(view);
            }
            if (view instanceof fairygui.GButton) {
                view.opaque = true;
            } else {
                view.opaque = false;
            }
            this.lastBase = new ctr(view);
            return this;
        }
        detach(ctr) {
            if (ctr == null) { return this; }
            if (typeof ctr === 'number') {
                this.window.contentPane.removeChildAt(ctr, true);
            } else {
                ctr.dispose();
                this.window.contentPane.removeChild(ctr.view, true);
            }
            return this;
        }
        setBase(ctr) {
            if (ctr && ctr.view) {
                this.lastBase = ctr;
            } else {
                this.lastBase = null;
            }
            return this;
        }
        getBase() {
            return this.lastBase;
        }
        clearBase() {
            this.lastBase = null;
            return this;
        }
        align(type, xOffset, yOffset) {
            if (this.lastBase) {
                let viewWidth = this.lastBase.view.width * this.lastBase.view.scaleX;
                let viewHeight = this.lastBase.view.height * this.lastBase.view.scaleY;
                let posX = 0;
                switch (type) {
                    case AlignType.Top:
                    case AlignType.Center:
                    case AlignType.Bottom:
                        posX = (this.window.contentPane.width - viewWidth) * 0.5;
                        break;
                    case AlignType.TopRight:
                    case AlignType.Right:
                    case AlignType.BottomRight:
                        posX = (this.window.contentPane.width - viewWidth);
                        break;
                }

                let posY = 0;
                switch (type) {
                    case AlignType.Left:
                    case AlignType.Center:
                    case AlignType.Right:
                        posY = (this.window.contentPane.height - viewHeight) * 0.5;
                        break;
                    case AlignType.BottomLeft:
                    case AlignType.Bottom:
                    case AlignType.BottomRight:
                        posY = (this.window.contentPane.height - viewHeight);
                        break;
                }

                if (this.lastBase.view.pivotAsAnchor) {
                    posX += viewWidth * this.lastBase.view.pivotX;
                    posY += viewHeight * this.lastBase.view.pivotY;
                }
                xOffset && (posX += xOffset);
                yOffset && (posY += yOffset);

                this.lastBase.view.setXY(posX, posY);
                switch (type) {
                    case AlignType.TopLeft:
                        this.lastBase.view.addRelation(this.window.contentPane, fairygui.RelationType.Left_Left);
                        this.lastBase.view.addRelation(this.window.contentPane, fairygui.RelationType.Top_Top);
                        break;
                    case AlignType.Top:
                        this.lastBase.view.addRelation(this.window.contentPane, fairygui.RelationType.Center_Center);
                        this.lastBase.view.addRelation(this.window.contentPane, fairygui.RelationType.Top_Top);
                        break;
                    case AlignType.TopRight:
                        this.lastBase.view.addRelation(this.window.contentPane, fairygui.RelationType.Right_Right);
                        this.lastBase.view.addRelation(this.window.contentPane, fairygui.RelationType.Top_Top);
                        break;
                    case AlignType.Left:
                        this.lastBase.view.addRelation(this.window.contentPane, fairygui.RelationType.Left_Left);
                        this.lastBase.view.addRelation(this.window.contentPane, fairygui.RelationType.Middle_Middle);
                        break;
                    case AlignType.Center:
                        this.lastBase.view.addRelation(this.window.contentPane, fairygui.RelationType.Center_Center);
                        this.lastBase.view.addRelation(this.window.contentPane, fairygui.RelationType.Middle_Middle);
                        break;
                    case AlignType.Right:
                        this.lastBase.view.addRelation(this.window.contentPane, fairygui.RelationType.Right_Right);
                        this.lastBase.view.addRelation(this.window.contentPane, fairygui.RelationType.Middle_Middle);
                        break;
                    case AlignType.BottomLeft:
                        this.lastBase.view.addRelation(this.window.contentPane, fairygui.RelationType.Left_Left);
                        this.lastBase.view.addRelation(this.window.contentPane, fairygui.RelationType.Bottom_Bottom);
                        break;
                    case AlignType.Bottom:
                        this.lastBase.view.addRelation(this.window.contentPane, fairygui.RelationType.Center_Center);
                        this.lastBase.view.addRelation(this.window.contentPane, fairygui.RelationType.Bottom_Bottom);
                        break;
                    case AlignType.BottomRight:
                        this.lastBase.view.addRelation(this.window.contentPane, fairygui.RelationType.Right_Right);
                        this.lastBase.view.addRelation(this.window.contentPane, fairygui.RelationType.Bottom_Bottom);
                        break;
                }
            }
            return this;
        }
        setX(x) {
            if (this.lastBase) {
                this.lastBase.view.x = x;
            }
            return this;
        }
        setWindowX(x) {
            if (this.window) {
                this.window.x = x;
            }
            return this;
        }
        setY(y) {
            if (this.lastBase) {
                this.lastBase.view.y = y;
            }
            return this;
        }
        setWindowY(y) {
            if (this.window) {
                this.window.y = y;
            }
            return this;
        }
        setXY(x, y) {
            if (this.lastBase) {
                this.lastBase.view.x = x;
                this.lastBase.view.y = y;
            }
            return this;
        }
        setWindowXY(x, y) {
            if (this.window) {
                this.window.x = x;
                this.window.y = y;
            }
            return this;
        }
        setWidth(width) {
            if (this.lastBase) {
                this.lastBase.view.width = width;
            }
            return this;
        }
        setWindowWidth(width) {
            if (this.window) {
                this.window.width = width;
            }
            return this;
        }
        setHeight(height) {
            if (this.lastBase) {
                this.lastBase.view.height = height;
            }
            return this;
        }
        setWindowHeight(height) {
            if (this.window) {
                this.window.height = height;
            }
            return this;
        }
        scaleFitWindow(designWidth, designHeight) {
            if (this.window) {
                let designRatio = designHeight / designWidth;
                let curRatio = fairygui.GRoot.inst.width / fairygui.GRoot.inst.height;
                let scale = 1;
                if (designRatio >= curRatio) {
                    scale = fairygui.GRoot.inst.height / designHeight;
                } else {
                    scale = fairygui.GRoot.inst.width / designWidth;
                }
                this.window.setScale(scale, scale);
            }
            return this;
        }
        scaleFit(designWidth, designHeight) {
            if (this.lastBase) {
                let designRatio = designHeight / designWidth;
                let curRatio = this.window.contentPane.height / this.window.contentPane.width;
                let scale = 1;
                if (designRatio >= curRatio) {
                    scale = this.window.contentPane.height / designHeight;
                } else {
                    scale = this.window.contentPane.width / designWidth;
                }
                this.lastBase.view.setScale(scale, scale);
            }
            return this;
        }
        scaleWindow(x, y) {
            if (this.window) {
                this.window.setScale(x, y);
            }
            return this;
        }
        scale(x, y) {
            if (this.lastBase) {
                this.lastBase.view.setScale(x, y);
            }
            return this;
        }
        fit() {
            if (this.lastBase) {
                let posX = 0;
                let posY = 0;
                this.lastBase.view.width = (this.window.contentPane.width / this.lastBase.view.scaleX) * (1 / this.window.scaleX);
                this.lastBase.view.height = (this.window.contentPane.height / this.lastBase.view.scaleY) * (1 / this.window.scaleY);
                if (this.lastBase.view.pivotAsAnchor) {
                    posX += this.lastBase.view.width * this.lastBase.view.scaleX * this.lastBase.view.pivotX;
                    posY += this.lastBase.view.height * this.lastBase.view.scaleY * this.lastBase.view.pivotY;
                }
                this.lastBase.view.x = posX;
                this.lastBase.view.y = posY;
            }
            return this;
        }
        fitWidth(keepRatio) {
            if (this.lastBase) {
                let ratio = this.window.contentPane.width / this.lastBase.view.width;
                this.lastBase.view.width = this.window.contentPane.width * (1 / this.window.scaleX);
                this.lastBase.view.x = this.lastBase.view.pivotAsAnchor ? (this.lastBase.view.width * this.lastBase.view.pivotX) : 0;
                if (keepRatio) {
                    this.lastBase.view.height *= ratio * (1 / this.window.scaleY);
                    this.lastBase.view.y = this.lastBase.view.y + (this.lastBase.view.pivotAsAnchor ? (this.lastBase.view.height * this.lastBase.view.pivotY) : 0);
                }
            }
            return this;
        }
        fitHeight(keepRatio) {
            if (this.lastBase) {
                let ratio = this.window.contentPane.height / this.lastBase.view.height;
                this.lastBase.view.height = this.window.contentPane.height * (1 / this.window.scaleY);
                this.lastBase.view.y = this.lastBase.view.pivotAsAnchor ? (this.lastBase.view.height * this.lastBase.view.pivotY) : 0;
                if (keepRatio) {
                    this.lastBase.view.width *= ratio * (1 / this.window.scaleX);
                    this.lastBase.view.x = this.lastBase.view.x + (this.lastBase.view.pivotAsAnchor ? (this.lastBase.view.width * this.lastBase.view.pivotX) : 0);
                }
            }
            return this;
        }
        block(value) {
            if (this.lastBase) {
                this.lastBase.view.opaque = value;
            }
            return this;
        }
        autoFront(value) {
            if (this.window != null) {
                this.window.bringToFontOnClick = value;
            }
            return this;
        }
        front() {
            if (this.window != null) {
                let root = this.window.root;
                let childIdx = root.getChildIndex(this.window);
                if (childIdx >= 0) {
                    root.setChildIndex(this.window, root.numChildren - 1);
                }

                if (msgbox.windowInst.isShowing()) {
                    let msgboxWindow = msgbox.windowInst.window;
                    let root = msgboxWindow.root;
                    let childIdx = root.getChildIndex(msgboxWindow);
                    if (childIdx >= 0) {
                        root.setChildIndex(msgboxWindow, root.numChildren - 1);
                    }
                }
            }
            return this;
        }
        top() {
            if (this.lastBase) {
                let panel = this.window.contentPane;
                let childIndex = panel.getChildIndex(this.lastBase.view);
                if (childIndex >= 0) {
                    panel.setChildIndex(this.lastBase.view, panel.numChildren - 1);
                }
            }
            return this;
        }
        update(type, func, thisArg) {
            if (this.lastBase) {
                if (this.lastBase instanceof type && this.lastBase.view) {
                    func.call(thisArg, this.lastBase, this.window);
                } else {
                    console.warn("UI类型不匹配，无法生成对应系统!", this.lastBase);
                }
            }
            return this;
        }
        show() {
            if (this.window != null) {
                this.window.show();
            }
            return this;
        }
        hide() {
            if (this.window != null) {
                this.window.hide();
            }
            return this;
        }
        clear() {
            if (this.window != null) {
                for (let index = this.window.contentPane.numChildren - 1; index >= 0; index--) {
                    const element = this.window.contentPane.getChildAt(index);
                    if (element && element.baseCtrl && element.baseCtrl.dispose) {
                        element.baseCtrl.dispose();
                    }
                }
                this.window.contentPane.removeChildren(0, -1, true);
            }
            return this;
        }
        applyConfig(config) {
            let type = configs.bases[config.type];
            if (type == null) { return this; }
            this.attach(type);
            if (config.window) {
                config.window.width != null && config.window.width != undefined && (this.setWidth(config.window.width));
                config.window.height != null && config.window.height != undefined && (this.setHeight(config.window.height));
                if (zs.configs.gameCfg.autoScaleFit || (config.window.scalefit != null && config.window.scalefit != undefined)) {
                    if (!config.window.scalefit || !Array.isArray(config.window.scalefit) || config.window.scalefit.length <= 1) {
                        this.scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight);
                    } else {
                        this.scaleFit(config.window.scalefit[0], config.window.scalefit[1]);
                    }
                }
                if (config.window.scale && Array.isArray(config.window.scale) && config.window.scale.length > 1) {
                    this.scale(config.window.scale[0], config.window.scale[1]);
                }
                config.window.fitwidth && (this.fitWidth());
                config.window.fitheight && (this.fitHeight());
                config.window.fit && (this.fit());
            }
            if (config.base) {
                this.update(type, (unit) => {
                    unit.applyConfig(config.base);
                });
            } else {
                this.update(type, (unit) => {
                    unit.apply();
                });
            }
            if (config.window) {
                if (config.window.align) {
                    switch (config.window.align) {
                        case "center":
                            this.align(AlignType.Center, config.window.alignoffsetx || 0, config.window.alignoffsety || 0);
                            break;
                        case "top":
                            this.align(AlignType.Top, config.window.alignoffsetx || 0, config.window.alignoffsety || 0);
                            break;
                        case "bottom":
                            this.align(AlignType.Bottom, config.window.alignoffsetx || 0, config.window.alignoffsety || 0);
                            break;
                        case "left":
                            this.align(AlignType.Left, config.window.alignoffsetx || 0, config.window.alignoffsety || 0);
                            break;
                        case "right":
                            this.align(AlignType.Right, config.window.alignoffsetx || 0, config.window.alignoffsety || 0);
                            break;
                        case "topleft":
                            this.align(AlignType.TopLeft, config.window.alignoffsetx || 0, config.window.alignoffsety || 0);
                            break;
                        case "bottomleft":
                            this.align(AlignType.BottomLeft, config.window.alignoffsetx || 0, config.window.alignoffsety || 0);
                            break;
                        case "topright":
                            this.align(AlignType.TopRight, config.window.alignoffsetx || 0, config.window.alignoffsety || 0);
                            break;
                        case "bottomright":
                            this.align(AlignType.BottomRight, config.window.alignoffsetx || 0, config.window.alignoffsety || 0);
                            break;
                    }
                }
                config.window.x != null && config.window.x != undefined && (this.setX(config.window.x));
                config.window.y != null && config.window.y != undefined && (this.setY(config.window.y));
                config.window.block != null && config.window.block != undefined && (this.block(config.window.block));
                config.window.autofront != null && config.window.autofront != undefined && (this.autoFront(config.window.autofront));
                config.window.front && (this.front());
                config.window.top && (this.top());
            }

            return this;
        }
        dispose() {
            if (this.window != null) {
                for (let index = this.window.contentPane.numChildren - 1; index >= 0; index--) {
                    const element = this.window.contentPane.getChildAt(index);
                    if (element && element.baseCtrl && element.baseCtrl.dispose) {
                        element.baseCtrl.dispose();
                        element.dispose();
                    }
                }
                this.window.dispose();
            }
        }
        isShowing() {
            if (this.window != null) {
                return this.window.isShowing;
            }
            return false;
        }
    }

    class manager {
        static get list() {
            if (this._list == null) {
                this._list = {};
            }
            return this._list;
        }

        static open(type, key, fit) {
            let panel = this.defaultPanel;

            if (key != null && key.trim().length > 0) {
                key = key.trim();
                panel = this.list[key];
            }

            if (panel != null) {
                panel.dispose();
            }

            panel = window.create();

            if (type) {
                panel.attach(type);
                if (!fit) { fit = FitType.Both; }
                switch (fit) {
                    case FitType.Fit:
                        panel.fit();
                        break;
                    case FitType.ScaleFit:
                        panel.scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight);
                        break;
                    case FitType.Both:
                        panel.scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight).fit();
                        break;
                }
            }

            panel.show();

            if (key != null && key.length > 0) {
                this.list[key] = panel;
            } else {
                this.defaultPanel = panel;
            }

            return panel;
        }

        static show(autoCreate, type, key, fit) {
            let panel = this.defaultPanel;
            if (key != null && key.trim().length > 0) {
                key = key.trim();
                panel = this.list[key];
            }

            if (panel != null) {
                panel.show();
            } else if (autoCreate) {
                return this.open(type, key, fit);
            }

            return panel;
        }

        static hide(key) {
            let panel = this.defaultPanel;
            if (key != null && key.trim().length > 0) {
                key = key.trim();
                panel = this.list[key];
            }

            if (panel != null) { panel.hide(); }
            return panel;
        }
    }
    manager.defaultPanel = null;

    class msgbox extends base {
        static get msgList() {
            if (this._msgList == null) {
                this._msgList = [];
            }
            return this._msgList;
        }
        static get windowInst() {
            if (this._windowInst == null) {
                this._windowInst = window.create()
                    .attach(msgbox)
                    .scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight)
                    .block(true);
            }
            return this._windowInst;
        }
        static show(params) {
            if (msgbox.windowInst.isShowing()) {
                msgbox.msgList.push(params);
            } else {
                msgbox.windowInst
                    .update(msgbox, (unit) => {
                        unit.setTitle(params.title)
                            .setContent(params.content)
                            .setConfirmText(params.confirmText)
                            .setCancelText(params.cancelText)
                            .setConfirmHandler(params.confirmHandler)
                            .setCancelHandler(params.cancelHandler)
                            .switchCancel(params.hideCancel)
                            .apply();
                    })
                    .align(AlignType.Center)
                    .show()
                    .front();
            }
        }
        static hide() {
            msgbox.windowInst.hide();
            if (msgbox.msgList.length > 0) {
                msgbox.show(msgbox.msgList.pop());
            }
        }
        static clear() {
            msgbox._msgList = [];
        }
        constructor(component) {
            super(component);
            component.btn_confirm.onClick(this, this.onConfirmClick);
            component.btn_cancel.onClick(this, this.onCancelClick);
        }
        static make() {
            let view = zs.ui.FGUI_msgbox.createInstance();
            return view;
        }
        static type() {
            return zs.ui.FGUI_msgbox;
        }
        check(component) {
            if (component instanceof zs.ui.FGUI_msgbox) {
                return true;
            }
            return false;
        }
        setTitle(title) {
            if (title) {
                this.view.title.text = title;
            } else {
                this.view.title.text = "提示";
            }
            return this;
        }
        setContent(content) {
            if (content) {
                this.view.content.text = content;
            } else {
                this.view.content.text = "";
            }
            return this;
        }
        setConfirmText(value) {
            if (value) {
                this.view.btn_confirm.title = value;
            } else {
                this.view.btn_confirm.title = "确定";
            }
            return this;
        }
        setCancelText(value) {
            if (value) {
                this.view.btn_cancel.title = value;
            } else {
                this.view.btn_cancel.title = "取消";
            }
            return this;
        }
        switchCancel(isHide) {
            return isHide ? this.hideCancel() : this.showCancel();
        }
        showCancel() {
            this.view.state.selectedIndex = 1;
            return this;
        }
        hideCancel() {
            this.view.state.selectedIndex = 0;
            return this;
        }
        setConfirmHandler(handler) {
            console.log("set confirm handler");
            this.confirmHandler = handler;
            return this;
        }
        setCancelHandler(handler) {
            this.cancelHandler = handler;
            return this;
        }
        onConfirmClick() {
            this.confirmHandler && this.confirmHandler.run();
            msgbox.hide();
        }
        onCancelClick() {
            this.cancelHandler && this.cancelHandler.run();
            msgbox.hide();
        }
    }

    exports.AlignType = AlignType;
    exports.configs = configs;
    exports.init = init;
    exports.loadPack = loadPack;
    exports.loadPacks = loadPacks;
    exports.base = base;
    exports.baseGeneric = baseGeneric;
    exports.window = window;
    exports.manager = manager;
    exports.msgbox = msgbox;
}(window.zs.fgui = window.zs.fgui || {}));