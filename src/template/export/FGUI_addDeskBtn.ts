/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FGUI_btn_native_addIcon from "./FGUI_btn_native_addIcon";

export default class FGUI_addDeskBtn extends fgui.GComponent {

	public btnAddDesk:FGUI_btn_native_addIcon;
	public static URL:string = "ui://pt2mjy81j8jq9l";

	public static createInstance():FGUI_addDeskBtn {
		return <FGUI_addDeskBtn>(fgui.UIPackage.createObject("export", "addDeskBtn"));
	}

	protected onConstruct():void {
		this.btnAddDesk = <FGUI_btn_native_addIcon>(this.getChildAt(0));
	}
}