import zs_example from "./fgui/zs_exampla";
import zs_exampleBinder from "./fgui/zs_exampleBinder";
import GameNode from "./GameNode";
import ProductKey from "./template/ProductKey";
import workflow from "./template/workflow";

export default class GameLogic extends Laya.Script {

    examplePage: zs_example;

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
            zs_exampleBinder.bindAll();
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
            this.examplePage.setWorkflowState(workflow.GAME_PREPARE).show();
        }));
        zs.core.onWorkflow(workflow.EXPORT_COMMON_EGG, Laya.Handler.create(this, () => {
            console.log("Workflow ====== EXPORT_COMMON_EGG");
            this.examplePage.setWorkflowState(workflow.EXPORT_COMMON_EGG).show();
        }));
        zs.core.onWorkflow(workflow.GAME_PLAY, Laya.Handler.create(this, () => {
            console.log("Workflow ===== GAME_PLAY");
            this.examplePage.setWorkflowState(workflow.GAME_PLAY).show();
        }));
        zs.core.onWorkflow(workflow.GAME_PLAY + '.START', Laya.Handler.create(this, () => {
            console.log("Workflow ===== GAME_PLAY START");
            this.examplePage.setWorkflowState(workflow.GAME_PLAY + '.START')
                .setBtnText("继续（子状态）")
                .setBtnClickEvent(this, this.workflowChildNext)
                .show();
        }));
        zs.core.onWorkflow(workflow.GAME_PLAY + '.READY', Laya.Handler.create(this, () => {
            console.log("Workflow ===== GAME_PLAY READY");
            this.examplePage.setWorkflowState(workflow.GAME_PLAY + '.READY').show();
        }));
        zs.core.onWorkflow(workflow.GAME_PLAY + '.PLAY', Laya.Handler.create(this, () => {
            console.log("Workflow ===== GAME_PLAY PLAY");
            this.examplePage.setWorkflowState(workflow.GAME_PLAY + '.PLAY').show();
        }));
        zs.core.onWorkflow(workflow.GAME_PLAY + '.SETTLE', Laya.Handler.create(this, () => {
            console.log("Workflow ===== GAME_PLAY SETTLE");
            this.examplePage.setWorkflowState(workflow.GAME_PLAY + '.SETTLE').show();
        }));
        zs.core.onWorkflow(workflow.GAME_PLAY + '.END', Laya.Handler.create(this, () => {
            console.log("Workflow ===== GAME_PLAY END");
            this.examplePage.setWorkflowState(workflow.GAME_PLAY + '.END')
                .setBtnText("继续（主状态）")
                .setBtnClickEvent(this, this.workflowNext)
                .show();
        }));
        zs.core.onWorkflow(workflow.OVER_FULL_1, Laya.Handler.create(this, () => {
            console.log("Workflow ====== OVER_FULL_1");
            this.examplePage.setWorkflowState(workflow.OVER_FULL_2).show();
        }));
        zs.core.onWorkflow(workflow.GAME_SETTLE, Laya.Handler.create(this, () => {
            console.log("Workflow ====== GAME_SETTLE");
            this.examplePage.setWorkflowState(workflow.GAME_SETTLE, true).show();
        }));
        zs.core.onWorkflow(workflow.OVER_FULL_2, Laya.Handler.create(this, () => {
            console.log("Workflow ====== OVER_FULL_2");
            this.examplePage.setWorkflowState(workflow.OVER_FULL_2).show();
        }));
        zs.core.onWorkflow(workflow.GAME_END, Laya.Handler.create(this, () => {
            console.log("Workflow ====== GAME_END");
            this.examplePage.setWorkflowState(workflow.GAME_END).show();
            zs.core.workflow.next();
        }));

        zs.core.onWorkflow(workflow.GAME_HOME, Laya.Handler.create(this, () => {
            console.log("Workflow ====== GAME_HOME");
            this.examplePage = zs.fgui.manager.show(true, zs_example)
                .update<zs_example>(zs_example, (unit) => {
                    unit.setWorkflowState(workflow.GAME_HOME)
                        .setBtnText("继续（主状态）")
                        .setBtnClickEvent(this, this.workflowNext)
                })
                .getBase() as zs_example;

            this.examplePage.show();
        }));

        zs.core.init(ProductKey);
    }

    workflowNext() {
        zs.core.workflow.next();
    }

    workflowChildNext() {
        zs.core.workflow.childNext();
    }
}