import entryBinder from "./fgui/entryBinder";
import fgui_loading from "./fgui/fgui_loading";

export default class Loading extends zs.ui.Loading {

    static preload(): Promise<void> {
        return new Promise((resolve, reject) => {
            zs.resource.load('fgui/sub_fgui/entry', zs.ResourceType.FGUIPack).then(() => {
                entryBinder.bindAll();
                resolve();
            });
        });
    }

    static make(): fairygui.GComponent {
        return fgui_loading.createInstance();
    }

    updateProgress(value) {
        let loadingView = this.view as fgui_loading;
        if (loadingView) {
            loadingView.loadingbar.value = value;
        }
    }
}