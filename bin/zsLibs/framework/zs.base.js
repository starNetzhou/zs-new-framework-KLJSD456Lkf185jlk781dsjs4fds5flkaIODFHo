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

    class workflow extends zs.workflow {
        registe() {
            this.fsm = new zs.fsm()
                .registe(workflow.GAME_HOME, workflow.GAME_PLAY)
                .registe(workflow.GAME_PLAY, workflow.GAME_END)
                .registe(workflow.GAME_END, workflow.GAME_HOME)
                .setDefault(workflow.GAME_HOME);
        }
    }

    workflow.GAME_HOME = "GAME_HOME";
    workflow.GAME_PLAY = "GAME_PLAY";
    workflow.GAME_END = "GAME_END";

    exports.entry = entry;
    exports.workflow = workflow;
}(window.zs.base = window.zs.base || {}))