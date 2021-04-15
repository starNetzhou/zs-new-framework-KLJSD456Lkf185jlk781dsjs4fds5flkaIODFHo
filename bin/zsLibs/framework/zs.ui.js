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
                } else {
                    this.current = this.current + delta;
                }
                this.updateProgress(this.current);
            } else if (this.progress >= 100) {
                return true;
            }

            return false
        }
    }
    Loading.typeDefine = FGUI_Loading;

    class LayaLoading extends Laya.Script {
        constructor() {
            super(...arguments);
            this.progressTime = 1 / 100;
            this.progressCount = 0;
            this.current = 0;
            this.progress = 0;
        }
        static preload() {
            return Promise((resolve, reject) => { resolve(); })
        }
        static make() {
            return null;
        }
        updateProgress(value) {
        }
        run(progress) {
            this.progress = progress;
            if (this.current < this.progress) {
                this.progressCount += Laya.timer.delta * 0.001;
                let delta = Math.round(this.progressCount / this.progressTime);
                this.progressCount -= delta * this.progressTime;
                if (this.current + delta >= this.progress) {
                    this.current = this.progress;
                } else {
                    this.current = this.current + delta;
                }
                this.updateProgress(this.current);
            } else if (this.progress >= 100) {
                return true;
            }
            return false;
        }
    }

    class uiScene {
        static get list() {
            if (this._list == null) {
                this._list = [];
            }
            return this._list;
        }
        static init() {
            this.scene = Laya.stage.addChild(new Laya.Scene3D());
            this.camera = (this.scene.addChild(new Laya.Camera(0, 0.1, 100)));
            this.camera.clearFlag = Laya.CameraClearFlags.DepthOnly;
            this.camera.clearColor = new Laya.Vector4(0, 0, 0, 0);
            this.camera.transform.position = new Laya.Vector3(0, 0, 3);
            this.camera.transform.rotation = new Laya.Quaternion();
            this.camera.enableRender = false;
            this.light = this.scene.addChild(new Laya.DirectionLight());
            this.light.color = new Laya.Vector3(1, 1, 1);
            this.light.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
        }
        static sync(object) {
            if (object instanceof Laya.Camera) {
                if (!this.camera) {
                    return;
                }
                this.camera.clearFlag = object.clearFlag;
                this.camera.clearColor = object.clearColor;
                this.camera.cullingMask = object.cullingMask;
                this.camera.aspectRatio = object.aspectRatio;
                this.camera.nearPlane = object.nearPlane;
                this.camera.farPlane = object.farPlane;
                this.camera.fieldOfView = object.fieldOfView;
                this.camera.orthographic = object.orthographic;
                this.camera.orthographicVerticalSize = object.orthographicVerticalSize;
            }
            else {
                if (!this.light) {
                    return;
                }
                this.light.transform.rotation = object.transform.rotation;
                this.light.color = object.color;
                this.light.intensity = object.intensity;
            }
        }
        static resetCamera() {
            if (!this.camera) {
                return;
            }
            this.camera.clearFlag = Laya.CameraClearFlags.DepthOnly;
            this.camera.clearColor = new Laya.Vector4(0, 0, 0, 0);
            this.camera.aspectRatio = 0;
            this.camera.nearPlane = 0.1;
            this.camera.farPlane = 100;
            this.camera.fieldOfView = 60;
            this.camera.orthographic = false;
            this.camera.orthographicVerticalSize = 10;
            this.camera.addAllLayers();
            this.camera.transform.position = new Laya.Vector3(0, 0, 3);
            this.camera.transform.rotation = new Laya.Quaternion();
        }
        static resetLight() {
            if (!this.light) {
                return;
            }
            this.light.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
            this.light.color = new Laya.Vector3(1, 1, 1);
            this.light.intensity = 1;
        }
        static add(sprite, position, rotationEuler) {
            this.scene.addChild(sprite);
            this.list.push(sprite);
            sprite.transform.position = position ? position : new Laya.Vector3();
            sprite.transform.rotationEuler = rotationEuler ? rotationEuler : new Laya.Vector3();
            this.camera.enableRender = true;
            return sprite;
        }
        static cloneAdd(sprite, position, rotationEuler) {
            return this.add(sprite.clone(), position, rotationEuler);
        }
        static clear() {
            if (this.list == null || this.list.length <= 0) {
                return;
            }
            for (let i = 0, n = this.list.length; i < n; i++) {
                this.list[i].removeSelf();
            }
            this._list = [];
            this.camera.enableRender = false;
        }
        static removeAt(index) {
            if (this.list == null || this.list.length <= 0 || index >= this.list.length) { return; }
            this.list[index].removeSelf();
            this.list.splice(index, 1);
            if (this.list.length <= 0) {
                this.camera.enableRender = false;
            }
        }
        static remove(sprite) {
            if (this.list == null || this.list.length <= 0) { return; }
            for (let i = 0, n = this.list.length; i < n; i++) {
                if (this.list[i].id == sprite.id) {
                    this.list[i].removeSelf();
                    this.list.splice(i, 1);
                    break;
                }
            }
            if (this.list.length <= 0) {
                this.camera.enableRender = false;
            }
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
    exports.LayaLoading = LayaLoading;
    exports.uiScene = uiScene;
}(window.zs.ui = window.zs.ui || {}));