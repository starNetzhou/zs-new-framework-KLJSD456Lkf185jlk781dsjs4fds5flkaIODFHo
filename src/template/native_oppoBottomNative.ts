import FGUI_BottomNative from "./export/FGUI_BottomNative";

/*
* @ Author: yangcheng
* @ Data: 2021-03-11 15:48
*/
export default class native_oppoBottomNative extends zs.fgui.base {

    owner: FGUI_BottomNative;

    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_BottomNative) {
            this.owner = component;
            // this.img = component.btnAdImg;
            this.owner.btnAdImg.onClick(this, this.onClickAd);
            this.owner.btnConfirm.onClick(this, this.openAdAndCloseView);
            this.owner.btnClose.onClick(this, this.closeView);
        }
    }
    static make() {
        let view = FGUI_BottomNative.createInstance();
        return view;
    }
    static type() {
        return FGUI_BottomNative;
    }
    check(component) {
        if (component instanceof FGUI_BottomNative) {
            return true;
        }
        return false;
    }
    closed = false;
    apply() {
        console.log("🐑 : --- >>> 手动隐藏 ", "bottonNativeUI");
        this.owner.visible = false;
        this.closed = false;
        zs.platform.async.isBeforeGameAccount().then(() => {
            this.adUnit = zs.product.get("zs_native_adunit")
            zs.platform.sync.initNativeAd({ id: this.adUnit });
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
    adUnit
    adId
    onAdLoaded(data) {
        var adData = data.adList[0];
        var url = adData.imgUrlList[0];
        console.log("🐑 : --- >>> ", data);
        this.adId = adData.adId;
        let zs_native_click_switch = zs.product.get('zs_native_click_switch');
        let zs_jump_time = zs.product.get('zs_jump_time');
        let zs_native_adunit = zs.product.get('zs_native_adunit');
        let zs_native_touch_switch = zs.product.get('zs_native_touch_switch');

        console.log("🐑 : --- >>> ",);

        //icon
        this.owner.btnAdImg.icon = url;
        this.owner.lab_desc.text = adData.desc;
        var btnText;
        if (zs_native_click_switch) {
            btnText = zs.product.get('zs_native_btn_text') ? zs.product.get('zs_native_btn_text') : adData.clickBtnTxt;
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

    set closeBtnVisible(val) {
        this.owner.btnClose.visible = this.owner.btnCloseBg.visible = val;
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
            // Laya.SoundManager.playSound(PlatformMgr.clickSound);
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
        this.owner.visible = false;
        zs.core.removeAppHide(Laya.Handler.create(this, this.closeView));
        this.dispose();
    }

    dispose() {
        super.dispose();
    }
}