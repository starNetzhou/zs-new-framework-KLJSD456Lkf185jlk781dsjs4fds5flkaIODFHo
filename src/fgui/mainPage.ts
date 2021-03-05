import fgui_entity from "./fgui_entity";

export default class mainPage extends zs.fgui.base {
    static make(): fairygui.GComponent {
        return fgui_entity.createInstance();
    }

    static type(): typeof fairygui.GComponent {
        return fgui_entity;
    }

    check(component: fairygui.GComponent): boolean {
        return component instanceof fgui_entity;
    }

    init() {
        console.log("mainPage init");
        let view = this.view as fgui_entity;
        view.img.touchable = true;
        view.txt.onClick(this, () => {
            console.log("txt click");
        });
        view.graph.onClick(this, () => {
            console.log("graph click");
        });
        view.txt.touchable = true;
        view.img.onClick(this, () => {
            console.log("img click");
        });
        view.loader.onClick(this, () => {
            zs.core.workflow.next();
            console.log("loader click");
        });
    }
}