import zs_example from "./fgui/zs_example";
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
        // 新建工作流
        zs.core.workflow = new workflow();

        // 在GAME_PLAY中设置子状态机
        zs.core.workflow.setFSM(workflow.GAME_PLAY,
            new zs.fsm()
                .registe("START", "READY")
                .registe("READY", "PLAY")
                .registe("PLAY", "SETTLE")
                .registe("SETTLE", "END")
                .setDefault("START")
        );

        // 绑定示例FGUI资源
        zs.core.onFGUIBind = Laya.Handler.create(this, () => {
            zs_exampleBinder.bindAll();
        });

        // 设置准备事件，通常为加载场景
        zs.core.onPrepare = Laya.Handler.create(this, async () => {
            // 加载场景
            zs.scene.nodesDef = GameNode;
            zs.scene.inst.load('3dres/Conventional/TestScene.ls', true).then(() => {
                // 加载预制体并放入场景
                let ball = zs.prefabs.get('ball');
                if (ball) {
                    ball.clone() as Laya.Sprite3D;
                    zs.scene.inst.current.addChild(ball);
                    ball.transform.position = new Laya.Vector3(0, 2, 0);
                }
                // 开始游戏，执行后将关闭加载界面
                zs.core.readyFinish();
            });
        });

        // 监听工作流
        zs.core.onWorkflow(workflow.GAME_HOME, Laya.Handler.create(this, () => {
            console.log("Workflow ====== GAME_HOME");
            // 展示FGUI界面
            this.examplePage = zs.fgui.manager.open(zs_example)
                .update<zs_example>(zs_example, (unit) => {
                    // 设置FGUI界面状态
                    unit.setWorkflowState(workflow.GAME_HOME)
                        .setBtnText("继续（主状态）")
                        .setBtnClickEvent(this, this.workflowNext)
                })
                .getBase() as zs_example;

            this.examplePage.show();
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
        zs.core.onWorkflow(workflow.GAME_SETTLE, Laya.Handler.create(this, () => {
            console.log("Workflow ====== GAME_SETTLE");
            this.examplePage.setWorkflowState(workflow.GAME_SETTLE, true).show();
        }));
        zs.core.onWorkflow(workflow.GAME_END, Laya.Handler.create(this, () => {
            console.log("Workflow ====== GAME_END");
            this.examplePage.setWorkflowState(workflow.GAME_END).show();
            zs.core.workflow.next();
        }));

        // 启动SDK，开始执行游戏进程
        zs.core.init(ProductKey);
    }

    workflowNext() {
        zs.core.workflow.next();
    }

    workflowChildNext() {
        zs.core.workflow.childNext();
    }
}