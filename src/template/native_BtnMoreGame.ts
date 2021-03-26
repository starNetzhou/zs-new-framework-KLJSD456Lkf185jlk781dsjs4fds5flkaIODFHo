import FGUI_MoreGameBtn from "./export/FGUI_MoreGameBtn";

/*
* @ Author: yangcheng
* @ Data: 2021-03-11 15:48
*/
export default class native_BtnMoreGame extends zs.fgui.base {//分享更多好玩 oppo 原生平台的资源互推

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

    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_MoreGameBtn) {
            (this.view as FGUI_MoreGameBtn).btnMoreGame.onClick(this, this.onClick);
        }
    }

    apply() {
        let qgg = window['qg'] as any;
        if (qgg) {
            //获取当前平台的版本 大于等于 1076 才展示这个按钮
            (this.view as FGUI_MoreGameBtn).visible = qgg.getSystemInfoSync().platformVersionCode >= 1076;
        }
        return this;
    }
    onClick() {
        zs.platform.async.showGamePortalAd().then(() => {
            zs.platform.sync.hideBanner();
        }).catch(() => {
            zs.platform.sync.showToast('暂无更多游戏');
        })
    }
}