import FGUI_InsertNative from "./export/FGUI_InsertNative";
import FGUI_ScreeNative from "./export/FGUI_ScreeNative";
import ProductKey from "./ProductKey";

/*全屏原生导出
* @ Author: yangcheng
* @ Data: 2021-03-11 15:48
*/
export default class native_vivoScreeNative extends zs.fgui.baseGeneric<FGUI_ScreeNative | FGUI_InsertNative> {

    closeHandler: Laya.Handler;
    /**是否已经关闭当前界面 防止重复调用 */
    closed = false;
    /**后台获取的广告 id */
    adUnit: string;
    /**加载原生完成后 原生的广告 id */
    adId: string;

    confirmText: string;
    confirmSwitch: string;
    closeEvent: any;

    static make(): FGUI_ScreeNative | FGUI_InsertNative {
        let view = FGUI_ScreeNative.createInstance();
        return view;
    }

    static type(): typeof FGUI_ScreeNative | typeof FGUI_InsertNative {
        return FGUI_ScreeNative;
    }

    check(component) {
        if (component instanceof FGUI_ScreeNative) {
            return true;
        }
        return false;
    }

    constructor(component) {
        super(component);
        if (component && (component instanceof FGUI_ScreeNative || component instanceof FGUI_InsertNative)) {
            this.view.btnAdImg.onClick(this, this.onClickAd);
            this.view.btnConfirm.onClick(this, this.openAdAndCloseView);
            this.view.btnClose.onClick(this, this.closeView);
        }
    }

    apply() {
        // console.log("🐑 : --- >>> 手动隐藏 ", "bottonNativeUI");
        console.log("apply screen native");
        this.closed = false;
        if (zs.platform.proxy) {
            this.view.visible = false;
            zs.platform.async.isBeforeGameAccount().then(() => {
                this.adUnit = ProductKey.zs_native_adunit;
                //初始化原生
                zs.platform.sync.initNativeAd({ id: this.adUnit });
                //加载原生
                zs.platform.async.loadNativeAd().then((data) => {
                    this.onAdLoaded(data);
                }).catch((err) => {
                    this.onAdError(err);
                })
            }).catch(() => {
                this.closeView();
            })
        } else {
            this.view.visible = true;
        }
        return this;
    }

    applyConfig(config) {
        let btnCloseIcon = this.view.btnClose.getChild('icon');
        if (config.closetouchsize != null) {
            this.view.btnClose.width = this.view.btnClose.height = config.closetouchsize;
            config.closesize != null && (btnCloseIcon.width = btnCloseIcon.height = config.closesize);
        } else if (config.closesize) {
            this.view.btnClose.width = this.view.btnClose.height = btnCloseIcon.width = btnCloseIcon.height = config.closesize;
        }
        config.confirmtext != null && (this.confirmText = config.confirmtext);
        config.confirmswitch != null && (this.confirmSwitch = config.confirmswitch);
        config.closeevent && (this.closeEvent = config.closeevent);
        if (!zs.platform.proxy) {
            if (this.confirmText != null && (this.confirmSwitch == null || ProductKey[this.confirmSwitch])) {
                this.view.btnConfirm.title = ProductKey.zs_native_btn_text || "查看广告";
            } else {
                this.view.btnConfirm.title = this.confirmText;
            }
        }
        return this.apply();
    }

    /**
    * 加载广告成功
    * @param data 加载广告完成返回的 广告数据
    */
    onAdLoaded(data) {
        var adData = data.adList[0];
        var url = adData.imgUrlList[0];
        console.log("🐑 : --- >>> ", data);
        this.adId = adData.adId;
        let zs_native_click_switch = ProductKey.zs_native_click_switch;
        let zs_jump_time = ProductKey.zs_jump_time;
        let zs_native_adunit = ProductKey.zs_native_adunit;
        let zs_native_touch_switch = ProductKey.zs_native_touch_switch;

        //icon
        this.view.btnAdImg.icon = url;
        this.view.lab_desc.text = adData.desc;
        var btnText;
        if (this.confirmText != null && (this.confirmSwitch == null || ProductKey[this.confirmSwitch])) {
            btnText = this.confirmText;
        } else {
            btnText = ProductKey.zs_native_btn_text ? ProductKey.zs_native_btn_text : adData.clickBtnTxt;
        }
        this.view.btnConfirm.title = btnText;

        zs.platform.sync.sendReqAdShowReport(this.adUnit, this.adId);
        zs.platform.sync.setNativeLastShowTime(Laya.Browser.now());
        zs.platform.sync.updateReviveTypeInfo(zs_native_adunit + "open_native_num");
        zs.platform.async.getAdReporteStatus(this.adUnit)
            .then(() => {
                this.view.visible = true;
                if (zs_native_touch_switch) {
                    this.view.btnClose.visible = true;
                    // this.view.btnClose.width = this.view.btnClose.height = 32;
                }
                if (zs_native_click_switch && zs_jump_time > 0) {
                    this.view.btnClose.visible = false;
                    Laya.timer.once(zs_jump_time, this, () => {
                        this.view.btnClose.visible = true;
                    });
                } else {
                    this.view.btnClose.visible = true;
                }
            })
            .catch(() => {
                this.closeView();
            })
    }

    /**原生加载失败回调 */
    onAdError(err) {
        console.warn(err);
        if (this.closed == false) {
            this.closed = true;
            this.closeView();
        }
    }
    /**打开广告 或者 关闭页面 */
    openAdAndCloseView() {
        let zs_native_click_switch = ProductKey.zs_native_click_switch;
        if (zs_native_click_switch) {
            // Laya.SoundManager.playSound(PlatformMgr.clickSound);
            zs.platform.sync.sendReqAdClickReport(this.adUnit, this.adId);
            zs.core.addAppShow(Laya.Handler.create(this, this.closeView));
        } else {
            this.closeView();
        }
    }
    /**点击广告回调 */
    onClickAd() {
        zs.platform.sync.sendReqAdClickReport(this.adUnit, this.adId);
        zs.core.addAppShow(Laya.Handler.create(this, this.closeView));
    }
    /**关闭界面 */
    closeView() {
        this.view.visible = false;
        zs.core.removeAppHide(Laya.Handler.create(this, this.closeView));
        if (this.window) {
            this.window.detach(this);
        } else {
            this.dispose();
        }
        this.closeHandler && this.closeHandler.run();
        this.closeEvent && zs.core.workflow.runEventConfig(this.closeEvent);
    }
}