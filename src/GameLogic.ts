import mainBinder from "./fgui/mainBinder";
import mainPage from "./fgui/mainPage";
import GameNode from "./GameNode";
import ProductKey from "./template/ProductKey";
import workflow from "./template/workflow";

export default class GameLogic extends Laya.Script {

    constructor() {
        super();
        this.init();
    }

    async init() {

        zs.core.workflow = new workflow();

        zs.core.workflow.setFSM(workflow.GAME_PLAY,
            new zs.fsm()
                .registe("START", "READY")
                .registe("READY", "PLAY")
                .registe("PLAY", "SETTLE")
                .registe("SETTLE", "END")
                .setDefault("START")
        );

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
        zs.core.onWorkflow(workflow.GAME_PLAY + '.START', Laya.Handler.create(this, () => {
            console.log("Workflow ===== GAME_PLAY START");
        }));
        zs.core.onWorkflow(workflow.GAME_PLAY + '.READY', Laya.Handler.create(this, () => {
            console.log("Workflow ===== GAME_PLAY READY");
        }));
        zs.core.onWorkflow(workflow.GAME_PLAY + '.PLAY', Laya.Handler.create(this, () => {
            console.log("Workflow ===== GAME_PLAY PLAY");
        }));
        zs.core.onWorkflow(workflow.GAME_PLAY + '.SETTLE', Laya.Handler.create(this, () => {
            console.log("Workflow ===== GAME_PLAY SETTLE");
        }));
        zs.core.onWorkflow(workflow.GAME_PLAY + '.END', Laya.Handler.create(this, () => {
            console.log("Workflow ===== GAME_PLAY END");
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
            // zs.fgui.manager.open(mainPage);
            zs.fgui.manager.show(true, mainPage); 
        }));

        zs.core.init(ProductKey);
    }
}