/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_item_3 extends fgui.GComponent {

	public picture:fgui.GLabel;
	public title:fgui.GTextField;
	public static URL:string = "ui://pt2mjy81coym78";

	public static createInstance():FGUI_item_3 {
		return <FGUI_item_3>(fgui.UIPackage.createObject("export", "item_3"));
	}

	protected onConstruct():void {
		this.picture = <fgui.GLabel>(this.getChild("picture"));
		this.title = <fgui.GTextField>(this.getChild("title"));
	}
}