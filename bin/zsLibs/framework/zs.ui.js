window.zs = window.zs || {};
window.zs.ui = window.zs.ui || {};
(function (exports) {
    'use strict';

    function bind(pack, itemName, type) {
        if (pack == null) {
            zs.log.warn("资源包为空，无法绑定模板 " + itemName);
            return;
        }
        let item = pack.getItemByName(itemName);
        if (item == null) {
            zs.log.warn("指定资源包（" + pack.name + "）中不存在" + itemName + "组件，无法绑定指定模板");
            return;
        }
        let url = "ui://" + pack.id + item.id;
        if (fairygui.UIObjectFactory.extensions[url] == null) {
            fairygui.UIObjectFactory.setPackageItemExtension(url, type);
        }
    }

    function readURL(pack, itemName) {
        if (pack == null) { return null; }
        let item = pack.getItemByName(itemName);
        if (item == null) { return null; }
        return "ui://" + pack.id + item.id;
    }

    class FGUI_item extends fairygui.GComponent {
        constructor() {
            super(...arguments);
            this.picture = null;
            this.desc = null;
            this.title = null;
            this.data = null;
        }

        static createInstance() {
            return null;
        }
    }
    FGUI_item.URL = null;


    class FGUI_card extends fairygui.GComponent {
        static bind(pack) {
            zs.ui.bind(pack, this.itemName, FGUI_card);
            this.pack = pack;
        }
        static createInstance() {
            return (fairygui.UIPackage.createObject(this.pack.name, this.itemName));
        }
        onConstruct() {
            this.loader = (this.getChild("loader"));
        }
    }
    FGUI_card.itemName = "card";

    class FGUI_list extends fairygui.GComponent {
        static bind(pack) {
            zs.ui.bind(pack, this.itemName, FGUI_list);
            this.pack = pack;
        }
        static createInstance() {
            return (fairygui.UIPackage.createObject(this.pack.name, this.itemName));
        }
        onConstruct() {
            this.background = (this.getChild("background"));
            this.list = (this.getChild("list"));
        }
    }
    FGUI_list.itemName = "list";

    class FGUI_msgbox extends fairygui.GComponent {
        static bind(pack) {
            zs.ui.bind(pack, this.itemName, FGUI_msgbox);
            this.pack = pack;
        }
        static createInstance() {
            return (fairygui.UIPackage.createObject(this.pack.name, this.itemName));
        }
        onConstruct() {
            this.state = this.getController("state");
            this.title = this.getChild("title");
            this.content = this.getChild("content");
            this.btn_confirm = this.getChild("btn_confirm");
            this.btn_cancel = this.getChild("btn_cancel");
        }
    }
    FGUI_msgbox.itemName = "msgbox";


    class FGUI_Loading extends fairygui.GComponent {
        static createInstance() {
            let panel = new fairygui.GComponent();
            panel.width = fairygui.GRoot.inst.width;
            panel.height = fairygui.GRoot.inst.height;

            let graphBack = new fairygui.GGraph();
            graphBack.drawRect(0, '#000000', '#000000');
            panel.addChild(graphBack);
            graphBack.x = -panel.width * 0.25;
            graphBack.y = -panel.height * 0.25;
            graphBack.width = panel.width * 2;
            graphBack.height = panel.height * 2;

            let valueTxt = new fairygui.GBasicTextField();
            valueTxt.pivotX = 0.5;
            valueTxt.pivotY = 0.5;
            valueTxt.x = panel.width * 0.5;
            valueTxt.y = panel.height * 0.5;
            valueTxt.addRelation(panel, fairygui.RelationType.Center_Center);
            valueTxt.addRelation(panel, fairygui.RelationType.Middle_Middle);
            valueTxt.fontSize = 100;
            valueTxt.text = '';
            valueTxt.color = '#FFFFFF';

            panel.loadingValue = panel.addChild(valueTxt);
            return panel;
        }
    }
    FGUI_Loading.itemName = "loading";

    class Loading extends zs.fgui.base {
        constructor() {
            super(...arguments);
            this.progressTime = 1 / 100;
            this.progressCount = 0;
            this.current = 0;
            this.progress = 0;
        }
        static preload() {
            return Promise((resolve, reject) => { resolve(); });
        }
        static make() {
            let view = zs.ui.FGUI_Loading.createInstance();
            return view;
        }
        updateProgress(value) {
            if (this.view) {
                this.view.loadingValue.text = value + '%';
            }
        }
        run(progress) {
            this.progress = progress;
            if (this.current < this.progress) {
                this.progressCount += Laya.timer.delta * 0.001;
                let delta = Math.round(this.progressCount / this.progressTime);
                this.progressCount -= delta * this.progressTime;
                if (this.current + delta >= this.progress) {
                    this.current = this.progress;
                }
                else {
                    this.current = this.current + delta;
                }

                this.updateProgress(this.current);
            } else if (this.progress >= 100) {
                return true;
            }

            return false
        }
    }

    exports.bind = bind;
    exports.readURL = readURL;
    exports.FGUI_item = FGUI_item;
    exports.FGUI_list = FGUI_list;
    exports.FGUI_card = FGUI_card;
    exports.FGUI_msgbox = FGUI_msgbox;
    exports.FGUI_Loading = FGUI_Loading;
    exports.Loading = Loading;
}(window.zs.ui = window.zs.ui || {}));