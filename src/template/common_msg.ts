import FGUI_common_msg from "./export/FGUI_common_msg";

export default class msgbox extends zs.fgui.base {

    static _msgList: msgboxParams[];
    static _windowInst: zs.fgui.window;

    sTitle: string;
    sContent: string;
    sConfireText: string;
    sCancelText: string;
    comfireHandler: Laya.Handler;
    cancelHandler: Laya.Handler;
    bHideCancel: boolean;

    static showMsgBox(params: msgboxParams) {
        if (msgbox.windowInst.isShowing()) {
            msgbox.msgList.push(params);
        } else {
            msgbox.windowInst
                .update<msgbox>(msgbox, (unit) => {
                    unit.setTitle(params.title)
                        .setContent(params.content)
                        .setComfireText(params.confirmText)
                        .setCancelText(params.cancelText)
                        .setComfireHandler(Laya.Handler.create(this, () => {
                            params.confirmHandler && params.confirmHandler.run();
                            msgbox.hideMsgBox();
                        }))
                        .setCancelHandler(Laya.Handler.create(this, () => {
                            params.cancelHandler && params.cancelHandler.run();
                            msgbox.hideMsgBox();
                        }))
                        .hideCancel(params.hideCancel)
                        .apply();
                })
                .show()
                .front();
        }
    }

    static hideMsgBox() {
        msgbox.windowInst.hide();
        if (msgbox.msgList.length > 0) {
            msgbox.showMsgBox(msgbox.msgList.pop());
        }
    }

    static get msgList() {
        if (this._msgList == null) {
            this._msgList = [];
        }
        return this._msgList;
    }
    static get windowInst() {
        if (this._windowInst == null) {
            this._windowInst = zs.fgui.window.create()
                .attach(msgbox)
                .scaleFit(zs.configs.gameCfg.designWidth, zs.configs.gameCfg.designHeight)
                .fit()
                .block(true);
        }
        return this._windowInst;
    }
    constructor(component) {
        super(component);
        if (component && component instanceof FGUI_common_msg) {
            component.btnComfire.onClick(this, this.onComfireClick);
            component.btnCancel.onClick(this, this.onCancelClick);
        }
    }
    static make() {
        let view = FGUI_common_msg.createInstance();
        return view;
    }
    static type() {
        return FGUI_common_msg;
    }
    check(component) {
        if (component instanceof FGUI_common_msg) {
            return true;
        }
        return false;
    }

    setTitle(title) {
        this.sTitle = title;
        return this;
    }

    setContent(content) {
        this.sContent = content;
        return this;
    }

    setComfireText(confireText) {
        this.sConfireText = confireText;
        return this;
    }

    setCancelText(cancelText) {
        this.sCancelText = cancelText;
        return this;
    }

    setComfireHandler(handler) {
        this.comfireHandler = handler;
        return this;
    }

    setCancelHandler(handler) {
        this.cancelHandler = handler;
        return this;
    }

    hideCancel(bHide) {
        this.bHideCancel = bHide;
        return this;
    }

    apply() {
        let view = this.view as FGUI_common_msg;
        view.c1.setSelectedIndex(this.bHideCancel ? 1 : 0);
        view.lblTitle.text = this.sTitle ? this.sTitle : "提示";
        view.lblContent.text = this.sContent ? this.sContent : "内容";
        view.btnComfire.lblComfire.text = this.sConfireText ? this.sConfireText : "确定"
        view.btnCancel.lblCancel.text = this.sCancelText ? this.sCancelText : "取消"
        return this;
    }

    onComfireClick() {
        this.comfireHandler && this.comfireHandler.run();
    }

    onCancelClick() {
        this.cancelHandler && this.cancelHandler.run();
    }
}