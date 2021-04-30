import FGUI_btn_Special from "./export/FGUI_btn_Special";
import ProductKey from "./ProductKey";

/*
* @ Author: yangcheng
* @ Data: 2021-04-30 14:40
*/
export default class exporter_Special extends zs.fgui.base {

    static typeDefine = FGUI_btn_Special;

    event = null;
    owner = null;

    bClickContinue = false;
    isChildNext = false;

    offsetX = 0;
    offsetY = 0;

    constructor(component) {
        super(component);
        this.owner = component;
        component.onClick(this, this.onClick);
    }

    onClick() {
        switch (this.event) {
            case "FULL_1":
                this.Full_1();
                break
        }
    }

    Full_1() {
        let fullSwitch = ProductKey.zs_full_screen_button_switch;
        let delayTime = ProductKey.zs_button_delay_time;
        if (fullSwitch && !this.bClickContinue) {
            this.owner.touchable = false;
            this.bClickContinue = true;
            let moveY = this.owner.y - this.offsetY;
            // let moveX = this.owner.x - this.offsetX;
            Laya.Tween.to(this.owner, { y: moveY }, 800, null, Laya.Handler.create(this, () => {
                this.owner.touchable = true;
            }), Number(delayTime));
            // 展示banner
            if (window.zs["wx"] && window.zs["wx"].banner) {
                var checkInit = !zs.platform.sync.hasBanner();
                var bannerTime = checkInit ? 0 : Number(delayTime) / 2;
                Laya.timer.once(bannerTime, this, function () {
                    zs.platform.sync.updateBanner({ isWait: false, checkInit: checkInit })
                })
            }
            return;
        } else {
            //暂时没有办法解决掉 界面关不掉的问题 跳转没啥用
            if (this.isChildNext) {
                zs.core.workflow.childNext();
            } else {
                zs.core.workflow.next();
            }
        }
    }

    applyConfig(config) {
        console.error("config", config)

        //#region  按钮位移不知道为什么不生效 我配置了位置 但是并没有 根据我 加的 数值 改变位置
        let offsetY = config.offsetY;
        offsetY != null && offsetY != "" && (this.owner.y += offsetY, this.offsetY = offsetY);
        let offsetX = config.offsetX;
        offsetX != null && offsetX != "" && (this.owner.x += offsetX, this.offsetX = offsetX);
        //#endregion

        //是否是子状态
        this.isChildNext = config.childNext;

        /**按钮的样式 */
        let style = config.style;
        if (style) {
            //设置按钮的宽高
            if (style.size && Array.isArray(style.size) && style.size.length >= 2) {
                this.owner.width = style.size[0];
                this.owner.height = style.size[1];
            }
            //替换icon
            if (style.icon && style.icon.length > 0) {
                this.owner.icon1.url = style.icon;
            }
            //设置按钮文字
            if (style.title && style.title.length > 0) {
                this.owner.title1.text = style.title;
            }
            //设置按钮scale 
            if (style.scale && Array.isArray(style.scale) && style.scale.length >= 2) {
                this.owner.scaleX = style.scale[0];
                this.owner.scaleY = style.scale[1];
            }
            //字体大小

            //字体颜色

        }

        //按钮需要响应的事件类型
        if (config.event) {
            this.event = config.event;
        }
        return this;
    }

}