import FGUI_full_2 from "./export/FGUI_full_2";

export default class exporter_full_2 extends zs.exporter.full {

    static readonly mistakenOffset = 300;
    static readonly buttonOffsetTime = 1500;
    static readonly dragRecoverTime = 3;
    static readonly autoScrollSpeed = 50;
    static readonly autoScrollingDelay = 3000;
    static readonly checkScrollDistance = 30;
    static readonly fakePlayerMin = 8;
    static readonly fakePlayerMax = 680;

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

    rankIndies: number[];
    rankPlayNums: number[];
    _clickContinue: Laya.Handler;
    mistakenMoveY: number;
    bClickContinue: boolean;
    disposed: boolean;

    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_full_2) {
            component.rank1.onClick(this, this.onClickItem, [component.rank1]);
            component.rank3.onClick(this, this.onClickItem, [component.rank3]);
            component.rank3.onClick(this, this.onClickItem, [component.rank3]);

            component.btn_continue.onClick(this, this.onClickContinue);
            component.rankList.itemRenderer = Laya.Handler.create(this, this.onItemRenderer, null, false);
            component.rankList.on(fairygui.Events.CLICK_ITEM, this, this.onClickItem);
            component.rankList.on(fairygui.Events.DRAG_START, this, this.scrollStart);
            component.rankList.on(fairygui.Events.DRAG_END, this, this.scrollJumpExport);
            component.rankList.on(Laya.Event.MOUSE_DOWN, this, this.onDragStateBegin);
            component.rankList.on(Laya.Event.MOUSE_MOVE, this, this.onDragStateChanged);
        }
        // console.log(component);
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
    setItemByData(item, data: ExporterData, rank?: number) {
        item.picture.icon = data.app_icon;
        item.title.text = data.app_title;
        if (rank && rank > 0 && item.desc) {
            item.desc.text = `${this.rankPlayNums[rank - 1]}万人在玩`;
        } else if (item.desc) {
            item.desc.text = "";
        }
        if (item.viewCtrl && rank && rank > 0) {
            item.viewCtrl.setSelectedIndex(rank - 1)
        }
        item.data = data;
        return this;
    }
    onItemRenderer(index: number, item) {
        if (this.rankData == null || this.rankData.length <= index) {
            item.picture.icon = "";
            item.title.text = "";
            if (item.desc) {
                item.desc.text = "";
            }
            item.data = null;
        } else {
            let rank = index + 3;
            let data = this.rankData[this.rankIndies[rank]];
            item.picture.icon = data.app_icon;
            item.title.text = data.app_title;
            if (rank >= 0 && item.desc) {
                item.desc.text = `${this.rankPlayNums[rank]}万人在玩`;
            } else if (item.desc) {
                item.desc.text = "";
            }
            if (rank && item.rank) {
                item.rank.text = (rank + 1).toString();
            } else if (item.rank) {
                item.rank.text = "";
            }
            item.data = data;
        }
    }
    setMistaken(moveY = 200) {
        this.mistakenMoveY = moveY;
        (this.view as FGUI_full_2).btn_continue.y += this.mistakenMoveY;
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
            Laya.Tween.to(view.btn_continue, { y: moveY }, exporter_full_2.buttonOffsetTime, null, Laya.Handler.create(this, () => {
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
            view.rankList.numItems = 0;
            zs.exporter.dataMgr.load().then((result) => {
                let data = result.promotion || [];
                this.rankIndies = zs.utils.pickNumbers(0, result.promotion.length - 1, result.promotion.length);
                this.rankPlayNums = [];
                for (let i = 0; i < result.promotion.length; i++) {
                    this.rankPlayNums.push((Math.floor(Math.random() * exporter_full_2.fakePlayerMax) + exporter_full_2.fakePlayerMin) / 10);
                }
                this.rankPlayNums.sort((a, b) => b - a);
                if (data.length >= 3) {
                    this.setItemByData(view.rank1, data[this.rankIndies[0]], 1);
                    this.setItemByData(view.rank2, data[this.rankIndies[1]], 2);
                    this.setItemByData(view.rank3, data[this.rankIndies[2]], 3);
                }
                this.rankData = data;
                view.rankList.numItems = this.rankData ? Math.max(this.rankData.length - 3, 0) : 0;
                this.enterJumpExport();
                this.setMistaken(exporter_full_2.mistakenOffset);
                this._dragRecoverTime = exporter_full_2.dragRecoverTime;
                this._autoScrollSpeed = exporter_full_2.autoScrollSpeed;
                Laya.timer.clearAll(this);
                Laya.timer.once(exporter_full_2.autoScrollingDelay, this, () => {
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
        if (zs.exporter.utils.checkScroll(this.touchX, this.touchY, exporter_full_2.checkScrollDistance)) {
            var bScrollJump = zs.product.get("zs_slide_jump_switch");
            if (bScrollJump) {
                this.randomJumpExport();
            }
        }

    }
    randomJumpExport() {
        if (!this.rankData) return;
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
        let view = this.view as FGUI_full_2;
        if (view && view.rankList) {
            if (this._isAutoScrolling) {
                let scrollDis = this._autoScrollSpeed * Laya.timer.delta * 0.001 * (this._autoScrollForward ? 1 : -1);
                let scrollPane = view.rankList.scrollPane;
                scrollPane.setPosY(scrollDis + view.rankList.scrollPane.posY);
                if (scrollPane.percY >= 1) {
                    this._autoScrollForward = false;
                }
                else if (scrollPane.percY <= 0) {
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