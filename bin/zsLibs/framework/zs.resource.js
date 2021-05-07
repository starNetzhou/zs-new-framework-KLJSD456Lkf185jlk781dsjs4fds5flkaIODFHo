window.zs = window.zs || {};
(function (exports) {
    'use strict';

    let ResourceType;
    (function (ResourceType) {
        ResourceType[ResourceType["Common"] = 0] = "Common";
        ResourceType[ResourceType["Scene"] = 1] = "Scene";
        ResourceType[ResourceType["Scene3D"] = 2] = "Scene3D";
        ResourceType[ResourceType["Sprite3D"] = 3] = "Sprite3D";
        ResourceType[ResourceType["FGUIPack"] = 4] = "FGUIPack";
    })(ResourceType = ResourceType || (ResourceType = {}));

    class resource {
        static init() {
            resource.loadedPacks = [];
            resource.preloadPacks = [];
            resource.subpacks = {};
            if (configs.gameCfg && configs.gameCfg.subpackages) {
                let subpacks = configs.gameCfg.subpackages;
                for (let key in configs.gameCfg.subpackages) {
                    if (key == null || key.length <= 0) { continue; }
                    let isPreload = false;
                    let pack = subpacks[key];
                    if (key[0] === '*') {
                        isPreload = true;
                        key = key.slice(1);
                        resource.preloadPacks.push(key);
                    }
                    resource.subpacks[key] = pack;
                }
            }
        }

        static async preload() {
            if (resource.preloadPacks == null || resource.preloadPacks.length <= 0) { return; }
            for (let i = 0, n = resource.preloadPacks.length; i < n; i++) {
                let key = resource.preloadPacks[i];
                await zs.platform.async.loadSubpackage({ pkgName: resource.subpacks[key] })
                    .then(() => {
                        resource.loadedPacks.push(key);
                        zs.log.debug("预加载分包" + key + "成功!");
                    })
                    .catch(() => {
                        zs.log.warn("预加载分包" + key + "失败!");
                    });
            }
        }

        static check(url) {
            for (let key in resource.subpacks) {
                if (zs.utils.startwith(url, resource.subpacks[key])) {
                    return key;
                }
            }
            return null;
        }

        static isPackLoaded(key) {
            return this.loadedPacks.indexOf(key) >= 0;
        }

        static isLoading() {
            return resource.numLoading > 0;
        }

        static load(url, type) {
            return new Promise((resolve, reject) => {
                if (!url) { return resolve(); }
                let packKey = resource.check(url);
                resource.numLoading++;
                if (packKey && !this.isPackLoaded(packKey)) {
                    zs.platform.async.loadSubpackage({ pkgName: resource.subpacks[packKey] })
                        .then(() => {
                            resource.loadedPacks.push(packKey);
                            resource.nativeLoad(url, type).then((res) => {
                                resource.numLoading--;
                                resolve(res);
                            });
                        })
                        .catch(() => {
                            resource.nativeLoad(url, type).then((res) => {
                                resource.numLoading--;
                                resolve(res);
                            });
                        });
                } else {
                    resource.nativeLoad(url, type).then((res) => {
                        resource.numLoading--;
                        resolve(res);
                    });
                }
            });
        }

        static nativeLoad(url, type) {
            return new Promise((resolve, reject) => {
                let existResource = Laya.loader.getRes(url);
                if (existResource) {
                    resolve(existResource);
                } else {
                    switch (type) {
                        case ResourceType.Scene:
                            Laya.Scene.load(url, Laya.Handler.create(null, (scene) => {
                                resolve(scene);
                            }));
                            break;
                        case ResourceType.Scene3D:
                            Laya.Scene3D.load(url, Laya.Handler.create(null, (scene) => {
                                resolve(scene);
                            }));
                            break;
                        case ResourceType.Sprite3D:
                            Laya.Sprite3D.load(url, Laya.Handler.create(null, (sprite) => {
                                resolve(sprite);
                            }));
                            break;
                        case ResourceType.FGUIPack:
                            fairygui.UIPackage.loadPackage(url, Laya.Handler.create(this, (result) => {
                                if (result && result.length > 0) {
                                    let pack = result[0];
                                    let items = pack._items;
                                    for (let i = 0, n = items.length; i < n; i++) {
                                        let item = items[i];
                                        if (item.type == fairygui.PackageItemType.Atlas) {
                                            let texture = pack.getItemAsset(item);
                                            if (texture._bitmap) {
                                                texture._bitmap.lock = true;
                                            }
                                        }
                                    }
                                    resolve(pack);
                                } else {
                                    resolve(null);
                                }
                            }));
                            break;
                        default:
                            Laya.loader.load(url, Laya.Handler.create(null, (res) => {
                                resolve(res);
                            }));
                            break;
                    }
                }
            });
        }
        static destroyFGUIPackage(pack) {
            if (pack) {
                pack.dispose();
            }
        }
        static destroyFGUIPackageByName(name) {
            let pack = fairygui.UIPackage.getByName(name);
            this.destroyFGUIPackage(pack);
        }

    }
    resource.subpacks = {};
    resource.preloadPacks = [];
    resource.loadedPacks = [];
    resource.numLoading = 0;

    class configs {
        static async init() {
            configs.gameCfg = await zs.resource.load(configs.gameCfgPath);
            configs.productCfg = await zs.resource.load(configs.porductCfgPath);
            configs.uiCfg = await zs.resource.load(configs.uiCfgPath);
            if (!configs.gameCfg.secret) {
                configs.gameCfg.secret = "7CaD3L23LlGnENd1";
            }
        }
        static async load(key, path, url, isAsync) {
            if (configs.list == null) {
                configs.list = {};
            }
            if (configs.list[key]) {
                return new Promise((resolve, reject) => {
                    resolve(configs.list[key]);
                });
            }
            if (url == null || isAsync) {
                await zs.resource.load(path)
                    .then((result) => {
                        configs.list[key] = result;
                    })
                    .catch(() => {
                        zs.log.warn("本地无法正确加载配置表 " + key + " 路径为 " + path, "Configs");
                    });
            }
            if (url) {
                let urlSplit = url.split('>>', 2);
                let lenUrlSplit = urlSplit.length;
                if (lenUrlSplit > 0) {
                    let module = urlSplit.length > 1 ? urlSplit[0] : null;
                    let table = urlSplit.length > 1 ? urlSplit[1] : urlSplit[0];
                    if (isAsync) {
                        zs.network.config(false, module, table)
                            .then((result) => {
                                result && (configs.list[key] = result);
                            })
                            .catch(() => {
                                zs.log.warn("远程无法正确加载配置表 " + key + " 路径为 " + url, "Configs");
                            });
                    } else {
                        let result = await zs.network.config(false, module, table)
                            .catch(() => {
                                zs.log.warn("远程无法正确加载配置表 " + key + " 路径为 " + url, "Configs");
                            });
                        result && (configs.list[key] = result);
                    }
                }
            }
            return new Promise((resolve, reject) => {
                resolve(configs.list[key]);
            });
        }
        static get(key) {
            if (configs.list == null || configs.list[key] == null) {
                return null;
            }
            return configs.list[key];
        }
    }
    configs.gameCfgPath = 'config/gameCfg.json';
    configs.porductCfgPath = 'config/productCfg.json';
    configs.uiCfgPath = "config/uiCfg.json";
    class prefabs {
        static async load(key, path, url, isAsync) {
            if (configs.list == null) {
                configs.list = {};
            }
            if (configs.list[key]) {
                return new Promise((resolve, reject) => {
                    resolve(configs.list[key]);
                });
            }
            if (url == null || isAsync) {
                let prefab = await zs.resource.load(path, zs.ResourceType.Sprite3D)
                    .catch(() => {
                        zs.log.warn("本地无法正确加载预制体 " + key + " 路径为 " + path, "Prefabs");
                    });
                configs.list[key] = prefab;
            }
            if (url) {
                // TODO 加入网络获取配置
            }
            return new Promise((resolve, reject) => {
                resolve(configs.list[key]);
            });
        }
        static get(key) {
            if (configs.list == null || configs.list[key] == null) {
                return null;
            }
            return configs.list[key];
        }
    }


    exports.ResourceType = ResourceType;
    exports.resource = resource;
    exports.configs = configs;
    exports.prefabs = prefabs;

}(window.zs = window.zs || {}));