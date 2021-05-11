import exportBinder from "./export/exportBinder";
import FGUI_item_1 from "./export/FGUI_item_1";
import FGUI_item_2 from "./export/FGUI_item_2";
import FGUI_item_3 from "./export/FGUI_item_3";
import FGUI_item_4 from "./export/FGUI_item_4";
import FGUI_item_5 from "./export/FGUI_item_5";
import FGUI_item_6 from "./export/FGUI_item_6";
import FGUI_item_7 from "./export/FGUI_item_7";
import exporter_full_1 from "./exporter_full_1";
import exporter_full_2 from "./exporter_full_2";
import exporter_knock from "./exporter_knock";
import exporter_side from "./exporter_side";
import exporter_fake_msg from "./exporter_fake_msg";
import ProductKey from "./ProductKey";
import exporter_fake_exit from "./exporter_fake_exit";
import exporter_friend_challenge from "./exporter_friend_challenge";
import knock_egg from "./knock_egg";
import FGUI_item_8 from "./export/FGUI_item_8";
import exporter_knock_1 from "./exporter_knock_1";
import KnockEggBinder from "./KnockEgg/KnockEggBinder";

export default class workflow extends zs.workflow {


    static readonly PRODUCT_START = "PRODUCT_START";
    static readonly PRODUCT_BEGIN = "PRODUCT_BEGIN";
    static readonly GAME_HOME = "GAME_HOME";
    static readonly PRODUCT_HOME_PLAY = "PRODUCT_HOME_PLAY";
    static readonly GAME_PLAY = "GAME_PLAY";
    static readonly PRODUCT_PLAY_END = "PRODUCT_PLAY_END";
    static readonly GAME_END = "GAME_END";
    static readonly PRODUCT_FINISH = "PRODUCT_FINISH";

    static readonly exporterSide = "export_side";
    static readonly exporterKnock = "export_knock";
    static readonly exporterKnock_1 = "export_knock_1";

    static readonly exportItem1 = "export_item_1";
    static readonly exportItem2 = "export_item_2";
    static readonly exportItem3 = "export_item_3";
    static readonly exportItem4 = "export_item_4";
    static readonly exportItem5 = "export_item_5";
    static readonly exportItem6 = "export_item_6";
    static readonly exportItem7 = "export_item_7";
    static readonly exportItem8 = "export_item_8";

    static readonly event_full_1 = "event_full_1";
    static readonly event_full_2 = "event_full_2";
    static readonly event_start_video = "event_start_video";
    static readonly event_common_egg = "event_common_egg";
    static readonly event_fake_exit = "event_fake_exit";
    static readonly event_fake_msg = "event_fake_msg";
    static readonly event_fake_delay = "event_fake_delay";
    static readonly event_hide_full = "event_hide_full";
    static readonly event_full_continue = "event_full_continue";
    static readonly event_check_egg = "event_check_egg";
    static readonly event_hide_egg = "event_hide_egg";
    static readonly event_hide_fake_msg = "event_hide_fake_msg";
    static readonly event_hide_fake_exit = "event_hide_fake_exit";
    static readonly event_product_value = "event_product_value"

    exporterPack = ["export/export", "knock_fgui/KnockEgg"];
    bannerIgnoreList = ['PRODUCT_START.FULL_1', 'PRODUCT_START.FULL_2', 'PRODUCT_PLAY_END.FULL_1', 'PRODUCT_PLAY_END.FULL_2'];

    windowFull: zs.fgui.window;

    _challengeExport: exporter_friend_challenge;
    _fakeMsg: exporter_fake_msg;
    _fakeExit: exporter_fake_exit;
    _commonEgg: knock_egg;

    static showPanel(type?: typeof zs.fgui.base, fit?: zs.fgui.FitType): zs.fgui.window {
        return zs.fgui.manager.show(true, type, "Workflow_Export", fit);
    }

    static getPanel(): zs.fgui.window {
        return zs.fgui.manager.get("Workflow_Export", true);
    }

