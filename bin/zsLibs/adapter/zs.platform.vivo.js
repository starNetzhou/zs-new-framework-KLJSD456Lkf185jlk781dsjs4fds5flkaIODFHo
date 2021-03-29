window.platform = (function () {
    function platform() { };
    platform.systemInfo = null;

    //#region 初始化和登录 必须保留的几个方法
    platform.init = function () {
        console.log("platform.init");
        platform.systemInfo = qg.getSystemInfoSync();
        qg.onError(function (data) {
            console.error(`vivo error message is ${data.message}`);
        });
        //-----------------------------------------------------
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
                        code: result.code,
                        is_old: 0
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
                    console.error("分包加载失败分包名字 -->> ", params.pkgName, result);
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
        platform.videoAd = qg.createRewardedVideoAd({ adUnitId: params.id, style: {} });
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
                platform.videoAd.load().catch(function () { platform.videoRequirePlay = false; })
            }
        })
    }
    platform.isVideoEnable = function () {
        return platform.videoAd != null;
    }
    platform.onVideoErrorHandler = function (error) {
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
    platform.insertAd = null;
    platform.insertAdUnitId = null;
    platform.initInsert = function (params) {
        if (params && params.insertAdUnitId) {
            platform.insertAdUnitId = params.insertAdUnitId;
        }
    }
    platform.loadInsert = function (params) {
        if (platform.insertAdUnitId == null || platform.insertAdUnitId == "" || !qg || !qg.createInterstitialAd) {
            return;
        }
        platform.insertAd = qg.createInterstitialAd({
            posId: platform.insertAdUnitId,
            style: {}
        })
        if (platform.insertAd == null) {
            return;
        }
        platform.insertAd.onLoad(() => {
            params && params.loadFunc && params.loadFunc();
        });
        platform.insertAd.onError(err => {
            console.log("插屏广告错误事件", err.errMsg, err.errCode);
            platform.insertAd = null;
            params && params.errFunc && params.errFunc();
        })
    }
    platform.showInsertAd = function (params) {
        if (platform.insertAd == null) {
            platform.loadInsert({
                loadFunc: function () {
                    platform.showInsertAd();
                }
            })
            return;
        }
        platform.insertAd.onClose(() => {
            platform.insertAd = null;
            params && params.closeFunc && params.closeFunc();
        })
        platform.insertAd.show();
    }
    //#endregion

    //#region banner 的初始化和展示
    platform.createBannerNum = 0;
    platform.bannerErrorHandler = null;
    platform.bannerAd = null;
    platform.bannerAdUnitArr = [];
    platform.bannerLiveTime = 10000;
    platform.bannerLastShowTime = 0;
    platform.initBanner = function (params) {
        platform.initBannerId(zs.product.get("zs_banner_adunit"), zs.product.get("zs_banner_adunit2"), zs.product.get("zs_banner_refresh_time"));
        platform.initNativeAd(zs.product.get("zs_native_adunit"), zs.product.get("zs_native_adunit2"));
    }
    platform.initBannerId = function (bannerAdUnit, bannerAdUnit2, bannerLiveTime) {
        bannerAdUnit && platform.bannerAdUnitArr.push(bannerAdUnit);
        bannerAdUnit2 && platform.bannerAdUnitArr.push(bannerAdUnit2);
        platform.bannerLiveTime = bannerLiveTime;
        platform.bannerLastShowTime = 0;
    }

    platform.showBanner = function (params) {
        if (!platform.bannerAdUnitArr) {
            zs.log.debug("🐢 咋回事！！");
            return;
        }
        if (platform.bannerAdUnitArr.length == 0) {
            zs.log.debug("bannerID未配置");
            return;
        }

        if (platform.bannerLastShowTime > 0 && Date.now() - platform.bannerLastShowTime < platform.bannerLiveTime) {
            return;
        }

        if (platform.bannerAd) {
            platform.bannerAd.destroy();
            platform.bannerAd = null;
        }
        var adUnit = platform.bannerAdUnitArr[Math.floor(Math.random() * platform.bannerAdUnitArr.length)];
        console.log("显示banner", adUnit);
        platform.bannerAd = qg.createBannerAd({
            posId: adUnit,
            style: {}
        });
        platform.bannerLastShowTime = Date.now();

        if (platform.bannerAd == null) {
            zs.log.debug("🐢 咋回事！！");
            return;
        }

        platform.bannerAd.onError((err) => {
            console.log("banner广告展示失败onError", JSON.stringify(err));
        })

        platform.bannerAd.show().then(() => {
            console.log("banner显示成功");
        });
    }

    platform.hideBanner = function () {
        zs.log.debug('bannerAd hide"');
        platform.bannerAd && platform.bannerAd.hide();
    }
    //#endregion

    //#region 原生广告
    platform.nativeAd = null;
    platform.nativeAdUnitIdArr = [];
    platform.nativeCurrentAdList = null;
    platform.loadErrorNum = 0;
    platform.nativeLastLoadTime = 0;
    platform.nativeLoadInterval = 10000;
    platform.onNativeErrorHandler = function (error) {
        console.warn("原生广告失败", JSON.stringify(error));
        platform.nativeAdErrorHandler && platform.nativeAdErrorHandler(error);
    }
    platform.onNativeLoadedHandler = function (data) {
        console.warn("原生广告加载成功", data);
        platform.nativeAdLoadedHandler && platform.nativeAdLoadedHandler(data);
    }
    /**初始化原生 */
    platform.initNativeAd = function (adUnitId1, adUnitId2) {
        adUnitId1 && platform.nativeAdUnitIdArr.push(adUnitId1);
        adUnitId2 && platform.nativeAdUnitIdArr.push(adUnitId2);
        platform.nativeLastLoadTime = 0;
    }
    /**加载原生 返回对应的参数 */
    platform.loadNativeAd = function _async() {
        return new Promise((resolve, reject) => {
            if (platform.nativeAdUnitIdArr.length == 0) {
                zs.log.debug("原生广告ID未配置");
                return;
            }
            if (platform.nativeLastLoadTime > 0 && Date.now() - platform.nativeLastLoadTime < platform.nativeLoadInterval) {
                console.log('原生广告加载冷却中');
                reject();
                return;
            }
            if (platform.nativeAd) {
                // platform.nativeAd.destroy();
                platform.nativeAd = null;
            }
            var adUnit = platform.nativeAdUnitIdArr[Math.floor(Math.random() * platform.nativeAdUnitIdArr.length)];
            platform.nativeAd = qg.createNativeAd({
                posId: adUnit,
            });
            if (platform.nativeAd == null) {
                console.log("原生广告失败");
                if (reject) {
                    reject();
                }
                return;
            }
            platform.nativeAd.onLoad((data) => {
                console.log("原生加载成功" + JSON.stringify(data));
                resolve(data);
            })
            platform.nativeAd.onError((error) => {
                console.log("原生加载失败" + adUnit);
                reject(error);
            })
            platform.nativeAd.load();
            platform.nativeLastLoadTime = Date.now();
            setTimeout(() => {
                platform.nativeLastLoadTime = 0;
            }, platform.nativeLoadInterval);
            console.log("原生加载loadAd");
        })
    }
    /** 上报原生显示*/
    platform.sendReqAdShowReport = function (adUnit, adId) {
        if (platform.nativeAd) {
            platform.nativeAd.reportAdShow({
                adId: adId
            });
            console.log(adUnit + "report Vivo NativeAd Show:" + Date.now());
        }
    }
    /** 上报原生点击 */
    platform.sendReqAdClickReport = function (adUnit, adId) {
        if (platform.nativeAd) {
            platform.nativeAd.reportAdClick({
                adId: adId
            });
            console.log(adUnit + "report Vivo NativeAd Click:" + Date.now());
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
    platform.getNetworkType = function _async() {
        return new Promise((resolve, reject) => {
            qg.getNetworkType({
                success: function (data) {
                    console.log(`handling success: ${data.type}`)
                    if (data.type == "none") {
                        qg.showDialog({
                            title: '提示',
                            message: '当前网络不可用，请检查是否连接网络',
                            buttons: [
                                {
                                    text: '退出游戏',
                                    color: '#33dd44'
                                }
                            ],
                            success: function (data) {
                                console.log('handling callback')
                                qg.exitApplication();
                            },
                            cancel: function () {
                                qg.exitApplication();
                            },
                            fail: function (data, code) {
                                qg.exitApplication();
                            }
                        })
                    } else {
                        resolve();
                    }
                }
            })
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

    platform.showToast = function (value, duration = 2000) {
        qg.showToast({
            title: value,
            icon: 'success',
            duration: duration
        })
    }
    console.log(platform.loadSubpackage);
    return platform;
})()