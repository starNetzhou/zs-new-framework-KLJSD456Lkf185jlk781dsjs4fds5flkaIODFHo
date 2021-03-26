import FGUI_BottomNative from "./export/FGUI_BottomNative";
import native_oppoScreeNative from "./native_oppoScreeNative";

/*
* @ Author: yangcheng
* @ Data: 2021-03-11 15:48
*/
export default class native_oppoBottomNative extends native_oppoScreeNative {
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
}