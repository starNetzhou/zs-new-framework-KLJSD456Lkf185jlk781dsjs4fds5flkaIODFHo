/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_btnConfirm extends fgui.GButton {

	public lblConfirm:fgui.GTextField;
	public static URL:string = "ui://pt2mjy81la808z";

	public static createInstance():FGUI_btnConfirm {
		return <FGUI_btnConfirm>(fgui.UIPackage.createObject("export", "btnConfirm"));
	}

	protected onConstruct():void {
		this.lblConfirm = <fgui.GTextField>(this.getChild("lblConfirm"));
	}
}