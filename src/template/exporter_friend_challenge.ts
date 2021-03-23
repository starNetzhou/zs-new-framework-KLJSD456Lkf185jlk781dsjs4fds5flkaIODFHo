import FGUI_friend_challenge from "./export/FGUI_friend_challenge";

export default class exporter_friend_challenge extends zs.fgui.base {
    static nickList: string[];
    adData: ExporterData;
    callback: Laya.Handler;

    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_friend_challenge) {
            component.challenge.btnNo.onClick(this, this.onBtnNoClick);
            component.challenge.btnYes.onClick(this, this.onBtnYesClick);
        }
    }
    static make() {
        let view = FGUI_friend_challenge.createInstance();
        return view;
    }
    static type() {
        return FGUI_friend_challenge;
    }
    init() {
        super.init();
        zs.platform.sync.hideBanner();
    }
    check(component) {
        if (component instanceof FGUI_friend_challenge) {
            return true;
        }
        return false;
    }
    setGameName(gameName) {
        let view = this.view as FGUI_friend_challenge;
        if (gameName && view.challenge.lblGame) {
            view.challenge.lblGame.text = gameName;
        } else if (view.challenge.lblGame) {
            view.challenge.lblGame.text = "";
        }
        return this;
    }
    setPlayerName(playerName) {
        let view = this.view as FGUI_friend_challenge;
        if (playerName && view.challenge.lblName) {
            view.challenge.lblName.text = playerName;
        } else if (view.challenge.lblName) {
            view.challenge.lblName.text = "";
        }
        return this;
    }
    setDesc(desc) {
        let view = this.view as FGUI_friend_challenge;
        if (desc && view.challenge.lblDesc) {
            view.challenge.lblDesc.text = desc;
        } else if (view.challenge.lblDesc) {
            view.challenge.lblDesc.text = "";
        }
        return this;
    }
    setGameIcon(url) {
        let view = this.view as FGUI_friend_challenge;
        if (url && view.challenge.picture1) {
            view.challenge.picture1.icon = url;
        } else if (view.challenge.picture1) {
            // this.view.picture1.text = "";
        }
        return this;
    }
    apply() {
        zs.exporter.dataMgr.load().then((result) => {
            var adDatas = result.promotion;
            this.adData = adDatas[Math.floor(Math.random() * adDatas.length)];
            var gameName = this.adData && this.adData.app_title || "游戏";
            var gameIcon = this.adData && this.adData.app_icon;
            let nameList = exporter_friend_challenge.nickList || [];
            var showName;
            if (nameList.length > 0) {
                showName = nameList[Math.floor(Math.random() * nameList.length)];
            } else {
                showName = "神秘人"
            }
            var desc = `好友“${showName}”向您发起挑战：`
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
            zs.exporter.dataMgr.collectExport(this.adData.app_id);
        });
        this.callback && this.callback.run();
    }
}