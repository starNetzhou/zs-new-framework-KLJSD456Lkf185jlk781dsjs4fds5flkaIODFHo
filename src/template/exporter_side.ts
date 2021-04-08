import FGUI_hot_game from "./export/FGUI_hot_game";
import FGUI_Side from "./export/FGUI_Side";

export default class exporter_side extends zs.fgui.base {

    static typeDefine = FGUI_Side;

    // 导出容器
    content: FGUI_hot_game;
    // 导出列表
    adList: fairygui.GList;
    // 弹出控制器
    btnPopCtrl: fairygui.Controller;

    // 是否隐藏侧栏
    bHide: boolean;
    // 导出数据
    adData: ExporterData[];
    // 延迟回调句柄
    delayHandler: number;

    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_Side) {

            this.content = component.content;
            this.adList = component.content.getChild("adList") as fairygui.GList;
            this.btnPopCtrl = component.content.btnPop.c1;
            component.content.getChild("btnPop").onClick(this, this.onBtnPopClick);
            this.adList.itemRenderer = Laya.Handler.create(this, this.onAdListRender, null, false);
            this.adList.on(fgui.Events.CLICK_ITEM, this, this.onAdListItemClick);
        }
    }
    dispose() {
        super.dispose();
        Laya.Tween.clearAll(this.content);
        clearTimeout(this.delayHandler);
    }
    onBtnPopClick() {
        this.bHide = !this.bHide;
        this.updatePos();
    }

    updatePos() {
        // this.content.x = this.bHide ? -600 : 0;
        var dt = 300;
        this.btnPopCtrl.selectedIndex = (this.bHide ? 0 : 1);
        Laya.Tween.to(this.content, { x: this.bHide ? -600 : 0 }, dt);
    }

    updateUI() {
        this.adList.numItems = Math.min(9, this.adData.length);
    }

    onAdListRender(index, item) {
        var data = this.adData[index];
        if (!data) return;

        item.title.text = data.app_title;
        item.picture.icon = data.app_icon;
    }

    refreshSingleItem(index) {
        var newIdx = Math.floor(Math.random() * this.adData.length);
        if (this.adData.length > 1 && newIdx == index) {
            // 防止自己换自己
            return this.refreshSingleItem(index);
        }
        // console.log("新的随机数是：", newIdx)
        var newData = this.adData[newIdx];
        var oldData = this.adData[index];
        if (newData) {
            this.adData[index] = newData;
            this.adData[newIdx] = oldData;
            this.updateUI();
        }
    }
    onAdListItemClick(item) {
        var index = this.adList.getChildIndex(item);
        zs.exporter.utils.navigateToMiniProgram(this.adData[index]).then(() => {
            // 刷新该icon
            this.refreshSingleItem(index)
        });
    }

    apply() {
        if (this.view) {
            this.adList.numItems = 0;
            this.bHide = true;
            zs.exporter.dataMgr.load().then((result) => {
                this.adData = result.promotion;
                this.updateUI();

            });
            this.delayHandler = setTimeout(() => {
                this.bHide = false;
                this.updatePos();
            }, 500)
        }
        return this;
    }
}