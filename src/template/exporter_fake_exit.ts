import FGUI_fake_exit from "./export/FGUI_fake_exit";

export default class exporter_fake_exit extends zs.fgui.base {

    callback: Laya.Handler;

    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_fake_exit) {
            component.onClick(this, this.onBtnExitClick)
        }
        // console.log(component);
    }
    static make() {
        let view = FGUI_fake_exit.createInstance();
        return view;
    }
    static type() {
        return FGUI_fake_exit;
    }
    check(component) {
        if (component instanceof FGUI_fake_exit) {
            return true;
        }
        return false;
    }
    apply() {
        return this;
    }
    setClickHandler(callback) {
        this.callback = callback;
    }
    onBtnExitClick() {
        console.log("点击了")
        this.callback && this.callback.run();
    }
}