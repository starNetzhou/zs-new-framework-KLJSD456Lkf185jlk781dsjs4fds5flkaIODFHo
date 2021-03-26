import FGUI_addDeskBtn from "./export/FGUI_addDeskBtn";

/*
* @ Author: yangcheng
* @ Data: 2021-03-11 15:48
*/
export default class native_BtnAddDesk extends zs.fgui.base {// oppo 原生平台的添加桌面方法
    static make() {
        let view = FGUI_addDeskBtn.createInstance();
        return view;
    }
    static type() {
        return FGUI_addDeskBtn;
    }
    check(component) {
        if (component instanceof FGUI_addDeskBtn) {
            return true;
        }
        return false;
    }
    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_addDeskBtn) {
            (this.view as FGUI_addDeskBtn).btnAddDesk.onClick(this, this.onClick);
        }
    }
    apply() {
        let view = this.view as FGUI_addDeskBtn;
        view.visible = false;
        //true 就是 有 icon false 是没有
        zs.platform.async.hasDesktopIcon().then((hasIcon) => {
            view.visible = !hasIcon;
        }).catch(() => {
            view.visible = true;
        });
        return this;
    }
    onClick() {
        zs.platform.async.createDesktopIcon().then(() => {
            //添加成功 隐藏当前按钮
            (this.view as FGUI_addDeskBtn).visible = false;
        }).catch(() => {
            console.log("🐑 : --- >>> ", "....");
        });
    }
    dispose() {
        super.dispose();
    }
}