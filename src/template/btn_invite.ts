import QQAd_btn_invite from "./export/QQAd_btn_invite";

export default class btn_invite extends zs.fgui.base {
    owner: QQAd_btn_invite;
    constructor(component) {
        super(component);
        if (component && component instanceof QQAd_btn_invite) {
            this.owner = component;
            this.owner.onClick(this, this.onClick);
        }
    }
    static make() {
        let view = QQAd_btn_invite.createInstance();
        return view;
    }
    static type() {
        return QQAd_btn_invite;
    }
    check(component) {
        if (component instanceof QQAd_btn_invite) {
            return true;
        }
        return false;
    }
    apply() {
        return this;
    }
    onClick() {
        zs.platform.sync.openShare(zs.product.get("zs_share_title"), zs.product.get("zs_share_image"), function (err) {
            zs.platform.sync.showToast("分享失败");
        })
    }
};