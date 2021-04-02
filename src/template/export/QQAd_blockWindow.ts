/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class QQAd_blockWindow extends fgui.GComponent {

	public maskui:fgui.GImage;
	public static URL:string = "ui://7i40o8nei2kxw";

	public static createInstance():QQAd_blockWindow {
		return <QQAd_blockWindow>(fgui.UIPackage.createObject("QQad", "blockWindow"));
	}

	protected onConstruct():void {
		this.maskui = <fgui.GImage>(this.getChildAt(0));
	}
}