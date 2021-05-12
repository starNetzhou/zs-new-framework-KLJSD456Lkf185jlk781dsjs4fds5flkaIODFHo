import FGUI_InsertNative from "./export/FGUI_InsertNative";
import native_oppoScreeNative from "./native_oppoScreeNative";

/*
* @ Author: yangcheng
* @ Data: 2021-03-11 15:48
*/
export default class native_oppoInsertNative extends native_oppoScreeNative {
    static make(): FGUI_InsertNative {
        let view = FGUI_InsertNative.createInstance();
        return view;
    }

    static type(): typeof FGUI_InsertNative {
        return FGUI_InsertNative;
    }

    check(component) {
        if (component instanceof FGUI_InsertNative) {
            return true;
        }
        return false;
    }
}