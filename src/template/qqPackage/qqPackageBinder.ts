/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FGUI_video_get from "./FGUI_video_get";
import FGUI_egg_box from "./FGUI_egg_box";
import FGUI_btn_invite from "./FGUI_btn_invite";
import FGUI_btn_moregame from "./FGUI_btn_moregame";
import FGUI_common_egg from "./FGUI_common_egg";

export default class qqPackageBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(FGUI_video_get.URL, FGUI_video_get);
		fgui.UIObjectFactory.setExtension(FGUI_egg_box.URL, FGUI_egg_box);
		fgui.UIObjectFactory.setExtension(FGUI_btn_invite.URL, FGUI_btn_invite);
		fgui.UIObjectFactory.setExtension(FGUI_btn_moregame.URL, FGUI_btn_moregame);
		fgui.UIObjectFactory.setExtension(FGUI_common_egg.URL, FGUI_common_egg);
	}
}