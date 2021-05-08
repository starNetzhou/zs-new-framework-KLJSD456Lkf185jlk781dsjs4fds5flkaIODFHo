import FGUI_friend_challenge from "./export/FGUI_friend_challenge";

export default class exporter_friend_challenge extends zs.fgui.baseGeneric<FGUI_friend_challenge> {

    static typeDefine = FGUI_friend_challenge;

    // 昵称列表
    static nickList: string[];
    // 导出数据
    adData: ExporterData;
    // 事件回调
    callback: Laya.Handler;

    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_friend_challenge) {
            component.challenge.btnNo.onClick(this, this.onBtnNoClick);
            component.challenge.btnYes.onClick(this, this.onBtnYesClick);
        }
    }
    init() {
        super.init();
        zs.platform.sync.hideBanner();
    }
    setGameName(gameName) {
        if (gameName && this.view.challenge.lblGame) {
            this.view.challenge.lblGame.text = gameName;
        } else if (this.view.challenge.lblGame) {
            this.view.challenge.lblGame.text = "";
        }
        return this;
    }
    setPlayerName(playerName) {
        if (playerName && this.view.challenge.lblName) {
            this.view.challenge.lblName.text = playerName;
        } else if (this.view.challenge.lblName) {
            this.view.challenge.lblName.text = "";
        }
        return this;
    }
    setDesc(desc) {
        if (desc && this.view.challenge.lblDesc) {
            this.view.challenge.lblDesc.text = desc;
        } else if (this.view.challenge.lblDesc) {
            this.view.challenge.lblDesc.text = "";
        }
        return this;
    }
    setGameIcon(url) {
        if (url && this.view.challenge.picture1) {
            this.view.challenge.picture1.icon = url;
        } else if (this.view.challenge.picture1) {
            // this.view.picture1.text = "";
        }
        return this;
    }
    apply() {
        zs.exporter.dataMgr.load().then((result) => {
            let adDatas = result;
            this.adData = adDatas[Math.floor(Math.random() * adDatas.length)];
            let gameName = this.adData && this.adData.app_title || "游戏";
            let gameIcon = this.adData && this.adData.app_icon;
            let nameList = exporter_friend_challenge.nickList || [];
            let showName = "神秘人";
            if (nameList.length > 0) {
                showName = nameList[Math.floor(Math.random() * nameList.length)];
            }
            let desc = `好友“${showName}”向您发起挑战：`
            this.setPlayerName(showName)
                .setGameName(gameName)
                .setGameIcon(gameIcon)
                .setDesc(desc);
        });
        return this;
    }
    setCloseCallback(callback) {
        this.callback = callback;
        return this;
    }
    onBtnNoClick() {
        this.callback && this.callback.run();
    }
    onBtnYesClick() {
        zs.platform.async.navigateToOther({ appInfo: this.adData }).then(() => {
            zs.exporter.dataMgr.collectExport(this.adData);
        });
        this.callback && this.callback.run();
    }
}