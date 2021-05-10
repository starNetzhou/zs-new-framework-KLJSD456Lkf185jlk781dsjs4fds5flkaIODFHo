window.zs = window.zs || {};
window.zs.base = window.zs.base || {};
(function (exports) {
    'use strict';

    class entry {
        constructor(type, thisArg, event) {
            this.thisArg = thisArg;
            if (type.prototype instanceof zs.ui.LayaLoading) {
                this.loading = type.make();
                event.call(thisArg);
                Laya.timer.frameLoop(1, this, this.onProgress);
            } else {
                this.window = zs.fgui.window.create()
                    .attach(type)
                    .fit()
                    .update(type, (unit) => {
                        this.loading = unit;
                        event.call(thisArg);
                        Laya.timer.frameLoop(1, this, this.onProgress);
                    })
                    .show();
            }
        }
        onProgress() {
            if ((!this.loading || this.loading.run(this.thisArg.progress || 0)) && this.thisArg.readyStart) {
                this.thisArg.start();
                Laya.timer.clear(this, this.onProgress);
                if (this.loading && this.loading instanceof zs.ui.LayaLoading) {
                    let owner = this.loading.owner;
                    owner.removeSelf();
                    this.loading.destroy();
                    owner.destroy();
                }
                this.window && this.window.dispose();
            }
        }
        get progress() {
            if (this.loading == null) { return 0; }
            return this.loading.current;
        }
        static init(type, thisArg, event) {
            return new entry(type, thisArg, event);
        }
    }

    exports.entry = entry;
}(window.zs.base = window.zs.base || {}))