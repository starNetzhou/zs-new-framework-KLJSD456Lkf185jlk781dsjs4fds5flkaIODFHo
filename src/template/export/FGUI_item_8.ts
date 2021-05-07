/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_item_8 extends fgui.GComponent {

	public picture:fgui.GLabel;
	public background:fgui.GImage;
	public shakeRight:fgui.Transition;
	public shakeLeft:fgui.Transition;
	public t2:fgui.Transition;
	public static URL:string = "ui://pt2mjy81ves39a";

	public static createInstance():FGUI_item_8 {
		return <FGUI_item_8>(fgui.UIPackage.createObject("export", "item_8"));
	}

	protected onConstruct():void {
		this.picture = <fgui.GLabel>(this.getChild("picture"));
		this.background = <fgui.GImage>(this.getChild("background"));
		this.shakeRight = this.getTransition("shakeRight");
		this.shakeLeft = this.getTransition("shakeLeft");
		this.t2 = this.getTransition("t2");
	}
}