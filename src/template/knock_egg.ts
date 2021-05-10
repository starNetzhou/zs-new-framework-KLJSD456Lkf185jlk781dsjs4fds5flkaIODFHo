import FGUI_btn_egg from "./export/FGUI_btn_egg";
import FGUI_common_egg from "./export/FGUI_common_egg";

export default class knock_egg extends zs.ui.EggKnock {
    static typeDefine = FGUI_common_egg;
    // 砸金蛋进度条
    _progressBar: fairygui.GProgressBar;
    // 砸金蛋按钮
    _btnKnock: FGUI_btn_egg;
    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_common_egg) {
            this._progressBar = component.bar;
            this._btnKnock = component.btn_click;
        }
    }
    get btnKnock(): fairygui.GButton {
        return this._btnKnock;
    }
    updateProgress(value: number) {
        this._progressBar.value = value * 100;
    }
    onBannerCheck() {
        let checkInit = !zs.platform.sync.hasBanner();
        checkInit && zs.platform.sync.updateBanner({ isWait: true, checkInit: true });
    }
}