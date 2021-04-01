/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class QQAd_common_egg extends fgui.GComponent {

	public bar:fgui.GProgressBar;
	public btn_click:fgui.GButton;
	public static URL:string = "ui://7i40o8nepcjw0";

	public static createInstance():QQAd_common_egg {
		return <QQAd_common_egg>(fgui.UIPackage.createObject("QQad", "common_egg"));
	}

	protected onConstruct():void {
		this.bar = <fgui.GProgressBar>(this.getChildAt(3));
		this.btn_click = <fgui.GButton>(this.getChildAt(5));
	}
}