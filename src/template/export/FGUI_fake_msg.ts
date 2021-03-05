/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_fake_msg extends fgui.GButton {

	public desc: fgui.GTextField;
	public static URL: string = "ui://pt2mjy81i71b8e";

	public static createInstance(): FGUI_fake_msg {
		return <FGUI_fake_msg>(fgui.UIPackage.createObject("export", "fake_msg"));
	}

	protected onConstruct(): void {
		this.pivotX = 0;
		this.pivotY = 0;
		this.desc = <fgui.GTextField>(this.getChild("desc"));
	}
}