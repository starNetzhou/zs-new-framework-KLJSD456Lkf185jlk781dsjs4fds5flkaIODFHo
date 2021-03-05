/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FGUI_btn_left_pop from "./FGUI_btn_left_pop";

export default class FGUI_hot_game extends fgui.GComponent {

	public adList:fgui.GList;
	public btnPop:FGUI_btn_left_pop;
	public static URL:string = "ui://pt2mjy81rx1c69";

	public static createInstance():FGUI_hot_game {
		return <FGUI_hot_game>(fgui.UIPackage.createObject("export", "hot_game"));
	}

	protected onConstruct():void {
		this.adList = <fgui.GList>(this.getChild("adList"));
		this.btnPop = <FGUI_btn_left_pop>(this.getChild("btnPop"));
	}
}