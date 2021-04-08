import FGUI_full_1 from "./export/FGUI_full_1";

export default class exporter_full_1 extends zs.exporter.full {
	// 拖拽自动弹导出生效距离
    static readonly checkScrollDistance = 30;
	// 自动滚动时间
    static readonly autoScrollTime = 3000;
	// 拖拽恢复时间
    static readonly dragRecoverTime = 3;
	// 自动滚动速度
    static readonly autoScrollSpeed = 50;
	// 误触偏移
    static readonly mistakenOffset = 350;

    // 列表一长度
    maxList_1: number;
    // 列表二长度
    maxList_2: number;

    // 列表一
    list_1: fairygui.GList;
    // 列表二
    list_2: fairygui.GList;
    // 列表三
    list_3: fairygui.GList;

    // 控件名称
    viewName: string;

    // 列表一数据
    _datas_1: ExporterData[];
    // 列表二数据
    _datas_2: ExporterData[];
    // 列表三数据
    _datas_3: ExporterData[];
    // 点击事件回调
    _clickHandler: Laya.Handler;
    // 拖拽恢复时间
    _dragRecoverTime: number;
    // 自动滚动速度
    _autoScrollSpeed: number;
    // 是否自动滚动中
    _isAutoScrolling: boolean;
    // 是否准备拖拽
    _readyDrag: boolean;
    // 拖拽计时
    _dragStopCount: number;
    // 整体是否向前滚动
    _autoScrollForward: boolean;
    // 局部是否向前滚动
    _autoScrollForward2: boolean;
    // 屏幕触摸位置X
    touchX: number;
    // 屏幕触摸位置Y
    touchY: number;
    // Y轴误触移动
    mistakenMoveY: number;
    // 是否点击继续
    bClickContinue: boolean;
    // 是否被销毁
    disposed: boolean;
    // 点击继续事件回调
    _clickContinue: Laya.Handler;
    // 导出数据
    _datas: ExporterData[];

