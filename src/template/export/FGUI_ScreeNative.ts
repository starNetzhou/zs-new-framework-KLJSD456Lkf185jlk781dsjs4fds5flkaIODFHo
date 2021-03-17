/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_ScreeNative extends fgui.GComponent {

	public btnAdImg:fgui.GButton;
	public lab_desc:fgui.GTextField;
	public btnConfirm:fgui.GButton;
	public btnClose:fgui.GButton;
	public btnCloseBg:fgui.GImage;
	public static URL:string = "ui://pt2mjy81j8jq9h";

	public static createInstance():FGUI_ScreeNative {
		return <FGUI_ScreeNative>(fgui.UIPackage.createObject("export", "ScreeNative"));
	}

	protected onConstruct():void {
		this.btnAdImg = <fgui.GButton>(this.getChildAt(2));
		this.lab_desc = <fgui.GTextField>(this.getChildAt(4));
		this.btnConfirm = <fgui.GButton>(this.getChildAt(5));
		this.btnClose = <fgui.GButton>(this.getChildAt(6));
		this.btnCloseBg = <fgui.GImage>(this.getChildAt(7));
	}
}