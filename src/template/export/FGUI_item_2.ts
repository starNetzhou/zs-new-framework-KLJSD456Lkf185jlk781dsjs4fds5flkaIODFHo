/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_item_2 extends fgui.GComponent {

	public background:fgui.GImage;
	public picture:fgui.GLabel;
	public title:fgui.GTextField;
	public shakeRight:fgui.Transition;
	public shakeLeft:fgui.Transition;
	public t2:fgui.Transition;
	public static URL:string = "ui://pt2mjy81coym7c";

	public static createInstance():FGUI_item_2 {
		return <FGUI_item_2>(fgui.UIPackage.createObject("export", "item_2"));
	}

	protected onConstruct():void {
		this.background = <fgui.GImage>(this.getChild("background"));
		this.picture = <fgui.GLabel>(this.getChild("picture"));
		this.title = <fgui.GTextField>(this.getChild("title"));
		this.shakeRight = this.getTransition("shakeRight");
		this.shakeLeft = this.getTransition("shakeLeft");
		this.t2 = this.getTransition("t2");
	}
}