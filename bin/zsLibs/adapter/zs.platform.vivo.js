window.platform = (function () {
    function platform() { };
    platform.systemInfo = null;

    //#region 初始化和登录 必须保留的几个方法
    platform.init = function () {
        console.log("platform.init");
        // qg.onError(function (res) {
        //     console.error(res);
        // })
        platform.systemInfo = qg.getSystemInfoSync();
        //-----------------------------------------------------
        //这个api低于1051 需要手动开启初始化
        // qg.initAdService({
        //     appId: zs.core.appId,
        //     isDebug: false,
        //     success: function (res) {
        //         console.log("success");
        //     },
        //     fail: function (res) {
        //         console.log("fail:" + res.code + res.msg);
        //     },
        //     complete: function (res) {
        //         console.log("complete");
        //     }
        // })
    }
    platform.login = function _async() {
        return new Promise((resolve, reject) => {
            qg.login({
                success: (result) => {
                    resolve(result);
                },
                fail: (result) => {
                    reject(result);
                },
                complete: (result) => {
                }
            });
        });
    }
    platform.getLoginParams = function _async() {
        return new Promise((resolve, reject) => {
            qg.login({
                success: (result) => {
                    resolve({
                        code: result.code
                    });
                },
                fail: (result) => {
                    resolve({
                        uid: 1
                    });
                },
                complete: (result) => { }
            });
        });
    }
    //#endregion

    //#region 平台的云存储
    platform.setCloudStorage = function _async(params) {
        return new Promise((resolve, reject) => {

        });
    }
    platform.getCloudStorage = function _async(params) {
        return new Promise((resolve, reject) => {

        })
    }
    //#endregion

    //#region 分包网络请求
    /**加载分包 */
    platform.loadSubpackage = function _async(params) {
        return new Promise((resolve, reject) => {
            if (params.pkgName == null) {
                zs.log.warn('方法（ loadSubpackage ）缺少必要参数（ pkgName ）', 'Platform');
                return reject();
            }
            let loadTask = qg.loadSubpackage({
                name: params.pkgName,
                success: (result) => {
                    resolve(result);
                },
                fail: (result) => {
                    console.error("分包加载失败分包名字 -->> ", params.pkgName);
                    reject(result);
                }
            });
            if (loadTask) {
                if (params.progressHandler) {
                    loadTask.onProgressUpdate((result) => {
                        progressHandler.runWith(result.progress);
                    });
                }
            } else {
                reject();
            }
        });
    }
    /**网络请求 */
    platform.request = function _async(params) {
        if (params.url == null || params.url.length <= 0) {
            zs.log.warn('方法（ request ）缺少必要参数（ url ）', 'Platform');
            return;
        }
        if (params.data == null) {
            zs.log.warn('方法（ request ）缺少必要参数（ data ）', 'Platform');
            return;
        }
        if (params.method == null) {
            zs.log.warn('方法（ request ）缺少必要参数（ method ）', 'Platform');
            return;
        }
        return new Promise((resolve, reject) => {
            qg.request({
                url: url,
                data: data,
                header: { 'content-type': 'application/json' },
                method: method,
                dataType: null,
                responseType: null,
                success: (result) => {
                    resolve(result);
                },
                fail: () => {
                    reject();
                },
                complete: () => { }
            });
        });
    }
    //#endregion

    //#region 激励视频模块
    platform.createVideoAdNum = 0;
    platform.videoReady = false;
    platform.videoRequirePlay = false;
    platform.initVideo = function (params) {
        if (params.id == null || params.id.length <= 0) {
            zs.log.warn('方法（ initVideo ）缺少必要参数（ id ）', 'Platform');
            platform.videoAd = null;
            return;
        }
        platform.videoId = params.id;
        platform.videoAd = qg.createRewardedVideoAd({ adUnitId: params.id });
        if (platform.videoAd == null) {
            if (platform.createVideoAdNum > 3) {
                return;
            }
            zs.log.warn("初始化视频失败，重新初始化:" + platform.createVideoAdNum);
            platform.initVideo(params);
        }
        platform.videoReady = false;
        platform.videoRequirePlay = false;
        //加载视频
        platform.videoAd.load();
        platform.videoAd.onLoad(function () {
            zs.log.warn("激励视频加载成功");
            platform.videoReady = true;
            if (platform.videoRequirePlay) {
                platform.videoAd.show();
                platform.videoRequirePlay = false;
            }
        });
        if (platform.videoAd) {
            platform.videoAd.onError(platform.onVideoErrorHandler);
            platform.videoAd.onClose(platform.onVideoCloseHandler);
        }
    }
    platform.playVideo = function _async() {
        return new Promise((resolve, reject) => {
            if (platform.videoAd == null) { return reject(null); }
            platform.videoCloseHandler = (result) => {
                resolve(result);
            };
            platform.videoErrorHandler = (error) => {
                reject(error);
            };
            if (platform.videoReady) {
                platform.videoAd.show();
            } else {
                platform.videoRequirePlay = true;
            }
        })
    }
    platform.isVideoEnable = function () {
        return platform.videoAd != null;
    }
    platform.onVideoErrorHandler = function (error) {
        platform.videoAd = null;
        platform.videoErrorHandler && platform.videoErrorHandler(error);
    }
    platform.onVideoCloseHandler = function (result) {
        platform.videoReady = false;
        platform.videoAd.load();

        if ((result && result.isEnded) || result == undefined) {
            console.log('激励视频广告完成，发放奖励:' + Date.now());
            platform.videoCloseHandler && platform.videoCloseHandler(true);
        } else {
            console.log('激励视频广告完成，发放奖励:' + Date.now());
            platform.videoCloseHandler && platform.videoCloseHandler(false);
        }
    }
    //#endregion

    //#region 插屏模块
    platform.insertId = null;
    platform.initInsert = function (params) {
    }
    platform.loadInsert = function (params) {
    }
    //#endregion

    //#region banner 的初始化和展示
    platform.createBannerNum = 0;
    platform.bannerErrorHandler = null;
    platform.bannerAd = null;
    platform.createBanner = function (params) {
        if (params.id == null || params.id.length <= 0) {
            zs.log.warn('方法（ initBanner ）缺少必要参数（ id ）', 'Platform');
            return;
        }
        if (params && params.onError) {
            platform.bannerErrorHandler = params.onError;
        }
        console.log("初始化banner:" + params.id);
        platform.bannerId = params.id;
        platform.createBannerNum += 1;
        let sysInfo = platform.systemInfo;

        if (sysInfo.platformVersionCode >= 1051) {
            platform.bannerAd = qg.createBannerAd({
                adUnitId: platform.bannerId,
            });
        } else {
            return;
        }
        if (platform.bannerAd == null) {
            console.log("banner create fail");
            if (platform.createBannerNum > 3) {
                return;
            }
            platform.initBannerAD(platform.bannerId, { id: params.id, onError: platform.bannerErrorHandler });
        }
        console.log("banner create success");
        platform.bannerAd.onError(function (err) {
            console.error("bannerAd error:", err);
            if (platform.bannerErrorHandler) {
                platform.bannerErrorHandler.run();
            }
            if (!platform.bannerAd) {
                console.warn("bannerAd lose");
            }
        });
    }
    platform.initBanner = function (params) {
        platform.initBannerId(zs.product.get("zs_banner_adunit"), zs.product.get("zs_banner_adunit2"), zs.product.get("zs_banner_refresh_time"));
        platform.initNativeAd(zs.product.get("zs_native_adunit"), zs.product.get("zs_native_adunit2"));
    }
    platform.showBanner = function (params) {
        if (!params || params.onError == null) {
            zs.log.warn('方法（ showBanner ）缺少必要参数（ onError ）', 'Platform');
        }
        if (platform.bannerId == null) { return; }
        if (platform.bannerAd == null) {
            let onError = null;
            if (params && params.onError) {
                onError = params.onError;
            }
            platform.initBanner({ id: platform.bannerId, onError: onError });
        }
        zs.log.debug("bannerAd show");
        platform.bannerAd.show();
    }

    platform.hideBanner = function () {
        zs.log.debug('bannerAd hide"');
        platform.bannerAd && platform.bannerAd.hide();
    }
    //#endregion

    //#region 原生广告
    platform.nativeAd = null;
    platform.onNativeErrorHandler = function (error) {
        console.warn("原生广告失败", JSON.stringify(error));
        platform.nativeAdErrorHandler && platform.nativeAdErrorHandler(error);
    }
    platform.onNativeLoadedHandler = function (data) {
        console.warn("原生广告加载成功", data);
        platform.nativeAdLoadedHandler && platform.nativeAdLoadedHandler(data);
    }
    /**初始化原生 */
    platform.initNativeAd = function (params) {
        if (params.id == null || params.id.length < 0) {
            return;
        }
        if (platform.nativeAd) {
            platform.nativeAd.destroy();
        }
        console.log("原生广告:" + params.id);
        platform.nativeAd = qg.createNativeAd({
            posId: params.id
        });
        if (platform.nativeAd == null) {
            console.warn("没有创建成功");
            return;
        }
        platform.nativeAd.onError(platform.onNativeErrorHandler);
        platform.nativeAd.onLoad(platform.onNativeLoadedHandler);
    }
    /**加载原生 返回对应的参数 */
    platform.loadNativeAd = function _async() {
        return new Promise((resolve, reject) => {
            if (platform.nativeAd == null) {
                console.log("原生广告失败");
                if (reject) {
                    reject();
                }
                return;
            }
            platform.nativeAdErrorHandler = (error) => {
                reject(error);
            }
            platform.nativeAdLoadedHandler = (data) => {
                resolve(data);
            }
            platform.nativeAd.load();
            console.log("loadAd");
        })
    }
    /** 上报原生显示*/
    platform.reportNativeAdShow = function (adId) {
        if (platform.nativeAd) {
            platform.nativeAd.reportAdShow({
                adId: adId
            });
            console.log("report VIVO NativeAd Show:" + Date.now());
        }
    }
    /** 上报原生点击 */
    platform.reportNativeAdClick = function (adId) {
        if (platform.nativeAd) {
            platform.nativeAd.reportAdClick({
                adId: adId
            });
            console.log("report VIVO NativeAd Click:" + Date.now());
        }
    }
    //#endregion

    //#region 桌面图标
    platform.hasDesktopIcon = function _async() {
        //判断是否有桌面图标
        return new Promise((resolve, reject) => {
            qg.hasShortcutInstalled({
                success: function (res) {
                    // var data = JSON.stringify(res);
                    resolve(res);
                },
                fail: function (err) {
                    console.log("request desktop icon error:" + JSON.stringify(err));
                    reject("request desktop icon error:" + JSON.stringify(err));
                }
            });
        })
    }
    //创建桌面图标
    platform.createDesktopIcon = function _async() {
        return new Promise((resolve, reject) => {
            qg.installShortcut({
                success: function (res) {
                    // var data = JSON.stringify(res);
                    console.log("create DesktopIcon success:", res);
                    resolve();
                },
                fail: function (err) {
                    console.log("create desktop icon fail", err);
                    reject();
                },
                complete: function () {
                    console.log("create desktop icon complete");
                }
            });
        })
    }
    //#endregion

    //#region 互推盒子模块
    platform.gamePortalAdId = null;
    platform.gamePortalAd = null;
    platform.gamePortalAdShowTime = 0;
    platform.initGamePortalAd = function (adUnitId) {
        if (adUnitId == null || adUnitId == "") {
            console.log('互推盒子九宫格广告id为空');
            return;
        }
        platform.gamePortalAdId = adUnitId;
        if (qg.getSystemInfoSync().platformVersionCode >= 1076) {
            console.log("初始化互推盒子");
            platform.gamePortalAd = qg.createGamePortalAd({
                adUnitId: adUnitId
            });
            platform.gamePortalAd.onError(function (err) {
                console.log("互推盒子九宫格广告出错", JSON.stringify(err));
            });
        } else {
            console.log('快应用平台版本号低于1076，暂不支持互推盒子相关 API');
        }
    }
    platform.showGamePortalAd = function _async() {
        return new Promise((resolve, reject) => {
            if (platform.gamePortalAd) {
                if (platform.gamePortalAdShowTime > 0 && Date.now() - platform.gamePortalAdShowTime < 5000) {
                    reject();
                    return;
                }
                platform.gamePortalAd.load();
                platform.gamePortalAd.onLoad(platform.gamePortalAd.show().then(() => {
                    console.log("显示互推盒子九宫格广告成功");
                    platform.gamePortalAdShowTime = Date.now();
                    resolve();
                }).catch((error) => {
                    console.log('显示互推盒子九宫格广告fail:' + error.errCode + ',' + error.errMsg)
                    reject();
                }));
            } else {
                reject();
            }
        })

    }
    //#endregion

    //#region 设备信息
    platform.statusBarHeight = function () {
        return platform.systemInfo ? platform.systemInfo.statusBarHeight : 0;
    }

    platform.screenWidth = function () {
        return platform.systemInfo ? platform.systemInfo.screenWidth : 1;
    }

    platform.screenHeight = function () {
        return platform.systemInfo ? platform.systemInfo.screenHeight : 1;
    }

    platform.vibrate = function (params) {
        if (params.isLong) {
            qg.vibrateLong({
                fail: () => {
                    zs.log.debug("Vibrate Long failed");
                }
            });
        } else {
            qg.vibrateShort({
                fail: () => {
                    zs.log.debug("vibrate Short failed");
                }
            });
        }
    }
    platform.isNetValid = function () {
        return true;
    }
    platform.addEventShow = function (params) {
        qg.onShow((result) => {
            params.showHandler && params.showHandler(result);
        });
    }
    platform.addEventHide = function (params) {
        qg.onHide((result) => {
            params.hideHandler && params.hideHandler(result);
        });
    }
    //#endregion

    //#region 原生上报点击模块
    platform.zs_ad_report_status = {};
    platform.zs_native_lsat_showTime = 0;
    /** 发送请求广告是否显示 */
    platform.sendReqAdShowReport = function (adIcon, adId) {
        if (!adId) {
            zs.log.warn('sendReqAdShowReport adid is null');
            return;
        }
        if (!adIcon) {
            console.error("return adicon is null");
            return
        }
        platform.reportNativeAdShow(adId);
        if (adIcon) {
            platform.requestNativeAdReport({ "adunit": adIcon, "type": "display" }).then((data) => {
                var adStatus = data.ad_status == "0";
                if (platform.zs_ad_report_status[data.adunit] && adStatus == false) {
                    return;
                }
                console.log("原生广告上报返回id:" + data.adunit + " adStatus:" + adStatus);
                platform.zs_ad_report_status[data.adunit] = adStatus;
            })
        }
    }
    /**发送请求点击报告 */
    platform.sendReqAdClickReport = function (adIcon, adId) {
        if (!adId) {
            zs.log.warn('sendReqAdClickReport adid is null');
            return;
        }
        if (!adIcon) {
            console.error("return adicon is null");
            return
        }
        if (adIcon == undefined || platform.zs_ad_report_status[adIcon] == undefined || platform.zs_ad_report_status[adIcon]) {
            platform.reportNativeAdClick(adId);
            if (adIcon) {
                platform.requestNativeAdReport({ "adunit": adIcon, "type": "click" }).then((data) => {
                    var adStatus = data.ad_status == "0";
                    console.log("原生广告上报返回id:" + data.adunit + " adStatus:" + adStatus);
                    platform.zs_ad_report_status[data.adunit] = adStatus;
                });
            }
        }
        else {
            console.warn("不是空")
        }
    }
    /**请求原生上报 */
    platform.requestNativeAdReport = function (args) {
        return new Promise((resolve, reject) => {
            if (!args["adunit"] || !args["type"]) {
                console.error("request report ad click error!");
                return;
            }
            var url = "https://platform.qwpo2018.com/api/ad_cache/index";
            zs.network.nativeRequest(url, args, 'POST', true)
                .then((result) => {
                    console.error('result ----->>> ', result)
                    resolve(result.data);
                })
                .catch((e) => {
                    console.warn("请求原生 上报失败", e);
                })
        })
    }
    /**获取广告状态 */
    platform.getAdReporteStatus = function _async(adId) {
        return new Promise((resolve, reject) => {
            console.warn("广告id:" + adId + " 是否显示广告：" + platform.zs_ad_report_status[adId]);
            if (platform.zs_ad_report_status[adId] == undefined || platform.zs_ad_report_status[adId]) {
                resolve();
            } else {
                reject();
            }
        })
    }
    /**获取游戏次数 */
    platform.getGameNum = function () {
        let zs_native_adunit = zs.product.get('zs_native_adunit');
        var clickTimestamp = Laya.LocalStorage.getItem(zs_native_adunit + "game_num_time_stamp");
        if (clickTimestamp == null || clickTimestamp == "" || platform.isToday(Number(clickTimestamp)) == false) {
            Laya.LocalStorage.setItem(zs_native_adunit + "game_num", "0");
            return 0;
        }
        var strNum = Laya.LocalStorage.getItem(zs_native_adunit + "game_num");
        var numVal = strNum == null || strNum == "" ? 0 : Number(strNum);
        return numVal;
    }
    platform.updateReviveTypeInfo = function (type) {
        Laya.LocalStorage.setItem(type + "_time_stamp", Date.now().toString());
        var strNum = Laya.LocalStorage.getItem(type);
        var numVal = strNum == null || strNum == "" ? 0 : Number(strNum);
        numVal++;
        Laya.LocalStorage.setItem(type, numVal.toString());
    }
    platform.setNativeLastShowTime = function (time) {
        platform.zs_native_lsat_showTime = time;
    }
    /** */
    platform.isVivoShowAd = function () {
        var showAd = true;
        let zs_native_limit_10 = zs.product.get('zs_native_limit_10');
        if (zs_native_limit_10) {
            var now = Laya.Browser.now();
            var gapTime = now - platform.zs_native_lsat_showTime;
            showAd = gapTime >= 10000;
        }
        console.log("========== zs_native_limit_10:" + zs_native_limit_10 + "      gapTime:" + gapTime);
        return showAd;
    }
    /**是否在游戏之前展示 */
    platform.isBeforeGameAccount = function _async() {
        return new Promise((resolve, reject) => {
            var gameNum = platform.getGameNum();
            console.error(platform.isShowNativeAd(gameNum), platform.isVivoShowAd());
            if (platform.isShowNativeAd(gameNum) && platform.isVivoShowAd()) {
                resolve();
            } else {
                reject();
            }
        });
    }
    /**控制是否原生展示 */
    platform.isShowNativeAd = function (gameNum) {
        let zs_native_end_before_num = zs.product.get('zs_native_end_before_num');
        let zs_native_adunit = zs.product.get('zs_native_adunit');
        if (platform.IsNumber(zs_native_end_before_num)) {
            //如果是-1则是无限制
            if (zs_native_end_before_num == -1) return true;
            var open_native_num = platform.getNativeOpenNum();
            console.log("----原生广告打开次数：" + open_native_num);
            if (Number(zs_native_end_before_num) > Number(open_native_num)) return true;
        }
        if (zs_native_end_before_num && zs_native_end_before_num.length > 0) {

            var tempStr = zs_native_end_before_num.slice(1, zs_native_end_before_num.length - 1);
            var tempArr = tempStr.split(",");
            if (tempArr.length == 1 && tempArr[0] == -1)
                return true;

            var index = tempArr.indexOf(gameNum + "");
            if (index != -1) {
                console.log("----游戏次数：" + gameNum);
                return true;
            }
            platform.updateReviveTypeInfo(zs_native_adunit + "game_num");
        }
        return false;
    }
    /**获取原生打开次数 */
    platform.getNativeOpenNum = function () {
        let zs_native_adunit = zs.product.get('zs_native_adunit');
        var clickTimestamp = Laya.LocalStorage.getItem(zs_native_adunit + "open_native_num_time_stamp");
        if (clickTimestamp == null || clickTimestamp == "" || platform.isToday(Number(clickTimestamp)) == false) {
            Laya.LocalStorage.setItem(zs_native_adunit + "open_native_num", "0");
            return 0;
        }
        var strNum = Laya.LocalStorage.getItem(zs_native_adunit + "open_native_num");
        var numVal = strNum == null || strNum == "" ? 0 : Number(strNum);
        return numVal;
    }
    /**是否是数字 */
    platform.IsNumber = function (val) {
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if (regPos.test(val) || regNeg.test(val)) {
            return true;
        } else {
            return false;
        }
    }
    /**是否是今天 */
    platform.isToday = function (date) {
        var now = new Date(Date.now());
        var target = new Date(date);
        if (now.getFullYear() != target.getFullYear() || now.getMonth() != target.getMonth() || now.getDate() != target.getDate()) {
            return false;
        }
        else {
            return true;
        }
    }
    //#endregion

    /**原生平台提示弹窗 */
    platform.showToast = function (value, duration = 2000) {
        qg.showToast({
            title: value,
            icon: 'success',
            duration: 2000
        })
    }

    return platform;
})()