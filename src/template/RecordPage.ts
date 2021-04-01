import msgbox from "./common_msg";
import FGUI_RecordPage from "./export/FGUI_RecordPage";

/**分享录屏界面 */
export default class RecordPage extends zs.fgui.base {

    public onShareHandler: Laya.Handler;

    public node: FGUI_RecordPage;

    static make() {
        let view = FGUI_RecordPage.createInstance();
        return view;
    }

    static type() {
        return FGUI_RecordPage;
    }

    check(component) {
        if (component instanceof FGUI_RecordPage) {
            return true;
        }
        return false;
    }

    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_RecordPage) {
            this.node = component;
            this.node.btn_drop_share.onClick(this, this.onCloseClick);
            this.node.btn_share.onClick(this, this.onShareRecord);
            this.node.bg_record_group.onClick(this, this.onShareRecord);
        }
    }


    apply() {
        //停止录屏
        zs.platform.sync.recorderStop();
        let zs_switch = zs.product.get("zs_switch");
        let delay_time = zs.product.get("zs_button_delay_time");
        if (zs_switch && delay_time > 0) {
            this.node.btn_drop_share.visible = false;
            Laya.timer.once(delay_time, this, () => {
                this.node.btn_drop_share.visible = true;
            });
        }
    }

    onCloseClick() {
        this.node.visible = false;
        zs.core.workflow.next();
    }

    onShareRecord() {
        this.setBtnTouchEnable(false);
        if (zs.platform.sync.canShareRecorder()) {
            zs.platform.async.shareRecorderVideo().then(() => {
                //分享录屏成功并领取奖励
                zs.log.log("分享录屏成功！");
                this.setBtnTouchEnable(true);
                this.onShareHandler && (this.onShareHandler.run());
                msgbox.showMsgBox({
                    title: "",
                    content: "恭喜获得100金币",
                    confirmHandler: Laya.Handler.create(this, this.onCloseClick)
                });
                this.onCloseClick();
            }).catch(() => {
                //分享录屏失败
                zs.log.log("分享录屏失败！");
                this.setBtnTouchEnable(true);
                this.onCloseClick();
            })
        } else {
            zs.log.log("录屏时间太短！");
            this.setBtnTouchEnable(true);
            this.onCloseClick();
        }

    }

    setBtnTouchEnable(val) {
        this.node.btn_drop_share.touchable = val;
        this.node.btn_share.touchable = val;
    }
}