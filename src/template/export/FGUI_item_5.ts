/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FGUI_icon_4 from "./FGUI_icon_4";

export default class FGUI_item_5 extends zs.ui.FGUI_item {

	public rank:fgui.GTextField;
	public desc:fgui.GTextField;
	public title:fgui.GTextField;
	public btn_play:fgui.GImage;
	public picture:FGUI_icon_4;
	public static URL:string = "ui://pt2mjy81dbce61";

	public static createInstance():FGUI_item_5 {
		return <FGUI_item_5>(fgui.UIPackage.createObject("export", "item_5"));
	}

	protected onConstruct():void {
		this.rank = <fgui.GTextField>(this.getChild("rank"));
		this.desc = <fgui.GTextField>(this.getChild("desc"));
		this.title = <fgui.GTextField>(this.getChild("title"));
		this.btn_play = <fgui.GImage>(this.getChild("btn_play"));
		this.picture = <FGUI_icon_4>(this.getChild("picture"));
	}
}