import FGUI_full_1 from "./export/FGUI_full_1";
import FGUI_full_1_content from "./export/FGUI_full_1_content";

export default class exporter_full_1 extends zs.exporter.full {

    static readonly updateBannerDelay = 500;
    static readonly mistakenOffset = 300;
    static readonly autoScrollingDelay = 3000;
    static readonly contentHeight = 313;
    static readonly dragRecoverTime = 3;
    static readonly checkScrollDistance = 30;
    static readonly autoScrollSpeed = 50;

    maxList_1: number;
    maxList_2: number;

    list_1: fairygui.GList;
    list_2: fairygui.GList;
    list_3: fairygui.GList;
    full_1_content: FGUI_full_1_content;

    viewName: string;

    _datas_1: ExporterData[];
    _datas_2: ExporterData[];
    _datas_3: ExporterData[];
    _clickHandler: Laya.Handler;
    _dragRecoverTime: number;
    _autoScrollSpeed: number;
    _isAutoScrolling: boolean;
    _readyDrag: boolean;
    _dragStopCount: number;
    _autoScrollForward: boolean;
    _autoScrollForward2: boolean;
    touchX: number;
    touchY: number;
    bClickContinue: boolean;
    delayTime1: number;
    delayTime2: number;
    _clickContinue: Laya.Handler;

