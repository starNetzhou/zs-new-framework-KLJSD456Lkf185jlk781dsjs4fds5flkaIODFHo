import QQAd_egg_box from "./fgui/QQAd_egg_box";

export default class qq_over_egg extends zs.fgui.base {

    progressBar: fairygui.GProgressBar;
    btnClick: fairygui.GButton;

    viewName: string;
    callback: Laya.Handler;

    awardDelay: number;
    closeDelay: number;
    repairProgress: number;
    click_add_percent: number;
    zs_click_award_back: number;
    isOpenAd: boolean;
    repair_click_num: number[];
    showBannerRange: number;
    isGetAward: boolean;
    btn_repair: boolean;

    constructor(component) {
        super(component);
        if (component && component instanceof QQAd_egg_box) {
            this.progressBar = component.bar;
            this.btnClick = component.btn_click;
            this.btnClick.onClick(this, this.onBtnClick);
        }
    }
    static make() {
        let view = QQAd_egg_box.createInstance();
        return view;
    }
    static type() {
        return QQAd_egg_box;
    }
    init() {
        super.init();
        this.viewName = "EGG_Box";
    }
    dispose() {
        this.removeEvent();
        super.dispose();
    }
    check(component) {
        if (component instanceof QQAd_egg_box) {
            return true;
        }
        return false;
    }
    setCloseCallback(callback) {
        this.callback = callback;
        return this;
    }
    apply() {
        this.awardDelay = 1000;
        this.closeDelay = 1000;
        //进度
        this.repairProgress = 0;
        //每次点击增加的百分比
        this.click_add_percent = 0.14;
        //每帧后退百分比
        this.zs_click_award_back = 0.01;
        //是否已经打开广告
        this.isOpenAd = false;
        //显示广告 随机区间
        this.repair_click_num = [0.3, 0.7];
        /**显示Banner区间 */
        this.showBannerRange = this.random(Number(this.repair_click_num[0]) * 100, Number(this.repair_click_num[1]) * 100) * 0.01;
        this.isGetAward = false;
        Laya.timer.loop(20, this, this.cutBack);
        zs.platform.sync.updateBanner();
        return this;
    }

    random(min, max) {
        return Math.random() * (max - min) + min << 0;
    }

    removeEvent() {
        Laya.timer.clear(this, this.cutBack);
        if (this.btn_repair) {
            this.btnClick.offClick(this, this.onBtnClick);
        }
    }

    onBtnClick() {
        if (this.repairProgress + this.click_add_percent <= 1) {
            this.updateRepairPorgress(this.repairProgress + this.click_add_percent);
            if (this.repairProgress >= this.showBannerRange && !this.isOpenAd) {
                if (window["qq"]) {
                    this.isOpenAd = true;
                    zs.platform.sync.showAppBox();
                    Laya.timer.once(800, this, function () {
                        this.onFinish();
                    });
                }
            }
        } else {
            this.updateRepairPorgress(this.repairProgress + this.click_add_percent);
            Laya.timer.clear(this, this.cutBack);
            this.onFinish();
        }
    }
    onFinish() {
        if (this.isGetAward) return;
        // 砸金蛋次数需要缓存
        this.isGetAward = true;
        Laya.timer.once(this.awardDelay, this, function () {
            Laya.stage.event("EGG_GET_AWARD");
            console.log("派发获得砸金蛋奖励消息")
        });
        Laya.timer.once(Math.max(this.closeDelay, this.awardDelay + 40), this, this.onClose);

    }
    updateRepairPorgress(val) {
        this.repairProgress = Math.min(1, Math.max(0, val));
        this.progressBar.value = this.repairProgress * 100;
    }
    //修车进度回退
    cutBack() {
        this.repairProgress -= this.zs_click_award_back;
        this.updateRepairPorgress(this.repairProgress);
    }
    onClose() {
        console.log("====================关闭金蛋==================");
        this.callback && this.callback.run();
    }
}