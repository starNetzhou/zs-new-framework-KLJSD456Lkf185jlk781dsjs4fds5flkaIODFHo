import FGUI_fake_exit from "./export/FGUI_fake_exit";

export default class exporter_fake_exit extends zs.fgui.base {

    static typeDefine = FGUI_fake_exit;

    event: string | string[];

    constructor(component) {
        super(component);
        component.onClick(this, this.onClicked)
    }
    apply() {
        return this;
    }
    applyConfig(config) {
        if (config) {
            config.event && (this.event = config.event);
        }
        return this;
    }
    onClicked() {
        this.event && zs.core.workflow && zs.core.workflow.runEventConfig(this.event);
    }
}