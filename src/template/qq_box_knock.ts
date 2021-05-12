import FGUI_egg_box from "./qqPackage/FGUI_egg_box";
export default class qq_box_knock extends zs.ui.EggKnock {
    static typeDefine = FGUI_egg_box;
    // 砸盒子进度条
    _progressBar: fairygui.GProgressBar;
    // 砸盒子按钮
    _btnKnock: fgui.GButton;
    
    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_egg_box) {
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

    handleClick(progress) {
        if (progress >= this["bannerPoint"] && !this["isOpenAd"]) {
            this["isOpenAd"] = true;
            zs.platform.sync.showAppBox();
            Laya.timer.once(800, this, () => {
                this["onFinish"]();
            });
        }
    }
}