/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FGUI_icon_4 from "./FGUI_icon_4";

export default class FGUI_item_4 extends fgui.GComponent {

	public viewCtrl:fgui.Controller;
	public imgRankBg:fgui.GLoader;
	public picture:FGUI_icon_4;
	public title:fgui.GTextField;
	public desc:fgui.GTextField;
	public imgRank:fgui.GLoader;
	public static URL:string = "ui://pt2mjy81dbce5z";

	public static createInstance():FGUI_item_4 {
		return <FGUI_item_4>(fgui.UIPackage.createObject("export", "item_4"));
	}

	protected onConstruct():void {
		this.viewCtrl = this.getController("viewCtrl");
		this.imgRankBg = <fgui.GLoader>(this.getChild("imgRankBg"));
		this.picture = <FGUI_icon_4>(this.getChild("picture"));
		this.title = <fgui.GTextField>(this.getChild("title"));
		this.desc = <fgui.GTextField>(this.getChild("desc"));
		this.imgRank = <fgui.GLoader>(this.getChild("imgRank"));
	}
}