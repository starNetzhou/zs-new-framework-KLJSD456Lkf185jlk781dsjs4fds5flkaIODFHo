import FGUI_addDeskBtn from "./export/FGUI_addDeskBtn";

/*
* @ Author: yangcheng
* @ Data: 2021-03-11 15:48
*/
export default class native_BtnAddDesk extends zs.fgui.base {

    owner: FGUI_addDeskBtn;

    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_addDeskBtn) {
            this.owner = component;
            this.owner.btnAddDesk.onClick(this, this.onClick);
        }
    }
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
    apply() {
        this.owner.visible = false;
        //true 就是 有 icon false 是没有
        zs.platform.async.hasDesktopIcon().then((hasIcon) => {
            this.owner.visible = !hasIcon;
        }).catch(() => {
            this.owner.visible = true;
        });
        return this;
    }
    onClick() {
        zs.platform.async.createDesktopIcon().then(() => {
            //添加成功 隐藏当前按钮
            this.owner.visible = false;
        }).catch(() => {
            console.log("🐑 : --- >>> ", "....");
        });
    }

    dispose() {
        super.dispose();
    }
}