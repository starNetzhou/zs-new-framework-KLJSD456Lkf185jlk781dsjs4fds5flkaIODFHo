/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_ScreeNative extends fgui.GComponent {

	public btnAdImg:fgui.GButton;
	public lab_desc:fgui.GTextField;
	public btnConfirm:fgui.GButton;
	public btnClose:fgui.GButton;
	public static URL:string = "ui://8mc57yxkiwh9d";

	public static createInstance():FGUI_ScreeNative {
		return <FGUI_ScreeNative>(fgui.UIPackage.createObject("export", "ScreeNative"));
	}

	protected onConstruct():void {
		this.btnAdImg = <fgui.GButton>(this.getChild("btnAdImg"));
		this.lab_desc = <fgui.GTextField>(this.getChild("lab_desc"));
		this.btnConfirm = <fgui.GButton>(this.getChild("btnConfirm"));
		this.btnClose = <fgui.GButton>(this.getChild("btnClose"));
	}
}