window.zs = window.zs || {};
window.zs.qq = window.zs.qq || {};

(function (exports, Laya) {
    'use strict';

    class QQBanner {
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
            this.loadTimer = setTimeout(function () { console.log("加载超时"); s.destroy() }, 10000);
            this.showTime = 0;
            this.birthTime = 0;
            this.inErr = false;
        }
        /**生存时间 */
        get liveTime() {
            if (!this.birthTime) return 0;
            return new Date().getTime() - this.birthTime;
        }
        /**是否展示超过配置时间，最低3s */
        get showEd() {
            var num = Number(zs.product.get("zs_banner_show_number"));
            var time = num ? num : 0;
            time = Math.max(time, 3000);
            return this.showLong > time;
        }

        initBanner() {
            if (!window["qq"] || !window["qq"].createBannerAd) {
                console.log("环境异常,无法创建");
                return;
            }
            console.log("进入banner初始化" + this.adUnitId);
            var s = this;
            let offSetW = window.screen.availWidth / Laya.stage.width;
            let offSetH = window.screen.availHeight / Laya.stage.height;
            let left = this.pos ? (this.pos.left != null ? this.pos.left * offSetW : (this.pos.right != null ? ((Laya.stage.width - this.pos.right) * offSetW - 350) : (this.pos.centerX != null ? (Laya.stage.width / 2 + this.pos.centerX) * offSetW - 350 / 2 : (window.screen.availWidth - 350) / 2))) : (window.screen.availWidth - 350) / 2;
            let top = this.pos ? (this.pos.top != null ? this.pos.top * offSetH : (this.pos.bottom != null ? ((Laya.stage.height - this.pos.bottom) * offSetH - 86) : (this.pos.centerY != null ? (Laya.stage.height / 2 + this.pos.centerY) * offSetH - 86 / 2 : (window.screen.availHeight - 86)))) : (window.screen.availHeight - 86);
            if (this.bannerAd == null) {
                this.bannerAd = qq.createBannerAd({
                    adUnitId: s.adUnitId,
                    style: {
                        left: left,
                        top: top,
                        width: 350
                    }
                });
            }
            if (!this.bannerAd) {
                console.error("Banner 创建失败???环境？");
                return;
            }
            this.bannerAd.onLoad(function () {
                s.isLoad = true;
                s.loadTimer && clearTimeout(s.loadTimer);
                s.loadFunc && s.loadFunc();
                s.birthTime = new Date().getTime();
                if (!s.isWait) s.show();
            })
            this.bannerAd.onError(function (err) {
                console.error("Banner err:", err);
                QQBannerMgr.Instance.inErr();
                s.inErr = true;
            });

            this.bannerAd.onResize(this.onResize.bind(this));
        }

        onResize(size) {
            QQBannerMgr.Instance.realSize = { w: size.width, h: size.height };
        }

        getOffsetY() {
            return window.screen.availHeight * 750 > 1600 * window.screen.availWidth ? 15 * window.screen.availHeight * 750 / 1600 / window.screen.availWidth : 0;
        }

        show() {
            if (this.bannerAd == null || !this.isLoad) return;
            if (!this.bannerAd.show) return;
            this.isShow = true;
            this.isWait = false;
            var s = this;
            this.updatePosition();
            try {
                this.bannerAd.show().then(function () {
                    console.warn("banner标号" + s.bannerIndex + "展示成功,当前已展示时间" + s.showLong);
                    s.showTime = new Date().getTime();
                    if (s.isWait) { s.hide(); }
                });
            } catch (e) {
                console.log("banner报错了");
            }
        }
        //正常展示位置
        updatePosition() {
            if (!this.bannerAd || !QQBannerMgr.Instance.realSize) return;
            let offSetW = window.screen.availWidth / Laya.stage.width;
            let offSetH = window.screen.availHeight / Laya.stage.height;
            let left = this.pos ? (this.pos.left ? this.pos.left * offSetW : (this.pos.right ? ((Laya.stage.width - this.pos.right) * offSetW - QQBannerMgr.Instance.realSize.w) : (this.pos.centerX ? (Laya.stage.width / 2 + this.pos.centerX) * offSetW - QQBannerMgr.Instance.realSize.width / 2 : (window.screen.availWidth - QQBannerMgr.Instance.realSize.w) / 2))) : (window.screen.availWidth - QQBannerMgr.Instance.realSize.w) / 2;
            let top = this.pos ? (this.pos.top ? this.pos.top * offSetH : (this.pos.bottom ? ((Laya.stage.height - this.pos.bottom) * offSetH - QQBannerMgr.Instance.realSize.h) : (this.pos.centerY ? (Laya.stage.height / 2 + this.pos.centerY) * offSetH - QQBannerMgr.Instance.realSize.height / 2 : (window.screen.availHeight - QQBannerMgr.Instance.realSize.h)))) : (window.screen.availHeight - QQBannerMgr.Instance.realSize.h);
            this.bannerAd.style.top = top;
            this.bannerAd.style.left = left;
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
            if (this.bannerAd && QQBannerMgr.Instance.realSize) {
                this.bannerAd.style.top = top * window.screen.availHeight / Laya.stage.height;
            }
        }

        updateX(left) {
            if (this.bannerAd && QQBannerMgr.Instance.realSize) {
                this.bannerAd.style.left = left * window.screen.availWidth / Laya.stage.width;
            }
        }
    }

    class QQBannerMgr {
        constructor() {
            //曝光banner集合
            this.qqbannerArray = [];
            this.bannerIds = [];
            /**当为false不自动展示，不自动刷新 */
            this.isWait = false;
            this.pos = {};
            this.lastFreshTime = 0;
            this.length = 0;
            this.inErrTime = false;
            this.errTimer = null;
            //banner实例的标号
            this.bannerIndex = 0;
            this.idCdArr = [];
            this.realSize = null;
            var s = this;
            //这里每秒检测banner刷新
            setInterval(function () {
                let time = new Date().getTime();
                var ftime = zs.product.get("zs_banner_refresh_time");
                if (!s.isWait && s.lastFreshTime && ftime && time - s.lastFreshTime > ftime) {
                    console.log("自动刷新");
                    s.checkBanner(s.isWait, s.pos);
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
         * @param pos banner位置信息 （laya.stage 坐标 left,right,centerX,top,bottom,centerY)
         */
        checkBanner(isWait, pos) {
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
            let eNum = 0;
            for (let i = this.qqbannerArray.length - 1; i >= 0; i--) {
                let banner = this.qqbannerArray[i];
                if (banner.inErr) {
                    banner.destroy();
                    console.log("banner" + banner.bannerIndex + "报错了");
                }
                if (this.qqbannerArray.length > 5 && banner.showEd && banner.liveTime > 30000) {
                    console.log("banner" + banner.bannerIndex + "生存时长超30s并已展示时长" + banner.showLong);
                    banner.destroy();
                }
                if (!banner.bannerAd) {
                    console.log("banner" + banner.bannerIndex + "已销毁");
                    this.qqbannerArray.splice(i, 1);
                    continue;
                }
                if (!banner.isLoad) {
                    eNum++;
                    continue;
                }
                if (banner.isLoad && !banner.showEd && !banner.isShow) {
                    console.log("存在加载完成但未展示的banner");
                    eNum++;
                    break;
                }
            }
            if (eNum >= 1 || this.inErrTime) {
                console.log("存在拉取中的banner或为报错状态,暂停拉取");
                if (!this.isWait) {
                    this.showBanner(pos);
                }
                return;
            }
            this.createBanner();
        }
        /**不提供外部调用 */
        createBanner() {
            if (this.inErrTime) {
                console.log("处于报错状态取消创建");
            }
            if (this.inErrTime) return;
            let r = Math.floor(Math.random() * this.bannerIds.length);
            let banner = new QQBanner(this.bannerIds[r], this.isWait, this.pos);
            banner.bannerIndex = this.bannerIndex;
            this.bannerIndex++;
            this.qqbannerArray.push(banner);
        }
        /**展示banner的方法，先找是否有展示时长不达标的 再找已展示达标中展示时长最低的  */
        showBanner(pos) {
            for (let i = 0; i < this.qqbannerArray.length; i++) {
                let banner = this.qqbannerArray[i];
                if (banner.isLoad && !banner.showEd && !banner.isShow) {
                    banner.pos = pos;
                    banner.show();
                    this.isWait = false;
                    return;
                }
            }
            let showBanner = null;
            for (let i = 0; i < this.qqbannerArray.length; i++) {
                let banner = this.qqbannerArray[i];
                if (banner.isLoad && !banner.isShow) {
                    if (!showBanner || banner.showLong < showBanner.showLong) {
                        showBanner = banner;
                    }
                }
            }
            if (showBanner) {
                showBanner.pos = pos;
                showBanner.show();
                this.isWait = false;
            }
            !showBanner && console.log("不存在加载完并且没有正在展示的banner");
        }
        /**检查banner合集  隐藏所有banner 使自动刷新失效 */
        hideAll() {
            for (let i = 0; i < this.qqbannerArray.length; i++) {
                let banner = this.qqbannerArray[i];
                banner.hide();
            }
            this.isWait = true;
        }
    }
    QQBannerMgr.Instance = new QQBannerMgr();

    exports.QQBanner = QQBanner;
    exports.QQBannerMgr = QQBannerMgr;

}(window.zs.qq.banner = window.zs.qq.banner || {}, Laya));