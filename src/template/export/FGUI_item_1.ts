/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_item_1 extends fgui.GComponent {

	public ditu1:fgui.Controller;
	public bottomlighting:fgui.GLoader;
	public highlight:fgui.GImage;
	public bottom:fgui.GLoader;
	public picture:fgui.GLabel;
	public title:fgui.GTextField;
	public desc:fgui.GTextField;
	public static URL:string = "ui://pt2mjy81coym71";

	public static createInstance():FGUI_item_1 {
		return <FGUI_item_1>(fgui.UIPackage.createObject("export", "item_1"));
	}

	protected onConstruct():void {
		this.ditu1 = this.getController("ditu1");
		this.bottomlighting = <fgui.GLoader>(this.getChild("bottomlighting"));
		this.highlight = <fgui.GImage>(this.getChild("highlight"));
		this.bottom = <fgui.GLoader>(this.getChild("bottom"));
		this.picture = <fgui.GLabel>(this.getChild("picture"));
		this.title = <fgui.GTextField>(this.getChild("title"));
		this.desc = <fgui.GTextField>(this.getChild("desc"));
	}
}