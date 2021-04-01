/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FGUI_RecordPage from "./FGUI_RecordPage";
import FGUI_btn_share from "./FGUI_btn_share";
import FGUI_btn_more_game from "./FGUI_btn_more_game";
import FGUI_btn_drop_share from "./FGUI_btn_drop_share";
import FGUI_common_msg from "./FGUI_common_msg";
import FGUI_btnComfire from "./FGUI_btnComfire";
import FGUI_btnCancel from "./FGUI_btnCancel";

export default class exportBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(FGUI_RecordPage.URL, FGUI_RecordPage);
		fgui.UIObjectFactory.setExtension(FGUI_btn_share.URL, FGUI_btn_share);
		fgui.UIObjectFactory.setExtension(FGUI_btn_more_game.URL, FGUI_btn_more_game);
		fgui.UIObjectFactory.setExtension(FGUI_btn_drop_share.URL, FGUI_btn_drop_share);
		fgui.UIObjectFactory.setExtension(FGUI_common_msg.URL, FGUI_common_msg);
		fgui.UIObjectFactory.setExtension(FGUI_btnComfire.URL, FGUI_btnComfire);
		fgui.UIObjectFactory.setExtension(FGUI_btnCancel.URL, FGUI_btnCancel);
	}
}