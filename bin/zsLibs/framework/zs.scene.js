window.zs = window.zs || {};
(function (exports) {
    'use strict';

    class scene {
        constructor() {
            this._isPreloading = false;
            this._isSceneLoading = false;
            this._current = null;
            this._nodes = {};
        }
        static get inst() {
            if (scene._inst == null) {
                scene._inst = new scene();
            }
            return scene._inst;
        }
        get nodes() {
            return this._nodes;
        }
        get current() {
            return this._current;
        }
        get next() {
            return this._next;
        }
        get staticNode() {
            return this._staticNode;
        }
        get dynamicNode() {
            return this._dynamicNode;
        }
        get preloadNode() {
            return this._preloadNode;
        }
        get isSceneLoading() {
            return this._isSceneLoading;
        }
        get isPreloading() {
            return this._isPreloading;
        }
        static URLCombine(url, suffix) {
            let finalUrl = this.basePath + '/' + url;
            if (suffix != null && suffix.trim().length > 0) {
                finalUrl += '.' + suffix;
            }
            return finalUrl;
        }
        async load(inScene, fullpath, index) {
            if (this._isSceneLoading) {
                zs.log.warn("正在加载其他场景······", 'Scene');
                return;
            }
            let newSceneUrl = '';
            if (inScene instanceof Laya.Scene3D) {
                newSceneUrl = inScene.url;
            } else {
                if (fullpath) {
                    newSceneUrl = inScene;
                } else {
                    newSceneUrl = scene.URLCombine(inScene, 'ls');
                }
            }
            if (this._current != null && newSceneUrl != this._current.url) {
                this._current.destroy(true);
                Laya.loader.clearRes(this._current.url);
            }
            let newScene = null;
            if (inScene instanceof Laya.Scene3D) {
                newScene = inScene;
            } else {
                this._isSceneLoading = true;
                newScene = await zs.resource.load(newSceneUrl, zs.ResourceType.Scene3D);
                this._isSceneLoading = false;
            }
            this._current = Laya.stage.addChildAt(newScene, index || 0);
            this.build();
        }
        async loadNext(isNext, index) {
            if (this._isSceneLoading) {
                zs.log.warn("正在加载其他场景······", 'Scene');
                return;
            }
            let url = null;
            if (this._current) {
                url = this._current.url;
                this._current.destroy(true);
            }
            if (isNext && this._next != null && url != this._next.url) {
                Laya.loader.clearRes(url);
                url = this._next.url;
            }
            if (url == null) {
                zs.log.fatal("场景加载错误，当前无场景且未预加载场景");
            }
            this._isSceneLoading = true;
            let newScene = await zs.resource.load(url, zs.ResourceType.Scene3D);
            this._isSceneLoading = false;
            this._current = Laya.stage.addChildAt(newScene, index || 0);
            this.build();
        }
        async preload(inScene, fullpath) {
            if (this._isPreloading) {
                console.warn("正在预加载其他场景······");
                return;
            }
            this._isPreloading = true;
            if (this._current == null || this._current.url != inScene) {
                let newScene = await zs.utils.loadScene3D(url);
                this._next = newScene;
            }
            this._isPreloading = false;
        }
        build() {
            if (this._current == null) {
                zs.log.fatal("当前场景为空，无法构建场景");
                return;
            }
            if (scene.nodesDef) {
                for (let key in scene.nodesDef) {
                    let node = this._current.getChildByName(key);
                    if (node == null) {
                        node = this._current.addChild(new Laya.Sprite3D(key));
                    }
                    this._nodes[key] = node;
                    scene.nodesDef[key] = node;
                }
            }
            this._staticNode = this._current.getChildByName(scene.node_static);
            this._dynamicNode = this._current.getChildByName(scene.node_dynamic);
            this._preloadNode = this._current.getChildByName(scene.node_preload);
            if (this._staticNode == null) {
                zs.log.warn("构建世界场景警告！节点Static丢失！");
            }
            if (this._dynamicNode == null) {
                zs.log.warn("构建世界场景警告！节点Dynamic丢失！");
            }
            if (this._preloadNode == null) {
                zs.log.warn("构建世界场景警告！节点Preload丢失！");
            }

            let listDestroy = [];
            if (this._preloadNode && this._staticNode) {
                for (let i = 0, n = this._preloadNode.numChildren; i < n; i++) {
                    let prefab = this._preloadNode.getChildAt(i);
                    let node_parent = this._current.getChildByName(prefab.name);
                    if (node_parent == null || node_parent.numChildren <= 0) { continue; }
                    listDestroy.push(node_parent);
                    scene.onBuildPrefab && scene.onBuildPrefab.runWith(prefab);
                    for (let j = 0, m = node_parent.numChildren; j < m; j++) {
                        let node_child = node_parent.getChildAt(j);
                        if (scene.onPlacePrefab) {
                            scene.onPlacePrefab.runWith([prefab, node_child]);
                        } else {
                            let sprite = Laya.Sprite3D.instantiate(prefab, this._staticNode, false,
                                node_child.transform.position, node_child.transform.rotation);
                            sprite.transform.setWorldLossyScale(node_child.transform.getWorldLossyScale());
                        }
                    }
                }
            }
            scene.onBuildWorld && scene.onBuildWorld.run();
            Laya.StaticBatchManager.combine(this._staticNode);
            this._preloadNode.destroy(true);
            for (let i = 0; i < listDestroy.length; i++) {
                if (listDestroy[i] != null) {
                    listDestroy[i].destroy(true);
                }
            }
        }
    }
    scene.basePath = "3dres/Conventional";
    scene.nodesDef = null;
    scene.node_static = "static";
    scene.node_dynamic = "dynamic";
    scene.node_preload = "preload";
    scene.onBuildPrefab = null;
    scene.onPlacePrefab = null;
    scene.onBuildWorld = null;

    exports.scene = scene;

}(window.zs = window.zs || {}));