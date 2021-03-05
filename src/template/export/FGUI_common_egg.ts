/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FGUI_btn_egg from "./FGUI_btn_egg";

export default class FGUI_common_egg extends fgui.GComponent {

	public bar:fgui.GProgressBar;
	public btn_click:FGUI_btn_egg;
	public static URL:string = "ui://pt2mjy81i71b7v";

	public static createInstance():FGUI_common_egg {
		return <FGUI_common_egg>(fgui.UIPackage.createObject("export", "common_egg"));
	}

	protected onConstruct():void {
		this.bar = <fgui.GProgressBar>(this.getChild("bar"));
		this.btn_click = <FGUI_btn_egg>(this.getChild("btn_click"));
	}
}