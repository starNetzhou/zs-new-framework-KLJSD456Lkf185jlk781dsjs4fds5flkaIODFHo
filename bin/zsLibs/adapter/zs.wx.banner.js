window.zs = window.zs || {};
window.zs.wx = window.zs.wx || {};

(function (exports, Laya) {
    'use strict';

    class WxBanner {
        constructor(adUnitId, isWait, pos, loadFunc) {
            this.adUnitId = adUnitId;
            this.isLoad = false;
            this.isShow = false;
            this.isWait = isWait;
            this.pos = pos;
            this.loadFunc = loadFunc;
            this.showLong = 0;
            this.initBanner();
            //10s未能成功加载就销毁这个对象
            var s = this;
            this.loadTime = setTimeout(function () { console.log("加载超时"); s.destroy() }, 10000);
            this.showTime = "";
            this.birthTime = 0;
            this.inErr = false;
        }

        get liveTime() {
            if (!this.birthTime) return 0;
            return new Date().getTime() - this.birthTime;
        }

        get showEd() {
            var num = Number(zs.product.get("zs_banner_show_number"));
            var time = num ? num : 0;
            time = Math.max(time, 3000);
            return this.showLong > time;
        }

        initBanner() {
            if (!window["wx"] || !window["wx"].createBannerAd) {
                console.log("环境异常,无法创建");
                return;
            }
            console.log("进入banner初始化" + this.adUnitId);
            var s = this;
            if (this.bannerAd == null) {
                var pos = getAdPos(this.pos, WxBannerMgr.Instance.realSize ? WxBannerMgr.Instance.realSize.w : 300, WxBannerMgr.Instance.realSize ? WxBannerMgr.Instance.realSize.h : 104)
                this.bannerAd = wx.createBannerAd({
                    adUnitId: s.adUnitId,
                    style: {
                        left: pos.left,
                        top: pos.top,
                        width: 300
                    }
                });
            }
            if (!this.bannerAd) {
                console.error("Banner 创建失败???环境？");
                return;
            }
            this.bannerAd.onLoad(function () {
                s.isLoad = true;
                s.loadTime && clearTimeout(s.loadTime);
                s.loadFunc && s.loadFunc();
                s.birthTime = new Date().getTime();
                if (!s.isWait) s.show();
            })
            this.bannerAd.onError(function (err) {
                console.error("Banner err:", err);
                WxBannerMgr.Instance.inErr();
                s.inErr = true;
                s.isWait = true;
            });

            this.bannerAd.onResize(this.onResize.bind(this));
        }

        onResize(size) {
            WxBannerMgr.Instance.realSize = { w: size.width, h: size.height };
        }

        getOffsetY() {
            return window.screen.availHeight * 750 > 1600 * window.screen.availWidth ? 15 * window.screen.availHeight * 750 / 1600 / window.screen.availWidth : 0;
        }

        show() {
            if (this.bannerAd == null || !this.isLoad || this.inErr) return;
            this.isShow = true;
            this.isWait = false;
            var s = this;
            this.updatePosition()//修改位置是否影响曝光？？
            this.bannerAd.show().then(function () {
                console.warn("banner标号" + s.bannerIndex + "展示成功,当前已展示时间" + s.showLong);
                s.showTime = new Date().getTime();
                s.isWait && s.hide();
            });
        }
        //移到用户上次点击位置  top 弃用！
        updateTouchPos() {
            if (!this.bannerAd || !WxBannerMgr.Instance.realSize || Laya.stage.mouseY == null || Laya.stage.mouseX == null) return;
            // this.bannerAd.style.left = Laya.stage.mouseX * window.screen.availWidth / Laya.stage.width - WxBannerMgr.Instance.realSize.w / 2;
            this.bannerAd.style.top = Laya.stage.mouseY * window.screen.availHeight / Laya.stage.height - WxBannerMgr.Instance.realSize.h / 2;
        }

        //正常展示位置
        updatePosition() {
            if (!this.bannerAd || !WxBannerMgr.Instance.realSize) return;
            var pos = getAdPos(this.pos, WxBannerMgr.Instance.realSize ? WxBannerMgr.Instance.realSize.w : 300, WxBannerMgr.Instance.realSize ? WxBannerMgr.Instance.realSize.h : 104);
            this.bannerAd.style.left = pos.left;
            this.bannerAd.style.top = pos.top;
        }

        hide() {
            this.isWait = true;
            this.bannerAd && this.bannerAd.hide();
            this.showTime && (this.showLong += (new Date().getTime() - this.showTime));
            this.showTime = null;
            this.isShow && console.warn("banner标号" + this.bannerIndex + "调用隐藏,当前已展示时间" + this.showLong);
            this.isShow = false;
        }

        destroy() {
            this.bannerAd && this.bannerAd.destroy();
            this.bannerAd = null;
            this.adUnitId = null;
            this.isLoad = null;
            this.isShow = null;
            this.isWait = null;
            this.loadTimer && clearTimeout(this.loadTimer);
            this.pos = null;
            this.loadFunc = null;
            this.showLong = null;
            this.birthTime = null;
            this.loadTimer = null;
            this.showTime = null;
            this.inErr = null;
        }

        updateY(top) {
            if (this.bannerAd && WxBannerMgr.Instance.realSize) {
                this.bannerAd.style.top = top * window.screen.availHeight / Laya.stage.height;
            }
        }

        updateX(left) {
            if (this.bannerAd && WxBannerMgr.Instance.realSize) {
                this.bannerAd.style.left = left * window.screen.availWidth / Laya.stage.width;
            }
        }
    }

    class WxBannerMgr {

        //曝光banner集合
        constructor() {
            this.wxbannerArray = [];
            this.bannerIds = [];
            /**当为false不自动展示，不自动刷新 */
            this.isWait = false;
            this.pos = {};
            this.lastFreshTime = 0;
            this.length = 0;
            this.inErrTime = false;
            this.errTimer = null;
            this.createNum = 0;
            //banner实例的标号
            this.bannerIndex = 0;
            this.checkInit = false;
            this.idCdArr = [];
            this.realSize = null;
            var s = this;
            //这里每秒检测banner刷新
            setInterval(function () {
                let time = new Date().getTime();
                var ftime = zs.product.get("zs_banner_refresh_time");
                if (!s.isWait && s.lastFreshTime && ftime && time - s.lastFreshTime > ftime) {
                    console.log("自动刷新");
                    s.checkBanner(s.isWait, s.pos, s.length, s.checkInit);
                }
            }, 1000);
        }
        /**调用这个方法  banner管理进入应错暂停刷新状态 */
        inErr() {
            this.errTimer && clearTimeout(this.errTimer);
            this.inErrTime = true;
            var s = this;
            this.errTimer = setTimeout(function () { s.inErrTime = false }, 30000);
        }
        /**初始化banner管理的id 传入 id1,id2,id3  非数组！ */
        setAdUnitId(...adUnitIds) {
            this.bannerIds = adUnitIds;
            this.checkNull();
        }

        checkNull() {
            if (!this.bannerIds) this.bannerIds = [];
            for (let i = this.bannerIds.length - 1; i >= 0; i--) {
                if (!this.bannerIds[i] || !this.bannerIds[i].length) {
                    this.bannerIds.splice(i, 1);
                }
            }
        }
        /**一个刷新banner的方法
         * @param isWait 是否等待展示（为false时会自动刷新或去池子中banner展示，为true需手动调用展示）
         * @param pos banner居左居右居上居下居中 （laya.stage 坐标)
         * @param length
         * @param checkInit 该属性为true时  才会去创建banner并加入banner池
         */
        checkBanner(isWait, pos, length, checkInit) {
            if (!this.bannerIds) {
                console.log("未设置bannerID");
                return;
            }
            if (!this.bannerIds.length) {
                console.log("bannerID呢？？？");
                return;
            }
            this.hideAll();
            this.lastFreshTime = new Date().getTime();
            this.isWait = isWait;
            this.pos = pos;
            this.length = length ? Math.min(this.bannerIds.length, length) : 1;
            this.checkInit = checkInit;
            var num = 0;
            let eNum = 0;
            for (let i = this.wxbannerArray.length - 1; i >= 0; i--) {
                let banner = this.wxbannerArray[i];
                if (banner.inErr) {
                    banner.destroy();
                }
                else if (this.wxbannerArray.length > 5 && banner.showEd && banner.liveTime > 30000) {
                    console.log("banner" + banner.bannerIndex + "生存时长超30s并已展示时长" + banner.showLong);
                    banner.destroy();
                }
                if (!banner.bannerAd) {
                    console.log("banner已销毁");
                    this.wxbannerArray.splice(i, 1);
                    continue;
                }
                if (!banner.isLoad) {
                    eNum++;
                    continue;
                }
                if (banner.isLoad && !banner.showEd && !banner.isShow) {
                    console.log("存在加载完成但未展示的banner");
                    if (!this.isWait) {
                        this.showBanner(this.pos, 1);
                    }
                    num++;
                    if (num >= this.length) return;
                }
            }
            if (eNum >= this.length || this.inErrTime) {
                console.log("当前拉取中大于配置次或者出现banner报错,暂停拉取");
                if (!this.isWait) {
                    this.showBanner(this.pos, this.length - num);
                }
                return;
            }
            if (!checkInit) {
                console.error("checkInit为false，不创建banner");
                if (!this.isWait) {
                    this.showBanner(this.pos, this.length - num);
                }
                return;
            }
            this.createNum = this.length - num;
            this.createBanner();
        }
        /**不提供外部调用 */
        createBanner() {
            if (this.inErrTime) {
                console.log("处于报错状态取消创建");
            }
            if (!this.createNum || this.createNum <= 0 || this.inErrTime) return;
            let r = Math.floor(Math.random() * this.bannerIds.length);
            let banner = new WxBanner(this.bannerIds[r], this.isWait, this.pos, this.createBanner);
            banner.bannerIndex = this.bannerIndex;
            this.bannerIndex++;
            this.wxbannerArray.push(banner);
            this.createNum--;
        }
        /**展示banner的方法，先找是否有展示时长不达标的 再找已展示达标中展示时长最低的  （弃用其中的位置设定） */
        showBanner(pos, length) {
            var num = 0;
            length = length ? Math.min(this.bannerIds.length, length) : 1;
            for (let i = 0; i < this.wxbannerArray.length; i++) {
                let banner = this.wxbannerArray[i];
                if (banner.isLoad && !banner.showEd && !banner.isShow) {
                    banner.pos = pos;
                    banner.show();
                    num++;
                    if (num >= length) return;
                }
            }
            let showBanner = null;
            for (let i = 0; i < this.wxbannerArray.length; i++) {
                let banner = this.wxbannerArray[i];
                if (banner.isLoad && !banner.isShow) {
                    if (!showBanner || banner.showLong < showBanner.showLong) {
                        showBanner = banner;
                    }
                }
            }
            if (showBanner) { showBanner.pos = pos; showBanner.show() };
            !showBanner && console.log("不存在加载完并且没有正在展示的banner");
        }
        /**使正在展示的banner位移至用户上次点击位置  （已弃用，被和谐了） */
        toTouch() {
            let num = 0;
            for (let i = 0; i < this.wxbannerArray.length; i++) {
                let banner = this.wxbannerArray[i];
                if (banner.isLoad && banner.isShow) {
                    banner.updateTouchPos();
                    num++;
                }
            }
            if (num == 0) console.log("没有正在展示的banner");
        }
        /**回归正常位置的方法  （已弃用） */
        updatePos() {
            let num = 0;
            for (let i = 0; i < this.wxbannerArray.length; i++) {
                let banner = this.wxbannerArray[i];
                if (banner.isLoad && banner.isShow) {
                    banner.updatePosition(toTouch);
                    num++;
                }
            }
            if (num == 0) console.log("没有正在展示的banner");
        }
        /**检查banner合集  隐藏所有banner 使自动刷新失效 */
        hideAll() {
            for (let i = 0; i < this.wxbannerArray.length; i++) {
                let banner = this.wxbannerArray[i];
                banner.hide();
            }
            this.isWait = true;
        }
    }
    WxBannerMgr.Instance = new WxBannerMgr();
    /**获取广告位置
    * @param pos 广告在Laya上的适配信息 {left,right,centerX,top,bottom,centerY}
    * @param width 广告的宽 手机屏幕像素宽
    * @param height 广告的高 手机屏幕像素高
    */
    var getAdPos = function (pos, width, height) {
        if (!width || !height) {
            console.log("????干嘛吖！！！");
            return { left: 0, top: 0 };
        }
        let offSetW = window.screen.availWidth / Laya.stage.width;
        let offSetH = window.screen.availHeight / Laya.stage.height;
        let left = pos ? (pos.left != null ? pos.left * offSetW : (pos.right != null ? ((Laya.stage.width - pos.right) * offSetW - width) : (pos.centerX != null ? (Laya.stage.width / 2 + pos.centerX) * offSetW - width / 2 : (window.screen.availWidth - width) / 2))) : (window.screen.availWidth - width) / 2;
        let top = pos ? (pos.top != null ? pos.top * offSetH : (pos.bottom != null ? ((Laya.stage.height - pos.bottom) * offSetH - height) : (pos.centerY != null ? (Laya.stage.height / 2 + pos.centerY) * offSetH - height / 2 : (window.screen.availHeight - height)))) : (window.screen.availHeight - height);
        return { left: left, top: top };
    }
    exports.WxBanner = WxBanner;
    exports.WxBannerMgr = WxBannerMgr;

}(window.zs.wx.banner = window.zs.wx.banner || {}, Laya));