/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_item_8 extends fgui.GComponent {

	public picture:fgui.GLabel;
	public title:fgui.GTextField;
	public desc:fgui.GTextField;
	public rank:fgui.GTextField;
	public static URL:string = "ui://pt2mjy81oq619b";

	public static createInstance():FGUI_item_8 {
		return <FGUI_item_8>(fgui.UIPackage.createObject("export", "item_8"));
	}

	protected onConstruct():void {
		this.picture = <fgui.GLabel>(this.getChild("picture"));
		this.title = <fgui.GTextField>(this.getChild("title"));
		this.desc = <fgui.GTextField>(this.getChild("desc"));
		this.rank = <fgui.GTextField>(this.getChild("rank"));
	}
}