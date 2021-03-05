import GameConfig from "./GameConfig";
import GameLogic from "./GameLogic";
import Loading from "./Loading";
import network from "./network";

class Main {
	constructor() {
		//根据IDE设置初始化引擎		
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.alignV = GameConfig.alignV;
		Laya.stage.alignH = GameConfig.alignH;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError(true);

		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
	}

	// vec3link(...args: (string | Laya.Vector3 | number)[]) {
	// 	if (args == null || args.length <= 0) { return new Laya.Vector3(); }
	// 	let result: Laya.Vector3 = null;
	// 	let typeCalc = '+';
	// 	for (let i = 0, n = args.length; i < n; i++) {
	// 		let arg = args[i];
	// 		let typeArg = typeof arg;
	// 		if (typeArg === 'string') {
	// 			switch (arg) {
	// 				case '+':
	// 				case '-':
	// 				case '*':
	// 				case '/':
	// 					typeCalc = arg;
	// 					break;
	// 			}
	// 		} else {
	// 			if (result == null) {
	// 			} else {

	// 			}
	// 		}
	// 	}
	// }

	async onConfigLoaded() {
		// zs.platform.async('login')
		zs.core.loadingPage = Loading;
		Laya.stage.addComponent(GameLogic);
		// .then((result) => { console.log(result) })
		// .catch((result) => { console.error(result) });
		// console.log('login: ', zs.platform.sync('login'));
		// zs.platform.async('isNetValid').then((result) => { console.log(result) });
		// console.log('isNetValid: ', zs.platform.sync('isNetValid'));

		// zs.core.onPrepare = Laya.Handler.create(this, () => {
		// 	// zs.scene.inst.load("test_1", false, 0);
		// 	zs.resource.init();
		// 	zs.scene.nodesDef = GameNode;
		// 	zs.scene.inst.load('3dres/Conventional/TestScene.ls', true).then(() => {
		// 		zs.core.readyFinish();
		// 	});
		// });

		// zs.core.onStart = Laya.Handler.create(this, () => {
		// 	zs.scene.inst.load("test_1", false, 0)
		// 		.then(() => {
		// 			let scale = fairygui.GRoot.inst.height / 1920;
		// 			zs.fgui.window.create()
		// 				.attach(zs.exporter.full_1)
		// 				.scaleFit(1080, 1920)
		// 				.fit()
		// 				.update<zs.exporter.full_1>(zs.exporter.full_1, (unit) => {
		// 					unit.setData_1(
		// 						[{
		// 							url: "",
		// 							title: "Title-1",
		// 							desc: "Desc-1"
		// 						},
		// 						{
		// 							url: "",
		// 							title: "Title-2",
		// 							desc: "Desc-2"
		// 						},
		// 						{
		// 							url: "",
		// 							title: "Title-3",
		// 							desc: "Desc-3"
		// 						}])
		// 						.setData_2(
		// 							[{
		// 								url: "",
		// 								title: "Title-1",
		// 								desc: "Desc-1"
		// 							},
		// 							{
		// 								url: "",
		// 								title: "Title-2",
		// 								desc: "Desc-2"
		// 							},
		// 							{
		// 								url: "",
		// 								title: "Title-3",
		// 								desc: "Desc-3"
		// 							}])
		// 						.setData_3(
		// 							[{
		// 								url: "",
		// 								title: "Title-1",
		// 								desc: "Desc-1"
		// 							},
		// 							{
		// 								url: "",
		// 								title: "Title-2",
		// 								desc: "Desc-2"
		// 							},
		// 							{
		// 								url: "",
		// 								title: "Title-3",
		// 								desc: "Desc-3"
		// 							},
		// 							{
		// 								url: "",
		// 								title: "Title-4",
		// 								desc: "Desc-4"
		// 							},
		// 							{
		// 								url: "",
		// 								title: "Title-5",
		// 								desc: "Desc-5"
		// 							},
		// 							{
		// 								url: "",
		// 								title: "Title-6",
		// 								desc: "Desc-6"
		// 							},
		// 							{
		// 								url: "",
		// 								title: "Title-7",
		// 								desc: "Desc-7"
		// 							},
		// 							{
		// 								url: "",
		// 								title: "Title-8",
		// 								desc: "Desc-8"
		// 							},
		// 							{
		// 								url: "",
		// 								title: "Title-9",
		// 								desc: "Desc-9"
		// 							},
		// 							{
		// 								url: "",
		// 								title: "Title-10",
		// 								desc: "Desc-10"
		// 							},
		// 							{
		// 								url: "",
		// 								title: "Title-11",
		// 								desc: "Desc-11"
		// 							},
		// 							{
		// 								url: "",
		// 								title: "Title-12",
		// 								desc: "Desc-12"
		// 							},
		// 							{
		// 								url: "",
		// 								title: "Title-13",
		// 								desc: "Desc-13"
		// 							}])
		// 						.apply();
		// 				})
		// 				// .fitWidth()
		// 				// .fit()
		// 				// .attach(zs.exporter.list)
		// 				// .update<zs.exporter.list>(zs.exporter.list, (unit) => {
		// 				// 	unit.setHorizontalList(zs.ui.FGUI_item_2, 300,
		// 				// 		[{
		// 				// 			url: "",
		// 				// 			title: "Title-1"
		// 				// 		},
		// 				// 		{
		// 				// 			url: "",
		// 				// 			title: "Title-2"
		// 				// 		},
		// 				// 		{
		// 				// 			url: "",
		// 				// 			title: "Title-3"
		// 				// 		},
		// 				// 		{
		// 				// 			url: "",
		// 				// 			title: "Title-4"
		// 				// 		},
		// 				// 		{
		// 				// 			url: "",
		// 				// 			title: "Title-5"
		// 				// 		},
		// 				// 		{
		// 				// 			url: "",
		// 				// 			title: "Title-6"
		// 				// 		},
		// 				// 		{
		// 				// 			url: "",
		// 				// 			title: "Title-7"
		// 				// 		},
		// 				// 		{
		// 				// 			url: "",
		// 				// 			title: "Title-8"
		// 				// 		},
		// 				// 		{
		// 				// 			url: "",
		// 				// 			title: "Title-9"
		// 				// 		},
		// 				// 		{
		// 				// 			url: "",
		// 				// 			title: "Title-10"
		// 				// 		},
		// 				// 		{
		// 				// 			url: "",
		// 				// 			title: "Title-11"
		// 				// 		},
		// 				// 		{
		// 				// 			url: "",
		// 				// 			title: "Title-12"
		// 				// 		}], true);
		// 				// })
		// 				// .align(zs.fgui.AlignType.Top)
		// 				// .attach(zs.exporter.card)
		// 				// .update<zs.exporter.card>(zs.exporter.card, (unit) => {
		// 				// 	unit.setItem(zs.ui.FGUI_item_1)
		// 				// 		.setWidth(200, true)
		// 				// 		.setData({
		// 				// 			url: "",
		// 				// 			title: "ExportCard",
		// 				// 			desc: "ExportDesc"
		// 				// 		})
		// 				// 		.setTransition("shakeLeft");
		// 				// })
		// 				// .align(zs.fgui.AlignType.Left)
		// 				.show();
		// 		})
		// }, null, false);
		// zs.core.onWorkflow(zs.template.workflow.State_Home, Laya.Handler.create(this, () => {
		// 	console.log("监听： Home事件");
		// }));
		// zs.core.onceWorkflow(zs.template.workflow.State_Home, Laya.Handler.create(this, () => {
		// 	console.log("监听： Home事件 pre");
		// }), true);
		// zs.core.onWorkflow(zs.template.workflow.State_Game, Laya.Handler.create(this, () => {
		// 	console.log("监听: Game事件");
		// }));
		// zs.core.onceWorkflow(zs.template.workflow.State_Game, Laya.Handler.create(this, () => {
		// 	console.log("监听: Game事件 pre");
		// }), true);
		// zs.core.onWorkflow(zs.template.workflow.State_Finish, Laya.Handler.create(this, () => {
		// 	console.log("监听： Finish事件");
		// }));
		// zs.core.onceWorkflow(zs.template.workflow.State_Finish, Laya.Handler.create(this, () => {
		// 	console.log("监听： Finish事件 pre");
		// }), true);
		// zs.core.init(ProductKey);
	}
}
//激活启动类
new Main();
