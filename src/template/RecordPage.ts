import FGUI_RecordPage from "./export/FGUI_RecordPage";
import ProductKey from "./ProductKey";

/**分享录屏界面 */
export default class RecordPage extends zs.fgui.baseGeneric<FGUI_RecordPage> {

    static typeDefine = FGUI_RecordPage;

    public onShareHandler: Laya.Handler;

    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_RecordPage) {
            this.view.btn_drop_share.onClick(this, this.onCloseClick);
            this.view.btn_share.onClick(this, this.onShareRecord);
            this.view.bg_record_group.onClick(this, this.onShareRecord);
        }
    }


    apply(): RecordPage {
        zs.platform.sync.recorderStop();
        let zs_switch = ProductKey.zs_switch;
        let delay_time = ProductKey.zs_button_delay_time;
        if (zs_switch && delay_time > 0) {
            this.view.btn_drop_share.visible = false;
            Laya.timer.once(delay_time, this, () => {
                this.view.btn_drop_share.visible = true;
            });
        }
        return this;
    }

    onCloseClick() {
        this.view.visible = false;
        zs.core.workflow.childNext();
    }

    onShareRecord() {
        this.setBtnTouchEnable(false);
        if (zs.platform.sync.canShareRecorder()) {
            zs.platform.async.shareRecorderVideo().then(() => {
                //分享录屏成功并领取奖励
                zs.log.debug("分享录屏成功！");
                this.setBtnTouchEnable(true);
                this.onShareHandler && (this.onShareHandler.run());
                this.onCloseClick();
            }).catch(() => {
                //分享录屏失败
                zs.log.debug("分享录屏失败！");
                this.setBtnTouchEnable(true);
                this.onCloseClick();
            })
        } else {
            zs.log.debug("录屏时间太短！");
            this.setBtnTouchEnable(true);
            this.onCloseClick();
        }

    }

    setBtnTouchEnable(val) {
        this.view.btn_drop_share.touchable = val;
        this.view.btn_share.touchable = val;
    }
}