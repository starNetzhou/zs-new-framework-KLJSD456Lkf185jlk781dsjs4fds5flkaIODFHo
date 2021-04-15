import FGUI_ScreeNative from "./export/FGUI_ScreeNative";
import native_oppoBottomNative from "./native_oppoBottomNative";
import ProductKey from "./ProductKey";

/*全屏原生导出
* @ Author: yangcheng
* @ Data: 2021-03-11 15:48
*/
export default class native_oppoScreeNative extends native_oppoBottomNative {
    static make() {
        let view = FGUI_ScreeNative.createInstance();
        return view;
    }
    static type() {
        return FGUI_ScreeNative;
    }
    check(component) {
        if (component instanceof FGUI_ScreeNative) {
            return true;
        }
        return false;
    }
    apply() {
        let zs_native_limit = ProductKey.zs_native_limit;
        console.log("🐑 下一关开始/重新开始原生广告开关 : --- >>> ", zs_native_limit);
        if (!zs_native_limit) {
            this.closeView();
            return;
        }
        super.apply();
        return this;
    }
    /**关闭界面 */
    closeView() {
        super.closeView();
        console.log("🐑 : --- >>> ", "workflow");
        zs.core.workflow.next();
    }
}