/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_btn_egg extends fgui.GButton {

	public btnExit:fgui.GImage;
	public static URL:string = "ui://xvfmpbdecqs58";

	public static createInstance():FGUI_btn_egg {
		return <FGUI_btn_egg>(fgui.UIPackage.createObject("KnockEgg", "btn_egg"));
	}

	protected onConstruct():void {
		this.btnExit = <fgui.GImage>(this.getChild("btnExit"));
	}
}