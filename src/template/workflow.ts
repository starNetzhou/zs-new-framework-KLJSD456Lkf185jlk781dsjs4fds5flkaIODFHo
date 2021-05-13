import ProductKey from "./ProductKey";
import qq_common_knock from "./qq_common_knock";
import qq_box_knock from "./qq_box_knock";
import qq_try_skin from "./qq_try_skin";
import qq_btn_more_game from "./qq_btn_more_game";
import qq_btn_invite from "./qq_btn_invite";
import qqPackageBinder from "./qqPackage/qqPackageBinder";

export default class workflow extends zs.workflow {


    static readonly PRODUCT_START = "PRODUCT_START";
    static readonly PRODUCT_BEGIN = "PRODUCT_BEGIN";
    static readonly GAME_HOME = "GAME_HOME";
    static readonly PRODUCT_HOME_PLAY = "PRODUCT_HOME_PLAY";
    static readonly GAME_PLAY = "GAME_PLAY";
    static readonly PRODUCT_PLAY_END = "PRODUCT_PLAY_END";
    static readonly GAME_END = "GAME_END";
    static readonly PRODUCT_FINISH = "PRODUCT_FINISH";

    static readonly event_enter_game = "event_enter_game";
    static readonly event_check_egg = "event_check_egg";
    static readonly event_common_egg = "event_common_egg";
    static readonly event_show_common_egg = "event_show_common_egg";
    static readonly event_hide_common_egg = "event_hide_common_egg";
    static readonly event_check_skin = "event_check_skin";
    static readonly event_try_skin = "event_try_skin";
    static readonly event_show_try_skin = "event_show_try_skin";
    static readonly event_hide_try_skin = "event_hide_try_skin";
    static readonly event_box_egg = "event_box_egg";
    static readonly event_show_box_egg = "event_show_box_egg";
    static readonly event_hide_box_egg = "event_hide_box_egg";
    static readonly event_add_block_ad = "event_add_block_ad";
    static readonly event_clear_block_ad = "event_clear_block_ad";

    static readonly qq_btn_more_game = "qq_btn_more_game";
    static readonly qq_btn_invite = "qq_btn_invite";
    static readonly qq_try_skin = "qq_try_skin";
    static readonly qq_common_egg = "qq_common_egg";
    static readonly qq_box_egg = "qq_box_egg";

    exporterPack = "qqPackage/qqPackage";
    bannerIgnoreList = [];

    windowFull: zs.fgui.window;

    _commonEgg: qq_common_knock;
    _boxEgg: qq_box_knock;
    _trySkin: qq_try_skin;

    _commonEggHanlder: Laya.Handler;
    _boxEggHanlder: Laya.Handler;
    _trySkinHanlder: Laya.Handler;
    _checkSkinHanlder: Laya.Handler;

    _trySkinIndex = 0;
    _trySkinUrl = "";

    static showPanel(type?: typeof zs.fgui.base, fit?: zs.fgui.FitType): zs.fgui.window {
        return zs.fgui.manager.show(true, type, "Workflow_Export", fit);
    }

    static getPanel(): zs.fgui.window {
        return zs.fgui.manager.get("Workflow_Export", true);
    }

    registe() {
        super.registe();

        // 绑定工作流FGUI组件
        qqPackageBinder.bindAll();

        // 注册控件
        zs.fgui.configs.registeBase(workflow.qq_btn_more_game, qq_btn_more_game);
        zs.fgui.configs.registeBase(workflow.qq_btn_invite, qq_btn_invite);
        zs.fgui.configs.registeBase(workflow.qq_try_skin, qq_try_skin);
        zs.fgui.configs.registeBase(workflow.qq_common_egg, qq_common_knock);
        zs.fgui.configs.registeBase(workflow.qq_box_egg, qq_box_knock);

        // 注册事件
        zs.core.workflow.registeEvent(workflow.event_enter_game, this, this.onEnterGame);
        zs.core.workflow.registeEvent(workflow.event_check_egg, this, (value) => { return zs.ui.EggKnock.checkEggOpen(value); }, false);
        // zs.core.workflow.registeEvent(workflow.event_check_egg, this, (value) => { return true; }, false);
        zs.core.workflow.registeEvent(workflow.event_common_egg, this, this.handleCommonEgg);
        zs.core.workflow.registeEvent(workflow.event_show_common_egg, this, this.commonEgg);
        zs.core.workflow.registeEvent(workflow.event_hide_common_egg, this, this.hideCommonEgg);
        zs.core.workflow.registeEvent(workflow.event_check_skin, this, this.checkSkin);
        zs.core.workflow.registeEvent(workflow.event_try_skin, this, this.handleTrySkin);
        zs.core.workflow.registeEvent(workflow.event_show_try_skin, this, this.showTrySkin);
        zs.core.workflow.registeEvent(workflow.event_hide_try_skin, this, this.hideTrySkin);
        zs.core.workflow.registeEvent(workflow.event_box_egg, this, this.hanldeBoxEgg);
        zs.core.workflow.registeEvent(workflow.event_show_box_egg, this, this.boxEgg);
        zs.core.workflow.registeEvent(workflow.event_hide_box_egg, this, this.hideBoxEgg);
        zs.core.workflow.registeEvent(workflow.event_add_block_ad, this, this.addBlockAd);
        zs.core.workflow.registeEvent(workflow.event_clear_block_ad, this, this.clearBlockAd);
    }


