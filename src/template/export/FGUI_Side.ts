/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FGUI_hot_game from "./FGUI_hot_game";

export default class FGUI_Side extends fgui.GComponent {

	public viewCtrl:fgui.Controller;
	public content:FGUI_hot_game;
	public static URL:string = "ui://pt2mjy81rx1c67";

	public static createInstance():FGUI_Side {
		return <FGUI_Side>(fgui.UIPackage.createObject("export", "Side"));
	}

	protected onConstruct():void {
		this.viewCtrl = this.getController("viewCtrl");
		this.content = <FGUI_hot_game>(this.getChild("content"));
	}
}