    constructor(component) {
        super(component);
        this.maxList_1 = 3;
        this.maxList_2 = 4;
        if (component && component instanceof FGUI_full_1) {
            this.list_1 = component.listAch;
            this.list_2 = component.listHot;
            this.list_1.setVirtualAndLoop();

            this.list_1.itemRenderer = Laya.Handler.create(this, this.onItem1Renderer, null, false);
            this.list_2.itemRenderer = Laya.Handler.create(this, this.onItem2Renderer, null, false);

            this.list_1.on(fairygui.Events.CLICK_ITEM, this, this.onClickItem1);
            this.list_2.on(fairygui.Events.CLICK_ITEM, this, this.onClickItem2);

            this.list_1.on(fairygui.Events.DRAG_START, this, this.scrollStart);
            this.list_1.on(fairygui.Events.DRAG_END, this, this.scrollJumpExport);
            this.list_2.on(fairygui.Events.DRAG_START, this, this.scrollStart);
            this.list_2.on(fairygui.Events.DRAG_END, this, this.scrollJumpExport);

            this.list_1.on(fgui.Events.SCROLL, this, this.doSpecialEffect);


            this.list_1.childrenRenderOrder = fgui.ChildrenRenderOrder.Arch;
            this.list_1.apexIndex = 1;
            this.list_2.on(Laya.Event.MOUSE_DOWN, this, this.onDragStateBegin);
            this.list_2.on(Laya.Event.MOUSE_MOVE, this, this.onDragStateChanged);
            component.btn_continue.onClick(this, this.onClickContinue);
            this.maxList_1 = this.list_1.numItems;
            this.maxList_2 = this.list_2.numItems;
        }
    }
    static make() {
        let view = FGUI_full_1.createInstance();
        return view;
    }
    static type() {
        return FGUI_full_1;
    }
    init() {
        super.init();
        this.viewName = "FULL_1";
        zs.platform.sync.hideBanner();
    }
    dispose() {
        super.dispose();
        let view = this.view as FGUI_full_1;
        Laya.Tween.clearAll(view.btn_continue);
        zs.platform.sync.hideBanner();
    }
    check(component) {
        if (component instanceof FGUI_full_1) {
            return true;
        }
        return false;
    }
    setData_1(datas) {
        this._datas_1 = datas.filter(element => true);
        this._datas_1.sort((a, b) => Math.random() > 0.5 ? -1 : 1)
        return this;
    }
    setData_2(datas) {
        this._datas_2 = datas.filter(element => true);
        this._datas_2.sort((a, b) => Math.random() > 0.5 ? -1 : 1)
        return this;
    }
    setMistaken(moveY = 200) {
        this.mistakenMoveY = moveY;
        return this;
    }
    onClickContinue() {
        let fullSwitch = zs.product.get("zs_full_screen_button_switch")
        let delayTime = zs.product.get("zs_button_delay_time")
        let view = this.view as FGUI_full_1;
        if (fullSwitch && !this.bClickContinue) {
            view.btn_continue.touchable = false;
            this.bClickContinue = true;
            let moveY = view.btn_continue.y - this.mistakenMoveY;
            Laya.Tween.to(view.btn_continue, { y: moveY }, 1500, null, Laya.Handler.create(this, () => {
                view.btn_continue.touchable = true;
            }), Number(delayTime));
            // 展示banner
            if (window.zs["wx"] && window.zs["wx"].banner) {
                var checkInit = !zs.platform.sync.hasBanner();
                var bannerTime = checkInit ? 0 : Number(delayTime) / 2;
                Laya.timer.once(bannerTime, this, function () {
                    zs.platform.sync.updateBanner({ isWait: false, checkInit: checkInit })
                })
            }
            return;
        }
        this._clickContinue && this._clickContinue.run();
    }
    apply() {
        let listView = this.view;
        if (listView) {
            this.list_1.numItems = 0;
            this.list_2.numItems = 0;
            zs.exporter.dataMgr.load().then((result) => {
                if (this.disposed) return;
                this.setData_1(result.promotion);
                this.setData_2(result.promotion);

                this.list_1.numItems = this._datas_1 ? this._datas_1.length : 0;
                this.list_2.numItems = this._datas_2 ? this._datas_2.length : 0;
                this.enterJumpExport();
                this.setMistaken(exporter_full_1.mistakenOffset);
                this.doSpecialEffect();
                this._dragRecoverTime = exporter_full_1.dragRecoverTime;
                this._autoScrollSpeed = exporter_full_1.autoScrollSpeed;
                Laya.timer.clearAll(this);
                Laya.timer.once(exporter_full_1.autoScrollTime, this, () => {
                    Laya.timer.frameLoop(1, this, this.onAutoScroll);
                    this._isAutoScrolling = true;
                })
            });
        }
        return this;
    }

