/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_btnCancel extends fgui.GButton {

	public lblCancel:fgui.GTextField;
	public static URL:string = "ui://pt2mjy81la8092";

	public static createInstance():FGUI_btnCancel {
		return <FGUI_btnCancel>(fgui.UIPackage.createObject("export", "btnCancel"));
	}

	protected onConstruct():void {
		this.lblCancel = <fgui.GTextField>(this.getChildAt(2));
	}
}