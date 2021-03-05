import FGUI_full_2 from "./export/FGUI_full_2";

export default class exporter_full_2 extends zs.exporter.full {

    rankData: ExporterData[];

    viewName: string;

    _clickHandler: Laya.Handler;
    _dragRecoverTime: number;
    _autoScrollSpeed: number;
    _isAutoScrolling: boolean;
    _readyDrag: boolean;
    _dragStopCount: number;
    _autoScrollForward: boolean;
    touchX: number;
    touchY: number;

    mistakenMoveY: number;
    bClickContinue: boolean;
    disposed: boolean;
    _clickContinue: Laya.Handler;

    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_full_2) {

            component.btn_continue.onClick(this, this.onClickContinue);
            component.list.itemRenderer = Laya.Handler.create(this, this.onItemRenderer, null, false);
            component.list.on(fairygui.Events.CLICK_ITEM, this, this.onClickItem);
            component.list.on(fairygui.Events.DRAG_START, this, this.scrollStart);
            component.list.on(fairygui.Events.DRAG_END, this, this.scrollJumpExport);
            component.list.on(Laya.Event.MOUSE_DOWN, this, this.onDragStateBegin);
            component.list.on(Laya.Event.MOUSE_MOVE, this, this.onDragStateChanged);
        }
    }
    static make() {
        let view = FGUI_full_2.createInstance();
        return view;
    }
    static type() {
        return FGUI_full_2;
    }
    init() {
        super.init();
        this.viewName = "FULL_2";
        this.closeBanner();
    }
    closeBanner() {
        if (window.zs["wx"] && window.zs["wx"].banner) {
            let wxBannerMgr = zs["wx"].banner.WxBannerMgr.Instance;
            wxBannerMgr.hideAll();
        }
    }
    dispose() {
        super.dispose();
        let view = this.view as FGUI_full_2;
        Laya.Tween.clearAll(view.btn_continue);
        this.closeBanner();
    }
    check(component) {
        if (component instanceof FGUI_full_2) {
            return true;
        }
        return false;
    }
    // setItemByData(item, data) {
    //     item.picture.icon = data.app_icon;
    //     item.title.text = data.app_title;
    //     if (data.playNum && item.desc) {
    //         item.desc.text = `${data.playNum}万人在玩`;
    //     } else if (item.desc) {
    //         item.desc.text = "";
    //     }
    //     if (item.viewCtrl && data.rank) {
    //         item.viewCtrl.setSelectedIndex(data.rank - 1)
    //     }
    //     item.data = data;
    //     return this;
    // }
    onItemRenderer(index: number, item) {
        if (index < 0 || this.rankData == null || this.rankData.length <= index) {
            item.picture.icon = "";
            item.title.text = "";
            if (item.desc) {
                item.desc.text = "";
            }
            item.data = null;
        } else {
            let data = this.rankData[index];
            item.picture.icon = data.app_icon;
            item.title.text = data.app_title;
            item.data = data;
        }
    }
    setMistaken(moveY = 200) {
        this.mistakenMoveY = moveY;
        return this;
    }
    onClickContinue() {
        let fullSwitch = zs.product.get("zs_full_screen_button_switch")
        let delayTime = zs.product.get("zs_button_delay_time")
        let view = this.view as FGUI_full_2;
        if (fullSwitch && !this.bClickContinue) {
            view.btn_continue.touchable = false;
            this.bClickContinue = true;
            let moveY = view.btn_continue.y - this.mistakenMoveY;
            Laya.Tween.to(view.btn_continue, { y: moveY }, 1500, null, Laya.Handler.create(this, () => {
                view.btn_continue.touchable = true;
            }), Number(delayTime))
            // 展示banner
            if (window.zs["wx"] && window.zs["wx"].banner) {
                let wxBannerMgr = zs["wx"].banner.WxBannerMgr.Instance;
                wxBannerMgr.updateBanner(false);
            }
            return;
        }
        this._clickContinue && this._clickContinue.run();
    }
    apply() {
        let view = this.view as FGUI_full_2;
        if (view) {
            view.list.numItems = 0;
            zs.exporter.dataMgr.load().then((result) => {
                if (this.disposed) return;
                let data = result.promotion || [];
                this.rankData = data;
                view.list.numItems = this.rankData ? this.rankData.length : 0;
                this.enterJumpExport();
                this.setMistaken(350);
                this._dragRecoverTime = 3;
                this._autoScrollSpeed = 50;
                Laya.timer.clearAll(this);
                Laya.timer.once(3000, this, () => {
                    Laya.timer.frameLoop(1, this, this.onAutoScroll);
                    this._isAutoScrolling = true;
                })
            });
        }
        return this;
    }
    onClickItem(item, evt) {
        if (this._clickHandler) {
            this._clickHandler.runWith(item);
        } else {
            zs.exporter.utils.navigateToMiniProgram(item.data);
        }
    }
    scrollStart() {
        this.touchX = Laya.stage.mouseX;
        this.touchY = Laya.stage.mouseY;
    }
    scrollJumpExport(event) {
        // 滑动跳出
        if (zs.exporter.utils.checkScroll(this.touchX, this.touchY, 30)) {
            var bScrollJump = zs.product.get("zs_slide_jump_switch");
            if (bScrollJump) {
                this.randomJumpExport();
            }
        }

    }
    randomJumpExport() {
        if (!this.rankData || this.rankData.length <= 0) return;
        let data = this.rankData[Math.floor(Math.random() * this.rankData.length)];
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
        let listView = this.view as FGUI_full_2;
        if (listView && listView.list) {
            if (this._isAutoScrolling) {
                let scrollDis = this._autoScrollSpeed * Laya.timer.delta * 0.001 * (this._autoScrollForward ? 1 : -1);
                let scrollPane = listView.list.scrollPane;
                scrollPane.setPosX(scrollDis + listView.list.scrollPane.posX);
                if (scrollPane.percX >= 1) {
                    this._autoScrollForward = false;
                }
                else if (scrollPane.percX <= 0) {
                    this._autoScrollForward = true;
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
}