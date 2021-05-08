import exportBinder from "./export/exportBinder";
import native_oppoBottomNative from "./native_oppoBottomNative";
import native_oppoScreeNative from "./native_oppoScreeNative";
import native_BtnAddDesk from "./native_BtnAddDesk";
import native_BtnMoreGame from "./native_BtnMoreGame";

export default class workflow extends zs.workflow {
    static readonly PRODUCT_START = "PRODUCT_START";
    static readonly PRODUCT_BEGIN = "PRODUCT_BEGIN";
    static readonly GAME_HOME = "GAME_HOME";
    static readonly PRODUCT_HOME_PLAY = "PRODUCT_HOME_PLAY";
    static readonly GAME_PLAY = "GAME_PLAY";
    static readonly PRODUCT_PLAY_END = "PRODUCT_PLAY_END";
    static readonly GAME_END = "GAME_END";
    static readonly PRODUCT_FINISH = "PRODUCT_FINISH";

    exporterPack = "export/export";

    /**添加桌面icon按钮 */
    static readonly add_btn_deskTopIcon = "add_btn_deskTopIcon";
    /**添加更多好玩按钮 */
    static readonly add_btn_moreGame = "add_btn_moreGame";
    /**添加底部原生 */
    static readonly add_bottom_native = "add_bottom_native";
    /**添加屏幕原生 */
    static readonly add_screen_native = "add_screen_native";

    registe() {
        super.registe();

        // 绑定导出UI
        exportBinder.bindAll();

        zs.fgui.configs.registeBase(workflow.add_btn_deskTopIcon, native_BtnAddDesk);
        zs.fgui.configs.registeBase(workflow.add_bottom_native, native_oppoBottomNative);
        zs.fgui.configs.registeBase(workflow.add_screen_native, native_oppoScreeNative);
        zs.fgui.configs.registeBase(workflow.add_btn_moreGame, native_BtnMoreGame);
    }
}