    onItem1Renderer(index, item) {
        if (this._datas_1 == null || this._datas_1.length <= index) {
            item.picture.icon = "";
            item.title.text = "";
            if (item.desc) {
                item.desc.text = "";
            }
            item.data = null;
        } else {
            let data = this._datas_1[index];
            item.picture.icon = data.app_icon;
            item.title.text = data.app_title;
            if (data.app_desc && item.desc) {
                item.desc.text = data.app_desc;
            } else if (item.desc) {
                item.desc.text = "";
            }
            let bgCtrlList = [0, 1, 2]
            var idx = Math.floor(Math.random() * bgCtrlList.length)
            item.ditu1.setSelectedIndex(bgCtrlList[idx]);
            item.data = data;
        }
    }
    onItem2Renderer(index, item) {
        if (this._datas_2 == null || this._datas_2.length <= index) {
            item.picture.icon = "";
            item.title.text = "";
            if (item.desc) {
                item.desc.text = "";
            }
            item.rank.text = "";
            item.data = null;
        }
        else {
            let data = this._datas_2[index];
            item.picture.icon = data.app_icon;
            item.title.text = data.app_title;
            if (data.app_desc && item.desc) {
                item.desc.text = data.app_desc;
            }
            else if (item.desc) {
                item.desc.text = "";
            }
            item.rank.text = `${index + 1}`;
            item.data = data;
        }
    }
    refreshSingleItem(index, id, datas) {
        var newIdx = Math.floor(Math.random() * datas.length);
        if (datas.length > 1 && newIdx == index) {
            // 防止自己换自己
            return this.refreshSingleItem(index, id, datas);
        }
        // console.log("新的随机数是：", newIdx)
        var newData = datas[newIdx];
        var oldData = datas[index];
        if (newData) {
            datas[index] = newData;
            datas[newIdx] = oldData;
            switch (id) {
                case 1:
                    this.list_1.numItems = Math.min(this._datas_1 ? this._datas_1.length : 0, this.maxList_1);
                    break
                case 2:
                    this.list_2.numItems = this._datas_2 ? this._datas_2.length : 0;
                    break
                case 3:
                    this.list_3.numItems = this._datas_3 ? this._datas_3.length : 0;
                    break
            }
        }
    }
    onClickItem(item, evt, id) {
        if (this._clickHandler) {
            this._clickHandler.runWith(item);
        } else {
            zs.exporter.utils.navigateToMiniProgram(item.data).then(() => {
                var datas;
                switch (id) {
                    case 1:
                        datas = this._datas_1;
                        break
                    case 2:
                        datas = this._datas_2;
                        break
                }
                let index = datas.indexOf(item.data)
                this.refreshSingleItem(index, id, datas)
            });
        }
    }
    onClickItem1(item, evt) {
        this.onClickItem(item, evt, 1);
    }
    onClickItem2(item, evt) {
        this.onClickItem(item, evt, 2);
    }
    scrollStart() {
        this.touchX = Laya.stage.mouseX;
        this.touchY = Laya.stage.mouseY;
    }
    scrollJumpExport() {
        // 滑动跳出
        if (zs.exporter.utils.checkScroll(this.touchX, this.touchY, exporter_full_1.checkScrollDistance)) {
            var bScrollJump = zs.product.get("zs_slide_jump_switch");
            console.log("滑动跳转开关", bScrollJump)
            if (bScrollJump) {
                this.randomJumpExport();
            }
        }

    }
    randomJumpExport() {
        if (!this._datas || this._datas.length <= 0) return
        let data = this._datas_3[Math.floor(Math.random() * this._datas_3.length)];
        zs.exporter.utils.navigateToMiniProgram(data);
    }
    onDragStateBegin() {
        this._readyDrag = true;
    }
    onDragStateChanged() {
        if (this._readyDrag && this._dragRecoverTime > 0) {
            this._isAutoScrolling = false;
            this._dragStopCount = 0;
        }
        if (this._readyDrag) {
            this._readyDrag = false;
        }
    }
    onAutoScroll() {
        if (this._isAutoScrolling) {
            let scrollDis = 0;
            scrollDis = this._autoScrollSpeed * Laya.timer.delta * 0.001 * (this._autoScrollForward ? 1 : -1);
            let scrollPane = this.list_2.scrollPane;
            scrollPane.setPosY(scrollDis + this.list_2.scrollPane.posY);
            if (scrollPane.percY >= 1) {
                this._autoScrollForward = false;
            } else if (scrollPane.percY <= 0) {
                this._autoScrollForward = true;
            }
        } else {
            this._dragStopCount += Laya.timer.delta * 0.001;
            if (this._dragStopCount > this._dragRecoverTime) {
                this._dragStopCount = 0;
                this._isAutoScrolling = true;
            }
        }
        // }
    }
    doSpecialEffect() {
        var midX = this.list_1.scrollPane.posX + this.list_1.viewWidth / 2;
        var cnt = this.list_1.numChildren;
        for (var i = 0; i < cnt; i++) {
            var obj = this.list_1.getChildAt(i);
            var dist = Math.abs(midX - obj.x - obj.width / 2);
            if (dist > obj.width) //no intersection
            {
                obj.setScale(1, 1);
            }
            else {
                var ss = 1 + (1 - dist / obj.width) * 0.24;
                obj.setScale(ss, ss);
            }
        }
    }
}