/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FGUI_btn_share from "./FGUI_btn_share";
import FGUI_btn_drop_share from "./FGUI_btn_drop_share";

export default class FGUI_RecordPage extends fgui.GComponent {

	public bg_record_group:fgui.GGroup;
	public btn_share:FGUI_btn_share;
	public btn_drop_share:FGUI_btn_drop_share;
	public static URL:string = "ui://pt2mjy81c57h99";

	public static createInstance():FGUI_RecordPage {
		return <FGUI_RecordPage>(fgui.UIPackage.createObject("export", "RecordPage"));
	}

	protected onConstruct():void {
		this.bg_record_group = <fgui.GGroup>(this.getChild("bg_record_group"));
		this.btn_share = <FGUI_btn_share>(this.getChild("btn_share"));
		this.btn_drop_share = <FGUI_btn_drop_share>(this.getChild("btn_drop_share"));
	}
}