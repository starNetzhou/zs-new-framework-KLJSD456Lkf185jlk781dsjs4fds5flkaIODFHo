/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class QQAd_btn_moregame extends fgui.GButton {

	public btn_moregame:fgui.GImage;
	public static URL:string = "ui://7i40o8nei2kx11";

	public static createInstance():QQAd_btn_moregame {
		return <QQAd_btn_moregame>(fgui.UIPackage.createObject("QQad", "btn_moregame"));
	}

	protected onConstruct():void {
		this.btn_moregame = <fgui.GImage>(this.getChildAt(0));
	}
}