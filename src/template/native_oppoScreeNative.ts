import FGUI_BottomNative from "./export/FGUI_BottomNative";
import FGUI_ScreeNative from "./export/FGUI_ScreeNative";

/*全屏原生导出
* @ Author: yangcheng
* @ Data: 2021-03-11 15:48
*/
export default class native_oppoScreeNative extends zs.fgui.base {
    /**是否已经关闭当前界面 防止重复调用 */
    closed = false;
    /**后台获取的广告 id */
    adUnit: string;
    /**加载原生完成后 原生的广告 id */
    adId: string;
    /**设置 原生 按钮的隐藏和显示 */

    static make(): FGUI_ScreeNative | FGUI_BottomNative {
        let view = FGUI_ScreeNative.createInstance();
        return view;
    }
    static type(): typeof FGUI_ScreeNative | typeof FGUI_BottomNative {
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
        if (component && (component instanceof FGUI_ScreeNative || component instanceof FGUI_BottomNative)) {
            component.btnAdImg.onClick(this, this.onClickAd);
            component.btnConfirm.onClick(this, this.openAdAndCloseView);
            component.btnClose.onClick(this, this.closeView);
        }
    }
    /**设置 原生 按钮的隐藏和显示 */
    set closeBtnVisible(val) {
        let view = this.view as (FGUI_ScreeNative | FGUI_BottomNative);
        view.btnClose.visible = view.btnCloseBg.visible = val;
    }

    apply() {
        console.log("🐑 : --- >>> 手动隐藏 ", "ScreeNative");
        this.view.visible = false;
        this.closed = false;

        let zs_native_limit = zs.product.get('zs_native_limit');
        console.log("🐑 下一关开始/重新开始原生广告开关 : --- >>> ", zs_native_limit);
        if (!zs_native_limit) {
            this.closeView();
            return;
        }

        zs.platform.async.isBeforeGameAccount().then(() => {
            this.adUnit = zs.product.get("zs_native_adunit")
            //初始化原生
            zs.platform.sync.initNativeAd({ id: this.adUnit });
            //加载原生
            zs.platform.async.loadNativeAd().then((data) => {
                this.onAdLoaded(data);
            }).catch((err) => {
                this.onAdError(err);
            })
        }).catch(() => {
            console.log("🐑 : --- >>> ", "????????????");
            this.closeView();
        })
        return this;
    }
    /**
     * 加载广告成功
     * @param data 加载广告完成返回的 广告数据
     */
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
            btnText = zs.product.get('zs_native_btn_text') ? zs.product.get('zs_native_btn_text') : adData.clickBtnTxt;
        } else {
            btnText = "点击跳过";
        }
        view.btnConfirm.title = btnText;

        zs.platform.sync.sendReqAdShowReport(this.adUnit, this.adId);
        zs.platform.sync.setNativeLastShowTime(Laya.Browser.now());
        zs.platform.sync.updateReviveTypeInfo(zs_native_adunit + "open_native_num");
        zs.platform.async.getAdReporteStatus(this.adUnit)
            .then(() => {
                view.visible = true;
                if (zs_native_touch_switch) {
                    this.closeBtnVisible = true;
                    view.btnClose.width = view.btnClose.height = 32;
                    view.btnCloseBg.alpha = 0.75;
                }
                this.closeBtnVisible = false;
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
        let zs_native_click_switch = zs.product.get('zs_native_click_switch')
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

        console.log("🐑 : --- >>> ", "workflow");
        zs.core.workflow.next();
    }

    dispose() {
        super.dispose();
    }
}