import msgbox from "./common_msg";
import QQAd_video_get from "./fgui/QQAd_video_get";

export default class video_view extends zs.fgui.base {
    viewName: string;
    closeHandler: Laya.Handler;
    videoHandler: Laya.Handler;
    btn_video: fgui.GButton;
    btn_close: fgui.GButton;
    constructor(component) {
        super(component);
        if (component && component instanceof QQAd_video_get) {
            this.btn_video = component.btn_video;
            this.btn_close = component.btn_close;
            this.btn_video.onClick(this, this.playVideo);
            this.btn_close.onClick(this, this.closeView);
            zs.platform.sync.updateBanner();
        }
    }
    static make() {
        let view = QQAd_video_get.createInstance();
        return view;
    }
    static type() {
        return QQAd_video_get;
    }
    init() {
        super.init();
        this.viewName = "videoGet";
    }
    dispose() {
        super.dispose();
    }
    check(component) {
        if (component instanceof QQAd_video_get) {
            return true;
        }
        return false;
    }

    setFinishHandler(closeFunc: Laya.Handler, videoFunc?: Laya.Handler) {
        this.closeHandler = closeFunc;
        this.videoHandler = videoFunc;
    }

    playVideo(autoClose?) {
        this.btn_video.touchable = false;
        zs.platform.async.playVideo().then((finish) => {
            if (finish) {
                this.videoHandler && this.videoHandler.run();
                this.closeHandler && this.closeHandler.run();
            } else {
                console.log("用户取消")
                this.btn_video.touchable = true;
                autoClose && this.closeHandler && this.closeHandler.run();
            }
        }).catch(() => {
            msgbox.showMsgBox({
                title: "错误",
                content: "视频组件错误",
                hideCancel: true,
            });
            this.btn_video.touchable = true;
            autoClose && this.closeHandler && this.closeHandler.run();;
        })
    }

    checkVideo() {
        if (zs.product.get("zs_swich") && zs.product.get("zs_start_video_switch")) {
            this.playVideo(true);
        }
        else {
            this.closeView();
        }
    }

    closeView() {
        this.closeHandler && this.closeHandler.run();
    }

    apply() {
        var a = 1;
        return this;
    }

}