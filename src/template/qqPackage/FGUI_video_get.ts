/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_video_get extends fgui.GLabel {

	public btn_video:fgui.GButton;
	public btn_close:fgui.GButton;
	public static URL:string = "ui://7i40o8nefkaro";

	public static createInstance():FGUI_video_get {
		return <FGUI_video_get>(fgui.UIPackage.createObject("qqPackage", "video_get"));
	}

	protected onConstruct():void {
		this.btn_video = <fgui.GButton>(this.getChildAt(3));
		this.btn_close = <fgui.GButton>(this.getChildAt(4));
	}
}