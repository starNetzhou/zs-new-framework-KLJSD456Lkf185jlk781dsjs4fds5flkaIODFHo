/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_BottomNative extends fgui.GComponent {

	public btnAdImg:fgui.GButton;
	public btnConfirm:fgui.GButton;
	public lab_desc:fgui.GTextField;
	public btnClose:fgui.GButton;
	public static URL:string = "ui://8mc57yxkiwh90";

	public static createInstance():FGUI_BottomNative {
		return <FGUI_BottomNative>(fgui.UIPackage.createObject("export", "BottomNative"));
	}

	protected onConstruct():void {
		this.btnAdImg = <fgui.GButton>(this.getChild("btnAdImg"));
		this.btnConfirm = <fgui.GButton>(this.getChild("btnConfirm"));
		this.lab_desc = <fgui.GTextField>(this.getChild("lab_desc"));
		this.btnClose = <fgui.GButton>(this.getChild("btnClose"));
	}
}