import ExampleUI from "./ExampleUI";

export default class GameLogic extends Laya.Script {

    exampleSceneURL: string = "example/ExampleUI.scene";

    exampleUI: ExampleUI;

    constructor() {
        super();
        this.init();
    }

    init() {
        Laya.Scene3D.load("Conventional/TestScene.ls", Laya.Handler.create(this, (s) => {
            Laya.stage.addChild(s);
            Laya.Scene.open(this.exampleSceneURL, true, null, Laya.Handler.create(this, (s) => {
                let scene = s as Laya.Scene;
                scene.height = Laya.stage.height;
                this.exampleUI = new ExampleUI(scene);
                this.exampleUI.setBtnClickEvent(this, () => {
                    this.exampleUI.setWorkflowState("btn clicked")
                    console.log("Test Example Btn Click");
                })
            }));
        }))
    }
}