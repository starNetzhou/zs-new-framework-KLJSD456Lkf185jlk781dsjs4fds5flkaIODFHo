import FGUI_BottomNative from "./export/FGUI_BottomNative";
import native_vivoScreeNative from "./native_vivoScreeNative";
import ProductKey from "./ProductKey";

/*
* @ Author: yangcheng
* @ Data: 2021-03-11 15:48
*/
export default class native_vivoBottomNative extends native_vivoScreeNative {
    static make() {
        let view = FGUI_BottomNative.createInstance();
        return view;
    }
    static type() {
        return FGUI_BottomNative;
    }
    check(component) {
        if (component instanceof FGUI_BottomNative) {
            return true;
        }
        return false;
    }
    apply() {
        let zs_native_limit = ProductKey.zs_native_limit;
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
        zs.core.workflow.next();
    }
}