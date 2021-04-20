import FGUI_btn_egg from "./export/FGUI_btn_egg";
import FGUI_common_egg from "./export/FGUI_common_egg";

export default class ad_egg extends zs.fgui.base {

    static typeDefine = FGUI_common_egg;

    // 横幅广告偏移延迟
    static readonly bannerOffsetDelay = 1000;
    // 砸金蛋奖励延迟
    static readonly awardDelay = 1000;
    // 砸金蛋关闭延迟
    static readonly closeDelay = 1000;
    //每次点击增加的百分比
    static readonly click_add_percent = 0.14;
    //每帧后退百分比
    static readonly zs_click_award_back = 0.01;
    //显示广告 随机区间
    static readonly repair_click_num = [0.3, 0.7];
    // 回退间隔时间
    static readonly cutBackInterval = 20;


    // 砸金蛋进度条
    progressBar: fairygui.GProgressBar;
    // 砸金蛋按钮
    btnKnock: FGUI_btn_egg;

    // 显示名称
    viewName: string;
    // 关闭事件回调
    callback: Laya.Handler;

    // 砸金蛋进度
    progress: number;
    //是否已经打开广告
    isOpenAd: boolean;
    // 是否已经获取奖励
    isGetAward: boolean;
    // 显示Banner区间
    showBannerRange: number;

    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_common_egg) {
            this.progressBar = component.bar;
            this.btnKnock = component.btn_click;
            this.btnKnock.onClick(this, this.onBtnClick);
            zs.core.addAppShow(Laya.Handler.create(this, this.onAppShow, null, false));
            zs.core.addAppHide(Laya.Handler.create(this, this.onAppHide, null, false));
        }
    }
    init() {
        super.init();
        this.viewName = "EGG";
    }
    dispose() {
        this.removeEvent();
        super.dispose();
    }
    setCloseCallback(callback) {
        this.callback = callback;
        return this;
    }
    apply() {
        this.progress = 0;
        this.isOpenAd = false;
        this.isGetAward = false;
        this.showBannerRange = this.random(Number(ad_egg.repair_click_num[0]) * 100, Number(ad_egg.repair_click_num[1]) * 100) * 0.01;

        Laya.timer.loop(ad_egg.cutBackInterval, this, this.cutBack);
        return this;
    }

    random(min, max) {
        return Math.random() * (max - min) + min << 0;
    }

    removeEvent() {
        Laya.timer.clear(this, this.cutBack);
        zs.core.removeAppShow(Laya.Handler.create(this, this.onAppShow));
        zs.core.removeAppHide(Laya.Handler.create(this, this.onAppHide));
        this.btnKnock.offClick(this, this.onBtnClick);
    }

    onAppShow() {
        if (!this.isOpenAd) return;
        this.onFinish();
    }

    onAppHide() {
        if (!this.isOpenAd) return;
        this.btnKnock.offClick(this, this.onBtnClick);
        this.isOpenAd = true;
        Laya.timer.clear(this, this.cutBack);
    }

    onBtnClick() {
        if (this.progress + ad_egg.click_add_percent <= 1) {
            let checkInit = !zs.platform.sync.hasBanner();
            if (checkInit) {
                zs.platform.sync.updateBanner({ isWait: true, checkInit: true })
            }
            this.updateRepairPorgress(this.progress + ad_egg.click_add_percent);
            if (this.progress >= this.showBannerRange && !this.isOpenAd && window.zs["wx"] && window.zs["wx"].banner) {
                this.isOpenAd = true;
                zs.platform.sync.showBanner();
                Laya.timer.once(800, this, function () {
                    Laya.Tween.to(this.btn_click, { y: this.btn_click.y - 240 }, 500);
                });
            }
        } else {
            this.updateRepairPorgress(this.progress + ad_egg.click_add_percent);
            Laya.timer.clear(this, this.cutBack);
            this.onFinish();
        }
    }

    onFinish() {
        if (this.isGetAward) return;
        // 砸金蛋次数需要缓存
        var appId = zs.core.appId;
        var open_award_num = Laya.LocalStorage.getItem(appId + "open_award_num") || 0;
        Laya.LocalStorage.setItem(appId + "open_award_num", (Number(open_award_num) + 1).toString());
        this.isGetAward = true;

        Laya.timer.once(ad_egg.awardDelay, this, function () {
            Laya.stage.event("EGG_GET_AWARD");
            console.log("派发获得砸金蛋奖励消息")
        });
        Laya.timer.once(Math.max(ad_egg.closeDelay, ad_egg.awardDelay + 40), this, this.onClose);

    }

    updateRepairPorgress(val) {
        this.progress = Math.min(1, Math.max(0, val));
        this.progressBar.value = this.progress * 100;
    }

    // 进度回退
    cutBack() {
        this.progress -= ad_egg.zs_click_award_back;
        this.updateRepairPorgress(this.progress);
    }

    onClose() {
        console.log("====================关闭金蛋==================");
        this.callback && this.callback.run();
    }
}