    registe() {
        super.registe();

        // 绑定工作流FGUI组件
        exportBinder.bindAll();
        KnockEggBinder.bindAll();
        // 注册模块
        zs.fgui.configs.registeBase(workflow.exporterSide, exporter_side);
        zs.fgui.configs.registeBase(workflow.exporterKnock, exporter_knock);
        zs.fgui.configs.registeBase(workflow.exporterKnock_1, exporter_knock_1);
        // 注册控件
        zs.fgui.configs.registeItem(workflow.exportItem1, FGUI_item_1);
        zs.fgui.configs.registeItem(workflow.exportItem2, FGUI_item_2);
        zs.fgui.configs.registeItem(workflow.exportItem3, FGUI_item_3);
        zs.fgui.configs.registeItem(workflow.exportItem4, FGUI_item_4);
        zs.fgui.configs.registeItem(workflow.exportItem5, FGUI_item_5);
        zs.fgui.configs.registeItem(workflow.exportItem6, FGUI_item_6);
        zs.fgui.configs.registeItem(workflow.exportItem7, FGUI_item_7);
        zs.fgui.configs.registeItem(workflow.exportItem8, FGUI_item_8);
        // 注册事件
        zs.core.workflow.registeEvent(workflow.event_full_1, this, this.showFull1);
        zs.core.workflow.registeEvent(workflow.event_full_2, this, this.showFull2);
        zs.core.workflow.registeEvent(workflow.event_start_video, this, this.onGameVideo);
        zs.core.workflow.registeEvent(workflow.event_common_egg, this, this.commonEgg);
        zs.core.workflow.registeEvent(workflow.event_fake_exit, this, this.fakeExit);
        zs.core.workflow.registeEvent(workflow.event_fake_msg, this, this.fakeMsg);
        zs.core.workflow.registeEvent(workflow.event_fake_delay, this, this.fakeContinueDelay, 1000);
        zs.core.workflow.registeEvent(workflow.event_hide_full, this, this.hideWindowFull, false);
        zs.core.workflow.registeEvent(workflow.event_full_continue, this, this.onFullContinue);
        zs.core.workflow.registeEvent(workflow.event_product_value, this, (value) => { return ProductKey[value] });
        // zs.core.workflow.registeEvent(workflow.event_check_egg, this, (value) => {
        //     return zs.ui.EggKnock.checkEggOpen(value);
        // });
        zs.core.workflow.registeEvent(workflow.event_check_egg, this, zs.ui.EggKnock.checkEggOpen, true);
        zs.core.workflow.registeEvent(workflow.event_hide_egg, this, this.hideCommonEgg);
        zs.core.workflow.registeEvent(workflow.event_hide_fake_msg, this, this.hideFakeMsg);
        zs.core.workflow.registeEvent(workflow.event_hide_fake_exit, this, this.hideFakeExit);

        // 假消息音效，指定路径没有资源会报错
        exporter_fake_msg.soundShow = "fgui/export/wechat.mp3";
        // 导出错误事件回调
        zs.exporter.utils.navigateErrorHandler = Laya.Handler.create(this, () => {
            // this.showFull1(false);
            zs.core.workflow.callEvent(workflow.event_full_1);
        }, null, false);
        // 读取假消息昵称列表
        zs.configs.load("fake_msg_nick", "fgui/export/nickname.json").then((res) => {
            exporter_fake_msg.nickList = res;
            exporter_friend_challenge.nickList = res;
        });
    }

    onGameVideo() {
        if (ProductKey.zs_start_game_video_switch) {
            zs.platform.async.playVideo().then(() => {
                zs.core.workflow.childNext();
            }).catch(() => {
                zs.core.workflow.childNext();
            })
        } else {
            zs.core.workflow.childNext();
        }
    }

    fakeContinueDelay(value) {
        return value;
    }

    onFullContinue() {
        let checkInit = !zs.platform.sync.hasBanner();
        zs.platform.sync.updateBanner({ isWait: false, checkInit: checkInit });
    }

    hideWindowFull(autoNext) {
        this.windowFull && this.windowFull.dispose();
        this.windowFull = null;
        autoNext && zs.core.workflow.childNext();
    }

