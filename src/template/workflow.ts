import exportBinder from "./export/exportBinder";
import native_vivoBottomNative from "./native_vivoBottomNative";
import native_vivoScreeNative from "./native_vivoScreeNative";
import native_BtnAddDesk from "./native_BtnAddDesk";
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
    static readonly PRODUCT_FINISH = "PRODUCT_FINISH";

    exporterPack = "export/export";

    public skipHomeBanner = false;

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
    /**添加底部原生 */
    static readonly add_bottom_native = "add_bottom_native";
    /**添加屏幕原生 */
    static readonly add_screen_native = "add_screen_native";

    static readonly event_home_banner = "event_home_banner";
    static readonly event_hide_screen_native = "event_hide_screen_native";
    static readonly event_show_screen_native = "event_show_screen_native";
    static readonly event_finish_screen_native = "event_finish_screen_native";

    _settleBtn: exporter_btn_confirm;

    registe() {
        super.registe();

        // 绑定导出UI
        exportBinder.bindAll();

        zs.fgui.configs.registeBase(workflow.add_btn_deskTopIcon, native_BtnAddDesk);
        zs.fgui.configs.registeBase(workflow.add_bottom_native, native_vivoBottomNative);
        zs.fgui.configs.registeBase(workflow.add_screen_native, native_vivoScreeNative);

        zs.core.workflow.registeEvent(workflow.event_home_banner, this, this.homeBanner);
        zs.core.workflow.registeEvent(workflow.event_hide_screen_native, this, this.hideScreeNative);
        zs.core.workflow.registeEvent(workflow.event_show_screen_native, this, this.showScreeNative);
        zs.core.workflow.registeEvent(workflow.event_finish_screen_native, this, this.finishScreenNative);
    }

    homeBanner() {
        if ((!this._screeNative || !this._screeNative.view.visible) && !this.skipHomeBanner) {
            zs.platform.sync.showBanner();
        }
    }

    finishScreenNative() {
        if (ProductKey.zs_native_limit) {
            this.showScreeNative();
            zs.platform.sync.hideBanner();
        }
    }

    _screeNative: native_vivoScreeNative = null;
    showScreeNative() {
        if (this._screeNative) {
            this._screeNative.view.visible = true;
            this.windowExport
                .setBase(this._screeNative)
                .front();
        } else {
            this.windowExport
                .attach(native_vivoScreeNative)
                .scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight)
                .fit()
                .block(true)
                .update<native_vivoScreeNative>(native_vivoScreeNative, (unit) => {
                    this._screeNative = unit;
                    unit.closeHandler = Laya.Handler.create(this, () => {
                        zs.platform.sync.showBanner();
                    })
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
}