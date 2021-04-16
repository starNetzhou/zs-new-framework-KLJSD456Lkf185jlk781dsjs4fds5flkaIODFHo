/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_main extends fgui.GComponent {

	public hint:fgui.GTextField;
	public btn:fgui.GButton;
	public static URL:string = "ui://41w9qxrst50h2";

	public static createInstance():FGUI_main {
		return <FGUI_main>(fgui.UIPackage.createObject("zs_example", "main"));
	}

	protected onConstruct():void {
		this.hint = <fgui.GTextField>(this.getChild("hint"));
		this.btn = <fgui.GButton>(this.getChild("btn"));
	}
}