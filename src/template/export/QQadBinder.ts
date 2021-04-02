/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import QQAd_video_get from "./QQAd_video_get";
import QQAd_egg_box from "./QQAd_egg_box";
import QQAd_btn_invite from "./QQAd_btn_invite";
import QQAd_btn_moregame from "./QQAd_btn_moregame";
import QQAd_blockWindow from "./QQAd_blockWindow";
import QQAd_common_egg from "./QQAd_common_egg";

export default class QQadBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(QQAd_video_get.URL, QQAd_video_get);
		fgui.UIObjectFactory.setExtension(QQAd_egg_box.URL, QQAd_egg_box);
		fgui.UIObjectFactory.setExtension(QQAd_btn_invite.URL, QQAd_btn_invite);
		fgui.UIObjectFactory.setExtension(QQAd_btn_moregame.URL, QQAd_btn_moregame);
		fgui.UIObjectFactory.setExtension(QQAd_blockWindow.URL, QQAd_blockWindow);
		fgui.UIObjectFactory.setExtension(QQAd_common_egg.URL, QQAd_common_egg);
	}
}