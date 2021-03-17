/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_BottomNative extends fgui.GComponent {

	public btnAdImg:fgui.GButton;
	public btnConfirm:fgui.GButton;
	public lab_desc:fgui.GTextField;
	public btnClose:fgui.GButton;
	public btnCloseBg:fgui.GImage;
	public static URL:string = "ui://pt2mjy81j8jq94";

	public static createInstance():FGUI_BottomNative {
		return <FGUI_BottomNative>(fgui.UIPackage.createObject("export", "BottomNative"));
	}

	protected onConstruct():void {
		this.btnAdImg = <fgui.GButton>(this.getChildAt(1));
		this.btnConfirm = <fgui.GButton>(this.getChildAt(2));
		this.lab_desc = <fgui.GTextField>(this.getChildAt(4));
		this.btnClose = <fgui.GButton>(this.getChildAt(5));
		this.btnCloseBg = <fgui.GImage>(this.getChildAt(6));
	}
}