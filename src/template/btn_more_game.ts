import QQAd_btn_moregame from "./export/QQAd_btn_moregame";

export default class btn_more_game extends zs.fgui.base {
    owner: QQAd_btn_moregame;
    constructor(component) {
        super(component);
        if (component && component instanceof QQAd_btn_moregame) {
            this.owner = component;
            this.owner.onClick(this, this.onClick);
        }
    }
    static make() {
        let view = QQAd_btn_moregame.createInstance();
        return view;
    }
    static type() {
        return QQAd_btn_moregame;
    }
    check(component) {
        if (component instanceof QQAd_btn_moregame) {
            return true;
        }
        return false;
    }
    apply() {
        return this;
    }
    onClick() {
        zs.platform.sync.showAppBox(null, function () {
            zs.platform.sync.showToast("暂无更多好玩");
        });
    }
};