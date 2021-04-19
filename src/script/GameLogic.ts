import ExampleUI from "./ExampleUI";

export default class GameLogic extends Laya.Script {

    exampleSceneURL: string = "example/ExampleUI.scene";

    exampleUI: ExampleUI;
    curScene: Laya.Scene3D;

    constructor() {
        super();
        this.init();
    }

    init() {
        Laya.Scene3D.load("Conventional/TestScene.ls", Laya.Handler.create(this, (s) => {
            this.curScene = Laya.stage.addChild(s) as Laya.Scene3D;
            Laya.Scene.open(this.exampleSceneURL, true, null, Laya.Handler.create(this, (s) => {
                let scene = s as Laya.Scene;
                scene.height = Laya.stage.height;
                this.exampleUI = new ExampleUI(scene);
                this.exampleUI.setBtnClickEvent(this, () => {
                    this.exampleUI.setWorkflowState("btn clicked")
                    console.log("Test Example Btn Click");
                })
            }));
            Laya.Sprite3D.load("Conventional/Ball.lh", Laya.Handler.create(this, (s) => {
                let sprite = this.curScene.addChild(s) as Laya.Sprite3D;
                sprite.transform.position = new Laya.Vector3(0, 3, 0);
            }));
        }))
    }
}