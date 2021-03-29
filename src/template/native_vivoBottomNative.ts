import FGUI_BottomNative from "./export/FGUI_BottomNative";

/*
* @ Author: yangcheng
* @ Data: 2021-03-11 15:48
*/
export default class native_vivoBottomNative extends zs.fgui.base {
    static make(): FGUI_BottomNative {
        let view = FGUI_BottomNative.createInstance();
        return view;
    }
    static type(): typeof FGUI_BottomNative {
        return FGUI_BottomNative;
    }
    check(component) {
        if (component instanceof FGUI_BottomNative) {
            return true;
        }
        return false;
    }
}