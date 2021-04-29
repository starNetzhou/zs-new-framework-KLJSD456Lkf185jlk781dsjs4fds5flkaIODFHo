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
import exporter_background from "./exporter_background";

export default class workflow extends zs.workflow {


    static readonly PRODUCT_START = "PRODUCT_START";
    static readonly PRODUCT_BEGIN = "PRODUCT_BEGIN";
    static readonly GAME_HOME = "GAME_HOME";
    static readonly PRODUCT_HOME_PLAY = "PRODUCT_HOME_PLAY";
    static readonly GAME_PLAY = "GAME_PLAY";
    static readonly PRODUCT_PLAY_END = "PRODUCT_PLAY_END";
    static readonly GAME_END = "GAME_END";
    static readonly PRODUCT_FINISH = "PRODUCT_FINISH";

    static readonly exporterBackground = "export_background";
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
    bannerIgnoreList = ['PRODUCT_START.FULL_1', 'PRODUCT_START.FULL_2', 'PRODUCT_PLAY_END.FULL_1', 'PRODUCT_PLAY_END.FULL_2'];

    windowFull: zs.fgui.window;

    _challengeExport: exporter_friend_challenge;
    _fakeMsg: exporter_fake_msg;
    _fakeExit: exporter_fake_exit;
    _commonEgg: ad_egg;
    _gameEgg: ad_egg;
    _settleBtn: exporter_btn_confirm;

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
        zs.fgui.configs.registeBase(workflow.exporterBackground, exporter_background);
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

        zs.core.onWorkflow(zs.workflow.PRODUCT_START + ".FULL_1", Laya.Handler.create(this, this.onStartFull1));
        zs.core.onWorkflow(zs.workflow.PRODUCT_START + ".FULL_2", Laya.Handler.create(this, this.onStartFull2));
        zs.core.onWorkflow(zs.workflow.PRODUCT_BEGIN, Laya.Handler.create(this, () => { zs.core.workflow.next(); }));
        zs.core.onWorkflow(zs.workflow.PRODUCT_HOME_PLAY + ".VIDEO", Laya.Handler.create(this, this.onGameVideo));
        zs.core.onWorkflow(zs.workflow.PRODUCT_HOME_PLAY + ".EGG", Laya.Handler.create(this, this.onCommonEgg));
        zs.core.onWorkflow(zs.workflow.PRODUCT_PLAY_END + ".FULL_1", Laya.Handler.create(this, this.onOverFull1));
        zs.core.onWorkflowLater(zs.workflow.PRODUCT_PLAY_END + ".SETTLE", Laya.Handler.create(this, this.onGameSettle));
        zs.core.onWorkflow(zs.workflow.PRODUCT_PLAY_END + ".FULL_2", Laya.Handler.create(this, this.onOverFull2));
    }

    onStartFull1() {
        console.log("开局全屏1", ProductKey.zs_jump_switch, ProductKey.zs_full_screen2_jump, ProductKey.zs_auto_full_screen_jump_switch);
        var bOpenFull = ProductKey.zs_full_screen2_jump && ProductKey.zs_auto_full_screen_jump_switch;
        if (bOpenFull) {
            this.showFull2(true)
        } else {
            zs.core.workflow.childNext();
        }
    }

    onStartFull2() {
        console.log("开局全屏2", ProductKey.zs_jump_switch, ProductKey.zs_full_screen1_jump, ProductKey.zs_auto_full_screen_jump_switch);
        var bOpenFull = ProductKey.zs_full_screen1_jump && ProductKey.zs_auto_full_screen_jump_switch;
        if (bOpenFull) {
            this.showFull1(true)
        } else {
            zs.core.workflow.childNext();
        }
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

    onGamePlay() {
        // 假退出
        var bFakeExit = ProductKey.zs_history_list_jump;
        console.log("假退出开关", ProductKey.zs_history_list_jump);
        // bFakeExit = true;
        if (bFakeExit) {
            this.fakeExit();
        }
    }

    onOverFull1() {
        this.hideFakeExit();
        console.log("结束全屏1", ProductKey.zs_full_screen1_jump)
        var bOpenFull = ProductKey.zs_full_screen1_jump;
        if (bOpenFull) {
            this.showFull1(true)
        } else {
            zs.core.workflow.childNext();
        }
    }

    onGameSettle() {
        if (!ProductKey.zs_skip_settle && ProductKey.zs_version) {
            ProductKey.zs_history_list_jump && this.fakeExit();
            ProductKey.zs_false_news_switch && this.fakeMsg();

            if (this._settleBtn) {
                this._settleBtn.view.visible = true;
            } else {
                this._settleBtn = workflow.showPanel(exporter_btn_confirm, zs.fgui.FitType.None)
                    .align(zs.fgui.AlignType.Bottom, 0, -150)
                    .front()
                    .getBase<exporter_btn_confirm>()
                    .setClickEvent(this, () => {
                        zs.core.workflow.childNext();
                    });
            }
        } else {
            zs.core.workflow.childNext();
        }
    }

    onOverFull2() {
        this.hideFakeExit();
        if (ProductKey.zs_full_screen2_jump) {
            this.showFull2(true);
        } else {
            zs.core.workflow.childNext();
        }
        this.hideFakeMsg();
        this._settleBtn && workflow.getPanel().detach(this._settleBtn);
        this._settleBtn = null;
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
                            if (auto) { zs.core.workflow.childNext(); }
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
                            if (auto) { zs.core.workflow.childNext(); }
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
                    unit
                        .setCloseCallback(Laya.Handler.create(this, () => {
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

    fakeExit() {
        if (this._fakeExit) {
            this._fakeExit.view.visible = true;
            workflow.getPanel().setBase(this._fakeExit);
        } else {
            workflow.showPanel(exporter_fake_exit, zs.fgui.FitType.None)
                .update<exporter_fake_exit>(exporter_fake_exit, (unit) => {
                    this._fakeExit = unit;
                    unit.setClickHandler(Laya.Handler.create(this, () => {
                        this.showFull1(false);
                    }, null, false));
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