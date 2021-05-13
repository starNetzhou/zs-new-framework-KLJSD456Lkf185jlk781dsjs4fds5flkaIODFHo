import FGUI_btn_moregame from "./qqPackage/FGUI_btn_moregame";

/*
* @ Desc:  qq更多好玩
* @ Author: jiangdiwei
* @ Data: 2021-05-08 09:33
*/
export default class qq_btn_more_game extends zs.fgui.baseGeneric<FGUI_btn_moregame> {

    static typeDefine = FGUI_btn_moregame;

    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_btn_moregame) {
            component.onClick(this, this.onClick);
        }
    }
    
    onClick() {
        zs.platform.sync.showAppBox(null, Laya.Handler.create(this, () => {
            zs.platform.sync.showToast("暂无更多好玩");
        }));
    }
}