/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_MoreGameBtn extends fgui.GComponent {

	public btnMoreGame:fgui.GButton;
	public static URL:string = "ui://pt2mjy81j8jq9k";

	public static createInstance():FGUI_MoreGameBtn {
		return <FGUI_MoreGameBtn>(fgui.UIPackage.createObject("export", "MoreGameBtn"));
	}

	protected onConstruct():void {
		this.btnMoreGame = <fgui.GButton>(this.getChildAt(0));
	}
}