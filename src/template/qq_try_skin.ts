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
    videoHandler: Laya.Handler;
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

    setFinishHandler(closeFunc: Laya.Handler, videoFunc?: Laya.Handler) {
        this.closeHandler = closeFunc;
        this.videoHandler = videoFunc;
    }

    playVideo(autoClose?: boolean) {
        this.btn_video.touchable = false;
        zs.platform.async.playVideo().then((finish) => {
            if (finish) {
                this.videoHandler && this.videoHandler.run();
                this.closeHandler && this.closeHandler.run();
            } else {
                this.btn_video.touchable = true;
                autoClose && this.closeHandler && this.closeHandler.run();
            }
        }).catch(() => {
            zs.platform.sync.showToast("暂时没有视频资源！");
            this.btn_video.touchable = true;
            autoClose && this.closeHandler && this.closeHandler.run();
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

    closeView() {
        this.closeHandler && this.closeHandler.run();
    }

    refreshIcon(url) {
        this.view.icon = url;
    }
}