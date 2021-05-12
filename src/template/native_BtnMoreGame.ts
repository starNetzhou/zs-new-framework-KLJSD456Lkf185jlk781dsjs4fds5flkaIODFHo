import FGUI_MoreGameBtn from "./export/FGUI_MoreGameBtn";

/*
* @ Author: yangcheng
* @ Data: 2021-03-11 15:48
*/
export default class native_BtnMoreGame extends zs.fgui.baseGeneric<FGUI_MoreGameBtn> {

    static typeDefine = FGUI_MoreGameBtn;

    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_MoreGameBtn) {
            component.btnMoreGame.onClick(this, this.onClick);
        }
    }

    apply() {
        let qgg = window['qg'] as any;
        if (qgg) {
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