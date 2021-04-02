/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_btnComfire extends fgui.GButton {

	public lblComfire:fgui.GTextField;
	public static URL:string = "ui://pt2mjy81la808z";

	public static createInstance():FGUI_btnComfire {
		return <FGUI_btnComfire>(fgui.UIPackage.createObject("export", "btnComfire"));
	}

	protected onConstruct():void {
		this.lblComfire = <fgui.GTextField>(this.getChildAt(2));
	}
}