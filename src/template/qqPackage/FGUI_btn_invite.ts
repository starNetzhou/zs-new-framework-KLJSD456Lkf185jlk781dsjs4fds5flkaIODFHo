/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_btn_invite extends fgui.GButton {

	public btn_invite:fgui.GImage;
	public static URL:string = "ui://7i40o8nei2kx10";

	public static createInstance():FGUI_btn_invite {
		return <FGUI_btn_invite>(fgui.UIPackage.createObject("qqPackage", "btn_invite"));
	}

	protected onConstruct():void {
		this.btn_invite = <fgui.GImage>(this.getChildAt(0));
	}
}