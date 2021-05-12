/*
* @ Desc:  qq邀请好友按钮
* @ Author: jiangdiwei
* @ Data: 2021-05-08 09:31
*/
import ProductKey from "./ProductKey";
import FGUI_btn_invite from "./qqPackage/FGUI_btn_invite";

export default class qq_btn_invite extends zs.fgui.base{

    owner: FGUI_btn_invite;
    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_btn_invite) {
            this.owner = component;
            this.owner.onClick(this, this.onClick);
        }
    }
    static make() {
        let view = FGUI_btn_invite.createInstance();
        return view;
    }
    static type() {
        return FGUI_btn_invite;
    }
    check(component) {
        if (component instanceof FGUI_btn_invite) {
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
}