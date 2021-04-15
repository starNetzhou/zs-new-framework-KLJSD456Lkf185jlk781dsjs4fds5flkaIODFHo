import QQAd_btn_invite from "./export/QQAd_btn_invite";
import ProductKey from "./ProductKey";

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
        zs.platform.sync.openShare(ProductKey.zs_share_title, ProductKey.zs_share_img, Laya.Handler.create(this, (err) => {
            zs.platform.sync.showToast("分享失败");
        }));
    }
};