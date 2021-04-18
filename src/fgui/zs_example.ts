import FGUI_main from "./FGUI_main";

export default class zs_example extends zs.fgui.baseGeneric<FGUI_main> {
    static typeDefine = FGUI_main;

    eventThis: any;
    eventFunc: Function;

    constructor(component) {
        super(component);
        this.view.btn.onClick(this, this.onBtnClick);
    }

    setWorkflowState(state: string, hideBtn?: boolean): zs_example {
        this.view.hint.text = "工作流\n" + state;
        if (hideBtn) {
            this.view.btn.visible = false;
        } else {
            this.view.btn.visible = true;
        }
        return this;
    }
    setBtnText(content: string): zs_example {
        this.view.btn.title = content;
        return this;
    }

    onBtnClick() {
        this.eventThis && this.eventFunc && (this.eventFunc.call(this.eventThis));
    }
    
    setBtnClickEvent(thisObj: any, listener: Function): zs_example {
        this.eventThis = thisObj;
        this.eventFunc = listener;
        return this;
    }
}