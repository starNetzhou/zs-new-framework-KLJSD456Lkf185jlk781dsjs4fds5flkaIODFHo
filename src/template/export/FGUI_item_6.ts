/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_item_6 extends zs.ui.FGUI_item {

	public title:fgui.GTextField;
	public picture:fgui.GLabel;
	public static URL:string = "ui://pt2mjy81rx1c6a";

	public static createInstance():FGUI_item_6 {
		return <FGUI_item_6>(fgui.UIPackage.createObject("export", "item_6"));
	}

	protected onConstruct():void {
		this.title = <fgui.GTextField>(this.getChild("title"));
		this.picture = <fgui.GLabel>(this.getChild("picture"));
	}
}