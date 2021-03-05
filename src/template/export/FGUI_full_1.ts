/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_full_1 extends fgui.GComponent {

	public listAch:fgui.GList;
	public listHot:fgui.GList;
	public btn_continue:fgui.GButton;
	public static URL:string = "ui://pt2mjy81nbyx8v";

	public static createInstance():FGUI_full_1 {
		return <FGUI_full_1>(fgui.UIPackage.createObject("export", "full_1"));
	}

	protected onConstruct():void {
		this.listAch = <fgui.GList>(this.getChild("listAch"));
		this.listHot = <fgui.GList>(this.getChild("listHot"));
		this.btn_continue = <fgui.GButton>(this.getChild("btn_continue"));
	}
}