import value from "*.glsl";
import mainBinder from "./fgui/mainBinder";
import mainPage from "./fgui/mainPage";
import GameNode from "./GameNode";
import network from "./network";
import ProductKey from "./template/ProductKey";
import workflow from "./template/workflow";

export default class GameLogic extends Laya.Script {

    gameExporter: zs.fgui.window;
    workflow: workflow;

    constructor() {
        super();
        this.init();
    }

    async init() {
        // zs.network.listDomain = [
        //     "http://test-gamesapi.zxmn2018.com"
        // ];
        this.workflow = new workflow;
        zs.core.workflow = this.workflow;

        zs.core.onFGUIBind = Laya.Handler.create(this, () => {
            mainBinder.bindAll();
        });

        zs.core.onPrepare = Laya.Handler.create(this, async () => {
            zs.scene.nodesDef = GameNode;
            zs.scene.inst.load('3dres/Conventional/TestScene.ls', true).then(() => {
                zs.core.readyFinish();
            });
        });

        zs.core.onWorkflow(workflow.GAME_START, Laya.Handler.create(this, () => {
            console.log("Workflow ====== GAME_START");
        }));

        zs.core.onWorkflow(workflow.START_FULL_1, Laya.Handler.create(this, () => {
            console.log("Workflow ====== START_FULL_1");
        }));
        zs.core.onWorkflow(workflow.START_FULL_2, Laya.Handler.create(this, () => {
            console.log("Workflow ====== START_FULL_2");
        }));
        zs.core.onWorkflow(workflow.GAME_PREPARE, Laya.Handler.create(this, () => {
            console.log("Workflow ====== GAME_PREPARE");
        }));
        zs.core.onWorkflow(workflow.EXPORT_COMMON_EGG, Laya.Handler.create(this, () => {
            console.log("Workflow ====== EXPORT_COMMON_EGG");
        }));
        zs.core.onWorkflow(workflow.GAME_PLAY, Laya.Handler.create(this, () => {
            console.log("Workflow ===== GAME_PLAY");
        }));
        zs.core.onWorkflow(workflow.EXPORT_GAME_EGG, Laya.Handler.create(this, () => {
            console.log("Workflow ====== EXPORT_GAME_EGG");
        }));
        zs.core.onWorkflow(workflow.OVER_FULL_1, Laya.Handler.create(this, () => {
            console.log("Workflow ====== OVER_FULL_1");
        }));
        zs.core.onWorkflow(workflow.GAME_SETTLE, Laya.Handler.create(this, () => {
            console.log("Workflow ====== GAME_SETTLE");
        }));
        zs.core.onWorkflow(workflow.OVER_FULL_2, Laya.Handler.create(this, () => {
            console.log("Workflow ====== OVER_FULL_2");
        }));
        zs.core.onWorkflow(workflow.GAME_END, Laya.Handler.create(this, () => {
            console.log("Workflow ====== GAME_END");
        }));

        zs.core.onWorkflow(workflow.GAME_HOME, Laya.Handler.create(this, () => {
            console.log("Workflow ====== GAME_HOME");
            if (this.gameExporter) {
                this.gameExporter.show();
            } else {
                this.gameExporter = zs.fgui.window.create()
                    .attach(mainPage)
                    .fit()
                    .update<mainPage>(mainPage, (unit) => {
                        console.log(unit);
                    })
                    .show();
            }
        }));
        zs.core.init(ProductKey);
    }
}