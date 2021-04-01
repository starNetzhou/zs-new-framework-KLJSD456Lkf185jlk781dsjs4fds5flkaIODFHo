window.platform = (function () {
    function platform() { };
    platform.loginCount = 0;
    platform.launchOptions = null;
    platform.systemInfo = null;
    platform.delayBanner = null;

    platform.init = function () {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ["shareAppMessage", "shareTimeline"]
        })
        platform.systemInfo = wx.getSystemInfoSync();
        if (typeof wx.getUpdateManager === 'function') { // 请在使用前先判断是否支持
            var updateManager = wx.getUpdateManager();
            updateManager.onCheckForUpdate((res) => {
                zs.log.debug("微信系统更新检测" + (res.hasUpdate ? "成功" : "失败"), "Platform");
            })
            updateManager.onUpdateReady(() => {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate();
            })
        }
        console.log("微信平台初始化...");
    }

    platform.initAds() = function () {
        platform.initBanner();
        platform.initVideo({ id: zs.product.get("zs_video_adunit") });
    }

    platform.login = function _async() {
        return new Promise((resolve, reject) => {
            wx.login({
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

    platform.getLaunchOptions = function () {
        if (!platform.launchOptions) {
            platform.launchOptions = wx.getLaunchOptionsSync();
        }
        return platform.launchOptions;
    }

    platform.getScene = function () {
        if (!platform.launchOptions) {
            platform.launchOptions = wx.getLaunchOptionsSync();
        }
        if (!platform.launchOptions) { return null; }

        if (!platform.launchOptions.scene) { return null; }

        return platform.launchOptions.scene.toString();
    }

    platform.getLoginParams = function _async() {
        return new Promise((resolve, reject) => {
            wx.login({
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

    platform.share = function (params) {
        if (params.title == null) {
            zs.log.warn('方法（ share ）缺少必要参数（ title ）', 'Platform');
            return;
        }
        if (params.imgUrl == null) {
            zs.log.warn('方法（ share ）缺少必要参数（ imgUrl ）', 'Platform');
            return;
        }
        wx.shareAppMessage({
            title: params.title,
            imageUrl: params.imgUrl
        });
    }

    platform.setDefaultShare = function (params) {
        if (params.title == null) {
            zs.log.warn('方法（ share ）缺少必要参数（ title ）', 'Platform');
            return;
        }
        if (params.imgUrl == null) {
            zs.log.warn('方法（ share ）缺少必要参数（ imgUrl ）', 'Platform');
            return;
        }
        var shareInfo = {
            title: params.title,
            imageUrl: params.imgUrl
        }
        wx.onShareAppMessage(() => shareInfo)
    }

    platform.setCloudStorage = function _async(params) {
        return new Promise((resolve, reject) => {
            if (params.kvPair == null) {
                zs.log.warn('方法（ setCloudStorage ）缺少必要参数（ kvPair ）', 'Platform');
                return reject();
            }
            wx.setUserCloudStorage({
                KVDataList: params.kvPair,
                success: (result) => {
                    zs.log.debug('setCloudStorage success: ' + JSON.stringify(result), 'Platform');
                    resolve(result);
                },
                fail: (result) => {
                    zs.log.debug('setCloudStorage fail: ' + JSON.stringify(result), 'Platform');
                    reject(result);
                },
                complete: (result) => {
                }
            });
        });
    }

    platform.getCloudStorage = function _async(params) {
        return new Promise((resolve, reject) => {
            if (true) {
                zs.log.warn('该接口只可在开放数据域下使用,直接调用无效')
                return reject();
            }
            if (params.keyList == null) {
                zs.log.warn('方法（ getCloudStorage ）缺少必要参数（ keyList ）', 'Platform');
                return reject();
            }
            wx.getUserCloudStorage({
                keyList: params.keyList,
                success: (result) => {
                    zs.log.debug('getCloudStorage success: ' + JSON.stringify(e), 'Platform');
                    resolve(result);
                },
                fail: (result) => {
                    zs.log.debug('getCloudStorage fail: ' + JSON.stringify(e), 'Platform');
                    reject(result);
                },
                complete: (result) => {
                }
            })
        })
    }

    platform.userInfoCreate = function _async(params) {
        return new Promise((resolve, reject) => {
            if (params.rect == null) {
                zs.log.warn('方法（ userInfoCreate ）缺少必要参数（ rect ）', 'Platform');
                return reject();
            }
            let systemInfo = platform.systemInfo;
            let rect = params.rect;
            platform.userInfoButton = wx.createUserInfoButton({
                type: 'image',
                text: '',
                image: params.image,
                style: {
                    left: systemInfo.windowWidth * rect.x,
                    top: systemInfo.windowHeight * rect.y,
                    width: systemInfo.windowWidth * rect.width,
                    height: systemInfo.windowHeight * rect.height,
                    opacity: 1
                }
            });
            platform.userInfoButton.onTap((result) => {
                resolve(result);
            });
        });
    }

    platform.userInfoHide = function () {
        platform.userInfoButton && platform.userInfoButton.hide();
    }

    platform.userInfoShow = function () {
        platform.userInfoButton && platform.userInfoButton.show();
    }

    platform.userInfoDestroy = function () {
        platform.userInfoButton && platform.userInfoButton.destroy();
        platform.userInfoButton = null;
    }

    platform.loadSubpackage = function _async(params) {
        return new Promise((resolve, reject) => {
            if (params.pkgName == null) {
                zs.log.warn('方法（ loadSubpackage ）缺少必要参数（ pkgName ）', 'Platform');
                return reject();
            }
            let loadTask = wx.loadSubpackage({
                name: params.pkgName,
                success: (result) => {
                    resolve(result);
                },
                fail: (result) => {
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

    platform.onVideoErrorHandler = function (error) {
        platform.videoAd = null;
        platform.videoErrorHandler && platform.videoErrorHandler(error);
    }

    platform.onVideoCloseHandler = function (result) {
        if ((result && result.isEnded) || result == undefined) {
            platform.videoCloseHandler && platform.videoCloseHandler(true);
        } else {
            platform.videoCloseHandler && platform.videoCloseHandler(false);
        }
    }

    platform.initVideo = function (params) {
        if (params.id == null || params.id.length <= 0) {
            zs.log.warn('方法（ initVideo ）缺少必要参数（ id ）', 'Platform');
            platform.videoAd = null;
            return;
        }
        platform.videoId = params.id;
        platform.videoAd = wx.createRewardedVideoAd({ adUnitId: params.id });
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
            platform.videoAd.show().catch((error) => {
                platform.videoAd.load().then(() => {
                    platform.videoAd.show();
                })
            });
        })
    }

    platform.isVideoEnable = function () {
        return platform.videoAd != null;
    }

    platform.initInsert = function (params) {
        if (params.id == null || params.id.length <= 0) {
            zs.log.warn('方法（ initInsert ）缺少必要参数（ id ）', 'Platform');
            platform.insertId = null;
            return;
        }
        platform.insertId = params.id;
        platform.insertAd = wx.createInterstitialAd({ adUnitId: params.id });
        if (platform.insertAd) {
            platform.insertAd.onError((error) => {
                platform.insertAd = null;
                platform.insertErrorHandler && platform.insertErrorHandler(error);
            });
            platform.insertAd.onClose(() => {
                platform.insertCloseHandler && platform.insertCloseHandler();
            });
        }
    }

    platform.loadInsert = function (params) {
        if (params.closeHandler == null) {
            zs.log.warn('方法（ loadInsert ）缺少必要参数（ closeHandler ）', 'Platform');
            return;
        }
        if (params.errorHandler == null) {
            zs.log.warn('方法（ loadInsert ）缺少必要参数（ errorHandler ）', 'Platform');
            return;
        }
        if (platform.insertAd == null) {
            if (platform.insertId) {
                platform.initInsert({ id: platform.insertId });
            }
        }
        platform.insertCloseHandler = params.closeHandler;
        platform.insertErrorHandler = params.errorHandler;
        platform.insertAd.show().catch((error) => {
            platform.insertAd.load().then(() => {
                platform.insertAd.show();
            });
        });
    }

    platform.request = function _async(params) {
        if (params.url == null || params.url.length <= 0) {
            zs.log.warn('方法（ request ）缺少必要参数（ url ）', 'Platform');
            platform.bannerAd = null;
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
            wx.request({
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

    platform.initBanner = function () {
        zs.wx.banner.WxBannerMgr.Instance.setAdUnitId(zs.product.get("zs_banner_adunit"), zs.product.get("zs_banner_adunit2"), zs.product.get("zs_banner_adunit3"));
    }

    platform.checkBanner = function (params) {
        if (params.data == null) {
            zs.log.warn('方法（ checkBanner ）缺少必要参数（ data ）', 'Platform');
            return;
        }

        let wxBannerMgr = zs.wx.banner.WxBannerMgr.Instance;
        wxBannerMgr.hideAll();
        let data = params.data;
        if (data && data.banner) {
            let config = data.banner;
            let switchShow = true;
            if (config.switch) {
                if (Array.isArray(config.switch)) {
                    for (let i = 0, n = config.switch.length; i < n; i++) {
                        if (!zs.product.get(config.switch[i])) {
                            switchShow = false;
                            break;
                        }
                    }
                } else if (!zs.product.get(config.switch)) {
                    switchShow = false;
                }
            }
            if (!switchShow) {
                wxBannerMgr.isWait = true;
                return;
            }
            wxBannerMgr.updateBanner(config.delay || !config.auto, config.left, config.bottom, config.length);
            if (config.delay && zs.product.get("zs_banner_banner_time")) {
                platform.delayBanner = setTimeout(function () { wxBannerMgr.showBanner(config.left, config.bottom, config.length) }, zs.product.get("zs_banner_banner_time"));
            }
        } else {
            wxBannerMgr.isWait = true;
        }
    }

    platform.clearDelayBanner = function () {
        platform.delayBanner && clearTimeout(platform.delayBanner);
        platform.delayBanner = null;
    }

    platform.showBanner = function (params) {
        if (params.onError == null) {
            zs.log.warn('方法（ showBanner ）缺少必要参数（ onError ）', 'Platform');
            return;
        }
        if (platform.bannerId == null) { return; }
        if (platform.bannerAd == null) {
            platform.initBanner(platform.bannerId, platform.keepTime || 1000, params.onError);
        }
        if (platform.bannerAd) {
            if (platform.bannerStyle) {
                platform.bannerAd.style.top = window.screen.availHeight - platform.bannerStyle.height - 3;
                platform.bannerAd.style.left = (window.screen.availWidth - platform.bannerStyle.width) * 0.5;
            }
            platform.bannerAd.show();
        }
    }

    platform.updateBanner = function (params) {
        zs.wx.banner.WxBannerMgr.Instance.updateBanner(params.isWait, params.left, params.bottom, params.length);
    }

    platform.hideBanner = function () {
        let wxBannerMgr = zs.wx.banner.WxBannerMgr.Instance;
        wxBannerMgr.hideAll();
    }

    platform.updateBannerPos = function (params) {
        zs.wx.banner.WxBannerMgr.Instance.updatePosition(params.toTouch);
        return true;
    }

    platform.navigateToOther = function _async(params) {
        return new Promise((resolve, reject) => {
            if (params.appInfo == null) {
                zs.log.warn('方法（ navigateToOther ）缺少必要参数（ appInfo ）', 'Platform');
                reject();
            }
            var appInfo = params.appInfo;
            wx.navigateToMiniProgram({
                appId: appInfo.appid,
                path: appInfo.link_path,
                extraData: appInfo.extraData,
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

    platform.recorderStart = function () {
        if (typeof wx.getGameRecorder === 'function') {
            const recorder = wx.getGameRecorder();
            let canRecorder = recorder.isFrameSupported();
            zs.log.debug('是否支持录制游戏画面', canRecorder);
            if (canRecorder) {
                if (!platform.initRecorder) {
                    platform.initRecorder = true;
                    recorder.on('start', () => {
                        platform.recoding = true;
                        platform.recorderTime = Date.now();
                    });
                    recorder.on('stop', (result) => {
                        platform.recoding = false;
                        platform.recorderTime = Date.now() - platform.recorderTime;
                    });
                }
                recorder.start();
            }
        }
    }

    platform.recorderStop = function () {
        if (!wx || !platform.recoding) { reject(); }
        if (typeof wx.getGameRecorder === 'function') {
            const recorder = wx.getGameRecorder();
            recorder.stop();
        }
    }

    platform.recorderPause = function () {
        if (!wx || !platform.recoding) { reject(); }
        if (typeof wx.getGameRecorder === 'function') {
            const recorder = wx.getGameRecorder();
            recorder.pause();
        }
    }
    platform.recorderResume = function () {
        if (!wx || !platform.recoding) { reject(); }
        if (typeof wx.getGameRecorder === 'function') {
            const recorder = wx.getGameRecorder();
            recorder.resume();
        }
    }
    platform.recorderCreate = function (params) {
        if (params.data == null) {
            zs.log.warn('方法（ recorderCreate ）缺少必要参数（ data ）', 'Platform');
            return;
        }
        if (!wx || typeof wx.createGameRecorderShareButton !== 'function') {
            zs.load.warn('该设备不支持分享录屏功能');
            return;
        }
        platform.stopRecorder();
        let systemInfo = wx.getSystemInfoSync();
        let data = params.data;
        platform.shareRecorderButton = wx.createGameRecorderShareButton({
            style: {
                left: systemInfo.windowWidth * 0.5 - 65,
                top: systemInfo.windowHeight * (data.percentY || 0.7) - 20,
                height: 40
            },
            text: data.btnText || '分享录屏',
            share: {
                query: data.query || "",
                bgm: data.bgm || "",
                timeRange: [[0, 15000]],
                button: {
                    template: data.buttomType || "challenge"
                },
                title: {
                    template: data.titleType || "default.level",
                    data: data.score
                }
            }
        });
        platform.shareRecorderButton.show();
        platform.shareRecorderButton.onTap((result) => {
            data.successHandler && data.successHandler(result);
        });
    }

    platform.recorderHide = function () {
        platform.shareRecorderButton && platform.shareRecorderButton.hide();
    }

    platform.canShareRecorder = function () {
        return platform.recorderTime > 0;
    }

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
            wx.vibrateLong({
                fail: () => {
                    zs.log.debug("Vibrate Long failed");
                }
            });
        } else {
            wx.vibrateShort({
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
        wx.onShow((result) => {
            params.showHandler && params.showHandler(result);
        });
    }
    platform.addEventHide = function (params) {
        wx.onHide((result) => {
            params.hideHandler && params.hideHandler(result);
        });
    }
    return platform;
})()