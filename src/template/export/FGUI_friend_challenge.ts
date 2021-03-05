/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FGUI_challenge from "./FGUI_challenge";

export default class FGUI_friend_challenge extends fgui.GComponent {

	public challenge:FGUI_challenge;
	public static URL:string = "ui://pt2mjy81i71b8f";

	public static createInstance():FGUI_friend_challenge {
		return <FGUI_friend_challenge>(fgui.UIPackage.createObject("export", "friend_challenge"));
	}

	protected onConstruct():void {
		this.challenge = <FGUI_challenge>(this.getChild("challenge"));
	}
}