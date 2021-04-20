// 当前为微信小游戏SDK，版本号V3.2.8
// 具体配置项填写方式可参考doc.aldwx.com-小游戏统计平台或广告监测平台-快速接入指南
exports.app_key = zs.core.aldKey; // 在此处填写小游戏统计/广告监测平台创建小游戏后生成的app_key。必填项
exports.plugin = false; // 您的小游戏中是否使用了插件。根据是否启用插件会有不同的接入方式，请参考文档。默认不更改
exports.useOpen = false; // 开启OpenID上报选项，需要额外进行配置，具体参考文档。默认不更改
exports.openKey = ""; // 在此处填写用户OpenID，具体参考文档。默认不更改