    onEnterGame() {
        if (zs.platform.proxy && ProductKey.zs_box_switch && ProductKey.zs_click_award_num != "0" && ProductKey.zs_switch) {
            Laya.timer.once(1500, this, () => {
                zs.platform.sync.showAppBox();
            });
        }
        //设置开局砸金蛋奖励回调
        this._commonEggHanlder = Laya.Handler.create(this, () => {
            console.log("发放通用砸金蛋奖励");
        });
        //设置皮肤试用奖励回调
        this._trySkinHanlder = Laya.Handler.create(this, () => {
            console.log("发放皮肤试用奖励");
        })
        //设置皮肤试用奖励回调
        this._boxEggHanlder = Laya.Handler.create(this, () => {
            console.log("发放砸盒子奖励");
        })
        this._checkSkinHanlder = Laya.Handler.create(this, () => {
            console.log("判断是否存在皮肤可以试用");
            return true;
        })
        zs.core.workflow.next();
    }


    /**
     * 判断是否存在皮肤可以试用
     */
    checkSkin() {
        if (this._checkSkinHanlder) {
            return this._checkSkinHanlder.run();
        }
        return true;
    }

    /**
     * 处理皮肤试用
     */
    handleTrySkin() {
        this._trySkinHanlder && this._trySkinHanlder.run();
    }

    /**
     * 显示皮肤试用
     * @returns 
     */
    showTrySkin() {
        if (this._trySkin) { return; }
        return workflow.showPanel(qq_try_skin)
            .block(true)
            .update<qq_try_skin>(qq_try_skin, (unit) => {
                this._trySkin = unit;
                unit.setFinishHandler(
                    Laya.Handler.create(this, () => {
                        zs.core.workflow.childNext();
                    }),
                    Laya.Handler.create(this, this.handleTrySkin)
                ).setIcon(this._trySkinUrl);
            }).front();
    }

    /**
     * 移除皮肤试用
     */
    hideTrySkin() {
        this._trySkin && (workflow.getPanel().detach(this._trySkin));
        this._trySkin = null;
    }

    handleCommonEgg() {
        this._commonEggHanlder && this._commonEggHanlder.run();
    }

    /**
     * 打开通用砸金蛋
     * @returns 
     */
    commonEgg() {
        if (this._commonEgg) { return; }
        return workflow.showPanel(qq_common_knock)
            .block(true)
            .update<qq_common_knock>(qq_common_knock, (unit) => {
                this._commonEgg = unit;
                unit.setEventHandler(
                    Laya.Handler.create(this, this.handleCommonEgg),
                    Laya.Handler.create(this, () => {
                        this.hideCommonEgg();
                        zs.core.workflow.childNext();
                    })
                ).apply();
            }).front();
    }

    /**
     * 隐藏通用砸金蛋
     */
    hideCommonEgg() {
        this._commonEgg && (workflow.getPanel().detach(this._commonEgg));
        this._commonEgg = null;
    }

    hanldeBoxEgg() {
        this._boxEggHanlder && this._boxEggHanlder.run();
    }

    /**
     * 显示砸盒子
     * @returns 
     */
    boxEgg() {
        if (this._boxEgg) { return; }
        return workflow.showPanel(qq_box_knock)
            .block(true)
            .update<qq_box_knock>(qq_box_knock, (unit) => {
                this._boxEgg = unit;
                unit.setEventHandler(
                    Laya.Handler.create(this, this.hanldeBoxEgg),
                    Laya.Handler.create(this, () => {
                        this.hideBoxEgg();
                        zs.core.workflow.childNext();
                    })
                ).apply();
            }).front();
    }

    /**
     * 隐藏砸盒子
     */
    hideBoxEgg() {
        this._boxEgg && (workflow.getPanel().detach(this._boxEgg));
        this._boxEgg = null;
    }

    /**
     * 添加积木广告
     * @param config 积木广告配置
     */
    addBlockAd(config) {
        if (config) {
            zs.platform.sync.checkBlockAd(ProductKey.zs_blockAdUnit_id, config.orient, config.num, config.pos, Laya.Handler.create(this, () => {
                zs.platform.sync.showBlockAd(config.pos);
            }));
        }
    }

    /**
     * 移除积木广告
     */
    clearBlockAd() {
        zs.platform.sync.hideBlockAd();
    }
}