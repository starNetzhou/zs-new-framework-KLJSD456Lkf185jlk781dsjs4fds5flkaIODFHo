export default class LayaLoading extends zs.ui.LayaLoading {
    static url: string = 'test/Loading.scene';

    static loadedScene: Laya.Scene;

    progressText: Laya.Label;

    static preload(): Promise<void> {
        return new Promise((resolve, reject) => {
            Laya.Scene.load(this.url, Laya.Handler.create(this, resolve));
        });
    }

    static make(): LayaLoading {
        this.loadedScene = Laya.loader.getRes(this.url);
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

    updateProgress(value: number) {
        this.progressText.text = value + '%';
    }

}