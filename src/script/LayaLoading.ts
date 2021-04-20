export default class LayaLoading extends zs.ui.LayaLoading {
    // Loading 面板地址
    static url: string = 'example/Loading.scene';
    // 加载展示的Loading面板实例
    static loadedScene: Laya.Scene;
    // 进度文本
    progressText: Laya.Label;
    // 预加载资源方法，通常必须覆写，用于让SDK预加载Loading需要的资源
    static preload(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.loadedScene) { return resolve(); }
            Laya.Scene.load(this.url, Laya.Handler.create(this, (scene) => {
                this.loadedScene = scene as Laya.Scene;
                resolve();
            }));
        });
    }
    // 构建方法，通常必须覆写，用于生成Loading面板实例并执行初始逻辑
    static make(): LayaLoading {
        if (this.loadedScene == null) { return null; }
        Laya.stage.addChild(this.loadedScene);
        let layaLoading = this.loadedScene.getComponent(LayaLoading);
        if (layaLoading == null) {
            layaLoading = this.loadedScene.addComponent(LayaLoading);
        }

        this.loadedScene.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, '#000000', '#000000');
        layaLoading.progressText = this.loadedScene.getChildByName("progressText") as Laya.Label;
        return layaLoading;
    }
    // 更新进度，加载显示相关的逻辑都将在此执行
    updateProgress(value: number) {
        this.progressText.text = value + '%';
    }

}