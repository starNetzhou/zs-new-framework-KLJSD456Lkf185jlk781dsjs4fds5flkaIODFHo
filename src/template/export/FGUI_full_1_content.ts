/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FGUI_full_1_content extends fgui.GComponent {

	public backdrop_list:fgui.GImage;
	public list_1:fgui.GList;
	public list_2:fgui.GList;
	public list_3:fgui.GList;
	public title_1:fgui.GImage;
	public title_2:fgui.GImage;
	public title_3:fgui.GImage;
	public static URL:string = "ui://pt2mjy81coym6c";

	public static createInstance():FGUI_full_1_content {
		return <FGUI_full_1_content>(fgui.UIPackage.createObject("export", "full_1_content"));
	}

	protected onConstruct():void {
		this.backdrop_list = <fgui.GImage>(this.getChild("backdrop_list"));
		this.list_1 = <fgui.GList>(this.getChild("list_1"));
		this.list_2 = <fgui.GList>(this.getChild("list_2"));
		this.list_3 = <fgui.GList>(this.getChild("list_3"));
		this.title_1 = <fgui.GImage>(this.getChild("title_1"));
		this.title_2 = <fgui.GImage>(this.getChild("title_2"));
		this.title_3 = <fgui.GImage>(this.getChild("title_3"));
	}
}