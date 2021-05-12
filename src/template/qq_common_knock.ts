import ProductKey from "./ProductKey";
import FGUI_common_egg from "./qqPackage/FGUI_common_egg";
export default class qq_common_knock extends zs.ui.EggKnock {
    static typeDefine = FGUI_common_egg;
    // 砸金蛋进度条
    _progressBar: fairygui.GProgressBar;
    // 砸金蛋按钮
    _btnKnock: fgui.GButton;
    //是否砸视频
    _isPlayVideo: boolean = false;

    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_common_egg) {
            this._progressBar = component.bar;
            this._btnKnock = component.btn_click;
        }
    }
    get btnKnock(): fairygui.GButton {
        return this._btnKnock;
    }

    updateProgress(value: number) {
        this._progressBar.value = value * 100;
    }

    onBannerCheck() {
        let clickVideoTime = ProductKey.zs_click_video_time;
        let str = clickVideoTime.split("|");
        if (ProductKey.zs_click_video_switch) {
            for (let i = 0; i < str.length; i++) {
                if (str[i] && !zs.product.timeCheck(str[i])) {
                    this._isPlayVideo = false;
                    break;
                }
            }
        } else {
            this._isPlayVideo = false;
        }
        if (!this._isPlayVideo) {
            let checkInit = !zs.platform.sync.hasBanner();
            checkInit && zs.platform.sync.updateBanner({ isWait: true });
        }
    }

    handleClick(progress) {
        if (progress >= this["bannerPoint"] && !this["isOpenAd"]) {
            this["isOpenAd"] = true;
            if (this._isPlayVideo) {
                zs.platform.async.playVideo().then(() => {
                    this["onFinish"]();
                }).catch(() => {
                    this["onFinish"]();
                })
            } else {
                zs.platform.sync.showBanner();
                Laya.timer.once(800, this, () => {
                    this["onFinish"]();
                });
            }
        }
    }

}