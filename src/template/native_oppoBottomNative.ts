import FGUI_BottomNative from "./export/FGUI_BottomNative";
import FGUI_ScreeNative from "./export/FGUI_ScreeNative";
import ProductKey from "./ProductKey";

/*底部原生
* @ Author: yangcheng
* @ Data: 2021-03-11 15:48
*/
export default class native_oppoBottomNative extends zs.fgui.base {

    /** */
    owner: FGUI_ScreeNative | FGUI_BottomNative;
    /**是否已经关闭当前界面 防止重复调用 */
    closed = false;
    /**后台获取的广告 id */
    adUnit: string;
    /**加载原生完成后 原生的广告 id */
    adId: string;
    /**设置 原生 按钮的隐藏和显示 */
    set closeBtnVisible(val) {
        this.owner.btnClose.visible = this.owner.btnCloseBg.visible = val;
    }

    static make(): FGUI_ScreeNative | FGUI_BottomNative {
        let view = FGUI_BottomNative.createInstance();
        return view;
    }
    static type(): typeof FGUI_ScreeNative | typeof FGUI_BottomNative {
        return FGUI_BottomNative;
    }
    check(component) {
        if (component instanceof FGUI_BottomNative) {
            return true;
        }
        return false;
    }

    constructor(component) {
        super(component);
        if (component && (component instanceof FGUI_ScreeNative || component instanceof FGUI_BottomNative)) {
            this.owner = component;
            this.owner.btnAdImg.onClick(this, this.onClickAd);
            this.owner.btnConfirm.onClick(this, this.openAdAndCloseView);
            this.owner.btnClose.onClick(this, this.closeView);
        }
    }

    apply() {
        // console.log("🐑 : --- >>> 手动隐藏 ", "bottonNativeUI");
        this.owner.visible = false;
        this.closed = false;
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
        return this;
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
        this.owner.btnAdImg.icon = url;
        this.owner.lab_desc.text = adData.desc;
        var btnText;
        if (zs_native_click_switch) {
            btnText = ProductKey.zs_native_btn_text ? ProductKey.zs_native_btn_text : adData.clickBtnTxt;
        } else {
            btnText = "点击跳过";
        }
        this.owner.btnConfirm.title = btnText;

        zs.platform.sync.sendReqAdShowReport(this.adUnit, this.adId);
        zs.platform.sync.setNativeLastShowTime(Laya.Browser.now());
        zs.platform.sync.updateReviveTypeInfo(zs_native_adunit + "open_native_num");
        zs.platform.async.getAdReporteStatus(this.adUnit)
            .then(() => {
                this.owner.visible = true;
                if (zs_native_touch_switch) {
                    this.closeBtnVisible = true;
                    this.owner.btnClose.width = this.owner.btnClose.height = 32;
                    this.owner.btnCloseBg.alpha = 0.75;
                }
                if (zs_native_click_switch && zs_jump_time > 0) {
                    this.closeBtnVisible = false;
                    Laya.timer.once(zs_jump_time, this, () => {
                        this.closeBtnVisible = true;
                    });
                } else {
                    this.closeBtnVisible = true;
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
        this.owner.visible = false;
        zs.core.removeAppHide(Laya.Handler.create(this, this.closeView));
        this.dispose();
    }

    dispose() {
        super.dispose();
    }
}