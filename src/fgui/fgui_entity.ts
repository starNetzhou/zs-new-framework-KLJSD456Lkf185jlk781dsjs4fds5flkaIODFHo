/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class fgui_entity extends fgui.GComponent {

	public txt:fgui.GTextField;
	public graph:fgui.GGraph;
	public img:fgui.GImage;
	public loader:fgui.GLoader;
	public static URL:string = "ui://ryds8p76l0fpe";

	public static createInstance():fgui_entity {
		return <fgui_entity>(fgui.UIPackage.createObject("main", "entity"));
	}

	protected onConstruct():void {
		this.txt = <fgui.GTextField>(this.getChild("txt"));
		this.graph = <fgui.GGraph>(this.getChild("graph"));
		this.img = <fgui.GImage>(this.getChild("img"));
		this.loader = <fgui.GLoader>(this.getChild("loader"));
	}
}