export default class ExampleUI {
    scene: Laya.Scene;
    btn_Continue: Laya.Button;
    lbl_Workflow: Laya.Label;

    eventThis: any;
    eventFunc: Function;

    constructor(scene: Laya.Scene) {
        this.scene = scene;
        this.btn_Continue = scene.getChildByName("btn_Continue") as Laya.Button;
        this.lbl_Workflow = scene.getChildByName("lbl_Workflow") as Laya.Label;
        this.btn_Continue.on(Laya.Event.CLICK, this, this.onBtnClick);
    }

    show(): ExampleUI {
        this.scene.visible = true;
        return this;
    }

    hide(): ExampleUI {
        this.scene.visible = false;
        return this;
    }

    setWorkflowState(state: string, hideBtn?: boolean): ExampleUI {
        this.lbl_Workflow.text = state;
        if (hideBtn) {
            this.btn_Continue.visible = false;
        } else {
            this.btn_Continue.visible = true;
        }
        return this;
    }

    onBtnClick() {
        this.eventThis && this.eventFunc && (this.eventFunc.call(this.eventThis));
    }

    setBtnClickEvent(thisObj: any, listener: Function): ExampleUI {
        this.eventThis = thisObj;
        this.eventFunc = listener;
        return this;
    }
}