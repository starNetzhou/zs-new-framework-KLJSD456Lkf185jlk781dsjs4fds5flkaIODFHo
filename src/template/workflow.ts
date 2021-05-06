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
import ad_egg from "./ad_egg";
import exporter_btn_confirm from "./exporter_btn_confirm";
import exporter_Special from "./exporter_Special";

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

    static readonly exportItem1 = "export_item_1";
    static readonly exportItem2 = "export_item_2";
    static readonly exportItem3 = "export_item_3";
    static readonly exportItem4 = "export_item_4";
    static readonly exportItem5 = "export_item_5";
    static readonly exportItem6 = "export_item_6";
    static readonly exportItem7 = "export_item_7";

    static readonly event_full_1 = "event_full_1";
    static readonly event_full_2 = "event_full_2";
    static readonly event_start_video = "event_start_video";
    static readonly event_common_egg = "event_common_egg";
    static readonly event_fake_exit = "event_fake_exit";
    static readonly event_fake_msg = "event_fake_msg";
    // static readonly event_hide_full = "event_hide_full";

    static readonly event_full_continue = "event_full_continue";
    static readonly special = "special";

    exporterPack = "export/export";
    bannerIgnoreList = ['PRODUCT_START.FULL_1', 'PRODUCT_START.FULL_2', 'PRODUCT_PLAY_END.FULL_1', 'PRODUCT_PLAY_END.FULL_2'];

    windowFull: zs.fgui.window;

    _challengeExport: exporter_friend_challenge;
    _fakeMsg: exporter_fake_msg;
    _fakeExit: exporter_fake_exit;
    _commonEgg: ad_egg;
    _gameEgg: ad_egg;

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

        // 注册模块
        zs.fgui.configs.registeBase(workflow.exporterSide, exporter_side);
        zs.fgui.configs.registeBase(workflow.exporterKnock, exporter_knock);
        // 注册控件
        zs.fgui.configs.registeItem(workflow.exportItem1, FGUI_item_1);
        zs.fgui.configs.registeItem(workflow.exportItem2, FGUI_item_2);
        zs.fgui.configs.registeItem(workflow.exportItem3, FGUI_item_3);
        zs.fgui.configs.registeItem(workflow.exportItem4, FGUI_item_4);
        zs.fgui.configs.registeItem(workflow.exportItem5, FGUI_item_5);
        zs.fgui.configs.registeItem(workflow.exportItem6, FGUI_item_6);
        zs.fgui.configs.registeItem(workflow.exportItem7, FGUI_item_7);
        // 注册事件
        zs.core.workflow.registeEvent(workflow.event_full_1, this, this.showFull1, true);
        zs.core.workflow.registeEvent(workflow.event_full_2, this, this.showFull2, true);
        zs.core.workflow.registeEvent(workflow.event_start_video, this, this.onGameVideo);
        zs.core.workflow.registeEvent(workflow.event_common_egg, this, this.onCommonEgg);
        zs.core.workflow.registeEvent(workflow.event_fake_exit, this, this.fakeExit);
        zs.core.workflow.registeEvent(workflow.event_fake_msg, this, this.fakeMsg);
        zs.core.workflow.registeEvent(workflow.event_full_continue, this, this.onFullContinue, true);

        // 假消息音效，指定路径没有资源会报错
        exporter_fake_msg.soundShow = "fgui/export/wechat.mp3";
        // 导出错误事件回调
        zs.exporter.utils.navigateErrorHandler = Laya.Handler.create(this, () => {
            this.showFull1(false);
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

    isNumber(val) {
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if (regPos.test(val) || regNeg.test(val)) {
            return true;
        } else {
            return false;
        }
    }

    async checkEgg(bCommon) {
        return new Promise(async (resolve, reject) => {
            var curGameCount = 1;
            await zs.network.download('LevelInfo').then((res) => {
                // console.error("level = ", res)
                curGameCount = res;
            });
            console.log("--------------", curGameCount)
            var zs_ready_click_num = ProductKey.zs_ready_click_num;
            var zs_click_award_num = ProductKey.zs_click_award_num;
            var zs_click_award_since = ProductKey.zs_click_award_since;
            var isNew = false;
            var appId = zs.core.appId;
            if (isNew && zs_click_award_since && zs_click_award_since > 0) {
                let gameNum = Laya.LocalStorage.getItem(appId + "day_game_num");
                console.debug("当前局数" + gameNum, zs_click_award_since + "局后开启砸金蛋");
                if (!gameNum || Number(gameNum) < zs_click_award_since) {
                    return reject();
                }
            }
            let clicknum = bCommon ? zs_ready_click_num : zs_click_award_num;
            if (clicknum == null || clicknum.trim() == "") { clicknum = "0"; }
            let num = JSON.parse(clicknum);
            if (this.isNumber(num)) {
                let openNum = bCommon ? Laya.LocalStorage.getItem(appId + "open_ready_num") : ((!bCommon) ? Laya.LocalStorage.getItem(appId + "open_award_num") : 0);
                console.log("bCommon" + bCommon, "限制:" + num, "已:" + openNum);
                //如果是-1则是无限制
                if (num == -1) return resolve(null);
                if (Number(num) > Number(openNum)) return resolve(null);
            }
            console.log("限制:" + num);
            if (Array.isArray(num) && num.length > 0) {
                if (num.length == 1 && num[0] == -1)
                    return resolve(null);
                var index = num.indexOf(curGameCount);
                if (index != -1) {
                    return resolve(null);
                }
            }
            return reject();
        })
    }

    async onCommonEgg() {
        var bEgg;
        await this.checkEgg(true).then(() => {
            bEgg = true;
        }).catch(() => {
            bEgg = false;
        })
        console.log("通用砸金蛋", bEgg)
        if (bEgg) {
            this.commonEgg();
        } else {
            zs.core.workflow.childNext();
        }
    }

    hideWindowFull(autoNext) {
        this.windowFull && this.windowFull.dispose();
        this.windowFull = null;
        autoNext && zs.core.workflow.childNext();
    }

    showFull1(auto: boolean) {
        this.hideFakeExit();
        this.hideFakeMsg();
        if (this.windowFull) {
            zs.log.debug("全屏已经打开了，不能再开了");
            return;
        }
        this.bClickContinue = false;
        if (this.windowFull) {
            this.windowFull
                .update<zs.exporter.full>(zs.exporter.full, (unit) => {
                    unit.enterJumpExport()
                        .setMistaken();
                })
                .show();
        } else {
            this.windowFull = zs.fgui.window.create()
                .attach(exporter_full_1)
                .scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight)
                .fit()
                .block(true)
                .update<zs.exporter.full>(zs.exporter.full, (unit) => {
                    unit.setClickContinue(
                        Laya.Handler.create(this, () => {
                            this.hideWindowFull(auto);
                        }, null, false))
                        .apply();
                })
                .show();
        }
        return this.windowFull;
    }

    showFull2(auto: boolean) {
        this.hideFakeExit();
        this.hideFakeMsg();
        if (this.windowFull) {
            zs.log.debug("全屏已经打开了，不能再开了");
            return;
        }
        this.bClickContinue = false;
        if (this.windowFull) {
            this.windowFull
                .update<zs.exporter.full>(zs.exporter.full, (unit) => {
                    unit.enterJumpExport()
                        .setMistaken()
                })
                .show();
        } else {
            this.windowFull = zs.fgui.window.create()
                .attach(exporter_full_2)
                .scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight)
                .fit()
                .block(true)
                .update<zs.exporter.full>(zs.exporter.full, (unit) => {
                    unit.setClickContinue(
                        Laya.Handler.create(this, () => {
                            this.hideWindowFull(auto);
                        }, null, false))
                        .apply();
                })
                .show();
        }
        return this.windowFull;
    }
    //全屏按钮点击事件
    bClickContinue = false;
    onFullContinue(auto) {
        let delayTime = ProductKey.zs_button_delay_time;
        if (window.zs["wx"] && window.zs["wx"].banner) {
            var checkInit = !zs.platform.sync.hasBanner();
            var bannerTime = checkInit ? 0 : Number(delayTime) / 2;
            Laya.timer.once(bannerTime, this, function () {
                zs.platform.sync.updateBanner({ isWait: false, checkInit: checkInit });
                this.bClickContinue = true;
            })
        } else {
            this.bClickContinue = true;
        }
        if (this.bClickContinue) {
            this.hideWindowFull(auto);
        }
    }

    commonEgg() {
        if (this._commonEgg) {
            this._commonEgg.view.visible = true;
            this._commonEgg
                .setCloseCallback(Laya.Handler.create(this, () => {
                    console.log("关闭砸金蛋")
                    this.hideCommonEgg();
                    zs.core.workflow.childNext();
                    var appId = zs.core.appId;
                    let num = Laya.LocalStorage.getItem(`${appId}open_ready_num`);
                    num || (num = '0');
                    Laya.LocalStorage.setItem(`${appId}open_ready_num`, `${Number(num) + 1}`);
                }))
                .apply()
            workflow.getPanel().setBase(this._commonEgg);
        } else {
            workflow.showPanel(ad_egg)
                .block(true)
                .update<ad_egg>(ad_egg, (unit) => {
                    this._commonEgg = unit;
                    unit
                        .setCloseCallback(Laya.Handler.create(this, () => {
                            console.log("关闭砸金蛋")
                            this.hideCommonEgg();
                            zs.core.workflow.childNext();
                        }))
                        .apply()
                });
        }
        return workflow.getPanel().front();
    }

    hideCommonEgg() {
        this._commonEgg && (workflow.getPanel().detach(this._commonEgg));
        this._commonEgg = null;
    }

    gameEgg() {
        if (this._gameEgg) {
            this._gameEgg.view.visible = true;
            this._gameEgg
                .setCloseCallback(Laya.Handler.create(this, () => {
                    console.log("关闭砸金蛋")
                    this.hideGameEgg();
                    this.fsm.runNext();
                }))
                .apply();
            workflow.getPanel().setBase(this._gameEgg);
        } else {
            workflow.showPanel(ad_egg)
                .block(true)
                .update<ad_egg>(ad_egg, (unit) => {
                    this._gameEgg = unit;
                    unit
                        .setCloseCallback(Laya.Handler.create(this, () => {
                            console.log("关闭砸金蛋")
                            this.hideGameEgg();
                            this.fsm.runNext();
                            var appId = zs.core.appId;
                            let num = Laya.LocalStorage.getItem(`${appId}open_award_num`);
                            num || (num = '0');
                            Laya.LocalStorage.setItem(`${appId}open_award_num`, `${Number(num) + 1}`);
                        }))
                        .apply()
                });
        }
        return workflow.getPanel().front();
    }

    hideGameEgg() {
        this._gameEgg && (workflow.getPanel().detach(this._gameEgg));
        this._gameEgg = null;
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
                    unit
                        .setCancelCallback(Laya.Handler.create(this, () => {
                            if (ProductKey.zs_reminder_switch) {
                                this.challengeExport();
                            }
                        }))
                        .apply();
                })
                .align(zs.fgui.AlignType.Top)
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

    fakeExit(event: string | string[]) {
        if (!ProductKey.zs_history_list_jump) { return; }
        if (this._fakeExit) {
            this._fakeExit.view.visible = true;
            workflow.getPanel().setBase(this._fakeExit);
        } else {
            workflow.showPanel(exporter_fake_exit, zs.fgui.FitType.None)
                .update<exporter_fake_exit>(exporter_fake_exit, (unit) => {
                    this._fakeExit = unit;
                    unit.event = event;
                })
                .align(zs.fgui.AlignType.TopLeft, 10, 50)
                .scale(1.5, 1.5);
        }

        return workflow.getPanel().front();
    }

    hideFakeExit() {
        this._fakeExit && (workflow.getPanel().detach(this._fakeExit));
        this._fakeExit = null;
    }
}