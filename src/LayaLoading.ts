export default class LayaLoading extends zs.ui.LayaLoading {
    static url: string = 'test/Loading.scene';

    static loadedScene: Laya.Scene;

    progressText: Laya.Label;

    static preload(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.loadedScene) { return resolve(); }
            Laya.Scene.load(this.url, Laya.Handler.create(this, (scene) => {
                this.loadedScene = scene as Laya.Scene;
                Laya.stage.addChild(scene);
                resolve();
            }));
        });
    }

    static make(): LayaLoading {
        if (this.loadedScene == null) { return null; }
        let layaLoading = this.loadedScene.getComponent(LayaLoading);
        if (layaLoading == null) { return null; }

        this.loadedScene.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, '#000000', '#000000');
        layaLoading.progressText = this.loadedScene.getChildByName("progressText") as Laya.Label;
        return this.loadedScene.getComponent(LayaLoading);
    }

    updateProgress(value: number) {
        this.progressText.text = value + '%';
    }

}