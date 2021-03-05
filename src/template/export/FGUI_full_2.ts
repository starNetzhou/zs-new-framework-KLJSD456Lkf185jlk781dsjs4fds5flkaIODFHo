/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FGUI_item_4 from "./FGUI_item_4";

export default class FGUI_full_2 extends fgui.GComponent {

	public background:fgui.GImage;
	public background_list:fgui.GImage;
	public img_hot:fgui.GImage;
	public rank1:FGUI_item_4;
	public rank2:FGUI_item_4;
	public rank3:FGUI_item_4;
	public rankList:fgui.GList;
	public btn_continue:fgui.GButton;
	public static URL:string = "ui://pt2mjy81dbce5u";

	public static createInstance():FGUI_full_2 {
		return <FGUI_full_2>(fgui.UIPackage.createObject("export", "full_2"));
	}

	protected onConstruct():void {
		this.background = <fgui.GImage>(this.getChild("background"));
		this.background_list = <fgui.GImage>(this.getChild("background_list"));
		this.img_hot = <fgui.GImage>(this.getChild("img_hot"));
		this.rank1 = <FGUI_item_4>(this.getChild("rank1"));
		this.rank2 = <FGUI_item_4>(this.getChild("rank2"));
		this.rank3 = <FGUI_item_4>(this.getChild("rank3"));
		this.rankList = <fgui.GList>(this.getChild("rankList"));
		this.btn_continue = <fgui.GButton>(this.getChild("btn_continue"));
	}
}