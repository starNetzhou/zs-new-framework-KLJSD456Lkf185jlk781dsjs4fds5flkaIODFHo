import FGUI_fake_exit from "./export/FGUI_fake_exit";

export default class exporter_fake_exit extends zs.fgui.base {

    static typeDefine = FGUI_fake_exit;

    // 事件回调
    callback: Laya.Handler;

    constructor(component) {
        super(component);
        component.onClick(this, this.onBtnExitClick)
    }
    apply() {
        return this;
    }
    setClickHandler(callback) {
        this.callback = callback;
    }
    onBtnExitClick() {
        this.callback && this.callback.run();
    }
}