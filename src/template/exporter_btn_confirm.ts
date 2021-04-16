import FGUI_btnCancel from "./export/FGUI_btnCancel";
import FGUI_btnComfire from "./export/FGUI_btnConfirm";

export default class exporter_btn_confirm extends zs.fgui.baseGeneric<FGUI_btnComfire>  {
    static typeDefine = FGUI_btnComfire;

    constructor(component: FGUI_btnComfire) {
        super(component);
        component.onClick(this, () => {
            zs.core.workflow.next();
        });
    }
}