    constructor(component: FGUI_full_1) {
        super(component);
        this.maxList_1 = 3;
        this.maxList_2 = 4;
        if (component && component instanceof FGUI_full_1) {
            var full_1_content = component.list.getChildAt(0) as FGUI_full_1_content;
            this.list_1 = full_1_content.getChild("list_1") as fairygui.GList;
            this.list_2 = full_1_content.getChild("list_2") as fairygui.GList;
            this.list_3 = full_1_content.getChild("list_3") as fairygui.GList;
            this.full_1_content = full_1_content;

            this.list_1.itemRenderer = Laya.Handler.create(this, this.onItem1Renderer, null, false);
            this.list_2.itemRenderer = Laya.Handler.create(this, this.onItem2Renderer, null, false);
            this.list_3.itemRenderer = Laya.Handler.create(this, this.onItem3Renderer, null, false);
            this.list_1.on(fairygui.Events.CLICK_ITEM, this, this.onClickItem1);
            this.list_2.on(fairygui.Events.CLICK_ITEM, this, this.onClickItem2);
            this.list_3.on(fairygui.Events.CLICK_ITEM, this, this.onClickItem3);
            component.list.on(fairygui.Events.DRAG_START, this, this.scrollStart);
            component.list.on(fairygui.Events.DRAG_END, this, this.scrollJumpExport);
            component.list.on(Laya.Event.MOUSE_DOWN, this, this.onDragStateBegin);
            component.list.on(Laya.Event.MOUSE_MOVE, this, this.onDragStateChanged);
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
        this.viewName = "FULL_1"
        zs.platform.sync.hideBanner();
    }
    dispose() {
        super.dispose();
        let view = this.view as FGUI_full_1;
        Laya.Tween.clearAll(view.btn_continue);
        clearTimeout(this.delayTime1);
        clearTimeout(this.delayTime2);
        zs.platform.sync.hideBanner();
    }
    check(component: FGUI_full_1) {
        if (component instanceof FGUI_full_1) {
            return true;
        }
        return false;
    }
    setData_1(datas: ExporterData[]) {
        this._datas_1 = datas.filter(element => true);
        this._datas_1.sort((a, b) => Math.random() > 0.5 ? -1 : 1)
        return this;
    }
    setData_2(datas: ExporterData[]) {
        this._datas_2 = datas.filter(element => true);
        this._datas_2.sort((a, b) => Math.random() > 0.5 ? -1 : 1)
        return this;
    }
    setData_3(datas) {
        this._datas_3 = datas.filter(element => true);
        this._datas_3.sort((a, b) => Math.random() > 0.5 ? -1 : 1)
        return this;
    }
    setMistaken(moveY = 200) {
        let view = this.view as FGUI_full_1;
        view.btn_continue.y += moveY;
        return this;
    }
    onClickContinue() {
        let fullSwitch = zs.product.get("zs_full_screen_button_switch")
        let view = this.view as FGUI_full_1;
        let zs_full_screen_banner_time = zs.product.get("zs_full_screen_banner_time");
        if (fullSwitch && !this.bClickContinue) {
            view.btn_continue.touchable = false;
            this.bClickContinue = true;
            // 展示banner
            zs.platform.sync.updateBanner({isWait: true});
            this.delayTime1 = setTimeout(() => {
                zs.platform.sync.updateBanner({isWait: false});
            }, exporter_full_1.updateBannerDelay)
            this.delayTime2 = setTimeout(() => {
                zs.platform.sync.hideBanner();
                view.btn_continue.touchable = true;
            }, zs_full_screen_banner_time * 1000)
            return;
        }
        this._clickContinue && this._clickContinue.run();
    }
    apply() {
        let view = this.view as FGUI_full_1;
        if (view) {
            this.list_1.numItems = 0;
            this.list_2.numItems = 0;
            this.list_3.numItems = 0;
            zs.exporter.dataMgr.load().then((result) => {
                this.setData_1(result.promotion);
                this.setData_2(result.promotion);
                this.setData_3(result.promotion);

                this.list_1.numItems = Math.min(this._datas_1 ? this._datas_1.length : 0, this.maxList_1);
                this.list_2.numItems = this._datas_2 ? this._datas_2.length : 0;
                this.list_3.numItems = this._datas_3 ? this._datas_3.length : 0;
                this.setContentHeight();
                this.enterJumpExport();
                this.setMistaken(exporter_full_1.mistakenOffset);
                this._dragRecoverTime = exporter_full_1.dragRecoverTime;
                this._autoScrollSpeed = exporter_full_1.autoScrollSpeed;
                Laya.timer.clearAll(this);
                Laya.timer.once(exporter_full_1.autoScrollingDelay, this, () => {
                    Laya.timer.frameLoop(1, this, this.onAutoScroll);
                    this._isAutoScrolling = true;
                })
            });
        }
        return this;
    }
    setContentHeight() {
        var numItems = this._datas_3 ? this._datas_3.length : 0;
        var cows = Math.ceil(numItems / 4);
        var itemHeight = exporter_full_1.contentHeight;
        var height = cows * itemHeight + (cows - 1) * this.list_3.lineGap
        var addHeight = height - this.list_3.height;
        if (addHeight > 0) {
            this.full_1_content.height += addHeight;
        }

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
            item.data = data;
        }
    }
    onItem3Renderer(index, item) {
        if (this._datas_3 == null || this._datas_3.length <= index) {
            item.picture.icon = "";
            item.title.text = "";
            if (item.desc) {
                item.desc.text = "";
            }
            item.data = null;
        }
        else {
            let data = this._datas_3[index];
            item.picture.icon = data.app_icon;
            item.title.text = data.app_title;
            if (data.app_desc && item.desc) {
                item.desc.text = data.app_desc;
            }
            else if (item.desc) {
                item.desc.text = "";
            }
            item.data = data;
        }
        // console.log("list3", index)
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
                    case 3:
                        datas = this._datas_3;
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
    onClickItem3(item, evt) {
        this.onClickItem(item, evt, 3);
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
        let view = this.view as FGUI_full_1;
        if (this._isAutoScrolling) {
            // 整体的
            let scrollDis = this._autoScrollSpeed * Laya.timer.delta * 0.001 * (this._autoScrollForward ? 1 : -1);
            let scrollPane = view.list.scrollPane;
            scrollPane.setPosY(scrollDis + view.list.scrollPane.posY);
            if (scrollPane.percY >= 1) {
                this._autoScrollForward = false;
            }
            else if (scrollPane.percY <= 0) {
                this._autoScrollForward = true;
            }
            // 局部的
            scrollDis = this._autoScrollSpeed * Laya.timer.delta * 0.001 * (this._autoScrollForward2 ? 1 : -1);
            let scrollPane2 = this.list_2.scrollPane;
            scrollPane2.setPosX(scrollDis + scrollPane2.posX);

            if (scrollPane2.percX >= 1) {
                this._autoScrollForward2 = false;
            }
            else if (scrollPane2.percX <= 0) {
                this._autoScrollForward2 = true;
            }
        }
        else {
            this._dragStopCount += Laya.timer.delta * 0.001;
            if (this._dragStopCount > this._dragRecoverTime) {
                this._dragStopCount = 0;
                this._isAutoScrolling = true;
            }
        }
    }
}