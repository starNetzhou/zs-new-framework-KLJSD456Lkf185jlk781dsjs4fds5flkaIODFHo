/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FGUI_btn_egg from "./FGUI_btn_egg";

export default class FGUI_start_egg extends fgui.GComponent {

	public bar:fgui.GProgressBar;
	public btn_click:FGUI_btn_egg;
	public static URL:string = "ui://xvfmpbdecqs51";

	public static createInstance():FGUI_start_egg {
		return <FGUI_start_egg>(fgui.UIPackage.createObject("KnockEgg", "start_egg"));
	}

	protected onConstruct():void {
		this.bar = <fgui.GProgressBar>(this.getChild("bar"));
		this.btn_click = <FGUI_btn_egg>(this.getChild("btn_click"));
	}
}