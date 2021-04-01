import QQAd_blockWindow from "src/template/fgui/QQAd_blockWindow";

export default class block_view extends zs.fgui.base {
    viewName: string;
    constructor(component) {
        super(component);
    }
    static make() {
        let view = QQAd_blockWindow.createInstance();
        return view;
    }
    static type() {
        return QQAd_blockWindow;
    }
    init() {
        super.init();
        this.viewName = "blockView";
    }
    dispose() {
        zs.platform.sync.hideBlockAd();
        super.dispose();
    }
    check(component) {
        if (component instanceof QQAd_blockWindow) {
            return true;
        }
        return false;
    }

    applyConfig(config?) {
        if (config) {
            zs.platform.sync.checkBlockAd(zs.product.get("zs_blockAdUnit_id"), config.orient, config.Num, config.pos, function () {
                zs.platform.sync.showBlockAd(config.pos);
            })
        }
        return this;
    }

}