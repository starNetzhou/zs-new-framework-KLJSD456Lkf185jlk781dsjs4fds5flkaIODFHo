window.zs = window.zs || {};
window.zs.wx = window.zs.wx || {};

(function (exports, Laya) {
    'use strict';

    class WxBanner {
        constructor(adUnitId, isWait, left, bottom, loadFunc) {
            this.adUnitId = adUnitId;
            this.isLoad = false;
            this.isShow = false;
            this.showEd = false;
            this.isWait = isWait;
            this.left = left ? left * window.screen.availWidth / Laya.stage.width : 0;
            this.bottom = bottom ? bottom * window.screen.availHeight / Laya.stage.height : 0;
            this.loadFunc = loadFunc;
            this.initBanner();
            //10s未能成功加载就销毁这个对象
            var s = this;
            this.loadTime = setTimeout(function () { console.log("加载超时"); s.destroy() }, 10000);
            this.showTime = "";
        }

        initBanner() {
            if (!window["wx"] || !window["wx"].createBannerAd) {
                console.log("环境异常,无法创建");
                return;
            }
            console.log("进入banner初始化" + this.adUnitId);
            var s = this;
            if (this.bannerAd == null) {
                this.bannerAd = wx.createBannerAd({
                    adUnitId: s.adUnitId,
                    style: {
                        left: 0,
                        top: window.screen.availHeight - 150,
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
                if (!s.isWait) s.show();
            })
            this.bannerAd.onError(function (err) {
                console.error("Banner err:", err);
                WxBannerMgr.Instance.inErr();
                s.destroy();
            });

            this.bannerAd.onResize(this.onResize.bind(this));
        }

        onResize(size) {
            this.realSize = { w: size.width, h: size.height };
        }

        getOffsetY() {
            return window.screen.availHeight * 750 > 1600 * window.screen.availWidth ? 15 * window.screen.availHeight * 750 / 1600 / window.screen.availWidth : 0;
        }

        show(toTouch) {
            if (this.bannerAd == null || !this.isLoad) return;
            this.isShow = true;
            var s = this;
            toTouch ? this.updateTouchPos() : this.updatePosition();
            this.bannerAd.show().then(function () {
                var zs_full_screen_banner_time = zs.product.get("zs_full_screen_banner_time")
                var time = zs_full_screen_banner_time ? (zs_full_screen_banner_time * 1000) : 0;
                s.showTime = setTimeout(function () { s.showEd = true }, Math.max(2000, time));
            });
        }
        //移到用户上次点击位置  top
        updateTouchPos() {
            if (!this.bannerAd || !this.realSize || Laya.stage.mouseY == null || Laya.stage.mouseX == null) return;
            // this.bannerAd.style.left = Laya.stage.mouseX * window.screen.availWidth / Laya.stage.width - this.realSize.w / 2;
            this.bannerAd.style.top = Laya.stage.mouseY * window.screen.availHeight / Laya.stage.height - this.realSize.h / 2;
        }

        //正常展示位置
        updatePosition() {
            if (!this.bannerAd || !this.realSize) return;
            this.bannerAd.style.left = this.left ? this.left : ((window.screen.availWidth - this.realSize.w) / 2);
            this.bannerAd.style.top = window.screen.availHeight - this.realSize.h - this.bottom - this.getOffsetY() / 2;
        }

        hide() {
            this.isShow = false;
            this.isWait = true;
            this.bannerAd && this.bannerAd.hide();
            this.showTime && clearTimeout(this.showTime);
        }

        destroy() {
            this.bannerAd && this.bannerAd.destroy();
            this.bannerAd = null;
            this.adUnitId = null;
            this.isLoad = null;
            this.isShow = null;
            this.showEd = null;
            this.isWait = null;
            this.left = null;
            this.bottom = null;
            this.loadTime = null;
            this.showTime && clearTimeout(this.showTime);
            this.showTime = null;
        }

        updateY(top) {
            if (this.bannerAd && this.realSize) {
                this.bannerAd.style.top = top * window.screen.availHeight / Laya.stage.height;
            }
        }

        updateX(left) {
            if (this.bannerAd && this.realSize) {
                this.bannerAd.style.left = left * window.screen.availWidth / Laya.stage.width;
            }
        }
    }

    class WxBannerMgr {

        //曝光banner集合
        constructor() {
            this.wxbannerArray = [];
            this.bannerIds = [];
            this.isWait = false;
            this.left = 0;
            this.bottom = 0;
            this.lastFreshTime = 0;
            this.length = 0;
            this.inErrTime = false;
            this.errTimer = null;
            this.createNum = 0;
            setInterval(()=>{
                let time = new Date().getTime();
                var zs_banner_refresh_time = zs.product.get("zs_banner_refresh_time")
                if (!this.isWait && this.lastFreshTime && zs_banner_refresh_time && time - this.lastFreshTime > zs_banner_refresh_time) {
                    console.log("自动刷新")
                    this.updateBanner(this.isWait, this.left, this.bottom, this.length)
                }
            }, 1000)
        }

        inErr() {
            this.errTimer && clearTimeout(this.errTimer);
            this.inErrTime = true;
            var s = this;
            this.errTimer = setTimeout(function () { s.inErrTime = false }, 30000);
        }

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

        onAppShow() {
            this.updateBanner(this.isWait, this.left, this.bottom, this.length);
        }

        updateBanner(isWait, left, bottom, length) {
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
            isWait != null && (this.isWait = isWait);
            left != null && (this.left = left);
            bottom != null && (this.bottom = bottom);
            // if (this.length == null && length == null) {
            if (!this.length && !length) {
                this.length = 1;
            } else {
                length != num && (this.length = length);
                this.length = Math.min(this.bannerIds.length, this.length);
            }
            var num = 0;
            let eNum = 0;
            for (let i = this.wxbannerArray.length - 1; i >= 0; i--) {
                let banner = this.wxbannerArray[i];
                if (this.wxbannerArray.length > 5 && banner.showEd) {
                    banner.destroy();
                }
                if (!banner.bannerAd) {
                    console.log("banner已销毁");
                    this.wxbannerArray.splice(i, 1);
                    continue;
                }
                if (!banner.isLoad) {
                    eNum++;
                }
                if (banner.isLoad && !banner.showEd && !banner.isShow) {
                    console.log("存在加载完成但未展示的banner");
                    if (!this.isWait) {
                        banner.show();
                    }
                    num++;
                    if (num >= this.length) return;
                }
            }
            if (eNum >= this.length || this.inErrTime) {
                console.log("当前拉取中大于配置次或者出现banner报错,暂停拉取");
                if (!this.isWait) {
                    this.showBanner(this.left, this.bottom, this.length - num);
                }
                return;
            }
            this.createNum = this.length - num;
            this.createBanner();
        }

        createBanner() {
            if (this.inErrTime) {
                console.log("处于报错状态取消创建");
            }
            if (!this.createNum || this.createNum <= 0 || this.inErrTime) return;
            let banner = new WxBanner(this.bannerIds[Math.floor(Math.random() * this.bannerIds.length)], this.isWait, this.left, this.bottom, this.createBanner);
            this.wxbannerArray.push(banner);
            this.createNum--;
        }

        showBanner(left, bottom, length) {
            var num = 0;
            length = length ? Math.min(this.bannerIds.length, length) : 1;
            for (let i = 0; i < this.wxbannerArray.length; i++) {
                let banner = this.wxbannerArray[i];
                if (banner.isLoad && !banner.showEd && !banner.isShow) {
                    banner.left = left ? left : 0;
                    banner.bottom = bottom ? bottom : 0;
                    banner.show();
                    num++;
                    if (num >= length) return;
                }
            }
            for (let i = 0; i < this.wxbannerArray.length; i++) {
                let banner = this.wxbannerArray[i];
                if (banner.isLoad && !banner.isShow) {
                    banner.left = left ? left : 0;
                    banner.bottom = bottom ? bottom : 0;
                    banner.show();
                    return;
                }
            }
            console.log("不存在加载完并且没有正在展示的banner");
            for (let i = 0; i < this.wxbannerArray.length; i++) {
                let banner = this.wxbannerArray[i];
                if (!banner.isLoad && !banner.isShow) {
                    banner.isWait = false;
                    return;
                }
            }
        }

        toTouch() {
            // 移动到上次点击位置
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

        updatePos() {
            // 移动到正常展示的位置  底部
            let num = 0;
            for (let i = 0; i < this.wxbannerArray.length; i++) {
                let banner = this.wxbannerArray[i];
                if (banner.isLoad && banner.isShow) {
                    banner.updatePosition();
                    num++;
                }
            }
            if (num == 0) console.log("没有正在展示的banner");
        }

        hideAll() {
            this.isWait = true;
            for (let i = 0; i < this.wxbannerArray.length; i++) {
                let banner = this.wxbannerArray[i];
                banner.hide();
            }
        }
    }
    WxBannerMgr.Instance = new WxBannerMgr();

    exports.WxBanner = WxBanner;
    exports.WxBannerMgr = WxBannerMgr;

}(window.zs.wx.banner = window.zs.wx.banner || {}));