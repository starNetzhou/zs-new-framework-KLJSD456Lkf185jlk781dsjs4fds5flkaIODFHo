import exportBinder from "./export/exportBinder";
import native_vivoBottomNative from "./native_vivoBottomNative";
import native_vivoScreeNative from "./native_vivoScreeNative";
import native_BtnAddDesk from "./native_BtnAddDesk";
import ProductKey from "./ProductKey";
import exporter_btn_confirm from "./exporter_btn_confirm";

export default class workflow extends zs.workflow {
    static readonly GAME_START = 'GAME_START';
    static readonly GAME_HOME = 'GAME_HOME';
    static readonly GAME_PREPARE = 'GAME_PREPARE';
    static readonly GAME_PLAY = 'GAME_PLAY';
    static readonly GAME_SETTLE = 'GAME_SETTLE';
    static readonly GAME_END = 'GAME_END';

    exporterPack = "export/export";

    public skipHomeBanner = false;

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

    _settleBtn: exporter_btn_confirm;

    registe() {
        // 绑定导出UI
        exportBinder.bindAll();

        // 工作流注册
        this.fsm = new zs.fsm()
            .registe(workflow.GAME_START, workflow.GAME_HOME, 0, false, this, this.onGameHome)
            .registe(workflow.GAME_HOME, workflow.GAME_PREPARE, 0, false, this, this.onGamePrepare)
            .registe(workflow.GAME_PREPARE, workflow.GAME_PLAY, 0, false, this, this.onGamePlay)
            .registe(workflow.GAME_PLAY, workflow.GAME_SETTLE, 0, false, this, this.onGameSettle)
            .registe(workflow.GAME_SETTLE, workflow.GAME_END, 0, false, this, this.onGameEnd)
            .registe(workflow.GAME_END, workflow.GAME_HOME, 0, false, this, this.onGameHome)
            .setDefault(workflow.GAME_START, true);
    }

    onGameHome(complete) {
        complete.run();
        if ((!this._screeNative || !this._screeNative.view.visible) && !this.skipHomeBanner) {
            zs.platform.sync.showBanner();
        }
        this.onShowAddDeskTop();
    }

    onGamePrepare(complete) {
        complete.run();
        this.hideScreeNative();
        this.onHideAddDeskTop();
    }

    onGamePlay(complete) {
        complete.run();
    }

    onGameSettle(complete) {
        complete.run();
        if (this._settleBtn) {
            this._settleBtn.view.visible = true;
        } else {
            this._settleBtn = this.windowExport.attach(exporter_btn_confirm)
                .align(zs.fgui.AlignType.Bottom, 0, -150)
                .front()
                .getBase() as exporter_btn_confirm;
        }
        this.showScreeNative();
    }
    onGameEnd(complete) {
        complete.run();
        this.hideScreeNative();
        if (ProductKey.zs_native_limit) {
            this.showScreeNative();
            zs.platform.sync.hideBanner();
        }
        this._settleBtn && (this._settleBtn.view.visible = false);
        this._settleBtn = null;
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
                .scale(1.5, 1.5)
                .update<native_BtnAddDesk>(native_BtnAddDesk, (unit) => {
                    this._addDeaskTopBtn = unit;
                    unit.apply();

                })
                .align(zs.fgui.AlignType.Right)
        }
        return this.windowExport;
    }
    onHideAddDeskTop() {
        if (this._addDeaskTopBtn) {
            this.windowExport.detach(this._addDeaskTopBtn);
            this._addDeaskTopBtn = null;
        }
    }
    //#endregion

    //#region 原生的显示和隐藏
    _bottomNative: native_vivoBottomNative = null;
    showBottomNative() {
        if (this._bottomNative) {
            this._bottomNative.view.visible = true;
            this.windowExport
                .setBase(this._bottomNative)
                .front();
        } else {
            this.windowExport
                .attach(native_vivoBottomNative)
                .scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight)
                .update<native_vivoBottomNative>(native_vivoBottomNative, (unit) => {
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
    _screeNative: native_vivoScreeNative = null;
    showScreeNative() {
        if (this._screeNative) {
            this._screeNative.view.visible = true;
            this.windowExport
                .setBase(this._screeNative)
                .front();
        } else {
            this.windowExport
                .attach(native_vivoScreeNative)
                .scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight)
                .fit()
                .block(true)
                .update<native_vivoScreeNative>(native_vivoScreeNative, (unit) => {
                    this._screeNative = unit;
                    unit.closeHandler = Laya.Handler.create(this, () => {
                        zs.platform.sync.showBanner();
                    })
                    unit.apply();
                })
                .setBase(this._screeNative)
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