    showFull1(auto: boolean) {
        if (this.windowFull) {
            zs.log.debug("全屏已经打开了，不能再开了");
            return;
        }
        this.windowFull = zs.fgui.window.create()
            .attach(exporter_full_1, null, auto ? "full" : "full_popup")
            .scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight)
            .fit()
            .block(true)
            .update<zs.exporter.full>(zs.exporter.full, (unit) => {
                unit.apply();
            })
            .show();
        return this.windowFull;
    }

    showFull2(auto: boolean) {
        if (this.windowFull) {
            zs.log.debug("全屏已经打开了，不能再开了");
            return;
        }
        this.windowFull = zs.fgui.window.create()
            .attach(exporter_full_2, null, auto ? "full" : "full_popup")
            .scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight)
            .fit()
            .block(true)
            .update<zs.exporter.full>(zs.exporter.full, (unit) => {
                unit.apply();
            })
            .show();
        return this.windowFull;
    }

    commonEgg() {
        if (this._commonEgg) { return; }
        return workflow.showPanel(knock_egg)
            .block(true)
            .update<knock_egg>(knock_egg, (unit) => {
                this._commonEgg = unit;
                unit.setEventHandler(
                    Laya.Handler.create(this, () => {
                        console.log("Get Award");
                    }),
                    Laya.Handler.create(this, () => {
                        this.hideCommonEgg();
                        zs.core.workflow.childNext();
                    })
                )
                    .apply();
            })
            .front();
    }

    hideCommonEgg() {
        this._commonEgg && (workflow.getPanel().detach(this._commonEgg));
        this._commonEgg = null;
    }

    fakeMsg() {
        if (!ProductKey.zs_false_news_switch) { return; }
        if (this._fakeMsg) {
            this._fakeMsg.view.visible = true;
            this._fakeMsg.apply();
            workflow.getPanel().setBase(this._fakeMsg);
        } else {
            workflow.showPanel(exporter_fake_msg, zs.fgui.FitType.ScaleFit)
                .update<exporter_fake_msg>(exporter_fake_msg, (unit) => {
                    this._fakeMsg = unit;
                    unit.setCancelCallback(Laya.Handler.create(this, () => {
                        if (ProductKey.zs_reminder_switch) {
                            this.challengeExport();
                        }
                    }))
                        .apply();
                })
                .align(zs.fgui.AlignType.Top);
        }
        return workflow.getPanel().front();
    }

    hideFakeMsg() {
        this._fakeMsg && (workflow.getPanel().detach(this._fakeMsg));
        this._fakeMsg = null
    }

    challengeExport() {
        if (this._challengeExport) {
            this._challengeExport.view.visible = true;
            this._challengeExport.apply();
            workflow.getPanel().setBase(this._challengeExport);
        } else {
            workflow.showPanel(exporter_friend_challenge)
                .block(true)
                .update<exporter_friend_challenge>(exporter_friend_challenge, (unit) => {
                    this._challengeExport = unit;
                    unit.setCloseCallback(Laya.Handler.create(this, () => {
                        this.hideChallenge();
                    }))
                        .apply()
                })
                .show()
        }
        return workflow.getPanel().front();
    }

    hideChallenge() {
        this._challengeExport && (workflow.getPanel().detach(this._challengeExport));
        this._challengeExport = null;
    }

    fakeExit(event: string | string[], isHome?) {
        if (!ProductKey.zs_jump_switch) { return; }
        if (!ProductKey.zs_history_list_jump && isHome && ProductKey.zs_start_game_video_switch) { return; }
        if (this._fakeExit) {
            this._fakeExit.view.visible = true;
            workflow.getPanel().setBase(this._fakeExit);
        } else {
            workflow.showPanel(exporter_fake_exit, zs.fgui.FitType.None)
                .update<exporter_fake_exit>(exporter_fake_exit, (unit) => {
                    this._fakeExit = unit;
                    unit.event = event;
                })
                .scale(1.5, 1.5)
                .align(zs.fgui.AlignType.TopLeft, 10, 50);
        }

        return workflow.getPanel().front();
    }

    hideFakeExit() {
        this._fakeExit && (workflow.getPanel().detach(this._fakeExit));
        this._fakeExit = null;
    }
}