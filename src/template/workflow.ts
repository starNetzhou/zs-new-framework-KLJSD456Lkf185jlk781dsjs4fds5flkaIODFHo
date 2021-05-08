import exportBinder from "./export/exportBinder";
import native_oppoBottomNative from "./native_oppoBottomNative";
import native_oppoScreeNative from "./native_oppoScreeNative";
import native_BtnAddDesk from "./native_BtnAddDesk";
import native_BtnMoreGame from "./native_BtnMoreGame";
import exporter_btn_confirm from "./exporter_btn_confirm";
import ProductKey from "./ProductKey";

export default class workflow extends zs.workflow {
    static readonly GAME_START_NATIVE = 'GAME_START_NATIVE'
    static readonly GAME_SETTLE = 'GAME_SETTLE';
    static readonly OPEN_SCREE_NATIVE = 'OPEN_SCREE_NATIVE';

    static readonly PRODUCT_START = "PRODUCT_START";
    static readonly PRODUCT_BEGIN = "PRODUCT_BEGIN";
    static readonly GAME_HOME = "GAME_HOME";
    static readonly PRODUCT_HOME_PLAY = "PRODUCT_HOME_PLAY";
    static readonly GAME_PLAY = "GAME_PLAY";
    static readonly PRODUCT_PLAY_END = "PRODUCT_PLAY_END";
    static readonly GAME_END = "GAME_END";
    static readonly PRODUCT_FINISH = "PRODUCT_FINISH";

    exporterPack = "export/export";

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
    /**添加更多好玩按钮 */
    static readonly add_btn_moreGame = "add_btn_moreGame";
    /**添加底部原生 */
    static readonly add_bottom_native = "add_bottom_native";
    static readonly add_screen_native = "add_screen_native";

    _settleBtn: exporter_btn_confirm;

    registe() {
        super.registe();

        // 绑定导出UI
        exportBinder.bindAll();

        zs.fgui.configs.registeBase(workflow.add_btn_deskTopIcon, native_BtnAddDesk);
        zs.fgui.configs.registeBase(workflow.add_bottom_native, native_oppoBottomNative);
        zs.fgui.configs.registeBase(workflow.add_screen_native, native_oppoScreeNative);
        zs.fgui.configs.registeBase(workflow.add_btn_moreGame, native_BtnMoreGame);

        // 工作流注册
        // this.fsm = new zs.fsm()
        //     // .registe(workflow.GAME_HOME, workflow.GAME_START_NATIVE, 0, false, this, this.openScreeNative)
        //     .registe(workflow.GAME_START_NATIVE, workflow.GAME_PLAY, 0, false, this, this.onGamePlay)
        //     .registe(workflow.GAME_PLAY, workflow.GAME_SETTLE, 0, false, this, this.onGameSettle)
        //     .registe(workflow.GAME_SETTLE, workflow.GAME_END, 0, false, this, this.onGameEnd)
        //     .registe(workflow.GAME_END, workflow.OPEN_SCREE_NATIVE, 0, false, this, this.openScreeNative)
        //     .registe(workflow.OPEN_SCREE_NATIVE, workflow.GAME_HOME, 0, false, this, this.onGameHome)
        //     .setDefault(workflow.GAME_HOME);
    }

    onGameHome(complete) {
        complete.run();
        this.hideScreeNative();
    }

    onGamePlay(complete) {
        complete.run();
        this.hideScreeNative();
    }

    onGameSettle(complete) {
        complete.run();
        if (!ProductKey.zs_skip_settle && ProductKey.zs_version) {
            this.showBottomNative();
            if (this._settleBtn) {
                this._settleBtn.view.visible = true;
            } else {
                this._settleBtn = this.windowExport.attach(exporter_btn_confirm)
                    .align(zs.fgui.AlignType.Bottom, 0, -150)
                    .front()
                    .getBase() as exporter_btn_confirm;
            }
        } else {
            zs.core.workflow.next();
        }
    }
    openScreeNative(complete) {
        complete.run();
        this.showScreeNative();
    }
    onGameEnd(complete) {
        complete.run();
        this.hideBottomNative();
        this._settleBtn && (this._settleBtn.view.visible = false);
        this._settleBtn = null;
    }

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
                    unit.apply();
                })
                .align(zs.fgui.AlignType.Center)
                .front();
        }
        return this.windowExport;
    }
    hideScreeNative() {
        this._screeNative && this.windowExport.detach(this._screeNative);
        this._screeNative = null;
    }
    //#endregion
}