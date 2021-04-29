import FGUI_btnConfirm from "./export/FGUI_btnConfirm";

export default class exporter_btn_confirm extends zs.fgui.baseGeneric<FGUI_btnConfirm>  {
    static typeDefine = FGUI_btnConfirm;

    thisObj: any;
    callback: Function;

    constructor(component: FGUI_btnConfirm) {
        super(component);
        component.onClick(this, this.onClick);
    }

    setClickEvent(thisObj: any, event: Function): exporter_btn_confirm {
        this.thisObj = thisObj;
        this.callback = event;
        return this;
    }

    onClick() {
        if (this.callback) {
            this.callback.call(this.thisObj);
        }
    }
}