import FGUI_BottomNative from "./export/FGUI_BottomNative";
import FGUI_ScreeNative from "./export/FGUI_ScreeNative";

/*全屏原生导出
* @ Author: yangcheng
* @ Data: 2021-03-11 15:48
*/
export default class native_vivoScreeNative extends zs.fgui.base {
    /**关闭回调 */
    closeHandler: Laya.Handler = null;
    /**原生广告id */
    adUnit: string;
    /**原生广告数据标识 */
    adId: number;
    /**是否已关闭 */
    closed: boolean = false;

    set closeBtnVisible(val) {
        let view = this.view as (FGUI_ScreeNative | FGUI_BottomNative);
        (this.view as FGUI_ScreeNative).btnClose.visible = (this.view as FGUI_ScreeNative).btnCloseBg.visible = val;
    }
    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_ScreeNative) {
            component.btnAdImg.onClick(this, this.onClickAd);
            component.btnConfirm.onClick(this, this.openAdAndCloseView);
            component.btnClose.onClick(this, this.closeView);
        }
    }
    static make() {
        let view = FGUI_ScreeNative.createInstance();
        return view;
    }
    static type() {
        return FGUI_ScreeNative;
    }
    check(component) {
        if (component instanceof FGUI_ScreeNative) {
            return true;
        }
        return false;
    }
    apply() {
        console.log("🐑 : --- >>> 手动隐藏 ", "ScreeNative");
        this.view.visible = false;
        this.closed = false;
        zs.platform.async.loadNativeAd().then((data) => {
            this.onAdLoaded(data);
            Laya.timer.clear(this, this.onAdError);
        }).catch((err) => {
            this.onAdError(err);
            Laya.timer.clear(this, this.onAdError);
        })
        Laya.timer.once(6000, this, this.onAdError);
        return this;
    }

    onAdLoaded(data) {
        let view = this.view as (FGUI_ScreeNative | FGUI_BottomNative);
        var adData = data.adList[0];
        var url = adData.imgUrlList[0];
        console.log("🐑 : --- >>> ", data);
        this.adId = adData.adId;
        let zs_native_click_switch = zs.product.get('zs_native_click_switch');
        let zs_jump_time = zs.product.get('zs_jump_time');
        let zs_native_adunit = zs.product.get('zs_native_adunit');
        let zs_native_touch_switch = zs.product.get('zs_native_touch_switch');
        //icon
        view.btnAdImg.icon = url;
        view.lab_desc.text = adData.desc;
        var btnText;
        if (zs_native_click_switch) {
            btnText = zs.product.get('zs_native_btn_text') ? zs.product.get('zs_native_btn_text') : (adData.clickBtnTxt ? adData.clickBtnTxt : "点击查看");
        } else {
            btnText = "点击跳过";
        }
        view.btnConfirm.title = btnText;
        zs.platform.sync.sendReqAdShowReport(this.adUnit, this.adId);
        zs.platform.sync.setNativeLastShowTime(Laya.Browser.now());
        zs.platform.sync.updateReviveTypeInfo(zs_native_adunit + "open_native_num");
        view.visible = true;
        if (zs_native_touch_switch) {
            this.closeBtnVisible = true;
            view.btnClose.width = view.btnClose.height = 32;
        }
        this.closeBtnVisible = false;
        if (zs_native_click_switch && Number(zs_jump_time) > 0) {
            this.closeBtnVisible = false;
            Laya.timer.once(Number(zs_jump_time), this, () => {
                this.closeBtnVisible = true;
            });
        } else {
            this.closeBtnVisible = true;
        }
    }

    onAdError(err) {
        console.warn(err);
        if (this.closed == false) {
            this.closed = true;
            this.closeView();
        }
    }

    openAdAndCloseView() {
        let zs_native_click_switch = zs.product.get('zs_native_click_switch')
        if (zs_native_click_switch) {
            zs.platform.sync.sendReqAdClickReport(this.adUnit, this.adId);
            zs.core.addAppShow(Laya.Handler.create(this, this.closeView));
        } else {
            this.closeView();
        }
    }

    onClickAd() {
        zs.platform.sync.sendReqAdClickReport(this.adUnit, this.adId);
        zs.core.addAppShow(Laya.Handler.create(this, this.closeView));
    }

    closeView() {
        this.view.visible = false;
        zs.core.removeAppHide(Laya.Handler.create(this, this.closeView));
        this.closeHandler && this.closeHandler.run();
    }

    dispose() {
        super.dispose();
    }
}