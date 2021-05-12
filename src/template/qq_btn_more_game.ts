import FGUI_btn_moregame from "./qqPackage/FGUI_btn_moregame";

/*
* @ Desc:  qq更多好玩
* @ Author: jiangdiwei
* @ Data: 2021-05-08 09:33
*/
export default class qq_btn_more_game extends zs.fgui.base{

    owner: FGUI_btn_moregame;
    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_btn_moregame) {
            this.owner = component;
            this.owner.onClick(this, this.onClick);
        }
    }
    static make() {
        let view = FGUI_btn_moregame.createInstance();
        return view;
    }
    static type() {
        return FGUI_btn_moregame;
    }
    check(component) {
        if (component instanceof FGUI_btn_moregame) {
            return true;
        }
        return false;
    }
    apply() {
        return this;
    }
    onClick() {
        zs.platform.sync.showAppBox(null, Laya.Handler.create(this, () => {
            zs.platform.sync.showToast("暂无更多好玩");
        }));
    }
}