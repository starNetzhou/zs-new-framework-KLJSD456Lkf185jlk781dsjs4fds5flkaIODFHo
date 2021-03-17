/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_btn_native_addIcon extends fgui.GButton {

	public t1:fgui.Transition;
	public static URL:string = "ui://pt2mjy81j8jq9i";

	public static createInstance():FGUI_btn_native_addIcon {
		return <FGUI_btn_native_addIcon>(fgui.UIPackage.createObject("export", "btn_native_addIcon"));
	}

	protected onConstruct():void {
		this.t1 = this.getTransitionAt(0);
	}
}