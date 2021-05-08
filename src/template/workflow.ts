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
    static readonly add_share_record = "add_share_record";

    static readonly event_game_play = "event_game_play";
    static readonly event_share_record = "event_share_record";
    static readonly event_init_insert = "event_init_insert";
    static readonly event_load_insert = "event_load_insert";
    static readonly event_record_share_reward = "event_record_share_reward";

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
        zs.fgui.configs.registeBase(workflow.add_share_record, RecordPage);
        zs.core.workflow.registeEvent(workflow.event_game_play, this, this.gamePlay);
        zs.core.workflow.registeEvent(workflow.event_init_insert, this, this.initInsert);
        zs.core.workflow.registeEvent(workflow.event_load_insert, this, this.loadInsert);
        zs.core.workflow.registeEvent(workflow.event_record_share_reward, this, this.onRecordShareReward);
    }

    gamePlay() {
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

    loadInsert() {
        zs.platform.sync.loadInsert({ closeHandler: () => { }, errorHandler: () => { } });
    }

    onRecordShareReward() {
        this.onShareHandler && this.onShareHandler.run();
    }
}