import exportBinder from "./export/exportBinder";
import native_vivoBottomNative from "./native_vivoBottomNative";
import native_vivoScreeNative from "./native_vivoScreeNative";
import native_BtnAddDesk from "./native_BtnAddDesk";
import ProductKey from "./ProductKey";
import exporter_btn_confirm from "./exporter_btn_confirm";

export default class workflow extends zs.workflow {
    static readonly PRODUCT_START = "PRODUCT_START";
    static readonly PRODUCT_BEGIN = "PRODUCT_BEGIN";
    static readonly GAME_HOME = "GAME_HOME";
    static readonly PRODUCT_HOME_PLAY = "PRODUCT_HOME_PLAY";
    static readonly GAME_PLAY = "GAME_PLAY";
    static readonly PRODUCT_PLAY_END = "PRODUCT_PLAY_END";
    static readonly GAME_END = "GAME_END";
    static readonly PRODUCT_FINISH = "PRODUCT_FINISH";

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

    /**添加桌面icon按钮 */
    static readonly add_btn_deskTopIcon = "add_btn_deskTopIcon";
    /**添加底部原生 */
    static readonly add_bottom_native = "add_bottom_native";
    /**添加屏幕原生 */
    static readonly add_screen_native = "add_screen_native";

    static readonly event_home_banner = "event_home_banner";
    static readonly event_hide_screen_native = "event_hide_screen_native";
    static readonly event_show_screen_native = "event_show_screen_native";

    _settleBtn: exporter_btn_confirm;

    registe() {
        super.registe();

        // 绑定导出UI
        exportBinder.bindAll();

        zs.fgui.configs.registeBase(workflow.add_btn_deskTopIcon, native_BtnAddDesk);
        zs.fgui.configs.registeBase(workflow.add_bottom_native, native_vivoBottomNative);
        zs.fgui.configs.registeBase(workflow.add_screen_native, native_vivoScreeNative);

        zs.core.workflow.registeEvent(workflow.event_home_banner, this, this.homeBanner);
        zs.core.workflow.registeEvent(workflow.event_hide_screen_native, this, this.hideScreeNative);
        zs.core.workflow.registeEvent(workflow.event_show_screen_native, this, this.showScreeNative);
    }

    onGameHome(complete) {
        complete.run();
        if ((!this._screeNative || !this._screeNative.view.visible) && !this.skipHomeBanner) {
            zs.platform.sync.showBanner();
        }
        this.onShowAddDeskTop();
    }

    homeBanner() {
        if ((!this._screeNative || !this._screeNative.view.visible) && !this.skipHomeBanner) {
            zs.platform.sync.showBanner();
        }
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
        if (!ProductKey.zs_skip_settle && ProductKey.zs_version) {
            if (this._settleBtn) {
                this._settleBtn.view.visible = true;
            } else {
                this._settleBtn = this.windowExport.attach(exporter_btn_confirm)
                    .align(zs.fgui.AlignType.Bottom, 0, -150)
                    .front()
                    .getBase() as exporter_btn_confirm;
            }
            this.showScreeNative();
        } else {
            zs.core.workflow.next();
        }
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