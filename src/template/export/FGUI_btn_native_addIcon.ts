/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_btn_native_addIcon extends fgui.GButton {

	public t1:fgui.Transition;
	public static URL:string = "ui://8mc57yxkiwh9f";

	public static createInstance():FGUI_btn_native_addIcon {
		return <FGUI_btn_native_addIcon>(fgui.UIPackage.createObject("export", "btn_native_addIcon"));
	}

	protected onConstruct():void {
		this.t1 = this.getTransition("t1");
	}
}