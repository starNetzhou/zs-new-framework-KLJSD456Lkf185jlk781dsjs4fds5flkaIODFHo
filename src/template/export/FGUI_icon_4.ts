/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_icon_4 extends fgui.GLabel {

	public c1:fgui.Controller;
	public static URL:string = "ui://pt2mjy81dbce60";

	public static createInstance():FGUI_icon_4 {
		return <FGUI_icon_4>(fgui.UIPackage.createObject("export", "icon_4"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
	}
}