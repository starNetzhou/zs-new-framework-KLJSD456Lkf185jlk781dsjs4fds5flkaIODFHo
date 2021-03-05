/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_fake_exit extends fgui.GButton {

	public btnExit:fgui.GImage;
	public static URL:string = "ui://pt2mjy81i71b8s";

	public static createInstance():FGUI_fake_exit {
		return <FGUI_fake_exit>(fgui.UIPackage.createObject("export", "fake_exit"));
	}

	protected onConstruct():void {
		this.btnExit = <fgui.GImage>(this.getChild("btnExit"));
	}
}