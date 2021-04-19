import FGUI_btnConfirm from "./export/FGUI_btnConfirm";

export default class exporter_btn_confirm extends zs.fgui.baseGeneric<FGUI_btnConfirm>  {
    static typeDefine = FGUI_btnConfirm;

    constructor(component: FGUI_btnConfirm) {
        super(component);
        component.onClick(this, () => {
            zs.core.workflow.next();
        });
    }
}