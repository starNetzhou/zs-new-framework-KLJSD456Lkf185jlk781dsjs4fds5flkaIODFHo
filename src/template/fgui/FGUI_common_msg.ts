/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FGUI_btnComfire from "./FGUI_btnComfire";
import FGUI_btnCancel from "./FGUI_btnCancel";

export default class FGUI_common_msg extends fgui.GComponent {

	public c1:fgui.Controller;
	public btnComfire:FGUI_btnComfire;
	public lblTitle:fgui.GTextField;
	public lblContent:fgui.GTextField;
	public btnCancel:FGUI_btnCancel;
	public static URL:string = "ui://pt2mjy81la808w";

	public static createInstance():FGUI_common_msg {
		return <FGUI_common_msg>(fgui.UIPackage.createObject("export", "common_msg"));
	}

	protected onConstruct():void {
		this.c1 = this.getControllerAt(0);
		this.btnComfire = <FGUI_btnComfire>(this.getChildAt(2));
		this.lblTitle = <fgui.GTextField>(this.getChildAt(3));
		this.lblContent = <fgui.GTextField>(this.getChildAt(4));
		this.btnCancel = <FGUI_btnCancel>(this.getChildAt(5));
	}
}