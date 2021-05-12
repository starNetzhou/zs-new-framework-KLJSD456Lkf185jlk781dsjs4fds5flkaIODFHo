/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_common_egg extends fgui.GComponent {

	public bar:fgui.GProgressBar;
	public btn_click:fgui.GButton;
	public static URL:string = "ui://7i40o8nepcjw0";

	public static createInstance():FGUI_common_egg {
		return <FGUI_common_egg>(fgui.UIPackage.createObject("qqPackage", "common_egg"));
	}

	protected onConstruct():void {
		this.bar = <fgui.GProgressBar>(this.getChildAt(2));
		this.btn_click = <fgui.GButton>(this.getChildAt(4));
	}
}