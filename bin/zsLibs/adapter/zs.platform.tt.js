window.platform = (function () {
    function platform() { };
    platform.loginCount = 0;
    platform.systemInfo = null;

    platform.init = function () {
        tt.showShareMenu({
            withShareTicket: true
        });
        platform.systemInfo = tt.getSystemInfoSync();
        if (window.zsResUrl) {
            Laya.URL.basePath = window.zsResUrl;
            Laya.MiniAdpter.nativefiles = window.zsNativefiles;
        }
        if (Laya.MiniAdpter && Laya.MiniAdpter.getUrlEncode) {
            Laya.MiniAdpter.getUrlEncode = function (url, type) {
                if (url.indexOf(".fnt") != -1 || url.indexOf(".json") != -1) {
                    return "utf8";
                }
                else if (type == "arraybuffer") {
                    return "";
                }
                return "ascii";
            };
        }

        console.log("头条平台初始化...");
    }
    platform.initAds = function () {
        zs.platform.sync.initBanner();
        zs.platform.sync.initVideo({ id: zs.product.get("zs_video_adunit") });
    }

    platform.getLoginParams = function _async() {
        return new Promise((resolve, reject) => {
            tt.login({
                force: false,
                success: (result) => {
                    if (result.code || result.anonymousCode) {
                        resolve({
                            code: result.code,
                            anonymous_code: result.anonymousCode
                        });
                    }
                    else {
                        resolve({
                            uid: 1
                        });
                    }
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
        if (params.desc == null) {
            zs.log.warn('方法（ share ）缺少必要参数（ desc ）', 'Platform');
            return;
        }
        if (params.query == null) {
            zs.log.warn('方法（ share ）缺少必要参数（ query ）', 'Platform');
            return;
        }
        tt.shareAppMessage({
            title: params.title,
            imageUrl: params.imgUrl,
            desc: params.desc,
            query: params.query
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
        tt.onShareAppMessage(() => shareInfo)
    }


    platform.loadSubpackage = function _async(params) {
        return new Promise((resolve, reject) => {
            if (params.pkgName == null) {
                zs.log.warn('方法（ loadSubpackage ）缺少必要参数（ pkgName ）', 'Platform');
                return reject();
            }
            if (tt.loadSubpackage) {
                let loadTask = tt.loadSubpackage({
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
        if (!window.tt || typeof window.tt.createRewardedVideoAd != 'function') {
            return;
        }
        if (params.id == null || params.id.length <= 0) {
            zs.log.warn('方法（ initVideo ）缺少必要参数（ id ）', 'Platform');
            platform.videoAd = null;
            return;
        }
        platform.videoId = params.id;
        platform.videoAd = tt.createRewardedVideoAd({ adUnitId: params.id });
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
            tt.request({
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
        if (!window.tt || typeof window.tt.createBannerAd != 'function') {
            return;
        }
        platform.bannerId = zs.product.get("zs_banner_adunit");
        if (platform.bannerId.length <= 0 || platform.bannerId == null) {
            zs.log.warn('方法（ initBanner ）缺少必要参数（ id ）', 'Platform');
            platform.bannerAd = null;
            return;
        }
        platform.keepTime = 30;
        platform.bannerType = "normal";//默认banner类型
        let bannerAdScale = 0.7;
        let slideScale = (1 - bannerAdScale) * 0.5;
        let systemInfo = platform.systemInfo;
        platform.bannerAd = tt.createBannerAd({
            adUnitId: platform.bannerId,
            adIntervals: platform.keepTime,
            style: {
                left: systemInfo.windowWidth * slideScale,
                top: systemInfo.windowHeight - 100,
                width: systemInfo.windowWidth * bannerAdScale
            }
        });
        if (platform.bannerAd == null) { return; }
        platform.bannerAd.onResize((size) => {
            platform.bannerStyle = size;
            if (platform.bannerAd) {
                if (platform.bannerType == "pixel") {
                    var pixel = 1;
                    platform.bannerAd.style.top = window.screen.availHeight - pixel;
                    platform.bannerAd.style.left = pixel - platform.bannerStyle.width;
                } else {
                    platform.bannerAd.style.top = window.screen.availHeight - size.height - 3;
                    platform.bannerAd.style.left = (window.screen.availWidth - size.width) * 0.5;
                }
            }
        });
        platform.bannerAd.onError((error) => {
            platform.bannerAd = null;
        });
    }

    platform.showBanner = function () {
        platform.bannerType = "normal";
        if (platform.bannerId == null) { return; }
        if (platform.bannerAd == null) {
            platform.initBanner();
        }
        if (platform.bannerAd) {
            if (platform.bannerStyle) {
                platform.bannerAd.style.top = window.screen.availHeight - platform.bannerStyle.height - 3;
                platform.bannerAd.style.left = (window.screen.availWidth - platform.bannerStyle.width) * 0.5;
            }
            platform.bannerAd.show();
        }
    }

    /**显示单像素banner */
    platform.showOnePixelBanner = function () {
        platform.bannerType = "pixel";
        if (platform.bannerId == null) { return; }
        if (platform.bannerAd == null) {
            platform.initBanner();
        }
        if (platform.bannerAd) {
            if (platform.bannerStyle) {
                var pexel = 1;
                platform.bannerAd.style.top = window.screen.availHeight - pexel;
                platform.bannerAd.style.left = pexel - platform.bannerStyle.width;;
            }
            platform.bannerAd.show();
        }
    }

    platform.hideBanner = function () {
        platform.bannerAd && platform.bannerAd.hide();
    }


    platform.initInsert = function (params) {
        if (!window.tt || typeof window.tt.createInterstitialAd != 'function') {
            return;
        }
        if (params.id == null || params.id.length <= 0) {
            zs.log.warn('方法（ initInsert ）缺少必要参数（ id ）', 'Platform');
            platform.insertId = null;
            return;
        }
        platform.insertId = params.id;
        platform.insertAd = tt.createInterstitialAd({ adUnitId: params.id });
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


    /**
     * 开始录屏
     * @param {*} params 
     */
    platform.recorderStart = function (params) {
        params.maxTime = params.maxTime || 15;
        if (typeof window.tt.getGameRecorderManager === 'function') {
            const recorder = tt.getGameRecorderManager();
            platform.bHighLightRecorder = false
            recorder.onStart(() => {
                platform.recoding = true;
                platform.recorderTime = Date.now();
            });
            recorder.onStop((result) => {
                console.log("停止录屏回调", JSON.stringify(result));
                platform.recoding = false;
                platform.videoPath = result.videoPath;
                platform.recorderTime = Date.now() - platform.recorderTime;
                if (platform.bHighLightRecorder) {
                    zs.log.debug("有高光录屏");
                    recorder.clipVideo({
                        path: result.videoPath,
                        success(res) {
                            zs.log.debug("剪辑最后视频成功");
                            platform.videoPath = res.videoPath;
                        },
                        fail(e) {
                            zs.log.debug("剪辑视频失败");
                        }
                    })
                } else {
                    recorder.clipVideo({
                        path: result.videoPath,
                        timeRange: [15, 0], //剪辑最后15秒
                        success(res) {
                            console.log(`剪辑最后视频成功`)
                            platform.videoPath = res.videoPath;
                        },
                        fail(e) {
                            console.error("剪辑视频失败")
                        }
                    })
                }
            });

            recorder.start({
                duration: params.maxTime,
            });
        }
    }

    platform.recorderStop = function () {
        if (!window.tt || !platform.recoding) { return; }
        if (typeof window.tt.getGameRecorderManager === 'function') {
            const recorder = tt.getGameRecorderManager();
            recorder.stop();
            console.log("开始停止录屏");
        }
    }

    platform.recorderPause = function () {
        if (!window.tt || !platform.recoding) { return; }
        if (typeof window.tt.getGameRecorderManager === 'function') {
            const recorder = tt.getGameRecorderManager();
            recorder.pause();
        }
    }
    platform.recorderResume = function () {
        if (!window.tt || !platform.recoding) { return; }
        if (typeof window.tt.getGameRecorderManager === 'function') {
            const recorder = tt.getGameRecorderManager();
            recorder.resume();
        }
    }


    /**裁剪高光时刻 */
    platform.recorderClip = function (params) {
        if (!window.tt || !platform.recoding) { return; }
        if (params.beforeTime == null) {
            zs.log.warn('方法（ recorderClip ）缺少必要参数（ beforeTime ）', 'Platform');
            return;
        }
        if (params.laterTime == null) {
            zs.log.warn('方法（ recorderClip ）缺少必要参数（ laterTime ）', 'Platform');
            return;
        }
        if (typeof window.tt.getGameRecorderManager === 'function') {
            const recorder = tt.getGameRecorderManager();
            platform.bHighLightRecorder = true;
            recorder.recordClip({
                timeRange: [params.beforeTime, params.laterTime]
            })
        }
    }


    /**分享录屏 */
    platform.shareRecorderVideo = function _async() {
        return new Promise((resolve, reject) => {
            console.log("开始分享录屏", platform.videoPath);
            if (!window.tt || platform.videoPath == '') {
                return reject();
            }
            var topic = zs.product.get("zs_share_topics");
            var topics = [];
            if (topic != "") {
                topics = topic.split(",");
            }
            var queryData = `commandId=${zs.core.userId}&from=videoShare`;
            var desc = zs.product.get("zs_share_desc");
            var title = zs.product.get("zs_share_title");
            var imgUrl = zs.product.get("zs_share_image");
            let shareInfo = {
                channel: 'video',
                desc: desc,
                title: title,
                imageUrl: imgUrl,
                query: queryData,
                extra: {
                    videoPath: platform.videoPath,
                    videoTopics: topics, // 视频话题(只在抖音可用) （目前由 hashtag_list 代替），为保证兼容性，建议同时填写两个
                    hashtag_list: topics, // 视频话题(只在抖音可用)
                    withVideoId: true,
                    video_title: title, // 生成输入的默认文案
                },
                success(res) {
                    var videoId = res && res.videoId;
                    if (videoId) {
                        zs.log.debug('分享出去有视频id', videoId);
                    }
                    resolve();
                },
                fail(err) {
                    zs.log.debug('分享录屏失败', JSON.stringify(err));
                    reject();
                }
            };
            zs.log.debug('分享录屏', shareInfo);
            tt.shareAppMessage(shareInfo);
        });
    }

    /**
     * 显示头条更多好玩
     * @returns 
     */
    platform.showMoreGamesModalSimple = function _async() {
        return new Promise((resolve, reject) => {
            if (!window.tt || typeof window.tt.showMoreGamesModal != 'function') {
                reject();
                return;
            }
            tt.offNavigateToMiniProgram(); //取消所有监听
            tt.offMoreGamesModalClose();
            // 监听弹窗关闭
            tt.onMoreGamesModalClose((res) => {
                console.log("modal closed", res);
            });
            // 监听小游戏跳转
            tt.onNavigateToMiniProgram((res) => {
                if (res) {
                    console.log("是否有跳转的小游戏", res);
                    if (res.errCode == 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }

                }
            });
            // iOS 不支持，建议先检测再使用
            var navigateData = {};
            navigateData.appId = zs.core.appId;
            if (platform.systemInfo.platform !== "ios") {
                // 打开互跳弹窗
                tt.showMoreGamesModal({
                    appLaunchOptions: [
                        {
                            extraData: navigateData
                        }
                    ],
                    success(res) {
                        console.log("showMoreGamesModal success", res.errMsg);
                    },
                    fail(res) {
                        console.log("showMoreGamesModal fail", res.errMsg);
                    }
                });
            }
        })
    }

    /**
     * 调起关注小程序的引导组件
     * @returns 
     */
    platform.showFavoriteGuide = function () {
        if (!window.tt || typeof window.tt.showFavoriteGuide != 'function') {
            return;
        }
        tt.showFavoriteGuide({
            type: "bar",
            content: "一键添加到我的小程序",
            position: "bottom",
        })
    }

    platform.showModel = function (params) {
        if (!window.tt || typeof window.tt.showModal != 'function') {
            return;
        }
        params = params || {};
        return new Promise((resolve, reject) => {
            tt.showModal({
                title: params.title || "提示",
                content: params.content || "内容",
                confirmText: params.confirmText || "确定",
                cancelText: params.cancelText || "取消",
                showCancel: params.showCancel || false,
                success(res) {
                    if (res.confirm) {
                        resolve(true);
                    } else if (res.cancel) {
                        resolve(false);
                    } else {
                        reject();
                    }
                },
                fail(res) {
                    reject();
                },
            });
        });
    }

    platform.canShareRecorder = function () {
        return platform.recorderTime / 1000 >= 5;
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
            tt.vibrateLong({
                fail: () => {
                    zs.log.debug("Vibrate Long failed");
                }
            });
        } else {
            tt.vibrateShort({
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
        tt.onShow((result) => {
            params.showHandler && params.showHandler(result);
        });
    }
    platform.addEventHide = function (params) {
        tt.onHide((result) => {
            params.hideHandler && params.hideHandler(result);
        });
    }
    return platform;
})()