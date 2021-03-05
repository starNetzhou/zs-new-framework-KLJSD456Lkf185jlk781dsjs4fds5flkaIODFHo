/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_full_2 extends fgui.GComponent {

	public list:fgui.GList;
	public btn_continue:fgui.GButton;
	public static URL:string = "ui://pt2mjy81dbce5u";

	public static createInstance():FGUI_full_2 {
		return <FGUI_full_2>(fgui.UIPackage.createObject("export", "full_2"));
	}

	protected onConstruct():void {
		this.list = <fgui.GList>(this.getChild("list"));
		this.btn_continue = <fgui.GButton>(this.getChild("btn_continue"));
	}
}