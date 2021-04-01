/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class QQAd_video_get extends fgui.GComponent {

	public btn_video:fgui.GButton;
	public btn_close:fgui.GButton;
	public static URL:string = "ui://7i40o8nefkaro";

	public static createInstance():QQAd_video_get {
		return <QQAd_video_get>(fgui.UIPackage.createObject("QQad", "video_get"));
	}

	protected onConstruct():void {
		this.btn_video = <fgui.GButton>(this.getChildAt(4));
		this.btn_close = <fgui.GButton>(this.getChildAt(5));
	}
}