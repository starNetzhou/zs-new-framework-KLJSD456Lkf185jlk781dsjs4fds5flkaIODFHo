import FGUI_MoreGameBtn from "./export/FGUI_MoreGameBtn";

/*
* @ Author: yangcheng
* @ Data: 2021-03-11 15:48
*/
export default class native_BtnMoreGame extends zs.fgui.base {
    owner: FGUI_MoreGameBtn;
    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_MoreGameBtn) {
            this.owner = component;
            this.owner.btnMoreGame.onClick(this, this.onClick);
        }
    }
    static make() {
        let view = FGUI_MoreGameBtn.createInstance();
        return view;
    }
    static type() {
        return FGUI_MoreGameBtn;
    }
    check(component) {
        if (component instanceof FGUI_MoreGameBtn) {
            return true;
        }
        return false;
    }
    closed = false;
    apply() {
        let qgg = window['qg'] as any;
        if (qgg) {
            this.owner.visible = qgg.getSystemInfoSync().platformVersionCode >= 1076;
        }
        return this;
    }
    onClick() {
        zs.platform.async.showGamePortalAd().catch(() => {
            zs.platform.sync.showToast('暂无更多游戏');
        })
    }
}