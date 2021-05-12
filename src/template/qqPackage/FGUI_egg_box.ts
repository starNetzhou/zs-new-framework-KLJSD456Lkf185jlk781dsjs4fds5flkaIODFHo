/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_egg_box extends fgui.GComponent {

	public btn_click:fgui.GButton;
	public bar:fgui.GProgressBar;
	public static URL:string = "ui://7i40o8nefkart";

	public static createInstance():FGUI_egg_box {
		return <FGUI_egg_box>(fgui.UIPackage.createObject("qqPackage", "egg_box"));
	}

	protected onConstruct():void {
		this.btn_click = <fgui.GButton>(this.getChildAt(2));
		this.bar = <fgui.GProgressBar>(this.getChildAt(5));
	}
}