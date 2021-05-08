import exportBinder from "./export/exportBinder";
import BtnMoreGame from "./BtnMoreGame";
import RecordPage from "./RecordPage";
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
    static readonly PRODUCT_FINISH = "PRODUCT_FINISH";;

    static readonly add_more_game = "add_more_game";

    static readonly event_game_play = "event_game_play";
    static readonly event_share_record = "event_share_record";
    static readonly event_init_insert = "event_init_insert";

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

    _settleBtn: exporter_btn_confirm;
    _shareRecordPage: RecordPage = null;

    public onShareHandler: Laya.Handler;

    registe() {
        super.registe();

        exportBinder.bindAll();
        zs.fgui.configs.registeBase(workflow.add_more_game, BtnMoreGame);

        zs.core.workflow.registeEvent(workflow.event_game_play, this, this.onGamePlay);
        zs.core.workflow.registeEvent(workflow.event_share_record, this, this.showShareRecordPage);
        zs.core.workflow.registeEvent(workflow.event_init_insert, this, this.initInsert);
        // this.fsm = new zs.fsm()
        //     .registe(workflow.GAME_HOME, workflow.GAME_PLAY, 0, false, this, this.onGamePlay)
        //     .registe(workflow.GAME_PLAY, workflow.OPEN_SHARE_RECORD, 0, false, this, this.onShareRecordPage)
        //     .registe(workflow.OPEN_SHARE_RECORD, workflow.GAME_SETTLE, 0, false, this, this.onGameSettle)
        //     .registe(workflow.GAME_SETTLE, workflow.GAME_END, 0, false, this, this.onGameEnd)
        //     .registe(workflow.GAME_END, workflow.GAME_HOME, 0, false, this)
        //     .setDefault(workflow.GAME_HOME);
    }

    onGamePlay() {
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
        if (!ProductKey.zs_skip_settle && ProductKey.zs_version) {
            //预加载插屏
            zs.platform.sync.initInsert({ id: ProductKey.zs_full_screen_adunit });
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

    initInsert() {
        zs.platform.sync.initInsert({ id: ProductKey.zs_full_screen_adunit });
    }

    onGameEnd(complete) {
        complete.run();
        this._settleBtn && (this._settleBtn.view.visible = false);
        if (ProductKey.zs_full_screen_ad) {
            zs.platform.sync.loadInsert({ closeHandler: () => { }, errorHandler: () => { } });
        }
    }

    /**
     * 显示分享录屏
     * @returns 
     */
    showShareRecordPage() {
        console.log("show Share Record");
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
}