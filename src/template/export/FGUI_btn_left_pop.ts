/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_btn_left_pop extends fgui.GButton {

	public c1:fgui.Controller;
	public static URL:string = "ui://pt2mjy81rx1c68";

	public static createInstance():FGUI_btn_left_pop {
		return <FGUI_btn_left_pop>(fgui.UIPackage.createObject("export", "btn_left_pop"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
	}
}