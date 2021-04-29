export default class exporter_background extends zs.fgui.base {

    background: fairygui.GGraph;

    constructor(component: fairygui.GComponent) {
        super(component);
        let graphBack = new fairygui.GGraph();
        graphBack.drawRect(0, '#000000', '#000000');
        graphBack.alpha = 0.5;
        component.addChild(graphBack);
        graphBack.x = -fairygui.GRoot.inst.width * 0.25;
        graphBack.y = -fairygui.GRoot.inst.height * 0.25;
        graphBack.width = fairygui.GRoot.inst.width * 2;
        graphBack.height = fairygui.GRoot.inst.height * 2;
    }

    get color(): string {
        return this.background ? this.background.color : "";
    }

    set color(value: string) {
        this.background && (this.background.color = value);
    }

    get alpha(): number {
        return this.background ? this.background.alpha : 0;
    }

    set alpha(value: number) {
        this.background && (this.background.alpha = value);
    }
}
