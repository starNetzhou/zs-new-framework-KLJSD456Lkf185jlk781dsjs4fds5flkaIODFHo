import exportBinder from "./export/exportBinder";
import native_oppoBottomNative from "./native_oppoBottomNative";
import FGUI_BottomNative from "./export/FGUI_BottomNative";
import native_oppoScreeNative from "./native_oppoScreeNative";
import native_BtnAddDesk from "./native_BtnAddDesk";
import native_BtnMoreGame from "./native_BtnMoreGame";

export default class workflow extends zs.workflow {

    static readonly GAME_START = 'GAME_START';
    static readonly START_FULL_1 = 'START_FULL_1';
    static readonly START_FULL_2 = 'START_FULL_2';
    static readonly GAME_HOME = 'GAME_HOME';
    static readonly GAME_PREPARE = 'GAME_PREPARE';
    static readonly EXPORT_COMMON_EGG = 'EXPORT_COMMON_EGG';
    static readonly GAME_PLAY = 'GAME_PLAY';
    static readonly EXPORT_GAME_EGG = 'EXPORT_GAME_EGG';
    static readonly OVER_FULL_1 = 'OVER_FULL_1';
    static readonly GAME_SETTLE = 'GAME_SETTLE';
    static readonly OVER_FULL_2 = 'OVER_FULL_2';
    static readonly GAME_END = 'GAME_END';

    static readonly OPEN_SCREE_NATIVE = 'OPEN_SCREE_NATIVE';

    exporterPack = "export/export";

    windowFull: zs.fgui.window;

    _windowExport: zs.fgui.window;

    get windowExport(): zs.fgui.window {
        if (this._windowExport == null) {
            this._windowExport = zs.fgui.window
                .create()
                .fit()
                .show();
        }
        return this._windowExport;
    }

    commonMsgList: zs.fgui.window[];

    fullStack = [];

    registe() {
        exportBinder.bindAll();

        this.fsm = new zs.fsm()
            .registe(workflow.GAME_START, workflow.GAME_HOME, 0, false, this, this.onGameHome)
            .registe(workflow.GAME_HOME, workflow.GAME_PREPARE, 0, false, this, this.onGamePrepare)
            .registe(workflow.GAME_PREPARE, workflow.GAME_PLAY, 0, false, this, this.onGamePlay)
            .registe(workflow.GAME_PLAY, workflow.GAME_SETTLE, 0, false, this, this.onGameSettle)
            .registe(workflow.GAME_SETTLE, workflow.GAME_END, 0, false, this, this.onGameEnd)
            .registe(workflow.GAME_END, workflow.OPEN_SCREE_NATIVE, 0, false, this, this.openScreeNative)
            .registe(workflow.OPEN_SCREE_NATIVE, workflow.GAME_HOME, 0, false, this, this.onGameHome)
			.setDefault(workflow.GAME_START, true);
    }

    onGameHome(complete) {
        complete.run();
        this.hideScreeNative();
        zs.platform.sync.showBanner();
        this.onShowMoreGame();
        this.onShowAddDeskTop();
    }

    onGamePrepare(complete) {
        complete.run();
        this.onHideAddDeskTop();
        this.onHideMoreGame();
    }

    onGamePlay(complete) {
        complete.run();
        zs.platform.sync.showBanner();
    }

    onGameSettle(complete) {
        complete.run();
        zs.platform.sync.hideBanner();
        this.showBottomNative();
    }
    openScreeNative(complete) {
        complete.run();
        zs.platform.sync.hideBanner();
        this.showScreeNative();
    }
    onGameEnd(complete) {
        complete.run();
        zs.core.workflow.next();
        this.hideBottomNative();
    }

    //#region 添加桌面和更多好玩
    _addDeaskTopBtn: native_BtnAddDesk = null;
    onShowAddDeskTop() {
        if (this._addDeaskTopBtn) {
            this._addDeaskTopBtn.view.visible = true;
            this.windowExport
                .setBase(this._addDeaskTopBtn)
                .front();
        } else {
            this.windowExport
                .attach(native_BtnAddDesk)
                .scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight)
                .scale(1.5,1.5)
                .update<native_BtnAddDesk>(native_BtnAddDesk, (unit) => {
                    this._addDeaskTopBtn = unit;
                    unit.apply();

                })
                .align(zs.fgui.AlignType.Right)
                .front();
        }
        return this.windowExport;
    }
    onHideAddDeskTop() {
        if(this._addDeaskTopBtn){
            this.windowExport.detach(this._addDeaskTopBtn);
            this._addDeaskTopBtn = null;
        }
    }
    _moreGameBtn: native_BtnMoreGame = null;
    onShowMoreGame() {
        if (this._moreGameBtn) {
            this._moreGameBtn.view.visible = true;
            this.windowExport
                .setBase(this._moreGameBtn)
                .front();
        } else {
            this.windowExport
                .attach(native_BtnMoreGame)
                .scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight)
                .scale(1.5,1.5)
                .update<native_BtnMoreGame>(native_BtnMoreGame, (unit) => {
                    this._moreGameBtn = unit;
                    unit.apply();
                })
                .align(zs.fgui.AlignType.Left)
                .front();
        }
        return this.windowExport;
    }
    onHideMoreGame() {
        if(this._moreGameBtn){
            this.windowExport.detach(this._moreGameBtn);
            this._moreGameBtn = null;
        }
    }
    //#endregion

    //#region 原生的显示和隐藏
    _bottomNative: native_oppoBottomNative = null;
    showBottomNative() {
        if (this._bottomNative) {
            this._bottomNative.view.visible = true;
            this.windowExport
                .setBase(this._bottomNative)
                .front();
        } else {
            this.windowExport
                .attach(native_oppoBottomNative)
                .scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight)
                .update<native_oppoBottomNative>(native_oppoBottomNative, (unit) => {
                    this._bottomNative = unit;
                    unit.apply();
                })
                .align(zs.fgui.AlignType.Bottom)
                .front();
        }
        return this.windowExport;
    }
    hideBottomNative() {
        if (this._bottomNative) {
            this.windowExport.detach(this._bottomNative);
            this._bottomNative = null;
        }
    }
    _screeNative: native_oppoScreeNative = null;
    showScreeNative() {
        if (this._screeNative) {
            this._screeNative.view.visible = true;
            this.windowExport
                .setBase(this._screeNative)
                .front();
        } else {
            this.windowExport
                .attach(native_oppoScreeNative)
                .scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight)
                .fit()
                .block(true)
                .update<native_oppoScreeNative>(native_oppoScreeNative, (unit) => {
                    this._screeNative = unit;
                    unit.closeHandler = Laya.Handler.create(this, () => {
                        console.log("🐑 : --- >>> ","workflow");
                        zs.core.workflow.next();
                    })
                    unit.apply();
                })
                .align(zs.fgui.AlignType.Center)
                .front();
        }
        return this.windowExport;
    }
    hideScreeNative() {
        if (this._screeNative) {
            this.windowExport.detach(this._screeNative);
            this._screeNative = null;
        }
    }
    //#endregion


}