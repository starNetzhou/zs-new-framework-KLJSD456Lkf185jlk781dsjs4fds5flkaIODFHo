/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_challenge extends fgui.GComponent {

	public picture1:fgui.GLabel;
	public picture2:fgui.GLabel;
	public lblName:fgui.GTextField;
	public lblDesc:fgui.GTextField;
	public lblGame:fgui.GTextField;
	public btnNo:fgui.GButton;
	public btnYes:fgui.GButton;
	public static URL:string = "ui://pt2mjy81i71b81";

	public static createInstance():FGUI_challenge {
		return <FGUI_challenge>(fgui.UIPackage.createObject("export", "challenge"));
	}

	protected onConstruct():void {
		this.picture1 = <fgui.GLabel>(this.getChild("picture1"));
		this.picture2 = <fgui.GLabel>(this.getChild("picture2"));
		this.lblName = <fgui.GTextField>(this.getChild("lblName"));
		this.lblDesc = <fgui.GTextField>(this.getChild("lblDesc"));
		this.lblGame = <fgui.GTextField>(this.getChild("lblGame"));
		this.btnNo = <fgui.GButton>(this.getChild("btnNo"));
		this.btnYes = <fgui.GButton>(this.getChild("btnYes"));
	}
}