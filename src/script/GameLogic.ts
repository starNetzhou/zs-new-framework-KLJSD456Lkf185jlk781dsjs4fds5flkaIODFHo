import ProductKey from "src/template/ProductKey";
import workflow from "src/template/workflow";
import ExampleUI from "./ExampleUI";
import LayaLoading from "./LayaLoading";

export default class GameLogic extends Laya.Script {

    exampleSceneURL: string = "example/ExampleUI.scene";

    exampleUI: ExampleUI;
    curScene: Laya.Scene3D;

    constructor() {
        super();
        this.init();
    }

    init() {
        // 设置自定义Loading界面
        zs.core.layaLoadingPage = LayaLoading;

        // 初始化工作流
        zs.core.workflow = new workflow();

        // 监听SDK准备事件
        zs.core.onPrepare = Laya.Handler.create(this, () => {
            Laya.Scene3D.load("Conventional/TestScene.ls", Laya.Handler.create(this, (s) => {
                // 解决加载闪屏，场景加载时设置排序索引
                this.curScene = Laya.stage.addChildAt(s, 0) as Laya.Scene3D;
                Laya.Scene.open(this.exampleSceneURL, true, null, Laya.Handler.create(this, (s) => {
                    let scene = s as Laya.Scene;
                    scene.height = Laya.stage.height;
                    this.exampleUI = new ExampleUI(scene);
                    zs.core.readyFinish();
                }));
                Laya.Sprite3D.load("Conventional/Ball.lh", Laya.Handler.create(this, (s) => {
                    let sprite = this.curScene.addChild(s) as Laya.Sprite3D;
                    sprite.transform.position = new Laya.Vector3(0, 3, 0);
                }));
            }))
        })

        // 设置子状态机
        zs.core.workflow.setFSM(workflow.GAME_PLAY,
            new zs.fsm()
                .registe("START", "READY")
                .registe("READY", "PLAY")
                // 加入SHOP状态，并设置-1优先级，以避免占用PLAY的主优先级
                .registe("READY", "SHOP", -1)
                // 加入SHOP跳转到PLAY的连接，以形成状态闭环
                .registe("SHOP", "PLAY")
                .registe("PLAY", "SETTLE")
                .registe("SETTLE", "FINISH")
                .setDefault("START"));

        // 监听工作流
        zs.core.onWorkflow(workflow.GAME_HOME, Laya.Handler.create(this, () => {
            this.exampleUI.setWorkflowState(workflow.GAME_HOME)
                .setBtnClickEvent(this, () => { zs.core.workflow.next(); });
        }));

        // zs.core.onWorkflow(workflow.GAME_PLAY, Laya.Handler.create(this, () => {
        //     this.exampleUI.setWorkflowState(workflow.GAME_PLAY)
        //         .setBtnClickEvent(this, () => { zs.core.workflow.next(); });
        // }));

        zs.core.onWorkflow(workflow.GAME_END, Laya.Handler.create(this, () => {
            zs.core.workflow.next();
            // this.exampleUI.setWorkflowState(workflow.GAME_END)
            //     .setBtnClickEvent(this, () => { zs.core.workflow.next(); });
        }));

        // 监听子状态机
        zs.core.onWorkflow(workflow.GAME_PLAY + '.START', Laya.Handler.create(this, () => {
            this.exampleUI.setWorkflowState(workflow.GAME_PLAY + '.START')
                .setBtnClickEvent(this, () => { zs.core.workflow.childNext(); });
        }));

        // zs.core.onWorkflow(workflow.GAME_PLAY + '.READY', Laya.Handler.create(this, () => {
        //     this.exampleUI.setWorkflowState(workflow.GAME_PLAY + '.READY')
        //         .setBtnClickEvent(this, () => { zs.core.workflow.childNext(); });
        // }));

        // 通过指定跳转，跳转到SHOP状态
        zs.core.onWorkflow(workflow.GAME_PLAY + '.READY', Laya.Handler.create(this, () => {
            this.exampleUI.setWorkflowState(workflow.GAME_PLAY + '.READY')
                .setBtnClickEvent(this, () => { zs.core.workflow.childNext("SHOP"); });
        }));

        zs.core.onWorkflow(workflow.GAME_PLAY + '.SHOP', Laya.Handler.create(this, () => {
            this.exampleUI.setWorkflowState(workflow.GAME_PLAY + '.SHOP')
                .setBtnClickEvent(this, () => { zs.core.workflow.childNext(); });
        }));

        zs.core.onWorkflow(workflow.GAME_PLAY + '.PLAY', Laya.Handler.create(this, () => {
            this.exampleUI.setWorkflowState(workflow.GAME_PLAY + '.PLAY')
                .setBtnClickEvent(this, () => { zs.core.workflow.childNext(); });
        }));

        zs.core.onWorkflow(workflow.GAME_PLAY + '.SETTLE', Laya.Handler.create(this, () => {
            this.exampleUI.setWorkflowState(workflow.GAME_PLAY + '.SETTLE')
                .setBtnClickEvent(this, () => { zs.core.workflow.childNext(); });
        }));

        zs.core.onWorkflow(workflow.GAME_PLAY + '.FINISH', Laya.Handler.create(this, () => {
            // 跳出子状态，再次执行zs.core.workflow.next
            this.exampleUI.setWorkflowState(workflow.GAME_PLAY + '.FINISH')
                .setBtnClickEvent(this, () => { zs.core.workflow.next(); });
        }));

        // 启动SDK
        zs.core.init(ProductKey);
    }
}