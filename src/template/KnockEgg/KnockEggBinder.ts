/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FGUI_start_egg from "./FGUI_start_egg";
import FGUI_btn_egg from "./FGUI_btn_egg";

export default class KnockEggBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(FGUI_start_egg.URL, FGUI_start_egg);
		fgui.UIObjectFactory.setExtension(FGUI_btn_egg.URL, FGUI_btn_egg);
	}
}