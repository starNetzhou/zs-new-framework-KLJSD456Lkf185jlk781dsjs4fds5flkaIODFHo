/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_btn_drop_share extends fgui.GButton {

	public btn_drop:fgui.GImage;
	public static URL:string = "ui://pt2mjy81c57h9g";

	public static createInstance():FGUI_btn_drop_share {
		return <FGUI_btn_drop_share>(fgui.UIPackage.createObject("export", "btn_drop_share"));
	}

	protected onConstruct():void {
		this.btn_drop = <fgui.GImage>(this.getChild("btn_drop"));
	}
}