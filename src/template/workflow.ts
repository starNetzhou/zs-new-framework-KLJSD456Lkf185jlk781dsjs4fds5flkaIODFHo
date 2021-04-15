import QQadBinder from "./export/QQadBinder";
import qq_open_egg from "./qq_open_egg";
import qq_over_egg from "./qq_over_egg";
import btn_invite from "./btn_invite";
import btn_more_game from "./btn_more_game";
import block_view from "./block_view";
import video_view from "./video_view";
import ProductKey from "./ProductKey";

export default class workflow extends zs.workflow {

    static readonly GAME_START = 'GAME_START';
    static readonly GAME_HOME = 'GAME_HOME';
    static readonly GAME_PREPARE = 'GAME_PREPARE';
    static readonly QQ_OPEN_EGG = 'QQ_OPEN_EGG';
    static readonly QQ_VIDEO = "QQ_VIDEO";
    static readonly GAME_PLAY = 'GAME_PLAY';
    static readonly QQ_OVER_EGG = 'QQ_OVER_EGG';
    static readonly GAME_SETTLE = 'GAME_SETTLE';
    static readonly GAME_END = 'GAME_END';

    static readonly open_egg = "open_egg";
    static readonly over_egg = "over_egg";
    static readonly more_game = "more_game";
    static readonly block_view = "block_view";
    static readonly btn_invite = "btn_invite";
    exporterPack = "export/QQad";

    windowFull: zs.fgui.window;

    _windowExport: zs.fgui.window;
    /**开局砸金蛋实例 */
    openEgg: qq_open_egg = null;
    /**结束砸金蛋实例 */
    overEgg: qq_over_egg = null;
    /**积木广告载体 */
    blockView: block_view = null;
    /**看视频得奖励 */
    videoView: video_view = null;

    videoRewardHandler: Laya.Handler;

    get windowExport(): zs.fgui.window {
        if (this._windowExport == null) {
            this._windowExport = zs.fgui.window
                .create()
                .fit()
                .show();
        }
        return this._windowExport;
    }

    commonMsgList: zs.fgui.window[];

    fullStack = [];

    registe() {
        QQadBinder.bindAll();
        zs.fgui.configs.registeBase(workflow.open_egg, qq_open_egg);
        zs.fgui.configs.registeBase(workflow.over_egg, qq_over_egg);
        zs.fgui.configs.registeBase(workflow.block_view, block_view);
        zs.fgui.configs.registeBase(workflow.more_game, btn_more_game);
        zs.fgui.configs.registeBase(workflow.btn_invite, btn_invite);

        this.fsm = new zs.fsm()
            .registe(workflow.GAME_START, workflow.GAME_HOME, 0, false, this, this.onEnterGame)
            .registe(workflow.GAME_HOME, workflow.GAME_PREPARE, 0, false, this)
            .registe(workflow.GAME_PREPARE, workflow.QQ_OPEN_EGG, 0, false, this, this.onOpenEgg)
            .registe(workflow.QQ_OPEN_EGG, workflow.QQ_VIDEO, 0, false, this, this.onSkinShow)
            .registe(workflow.QQ_VIDEO, workflow.GAME_PLAY, 0, false, this)
            .registe(workflow.GAME_PLAY, workflow.QQ_OVER_EGG, 0, false, this, this.onOverEgg)
            .registe(workflow.QQ_OVER_EGG, workflow.GAME_SETTLE, 0, false, this)
            .registe(workflow.GAME_SETTLE, workflow.GAME_END, 0, false, this, this.onGameEnd)
            .registe(workflow.GAME_END, workflow.GAME_HOME, 0, false, this)
            .setDefault(workflow.GAME_START, true);
    }

    onEnterGame(complete) {
        complete.run();
        if (window["qq"] && ProductKey.zs_box_switch && ProductKey.zs_click_award_num != "0" && ProductKey.zs_switch) {
            Laya.timer.once(1500, this, () => {
                zs.platform.sync.showAppBox();
            });
        }
    }

    onSkinShow(complete) {
        complete.run();
        if (ProductKey.zs_switch) {
            this.showVideoGet();
        } else {
            zs.core.workflow.next();
        }
    }

    isNumber(val) {
        let regPos = /^\d+(\.\d+)?$/; //非负浮点数
        let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if (regPos.test(val) || regNeg.test(val)) {
            return true;
        } else {
            return false;
        }
    }

