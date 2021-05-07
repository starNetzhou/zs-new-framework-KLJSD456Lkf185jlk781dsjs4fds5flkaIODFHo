/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FGUI_donhua from "./FGUI_donhua";

export default class FGUI_knock_export_1 extends fgui.GComponent {

	public adList:fgui.GList;
	public knock:FGUI_donhua;
	public static URL:string = "ui://pt2mjy81ves39b";

	public static createInstance():FGUI_knock_export_1 {
		return <FGUI_knock_export_1>(fgui.UIPackage.createObject("export", "knock_export_1"));
	}

	protected onConstruct():void {
		this.adList = <fgui.GList>(this.getChild("adList"));
		this.knock = <FGUI_donhua>(this.getChild("knock"));
	}
}