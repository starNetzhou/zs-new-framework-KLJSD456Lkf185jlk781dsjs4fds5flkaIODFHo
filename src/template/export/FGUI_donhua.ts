/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_donhua extends fgui.GComponent {

	public aniKnock:fgui.Transition;
	public static URL:string = "ui://pt2mjy81i71b8p";

	public static createInstance():FGUI_donhua {
		return <FGUI_donhua>(fgui.UIPackage.createObject("export", "donhua"));
	}

	protected onConstruct():void {
		this.aniKnock = this.getTransition("aniKnock");
	}
}