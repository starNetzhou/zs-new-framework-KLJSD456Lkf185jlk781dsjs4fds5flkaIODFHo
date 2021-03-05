/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class fgui_loading extends fgui.GComponent {

	public background:fgui.GGraph;
	public logoarea:fgui.GGraph;
	public logolabel:fgui.GTextField;
	public loadingbar:fgui.GProgressBar;
	public static URL:string = "ui://03jxpdp78zgn0";

	public static createInstance():fgui_loading {
		return <fgui_loading>(fgui.UIPackage.createObject("entry", "loading"));
	}

	protected onConstruct():void {
		this.background = <fgui.GGraph>(this.getChild("background"));
		this.logoarea = <fgui.GGraph>(this.getChild("logoarea"));
		this.logolabel = <fgui.GTextField>(this.getChild("logolabel"));
		this.loadingbar = <fgui.GProgressBar>(this.getChild("loadingbar"));
	}
}