    async checkEgg(bCommon) {
        return new Promise(async (resolve, reject) => {
            let curGameCount = 1;
            await zs.network.download('LevelInfo').then((res) => {
                // console.error("level = ", res)
                curGameCount = res;
            });
            let zs_ready_click_num = ProductKey.zs_ready_click_num;
            let zs_click_award_num = ProductKey.zs_click_award_num;
            let zs_click_award_since = ProductKey.zs_click_award_since;
            let isNew = false;
            let appId = zs.core.appId;
            if (isNew && zs_click_award_since && zs_click_award_since > 0) {
                let gameNum = Laya.LocalStorage.getItem(appId + "day_game_num");
                console.debug("当前局数" + gameNum, zs_click_award_since + "局后开启砸金蛋");
                if (!gameNum || Number(gameNum) < zs_click_award_since) {
                    return reject();
                }
            }
            let clicknum: string = (bCommon ? zs_ready_click_num : zs_click_award_num) + "";
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
                let index = num.indexOf(curGameCount);
                if (index != -1) {
                    return resolve(null);
                }
            }
            return reject();
        })
    }

    async onOpenEgg(complete) {
        complete.run();
        let bEgg;
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

    async onOverEgg(complete) {
        complete.run();
        let bEgg;
        await this.checkEgg(false).then(() => {
            bEgg = true;
        }).catch(() => {
            bEgg = false;
        })
        console.log("游戏砸金蛋", bEgg)
        if (bEgg) {
            this.showOverEgg();
        } else {
            zs.core.workflow.next();
        }
    }

    onGameEnd(complete) {
        complete.run();
        zs.platform.sync.showInsertAd({
            closeFunc: Laya.Handler.create(this, () => {
                zs.core.workflow.next();
            })
        });
    }

    showVideoGet() {
        if (this.videoView) {
            this.videoView.view.visible = true;
            this.videoView.setFinishHandler(
                Laya.Handler.create(this, () => {
                    this.hideVideoGet();
                    this.fsm.runNext();
                }, null, true),
                Laya.Handler.create(this, () => {
                    this.videoRewardHandler && this.videoRewardHandler.run();
                }, null, true));
            this.windowExport.setBase(this.videoView);
        }
        else {
            this.windowExport
                .attach(video_view)
                .scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight)
                .fit()
                .block(true)
                .update<video_view>(video_view, (unit) => {
                    this.videoView = unit;
                    unit.setFinishHandler(
                        Laya.Handler.create(this, () => {
                            this.hideVideoGet();
                            this.fsm.runNext();
                        }, null, true),
                        Laya.Handler.create(this, () => {
                            this.videoRewardHandler && this.videoRewardHandler.run();
                        }, null, true));
                })
        };
    }

    hideVideoGet() {
        this.videoView && (this.windowExport.detach(this.videoView));
        this.videoView = null;
    }

    showOverEgg() {
        if (this.overEgg) {
            this.overEgg.view.visible = true;
            this.overEgg
                .setCloseCallback(Laya.Handler.create(this, () => {
                    console.log("关闭砸金蛋")
                    this.hideOverEgg();
                    this.fsm.runNext();
                    let appId = zs.core.appId;
                    let num = Laya.LocalStorage.getItem(`${appId}open_award_num`);
                    num || (num = '0');
                    Laya.LocalStorage.setItem(`${appId}open_award_num`, `${Number(num) + 1}`);
                }))
                .apply()
            this.windowExport.setBase(this.overEgg);
        } else {
            this.windowExport
                .attach(qq_over_egg)
                .scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight)
                .fit()
                .block(true)
                .update<qq_over_egg>(qq_over_egg, (unit) => {
                    this.overEgg = unit;
                    unit
                        .setCloseCallback(Laya.Handler.create(this, () => {
                            console.log("关闭砸金蛋")
                            this.hideOverEgg();
                            this.fsm.runNext();
                            let appId = zs.core.appId;
                            let num = Laya.LocalStorage.getItem(`${appId}open_award_num`);
                            num || (num = '0');
                            Laya.LocalStorage.setItem(`${appId}open_award_num`, `${Number(num) + 1}`);
                        }))
                        .apply()
                });
        }
        return this.windowExport.front();
    }

    hideOverEgg() {
        this.overEgg && (this.windowExport.detach(this.overEgg));
        this.overEgg = null;
    }

    commonEgg() {
        if (this.openEgg) {
            this.openEgg.view.visible = true;
            this.openEgg
                .setCloseCallback(Laya.Handler.create(this, () => {
                    this.hideCommonEgg();
                    this.fsm.runNext();
                    let appId = zs.core.appId;
                    let num = Laya.LocalStorage.getItem(`${appId}open_ready_num`);
                    num || (num = '0');
                    Laya.LocalStorage.setItem(`${appId}open_ready_num`, `${Number(num) + 1}`);
                }))
                .apply()
            this.windowExport.setBase(this.openEgg);
        } else {
            this.windowExport
                .attach(qq_open_egg)
                .scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight)
                .fit()
                .block(true)
                .update<qq_open_egg>(qq_open_egg, (unit) => {
                    this.openEgg = unit;
                    unit
                        .setCloseCallback(Laya.Handler.create(this, () => {
                            this.hideCommonEgg();
                            this.fsm.runNext();
                            let appId = zs.core.appId;
                            let num = Laya.LocalStorage.getItem(`${appId}open_ready_num`);
                            num || (num = '0');
                            Laya.LocalStorage.setItem(`${appId}open_ready_num`, `${Number(num) + 1}`);
                        }))
                        .apply()
                });
        }
        return this.windowExport.front();
    }

    hideCommonEgg() {
        this.openEgg && (this.windowExport.detach(this.openEgg));
        this.openEgg = null;
    }

}