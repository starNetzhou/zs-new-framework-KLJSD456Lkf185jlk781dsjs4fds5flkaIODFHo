import exportBinder from "./export/exportBinder";
import BtnMoreGame from "./BtnMoreGame";
import RecordPage from "./RecordPage";
import ProductKey from "./ProductKey";

export default class workflow extends zs.workflow {

    static readonly GAME_START = 'GAME_START';
    static readonly GAME_HOME = 'GAME_HOME';
    static readonly GAME_PREPARE = 'GAME_PREPARE';
    static readonly GAME_PLAY = 'GAME_PLAY';
    static readonly OPEN_SHARE_RECORD = 'OPEN_SHARE_RECORD';
    static readonly GAME_SETTLE = 'GAME_SETTLE';
    static readonly GAME_END = 'GAME_END';

    static readonly EXPORT_MORE_GAME = "EXPORT_MORE_GAME";

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

    _shareRecordPage: RecordPage = null;

    public onShareHandler: Laya.Handler;

    registe() {
        exportBinder.bindAll();
        zs.fgui.configs.registeBase(workflow.EXPORT_MORE_GAME, BtnMoreGame);
        this.fsm = new zs.fsm()
            .registe(workflow.GAME_START, workflow.GAME_HOME, 0, false, this, this.onGameHome)
            .registe(workflow.GAME_HOME, workflow.GAME_PREPARE, 0, false, this, this.onGamePrepare)
            .registe(workflow.GAME_PREPARE, workflow.GAME_PLAY, 0, false, this, this.onGamePlay)
            .registe(workflow.GAME_PLAY, workflow.OPEN_SHARE_RECORD, 0, false, this, this.onShareRecordPage)
            .registe(workflow.OPEN_SHARE_RECORD, workflow.GAME_SETTLE, 0, false, this, this.onGameSettle)
            .registe(workflow.GAME_SETTLE, workflow.GAME_END, 0, false, this, this.onGameEnd)
            .registe(workflow.GAME_END, workflow.GAME_HOME, 0, false, this, this.onGameHome);
    }

    start() {
        super.start();
        this.fsm.init(workflow.GAME_START, true);
    }

    onGameHome(complete) {
        complete.run();
    }

    onGamePrepare(complete) {
        complete.run();
    }

    onGamePlay(complete) {
        complete.run();
        let zs_best_videotape_time = ProductKey.zs_best_videotape_time / 1000;
        let zs_hide_banner_switch = ProductKey.zs_hide_banner_switch;
        //开始录屏
        zs.platform.sync.recorderStart({ maxTime: zs_best_videotape_time });
        //显示单像素banner
        if (zs_hide_banner_switch == 1) {
            zs.platform.sync.showOnePixelBanner();
        }
    }

    onGameSettle(complete) {
        complete.run();
        //预加载插屏
        zs.platform.sync.initInsert({ id: ProductKey.zs_full_screen_adunit });
    }

    onGameEnd(complete) {
        complete.run();
        zs.core.workflow.next();
        if (ProductKey.zs_full_screen_ad) {
            zs.platform.sync.loadInsert({ closeHandler: () => { }, errorHandler: () => { } });
        }
    }


    /**
     * 显示分享录屏
     * @returns 
     */
    showShareRecordPage() {
        if (this._shareRecordPage) {
            this._shareRecordPage.view.visible = true;
            this.windowExport.setBase(this._shareRecordPage).front();
        } else {
            this.windowExport.attach(RecordPage)
                .scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight)
                .fit()
                .block(true)
                .update<RecordPage>(RecordPage, (unit) => {
                    this._shareRecordPage = unit;
                    unit.onShareHandler = this.onShareHandler;
                    unit.apply();
                })
                .setBase(this._shareRecordPage).align(zs.fgui.AlignType.Center).front();
        }
        return this._shareRecordPage;
    }

    /**
     * 分享录屏工作流程
     * @param complete 
     */
    onShareRecordPage(complete) {
        complete.run();
        this.showShareRecordPage();
    }
}