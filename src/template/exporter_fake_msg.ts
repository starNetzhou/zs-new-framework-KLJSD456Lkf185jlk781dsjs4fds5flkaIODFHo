import FGUI_fake_msg from "./export/FGUI_fake_msg";

export default class exporter_fake_msg extends zs.fgui.baseGeneric<FGUI_fake_msg> {

    static typeDefine = FGUI_fake_msg;

    // 昵称列表
    static nickList: string[];
    // 音效路径
    static soundShow: string;

    // 描述文本
    desc: fairygui.GTextField;
    // 导出数据
    adData: ExporterData;
    // 事件回调
    callback: Laya.Handler;

    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_fake_msg) {
            this.desc = component.desc;
            component.onClick(this, this.onMsgClick);
        }
    }
    dispose() {
        super.dispose();
        Laya.Tween.clearAll(this.view);
    }
    setTitle(title) {
        if (title) {
            this.view.title = title;
        } else {
            this.view.title = "";
        }
        return this;
    }
    setDesc(desc) {
        if (desc && this.desc) {
            this.desc.text = desc;
        } else {
            this.desc.text = "";
        }
        return this;
    }
    apply() {
        this.tweenHide();
        zs.exporter.dataMgr.load().then((result) => {
            var adDatas = result.promotion;
            this.adData = adDatas[Math.floor(Math.random() * adDatas.length)];
            var desc = this.adData && this.adData.app_title || "游戏";
            let nameList = exporter_fake_msg.nickList || [];
            var showName;
            if (nameList.length > 0) {
                showName = nameList[Math.floor(Math.random() * nameList.length)];
            } else {
                showName = "神秘人";
            }
            desc = `邀请您一起玩 ${desc}`;
            this.setTitle(showName)
                .setDesc(desc)
                .tweenShow();
        });
        return this;
    }

    tweenShow() {
        exporter_fake_msg.soundShow && Laya.SoundManager.playSound(exporter_fake_msg.soundShow, 1);
        Laya.Tween.clearAll(this.view)
        let y = this.view.height;
        this.view.y = -y;
        Laya.Tween.to(this.view, { y: 0 }, 200);
        return this;
    }

    tweenHide() {
        Laya.Tween.clearAll(this.view)
        let y = this.view.height;
        Laya.Tween.to(this.view, { y: -y }, 200);
        return this;
    }

    setCancelCallback(callback) {
        this.callback = callback;
        return this
    }

    onMsgClick() {
        // console.log("点击了", this.adData)
        this.tweenHide();
        zs.platform.async.navigateToOther({ appInfo: this.adData }).then(() => {
            zs.exporter.dataMgr.collectExport(this.adData.app_id);
        }).catch(() => {
            // 点击了取消跳转   需要打开挑战界面
            this.callback && this.callback.run();
        });
    }
}