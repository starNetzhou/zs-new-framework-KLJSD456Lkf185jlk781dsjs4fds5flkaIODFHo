/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FGUI_BottomNative from "./FGUI_BottomNative";
import FGUI_ScreeNative from "./FGUI_ScreeNative";
import FGUI_btn_native_addIcon from "./FGUI_btn_native_addIcon";
import FGUI_MoreGameBtn from "./FGUI_MoreGameBtn";
import FGUI_addDeskBtn from "./FGUI_addDeskBtn";

export default class exportBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(FGUI_BottomNative.URL, FGUI_BottomNative);
		fgui.UIObjectFactory.setExtension(FGUI_ScreeNative.URL, FGUI_ScreeNative);
		fgui.UIObjectFactory.setExtension(FGUI_btn_native_addIcon.URL, FGUI_btn_native_addIcon);
		fgui.UIObjectFactory.setExtension(FGUI_MoreGameBtn.URL, FGUI_MoreGameBtn);
		fgui.UIObjectFactory.setExtension(FGUI_addDeskBtn.URL, FGUI_addDeskBtn);
	}
}