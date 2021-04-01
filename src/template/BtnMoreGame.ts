import FGUI_btn_more_game from "./export/FGUI_btn_more_game";

export default class BtnMoreGame extends zs.fgui.base {
    public node: FGUI_btn_more_game;

    static make() {
        let view = FGUI_btn_more_game.createInstance();
        return view;
    }

    static type() {
        return FGUI_btn_more_game;
    }

    check(component) {
        if (component instanceof FGUI_btn_more_game) {
            return true;
        }
        return false;
    }

    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_btn_more_game) {
            this.node = component;
            let isIos = Laya.Browser.onIOS;
            if (isIos) {
                this.node.visible = false;
            }
            this.node.onClick(this, this.showMoreGame);
        }
    }

    apply() {
        return this;
    }

    /**
     * 显示头条更多游戏
     */
    showMoreGame() {
        zs.platform.async.showMoreGamesModalSimple().then((isToGame) => {
            zs.log.debug("是否跳转了其它小游戏", isToGame);
        }).catch(() => { });
    }
}
