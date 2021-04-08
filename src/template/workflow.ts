import exportBinder from "./export/exportBinder";
import native_oppoBottomNative from "./native_oppoBottomNative";
import native_oppoScreeNative from "./native_oppoScreeNative";
import native_BtnAddDesk from "./native_BtnAddDesk";
import native_BtnMoreGame from "./native_BtnMoreGame";

export default class workflow extends zs.workflow {

    static readonly GAME_START = 'GAME_START';
    static readonly GAME_HOME = 'GAME_HOME';
    static readonly GAME_PREPARE = 'GAME_PREPARE';
    static readonly GAME_START_NATIVE = 'GAME_START_NATIVE'
    static readonly GAME_PLAY = 'GAME_PLAY';
    static readonly GAME_SETTLE = 'GAME_SETTLE';
    static readonly GAME_END = 'GAME_END';
    static readonly OPEN_SCREE_NATIVE = 'OPEN_SCREE_NATIVE';

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

    registe() {
        // 绑定导出UI
        exportBinder.bindAll();

        zs.fgui.configs.registeBase(workflow.add_btn_deskTopIcon, native_BtnAddDesk);
        zs.fgui.configs.registeBase(workflow.add_bottom_native, native_oppoBottomNative);
        zs.fgui.configs.registeBase(workflow.add_btn_moreGame, native_BtnMoreGame);

        // 工作流注册
        this.fsm = new zs.fsm()
            .registe(workflow.GAME_START, workflow.GAME_HOME, 0, false, this, this.onGameHome)
            .registe(workflow.GAME_HOME, workflow.GAME_PREPARE, 0, false, this, this.onGamePrepare)
            .registe(workflow.GAME_PREPARE, workflow.GAME_START_NATIVE, 0, false, this, this.openScreeNative)
            .registe(workflow.GAME_START_NATIVE, workflow.GAME_PLAY, 0, false, this, this.onGamePlay)
            .registe(workflow.GAME_PLAY, workflow.GAME_SETTLE, 0, false, this, this.onGameSettle)
            .registe(workflow.GAME_SETTLE, workflow.GAME_END, 0, false, this, this.onGameEnd)
            .registe(workflow.GAME_END, workflow.OPEN_SCREE_NATIVE, 0, false, this, this.openScreeNative)
            .registe(workflow.OPEN_SCREE_NATIVE, workflow.GAME_HOME, 0, false, this, this.onGameHome);
    }

    start() {
        super.start();
        this.fsm.init(workflow.GAME_START, true);
    }

    onGameHome(complete) {
        complete.run();
        this.hideScreeNative();
    }

    onGamePrepare(complete) {
        complete.run();
    }

    onGamePlay(complete) {
        complete.run();
        this.hideScreeNative();
    }

    onGameSettle(complete) {
        complete.run();
        this.showBottomNative();
    }
    openScreeNative(complete) {
        complete.run();
        this.showScreeNative();
    }
    onGameEnd(complete) {
        complete.run();
        zs.core.workflow.next();
        this.hideBottomNative();
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