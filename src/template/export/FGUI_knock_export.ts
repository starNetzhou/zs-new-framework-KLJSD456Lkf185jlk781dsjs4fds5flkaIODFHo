/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FGUI_donhua from "./FGUI_donhua";

export default class FGUI_knock_export extends fgui.GComponent {

	public adList:fgui.GList;
	public knock:FGUI_donhua;
	public static URL:string = "ui://pt2mjy81i71b8i";

	public static createInstance():FGUI_knock_export {
		return <FGUI_knock_export>(fgui.UIPackage.createObject("export", "knock_export"));
	}

	protected onConstruct():void {
		this.adList = <fgui.GList>(this.getChild("adList"));
		this.knock = <FGUI_donhua>(this.getChild("knock"));
	}
}