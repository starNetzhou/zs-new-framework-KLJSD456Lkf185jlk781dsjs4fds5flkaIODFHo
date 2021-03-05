export enum PackageState {
    Other = 0,
    SubPackage = 1,
    Loaded = 2
}

export enum ResourceType {
    Common = 0,
    Scene = 1,
    Scene3D = 2,
    Sprite3D = 3
}

export default class Resource {
    private static subPackConfigs: { [key: string]: string } = {};
    private static loadedPack: string[] = [];
    private static numLoading: number = 0;

    static init() {
        Resource.subPackConfigs = {
            "3dres": "3dres/",
            "res": "res/"
        };
        Resource.loadedPack = [];
    }

    static check(name): PackageState {
        if (Resource.loadedPack.indexOf(name) >= 0) {
            return PackageState.Loaded;
        } else if (Resource.subPackConfigs[name] != null) {
            return PackageState.SubPackage;
        }
        return PackageState.Other;
    }

    static isSubPackageLoading() {
        return this.numLoading > 0;
    }

    static load(url: string, type?: ResourceType): Promise<any> {
        let urlSplit = url.split('/', 2);
        let pkgName = urlSplit[0];
        let state = Resource.check(pkgName);
        return new Promise((resolve, reject) => {
            if (state == PackageState.SubPackage && Resource.loadedPack.indexOf(pkgName) <= 0) {
                Resource.numLoading++;
                zs.platform.async.loadSubpackage({ pkgName: Resource.subPackConfigs[pkgName] })
                    .then(() => {
                        Resource.numLoading--;
                        Resource.loadedPack.push(pkgName);
                        this.nativeLoad(url, type).then(resolve);
                    })
                    .catch(() => {
                        Resource.numLoading--;
                        this.nativeLoad(url, type).then(resolve);
                    })
            } else {
                this.nativeLoad(url, type).then(resolve);
            }
        })
    }

    static nativeLoad(url: string, type?: ResourceType): Promise<any> {
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
                    default:
                        Laya.loader.load(url, Laya.Handler.create(null, (res) => {
                            resolve(res);
                        }));
                        break;
                }
            }
        });
    }
}