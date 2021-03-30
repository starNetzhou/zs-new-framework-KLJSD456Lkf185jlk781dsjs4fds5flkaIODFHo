/**
 * 设置LayaNative屏幕方向，可设置以下值
 * landscape           横屏
 * portrait            竖屏
 * sensor_landscape    横屏(双方向)
 * sensor_portrait     竖屏(双方向)
 */
window.screenOrientation = "sensor_landscape";

//-----libs-begin-----
loadLib("libs/laya.core.js")
loadLib("libs/laya.ui.js")
loadLib("libs/laya.d3.js")
loadLib("libs/laya.physics3D.js")
//-----libs-end-------
if (typeof qg !== "undefined") {
    qg.onError(function(err){
        console.error("oppo error ---->>>  ",err)
    })
    loadLib("zsLibs/adapter/zs.platform.oppo.js");
}
loadLib("zsLibs/adapter/zs.platform.config.js")
loadLib("zsLibs/framework/zs.log.js")
loadLib("zsLibs/framework/zs.resource.js")
loadLib("zsLibs/framework/zs.utils.js")
loadLib("zsLibs/framework/zs.td.js")
loadLib("zsLibs/framework/zs.product.js")
loadLib("zsLibs/framework/zs.fgui.js")
loadLib("zsLibs/framework/zs.fsm.js")
loadLib("zsLibs/framework/zs.scene.js")
loadLib("zsLibs/framework/zs.platform.js")

loadLib("zsLibs/fairygui/fairygui.js")
loadLib("zsLibs/framework/zs.ui.js")
loadLib("zsLibs/framework/zs.exporter.js")
loadLib("zsLibs/framework/zs.core.js")
loadLib("zsLibs/framework/zs.network.js")
loadLib("zsLibs/framework/zs.base.js")

loadLib("js/bundle.js");
