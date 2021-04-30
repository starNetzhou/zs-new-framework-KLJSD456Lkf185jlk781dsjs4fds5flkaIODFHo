/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_btn_Special extends fgui.GButton {

	public icon1:fgui.GLoader;
	public title1:fgui.GTextField;
	public static URL:string = "ui://pt2mjy81r6qa96";

	public static createInstance():FGUI_btn_Special {
		return <FGUI_btn_Special>(fgui.UIPackage.createObject("export", "btn_Special"));
	}

	protected onConstruct():void {
		this.icon1 = <fgui.GLoader>(this.getChild("icon1"));
		this.title1 = <fgui.GTextField>(this.getChild("title1"));
	}
}