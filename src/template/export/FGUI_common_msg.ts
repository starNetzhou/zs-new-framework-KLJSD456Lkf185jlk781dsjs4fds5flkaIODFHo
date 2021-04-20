/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FGUI_btnConfirm from "./FGUI_btnConfirm";
import FGUI_btnCancel from "./FGUI_btnCancel";

export default class FGUI_common_msg extends fgui.GComponent {

	public c1:fgui.Controller;
	public btnComfire:FGUI_btnConfirm;
	public lblTitle:fgui.GTextField;
	public lblContent:fgui.GTextField;
	public btnCancel:FGUI_btnCancel;
	public static URL:string = "ui://pt2mjy81la808w";

	public static createInstance():FGUI_common_msg {
		return <FGUI_common_msg>(fgui.UIPackage.createObject("export", "common_msg"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.btnComfire = <FGUI_btnConfirm>(this.getChild("btnComfire"));
		this.lblTitle = <fgui.GTextField>(this.getChild("lblTitle"));
		this.lblContent = <fgui.GTextField>(this.getChild("lblContent"));
		this.btnCancel = <FGUI_btnCancel>(this.getChild("btnCancel"));
	}
}