/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_btn_share extends fgui.GButton {

	public btn_share:fgui.GImage;
	public t0:fgui.Transition;
	public static URL:string = "ui://pt2mjy81c57h9b";

	public static createInstance():FGUI_btn_share {
		return <FGUI_btn_share>(fgui.UIPackage.createObject("export", "btn_share"));
	}

	protected onConstruct():void {
		this.btn_share = <fgui.GImage>(this.getChild("btn_share"));
		this.t0 = this.getTransition("t0");
	}
}