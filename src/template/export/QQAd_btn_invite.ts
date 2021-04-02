/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class QQAd_btn_invite extends fgui.GButton {

	public btn_invite:fgui.GImage;
	public static URL:string = "ui://7i40o8nei2kx10";

	public static createInstance():QQAd_btn_invite {
		return <QQAd_btn_invite>(fgui.UIPackage.createObject("QQad", "btn_invite"));
	}

	protected onConstruct():void {
		this.btn_invite = <fgui.GImage>(this.getChildAt(0));
	}
}