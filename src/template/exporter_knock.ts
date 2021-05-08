import FGUI_donhua from "./export/FGUI_donhua";
import FGUI_knock_export from "./export/FGUI_knock_export";

export default class exporter_knock extends zs.fgui.baseGeneric<FGUI_knock_export> {

    static typeDefine = FGUI_knock_export;

    // 导出列表
    listAd: fairygui.GList;
    // 锤子节点
    nodeHammer: FGUI_donhua;
    // 锤子动画
    aniHammer: fairygui.Transition;
    // 锤子导出数据
    adData: ExporterData[];
    // 导出展示列表
    adShowArr: ExporterData[];
    // 砸锤子索引
    knockIndex: number;

    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_knock_export) {
            this.listAd = component.adList;
            this.nodeHammer = component.knock;
            this.aniHammer = this.nodeHammer.aniKnock;
            this.nodeHammer.visible = false;
            component.adList.itemRenderer = Laya.Handler.create(this, this.onItemRender, null, false);
            component.adList.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
        }
    }
    dispose() {
        super.dispose();
        this.stopKnock();
    }
    apply() {
        zs.exporter.dataMgr.load().then((result) => {
            if (!this.disposed) {
                this.adData = result;
                this.updateUI();
                this.startKnock();
                // this.view.x = -100;
                // Laya.Tween.to(this.view,{})
            }
        });
        return this;
    }
    onItemRender(index, item) {
        var data = this.adShowArr[index]
        item.icon = data.app_icon;
    }
    onClickItem(item) {
        var index = this.listAd.getChildIndex(item);
        // console.log("点击了", this.adShowArr[index])
        zs.exporter.utils.navigateToMiniProgram(this.adShowArr[index]);
    }
    updateUI() {
        this.adData.sort((a, b) => {
            return Math.random() > 0.5 ? -1 : 1;
        })
        this.adShowArr = [];
        var numItems = Math.min(6, this.adData.length);
        for (let index = 0; index < numItems; index++) {
            this.adShowArr.push(this.adData[index]);
        }
        // console.log(this.adShowArr)
        this.listAd.numItems = this.adShowArr.length;
    }
    startKnock() {
        this.stopKnock();
        var enterDelay = 1000; //进界面后多久开始砸导出
        Laya.timer.once(enterDelay, this, this.knockExportIcon, null, false);
    }
    stopKnock() {
        Laya.timer.clearAll(this);
        for (let index = 0; index < this.listAd.numItems; index++) {
            const element = this.listAd.getChildAt(index);
            Laya.Tween.clearAll(element)
        }
    }
    knockExportIcon() {
        if (this.listAd.numItems <= 0) { return; }
        var hammerTime = 5000;
        var idx = Math.floor(Math.random() * this.listAd.numItems);
        this.knockIndex = idx;
        var cell = this.listAd.getChildAt(idx);
        this.nodeHammer.removeFromParent();
        var globalPoint;
        cell.touchable = false;
        globalPoint = Laya.Point.create().setTo(cell.width / 2, cell.height / 2);
        globalPoint = cell.localToGlobal(globalPoint.x, globalPoint.y);
        var targetPoint = this.view.globalToLocal(globalPoint.x - (this.nodeHammer.width * this.view.scaleX) / 2, globalPoint.y - (this.nodeHammer.height * this.view.scaleY) / 2);
        this.nodeHammer.setXY(targetPoint.x, targetPoint.y);
        this.view.addChild(this.nodeHammer);
        this.nodeHammer.visible = true;
        this.aniHammer.play(Laya.Handler.create(this, this.onBrokenComplete), 1);
        Laya.timer.once(hammerTime, this, this.knockExportIcon, null, true);
    }
    onBrokenComplete() {
        this.nodeHammer.visible = false;
        var cell = this.listAd.getChildAt(this.knockIndex);
        this.playScaleEff(cell);
    }
    playScaleEff(cell) {
        var scaleTime = 500;
        //缩小
        Laya.Tween.to(cell, { scaleX: 0, scaleY: 0 }, scaleTime, Laya.Ease.bounceIn, Laya.Handler.create(this, () => {
            // 换图
            this.refreshSingleItem(this.knockIndex);
            // 放大
            Laya.Tween.to(cell, { scaleX: 1, scaleY: 1 }, scaleTime, Laya.Ease.bounceIn, Laya.Handler.create(this, () => {
                cell.touchable = true;
            }));
        }))
    }
    refreshSingleItem(index) {
        // 筛选当前没有的
        var filterArr = this.adData.filter((x) => !this.adShowArr.some((datas) => x.app_icon === datas.app_icon));
        var randomIdx = Math.floor(Math.random() * filterArr.length);
        var data = filterArr[randomIdx];
        this.adShowArr[index] = data;
        var item = this.listAd.getChildAt(index);
        this.onItemRender(index, item);
    }
}