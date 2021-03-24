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

    static readonly exporterSide = "export_side";
    static readonly exporterKnock = "export_knock";

    static readonly exportItem1 = "export_item_1";
    static readonly exportItem2 = "export_item_2";
    static readonly exportItem3 = "export_item_3";
    static readonly exportItem4 = "export_item_4";
    static readonly exportItem5 = "export_item_5";
    static readonly exportItem6 = "export_item_6";
    static readonly exportItem7 = "export_item_7";

    exporterPack = "export/export";
    bannerIgnoreList = ['START_FULL_1', 'START_FULL_2', 'OVER_FULL_1', 'OVER_FULL_2'];

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

    _challengeExport: exporter_friend_challenge;
    _fakeMsg: exporter_fake_msg;
    _fakeExit: exporter_fake_exit;
    _commonEgg: ad_egg;
    _gameEgg: ad_egg;

    commonMsgList: zs.fgui.window[];

    registe() {

        exportBinder.bindAll();
        zs.fgui.configs.registeBase(workflow.exporterSide, exporter_side);
        zs.fgui.configs.registeBase(workflow.exporterKnock, exporter_knock);

        zs.fgui.configs.registeItem(workflow.exportItem1, FGUI_item_1);
        zs.fgui.configs.registeItem(workflow.exportItem2, FGUI_item_2);
        zs.fgui.configs.registeItem(workflow.exportItem3, FGUI_item_3);
        zs.fgui.configs.registeItem(workflow.exportItem4, FGUI_item_4);
        zs.fgui.configs.registeItem(workflow.exportItem5, FGUI_item_5);
        zs.fgui.configs.registeItem(workflow.exportItem6, FGUI_item_6);
        zs.fgui.configs.registeItem(workflow.exportItem7, FGUI_item_7);

        exporter_fake_msg.soundShow = "sound/wechat.mp3";
        zs.exporter.utils.navigateErrorHandler = Laya.Handler.create(this, () => {
            this.showFull1(false);
        }, null, false);
        zs.configs.load("fake_msg_nick", "config/nickname.json").then((res) => {
            exporter_fake_msg.nickList = res;
            exporter_friend_challenge.nickList = res;
        });

        this.fsm = new zs.fsm()
            .registe(workflow.GAME_START, workflow.START_FULL_1, 0, false, this, this.onStartFull1)
            .registe(workflow.START_FULL_1, workflow.START_FULL_2, 0, false, this, this.onStartFull2)
            .registe(workflow.START_FULL_2, workflow.GAME_HOME, 0, false, this, this.onGameHome)
            .registe(workflow.GAME_HOME, workflow.GAME_PREPARE, 0, false, this, this.onGamePrepare)
            .registe(workflow.GAME_PREPARE, workflow.EXPORT_COMMON_EGG, 0, false, this, this.onCommonEgg)
            .registe(workflow.EXPORT_COMMON_EGG, workflow.GAME_PLAY, 0, false, this, this.onGamePlay)
            .registe(workflow.GAME_PLAY, workflow.OVER_FULL_1, 0, false, this, this.onOverFull1)
            .registe(workflow.OVER_FULL_1, workflow.GAME_SETTLE, 0, false, this, this.onGameSettle)
            .registe(workflow.GAME_SETTLE, workflow.OVER_FULL_2, 0, false, this, this.onOverFull2)
            .registe(workflow.OVER_FULL_2, workflow.GAME_END, 0, false, this, this.onGameEnd)
            .registe(workflow.GAME_END, workflow.GAME_HOME, 0, false, this, this.onGameHome)
            .setDefault(workflow.GAME_START, true);
    }

    onStartFull1(complete) {
        complete.run();
        console.log("开局全屏1", ProductKey.zs_jump_switch, ProductKey.zs_full_screen2_jump, ProductKey.zs_auto_full_screen_jump_switch);
        var bOpenFull = ProductKey.zs_full_screen2_jump && ProductKey.zs_auto_full_screen_jump_switch;
        if (bOpenFull) {
            this.showFull2(true)
        } else {
            zs.core.workflow.next();
        }
    }

    onStartFull2(complete) {
        complete.run();
        console.log("开局全屏2", ProductKey.zs_jump_switch, ProductKey.zs_full_screen1_jump, ProductKey.zs_auto_full_screen_jump_switch);
        var bOpenFull = ProductKey.zs_full_screen1_jump && ProductKey.zs_auto_full_screen_jump_switch;
        if (bOpenFull) {
            this.showFull1(true)
        } else {
            zs.core.workflow.next();
        }
    }

    onGameHome(complete) {
        complete.run();
    }

    onGamePrepare(complete) {
        var bVideo = ProductKey.zs_start_game_video_switch;
        console.log("开局视频", bVideo)
        if (bVideo) {
            zs.platform.async.playVideo().then(() => {
                complete.run();
            }).catch(() => {
                complete.run();
            })
        } else {
            complete.run();
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

    async onCommonEgg(complete) {
        complete.run();
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
            zs.core.workflow.next();
        }
    }

    async onGameEgg(complete) {
        complete.run();
        var bEgg;
        await this.checkEgg(false).then(() => {
            bEgg = true;
        }).catch(() => {
            bEgg = false;
        })
        console.log("游戏砸金蛋", bEgg)
        if (bEgg) {
            this.gameEgg();
        } else {
            zs.core.workflow.next();
        }
    }

    onGamePlay(complete) {
        complete.run();
        // 假退出
        var bFakeExit = ProductKey.zs_history_list_jump;
        console.log("假退出开关", ProductKey.zs_history_list_jump);
        // bFakeExit = true;
        if (bFakeExit) {
            this.fakeExit();
        }
    }

    onOverFull1(complete) {
        complete.run();
        this.hideFakeExit();
        console.log("结束全屏1", ProductKey.zs_full_screen1_jump)
        var bOpenFull = ProductKey.zs_full_screen1_jump;
        if (bOpenFull) {
            this.showFull1(true)
        } else {
            zs.core.workflow.next();
        }
    }

    onGameSettle(complete) {
        complete.run();
        var bFakeExit = ProductKey.zs_history_list_jump;
        console.log("假退出开关", ProductKey.zs_history_list_jump)
        // bFakeExit = true;
        if (bFakeExit) {
            this.fakeExit();
        }
        console.log("微信假消息", ProductKey.zs_jump_switch, ProductKey.zs_false_news_switch)
        if (ProductKey.zs_false_news_switch) {
            this.fakeMsg();
            console.log(this.windowExport);
        }
    }

    onOverFull2(complete) {
        complete.run();
        this.hideFakeExit();
        console.log("结束全屏2", ProductKey.zs_jump_switch, ProductKey.zs_full_screen2_jump)
        var bOpenFull = ProductKey.zs_full_screen2_jump;
        if (bOpenFull) {
            this.showFull2(true);
        } else {
            zs.core.workflow.next();
        }
        this.hideFakeMsg();
    }

    onGameEnd(complete) {
        complete.run();
        zs.core.workflow.next();
    }

    hideWindowFull() {
        this.windowFull && this.windowFull.dispose();
        this.windowFull = null;
    }

    showFull1(auto: boolean) {
        if (this.windowFull) {
            zs.log.debug("全屏已经打开了，不能再开了");
            return;
        }
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
                            this.hideWindowFull();
                            if (auto) { this.fsm.runNext(); }
                        }, null, false))
                        .apply();
                })
                .show();
        }
        return this.windowFull;
    }

    showFull2(auto: boolean) {
        if (this.windowFull) {
            zs.log.debug("全屏已经打开了，不能再开了");
            return;
        }
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
                            this.hideWindowFull();
                            if (auto) { this.fsm.runNext(); }
                        }, null, false))
                        .apply();
                })
                .show();
        }
        return this.windowFull;
    }

    commonEgg() {
        if (this._commonEgg) {
            this._commonEgg.view.visible = true;
            this._commonEgg
                .setCloseCallback(Laya.Handler.create(this, () => {
                    console.log("关闭砸金蛋")
                    this.hideCommonEgg();
                    this.fsm.runNext();
                    var appId = zs.core.appId;
                    let num = Laya.LocalStorage.getItem(`${appId}open_ready_num`);
                    num || (num = '0');
                    Laya.LocalStorage.setItem(`${appId}open_ready_num`, `${Number(num) + 1}`);
                }))
                .apply()
            this.windowExport.setBase(this._commonEgg);
        } else {
            this.windowExport
                .attach(ad_egg)
                .scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight)
                .fit()
                .block(true)
                .update<ad_egg>(ad_egg, (unit) => {
                    this._commonEgg = unit;
                    unit
                        .setCloseCallback(Laya.Handler.create(this, () => {
                            console.log("关闭砸金蛋")
                            this.hideCommonEgg();
                            this.fsm.runNext();
                        }))
                        .apply()
                });
        }
        return this.windowExport.front();
    }

    hideCommonEgg() {
        this._commonEgg && (this.windowExport.detach(this._commonEgg));
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
            this.windowExport.setBase(this._gameEgg);
        } else {
            this.windowExport
                .attach(ad_egg)
                .scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight)
                .block(true)
                .fit()
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
        return this.windowExport.front();
    }

    hideGameEgg() {
        this._gameEgg && this.windowExport.detach(this._gameEgg);
        this._gameEgg = null;
    }

    fakeMsg() {
        if (this._fakeMsg) {
            this._fakeMsg.view.visible = true;
            this._fakeMsg.apply();
            this.windowExport
                .setBase(this._fakeMsg)
                .front();
        } else {
            this.windowExport
                .attach(exporter_fake_msg)
                .scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight)
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
                .front();
        }
        return this.windowExport;
    }

    hideFakeMsg() {
        this._fakeMsg && this.windowExport.detach(this._fakeMsg);
        this._fakeMsg = null
    }

    challengeExport() {
        if (this._challengeExport) {
            this._challengeExport.view.visible = true;
            this._challengeExport.apply();
            this.windowExport
                .setBase(this._challengeExport)
                .front();
        } else {
            this.windowExport
                .attach(exporter_friend_challenge)
                .scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight)
                .fit()
                .block(true)
                .update<exporter_friend_challenge>(exporter_friend_challenge, (unit) => {
                    this._challengeExport = unit;
                    unit
                        .setCloseCallback(Laya.Handler.create(this, () => {
                            this.hideChallenge();
                        }))
                        .apply()
                })
                .show()
                .front();
        }
        return this.windowExport;
    }

    hideChallenge() {
        this._challengeExport && this.windowExport.detach(this._challengeExport);
        this._challengeExport = null;
    }

    fakeExit() {
        if (this._fakeExit) {
            this._fakeExit.view.visible = true;
            this.windowExport
                .setBase(this._fakeExit)
                .front();
        } else {
            this.windowExport
                .attach(exporter_fake_exit)
                .update<exporter_fake_exit>(exporter_fake_exit, (unit) => {
                    this._fakeExit = unit;
                    unit.setClickHandler(Laya.Handler.create(this, () => {
                        this.showFull1(false);
                    }, null, false));
                })
                .align(zs.fgui.AlignType.TopLeft, 10, 50)
                .scale(1.5, 1.5)
                .front();
        }

        return this.windowExport;
    }

    hideFakeExit() {
        this._fakeExit && this.windowExport.detach(this._fakeExit);
        this._fakeExit = null;
    }

}