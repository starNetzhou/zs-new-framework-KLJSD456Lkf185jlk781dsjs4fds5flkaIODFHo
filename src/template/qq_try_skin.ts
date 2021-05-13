import ProductKey from "./ProductKey";
import FGUI_video_get from "./qqPackage/FGUI_video_get";

/*
* @ Desc:  
* @ Author: jiangdiwei
* @ Data: 2021-05-08 09:47
*/
export default class qq_try_skin extends zs.fgui.baseGeneric<FGUI_video_get> {

    static typeDefine = FGUI_video_get;

    closeHandler: Laya.Handler;
    closeEvent: any;
    videoHandler: Laya.Handler;
    videoEvent: any;
    btn_video: fgui.GButton;
    btn_close: fgui.GButton;

    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_video_get) {
            this.btn_video = component.btn_video;
            this.btn_close = component.btn_close;
            this.btn_video.onClick(this, this.playVideo);
            this.btn_close.onClick(this, this.closeView);
            zs.platform.sync.updateBanner();
        }
    }

    applyConfig(config) {
        if (config) {
            config.icon != null && this.setIcon(config.icon);
            config.closeevent != null && (this.closeEvent = config.closeevent);
            config.videoevent != null && (this.videoEvent = config.videoevent);
        }
        return this.apply();
    }

    setFinishHandler(closeFunc: Laya.Handler, videoFunc?: Laya.Handler): qq_try_skin {
        this.closeHandler = closeFunc;
        this.videoHandler = videoFunc;
        return this;
    }

    playVideo(autoClose?: boolean) {
        this.btn_video.touchable = false;
        zs.platform.async.playVideo().then((finish) => {
            if (finish) {
                this.videoReward();
                this.closeView();
            } else {
                this.btn_video.touchable = true;
                autoClose && this.closeView();
            }
        }).catch(() => {
            zs.platform.sync.showToast("暂时没有视频资源！");
            this.btn_video.touchable = true;
            autoClose && this.closeView();
        })
    }

    checkVideo() {
        if (ProductKey.zs_switch && ProductKey.zs_start_video_switch) {
            this.playVideo(true);
        }
        else {
            this.closeView();
        }
    }

    videoReward() {
        this.videoEvent && zs.core.workflow.runEventConfig(this.videoEvent);
        this.videoHandler && this.videoHandler.run();
    }

    closeView() {
        this.closeEvent && zs.core.workflow.runEventConfig(this.closeEvent);
        this.closeHandler && this.closeHandler.run();
    }

    setIcon(value): qq_try_skin {
        if (this.view.icon) {
            if (Array.isArray(value) && value.length > 1) {
                zs.fgui.loadPack(value[0]).then((res) => {
                    this.view.icon = zs.ui.readURL(res, value[1]);
                });
            } else {
                this.view.icon = value;
            }
        }
        return this;
    }
}