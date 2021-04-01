
window.platform = (function () {
    function platform() { };
    /**视频 */
    platform.rewardedVideoAd = null;
    platform.videoCompletedFunc = null;
    platform.videoInterruptFunc = null;
    platform.videoErrorFunc = null;
    /**互推盒子 */
    platform.appBoxAd = null;
    /**插屏 */
    platform.insertAd = null;
    /**插屏ID */
    platform.insertUnit = null;
    platform.insertLoaded = false;
    platform.insertCloseFunc = null;
    /**视频是否加载完毕 */
    platform.videoLoad = false;
    //音效处理相关
    platform.audioArr = [];
    platform.srcIdxObj = {};
    /**积木 */
    platform.blockAd = null;
    platform.blockNum = null;
    platform.blockAdLoaded = false;
    platform.blockRealySize = null;
    platform.blockLoadFunc = null;

    platform.systemInfo = null;
    platform.qqVersion = "1.0.0";
    /**循环音效播放最短时间，低于这个时间将导致音效失控 */
    platform.loopSoundETime = 300;
    /**循环音效是否需要继续播放的标识 */
    platform.continiu = false;
    /**进入信息 */
    platform.launchInfo = null;
    /**初始化平台 */
    platform.init = function () {
        console.log("platform.init==========");
        platform.systemInfo = qq.getSystemInfoSync();
        zs.core.addAppShow(Laya.Handler.create(this, function () { platform.srcIdxObj = {}; platform.audioArr = []; }, null, false));
        platform.launchInfo = qq.getLaunchOptionsSync();
    }

    platform.initAds = function () {
        platform.sendAppFrom();
        platform.initVideo(zs.product.get("zs_video_adunit"));
        platform.initAppBox(zs.product.get("zs_box_adunit"));
        platform.initBanner();
        platform.initInsert(zs.product.get("zs_full_screen_adunit"));
    }

    platform.addEventShow = function (params) {
        qq && qq.onShow((result) => {
            params.showHandler && params.showHandler(result);
        });
    }
    platform.addEventHide = function (params) {
        qq && qq.onHide((result) => {
            params.hideHandler && params.hideHandler(result);
        });
    }

    // /**初始化分享 */
    // platform.showShareMenu = function (title, imageUrl) {
    //     qq.showShareMenu();
    //     qq.onShareAppMessage(() => ({
    //         title: title,
    //         imageUrl: imageUrl // 图片 URL
    //     }));
    // }
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
        qq.showShareMenu();
        qq.onShareAppMessage(() => shareInfo)
    }
    /**登录 */
    platform.getLoginParams = function _async() {
        return new Promise((resolve, reject) => {
            qq.login({
                success: function (res) {
                    if (res.code) {
                        console.log("====================CODE:" + res.code);
                        resolve({ code: res.code });
                        // platform.getReadSetting(["SYS_MSG_TYPE_INTERACTIVE", "SYS_MSG_TYPE_RANK"]);
                    }
                    else {
                        console.log("Code不存在");
                        reject("Code不存在");
                    }
                },
                fail: function () {
                    console.log("登录失败");
                    reject("登陆失败");
                },
                complete: function () {
                }
            });
        });
    }
    /**加载分包 */
    platform.loadSubpackage = function _async(obj) {
        return new Promise((resolve, reject) => {
            qq.loadSubpackage({
                name: obj.pkgName,
                success: function success(res) {
                    resolve();
                    console.log("分包" + obj.pkgName + "加载成功");
                },
                fail: function fail(err) {
                    reject();
                    console.log("分包" + obj.pkgName + "加载失败", JSON.stringify(err));
                }
            })
        });
    }
    /**分享 */
    platform.openShare = function (text, iconUrl, failedFunc) {
        qq.shareAppMessage({
            title: text,
            imageUrl: iconUrl,
            shareAppType: "qzone",
            success: function () {
                console.log("分享成功");
            },
            fail: function () {
                console.log("分享失败");
                if (failedFunc) failedFunc();
            },
            complete: function () {
            }
        });
    }
    platform.initBanner = function () {
        zs.qq.banner.QQBannerMgr.Instance.setAdUnitId(zs.product.get("zs_banner_adunit"), zs.product.get("zs_banner_adunit2"), zs.product.get("zs_banner_adunit3"));
    }
    platform.showBanner = function (params) {
        zs.qq.banner.QQBannerMgr.Instance.showBanner(params.position);
    }
    platform.updateBanner = function (params) {
        zs.qq.banner.QQBannerMgr.Instance.checkBanner(params.isWait, params.position);
    }
    /**检测banner */
    platform.checkBanner = function (params) {
        zs.qq.banner.QQBannerMgr.Instance.hideAll();
        if (!params || !params.data || !params.data.banner) {
            return;
        }
        var config = params.data.banner;
        var switchShow = true;
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
            return;
        }
        var isWait = config.delay || config.auto == false;
        zs.qq.banner.QQBannerMgr.Instance.checkBanner(isWait, config.pos);
        if (config.delay && zs.product.get("zs_banner_banner_time")) {
            platform.delayBanner = setTimeout(function () {
                zs.qq.banner.QQBannerMgr.Instance.showBanner(config.pos);
            })
        }
    }
    platform.getScene = function () {
        var launchInfo = qq.getLaunchOptionsSync();
        var scene = launchInfo.scene ? launchInfo.scene : "";
        return scene;
    }
    platform.hideBanner = function () {
        zs.qq.banner.QQBannerMgr.Instance.hideAll();
    }
    platform.clearDelayBanner = function () {
        platform.delayBanner && clearTimeout(platform.delayBanner);
        platform.delayBanner = null;
    }
    /**初始化视频 */
    platform.initVideo = function (videoAdUnit) {
        if (!videoAdUnit) return;
        platform.rewardedVideoAd = qq.createRewardedVideoAd({ adUnitId: videoAdUnit });
        if (platform.rewardedVideoAd == null) {
            console.debug("初始化vide失败");
            return;
        }
        platform.rewardedVideoAd.onLoad(function () {
            platform.videoLoad = true;
            console.debug("video加载成功" + platform.videoLoad);
        })
        platform.rewardedVideoAd.onError(function (err) {
            console.debug("视频报错:" + JSON.stringify(err));
            platform.videoLoad = false;
            // !platform.videoErrorFunc && platform.showToast("视频正在准备中,请稍候再试!");
            platform.videoErrorFunc && platform.videoErrorFunc();
        });
        platform.rewardedVideoAd.onClose(function (res) {
            // 用户点击了【关闭广告】按钮
            // 小于 2.1.0 的基础库版本，res 是一个 undefined
            platform.videoLoad = false;
            platform.rewardedVideoAd.load();
            if (res && res.isEnded || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                if (platform.videoCompletedFunc) {
                    platform.videoCompletedFunc();
                }
            } else {
                // 播放中途退出，不下发游戏奖励
                if (platform.videoInterruptFunc) {
                    platform.videoInterruptFunc();
                }
            }
        });
        platform.rewardedVideoAd.load();
    }
    /**是否能播放视频 */
    platform.isVideoEnable = function () {
        return platform.rewardedVideoAd != null && platform.videoLoad;
    }
    /**播放视频*/
    platform.playVideo = function _async(videoErrorFunc) {
        return new Promise((resolve, reject) => {
            platform.videoErrorFunc = videoErrorFunc;
            if (!platform.rewardedVideoAd) {
                reject();
            }
            console.debug("当前是否加载" + platform.videoLoad);
            platform.videoCompletedFunc = function () {
                resolve(true);
            }
            platform.videoInterruptFunc = function () {
                resolve(false);
            }
            if (platform.videoLoad) {
                platform.rewardedVideoAd.show().catch(function () {
                    reject();
                    platform.videoLoad = false;
                });
            }
            else {
                platform.rewardedVideoAd.load().then(function () {
                    platform.rewardedVideoAd.show().catch(function () {
                        reject();
                        platform.videoLoad = false;
                    });
                }).catch(function () {
                    reject();
                });
            }
        });
    }

    platform.isColorSignExistSync = function _async() {
        return new Promise((resolve, reject) => {
            var use = qq.isColorSignExistSync();
            console.debug("是否已使用彩签" + use);
            use && resolve();
            reject();
        });
    }
    //添加到最近浏览彩签
    platform.addRecentColorSign = function _async() {
        return new Promise((resolve, reject) => {
            platform.getSetting("scope.recentColorSign").then(function () {
                qq.addRecentColorSign({
                    success() {
                        platform.showToast("添加到最近浏览彩签成功");
                        resolve();
                    },
                    fail() {
                        platform.showToast("添加到最近浏览彩签失败,请重试");
                        reject("添加到最近浏览彩签失败,请重试");
                    }
                });
            }.catch(function (errMsg) {
                reject(errMsg);
                console.log(errMsg);
            }))
        });
    }

    //获取订阅消息
    platform.getReadSetting = function (typeArr) {
        qq.getSetting({
            withSubscriptions: true,
            success(res) {
                console.debug("获取到的授权信息" + JSON.stringify(res));
                let arr = [];
                for (let i = 0; i < typeArr.length; i++) {
                    if (res.subscriptionsSetting && !res.subscriptionsSetting[typeArr[i]]) {
                        arr.push(typeArr[i]);
                    }
                }
                if (!arr.length) {
                    console.debug("用户已授权");
                    return;
                }
                console.debug("调用订阅接口" + arr);
                qq.requestSubscribeSystemMessage({
                    msgTypeList: arr,
                    success(res) {
                    },
                    fail() {
                        fail("请求授权失败");
                    }
                })
            }
        })
    }

    //获取授权信息
    platform.getSetting = function _async(type) {
        return new Promise((resolve, reject) => {
            qq.getSetting({
                success(res) {
                    console.debug("获取到的授权信息" + JSON.stringify(res));
                    if (res.authSetting && res.authSetting[type]) {
                        resolve();
                    }
                    else if (res.authSetting && res.authSetting[type] == null) {
                        console.debug("调用授权接口" + type);
                        qq.authorize({
                            scope: type,
                            success(res) {
                                console.debug("获取到的授权信息" + JSON.stringify(res));
                                if (res.authSetting && res.authSetting[type]) {
                                    resolve();
                                }
                                else {
                                    reject();
                                }
                            },
                            fail() {
                                platform.showToast("请求授权失败");
                                reject("请求授权失败");
                            }
                        })
                    }
                    else if (res.authSetting && res.authSetting[type] == false) {
                        qq.openSetting({
                            success(res) {
                                console.debug("获取到的授权信息" + JSON.stringify(res));
                                if (res.authSetting && res.authSetting[type]) {
                                    resolve();
                                }
                                else {
                                    reject();
                                }
                            },
                            fail() {
                                platform.showToast("请求授权失败");
                                reject("请求授权失败");
                            }
                        })
                    }
                },
                fail(err) {
                    reject("获取授权失败" + JSON.stringify(err));
                }
            })
        });
    }
    /**c初始化盒子 */
    platform.initAppBox = function (boxAdUnit) {
        console.log("box广告初始化....");
        if (!boxAdUnit) return;
        if (platform.appBoxAd) return
        console.log("appBoxId：" + boxAdUnit);
        platform.appBoxAd = qq.createAppBox({ adUnitId: boxAdUnit });
        platform.appBoxAd.load();
        platform.appBoxAd.onClose(function () {
            platform.boxCloseFunc && platform.boxCloseFunc();
        });
    }

    platform.showAppBox = function (boxCloseFunc, errFunc) {
        if (platform.appBoxAd) {
            platform.appBoxAd.show().catch(function () {
                errFunc && errFunc();
            });
            platform.boxCloseHandle = boxCloseFunc;
        } else {
            errFunc && errFunc();
            console.log("AppBox未初始化");
        }
    }
    /**初始化积木广告
     * @param blockAdUnit ID
     * @param orient 方向 landscape或null 横 vertical 竖
     * @param Num 展示数量
     * @param pos 适配信息 （laya.stage 坐标 left,right,centerX,top,bottom,centerY)
     * @param loadFunc 加载后的回调 
     */
    platform.checkBlockAd = function (blockAdUnit, orient, Num, pos, loadFunc) {
        if (!blockAdUnit) return;
        if (platform.blockAd) {
            platform.hideBlockAd();
        };
        platform.blockAdUnit = blockAdUnit;
        console.log("blockAd" + blockAdUnit);
        if (typeof (qq.createBlockAd) == "undefined") {
            console.debug("QQ版本过低，无法展示积木广告");
            return;
        }
        platform.blockLoadFunc = loadFunc;
        Num = Num ? Num : 5;
        var pos = platform.getAdPos(pos, (orient == "landscape" ? (8 + 65 * Num) : 65), (orient == "landscape" ? 73 : (73 * Num)));
        platform.blockAd = qq.createBlockAd({ adUnitId: blockAdUnit, size: Num, orientation: orient ? orient : "landscape", style: { left: pos.left, top: pos.top } });
        if (!platform.blockAd) return;
        platform.blockLoadFunc = function () {
            loadFunc();
        }
        platform.blockAd.onLoad(function () {
            platform.blockAdLoaded = true;
            platform.blockLoadFunc && platform.blockLoadFunc();
        });
        platform.blockAd.onError(function (errMsg) {
            try { console.debug(JSON.stringify(errMsg)) } catch (e) { console.debug(errMsg) };
            platform.blockAd.destroy();
            platform.blockAd = null;
        });
        platform.blockAd.onResize(function (size) {
            platform.blockRealySize = size;
        })
    }

    platform.showBlockAd = function (pos) {
        if (platform.blockAd && platform.blockAdLoaded) {
            if (platform.blockRealySize) {
                var pos = platform.getAdPos(pos, platform.blockRealySize.width, platform.blockRealySize.height);
                try {
                    platform.blockAd.style.top = pos.top;
                    platform.blockAd.style.left = pos.left;
                } catch (error) {
                    console.log("当前版本不支持设置位置");
                }
            }
            platform.blockAd.show();
        }
    }

    platform.hideBlockAd = function () {
        if (platform.blockAd) {
            platform.blockAd.hide();
            platform.blockAd.destroy();
            platform.blockAd = null;
        }
        if (platform.blockLoadFunc) {
            platform.blockLoadFunc = null;
        }
    }

    platform.initInsert = function (insertUnit) {
        if (!insertUnit) return;
        if (platform.insertAd) return;
        platform.insertUnit = insertUnit;
        console.log("insertAd" + insertUnit);
        if (typeof (qq.createInterstitialAd) == "undefined") {
            console.debug("QQ版本过低，无法展示插屏广告");
            return;
        }
        platform.insertAd = qq.createInterstitialAd({ adUnitId: insertUnit });
        platform.insertAd.onLoad(function () {
            platform.insertLoaded = true;
        });
        platform.insertAd.onError(function (errMsg) {
            try { console.debug(JSON.stringify(errMsg)) } catch (e) { console.debug(errMsg) };
        });
        platform.insertAd.onClose(function () {
            platform.insertLoaded = false;
            platform.insertCloseFunc && platform.insertCloseFunc();
        })
    }

    platform.showInsertAd = function (closeFunc) {
        if (platform.insertAd && platform.insertLoaded) {
            platform.insertAd.show().then(function () {
                platform.insertCloseFunc = closeFunc();
            }).catch(function () {
                closeFunc && closeFunc();
            });
        }
        else {
            console.debug("insertAd 尚未初始化");
            closeFunc && closeFunc();
        }
    }

    platform.destroyInsertAd = function () {
        if (platform.insertAd) {
            platform.insertAd.destroy();
            platform.initInsertAd(platform.insertUnit);
        }
    }
    /**播放循环音效，仅循环音效需要调用该方法，解决某种bug（老版本的bug） */
    platform.playSound = function (res, loop, compHandler) {
        var audio = null;
        if (platform.srcIdxObj[res]) {
            audio = platform.srcIdxObj[res]["audio"];
            console.debug("取到" + res + "的音频");
            if (!platform.srcIdxObj[res]["isStop"]) {
                console.debug("" + res + "已在播放中");
                platform.continiu = true;
                return;
            }
        }
        if (!audio) {
            audio = qq.createInnerAudioContext();
            audio.onError(function (eCode) {
                console.debug("音效播放异常  code " + JSON.stringify(eCode));
                delete platform.srcIdxObj[audio.src];
                audio.destroy();
            });
        }
        audio.src = res;
        audio.loop = loop;
        platform.srcIdxObj[res] = { "audio": audio, "ptime": new Date().getTime(), "isStop": false, "curTime": 0 };
        audio.onEnded(function () {
            if (compHandler) compHandler.run();
            platform.srcIdxObj[res].isStop = true;
        });
        audio.play();
    }
    /**暂停循环音效 */
    platform.pauseSound = function (res) {
        var audio = platform.srcIdxObj[res]["audio"];
        if (!audio) return;
        audio.pause();
        audio.offEnded();
        platform.srcIdxObj[res]["isStop"] = true;
    }
    /**停止循环音效 */
    platform.stopSound = function (res) {
        if (!platform.srcIdxObj[res]) return;
        platform.continiu = false;
        var a = new Date().getTime() - platform.srcIdxObj[res]["ptime"]
        if (a < platform.loopSoundETime) {
            console.debug("间隔过短，延时关闭");
            setTimeout(function () {
                if (!platform.srcIdxObj[res]) return;
                var audio = platform.srcIdxObj[res]["audio"];
                if (!audio || platform.srcIdxObj[res]["isStop"] || platform.continiu) return;
                platform.srcIdxObj[res]["isStop"] = true;
                audio.stop();
                audio.offEnded();
                console.debug("进入延时关闭");
            }, platform.loopSoundETime - a);
            return;
        }
        var audio = platform.srcIdxObj[res]["audio"];
        audio.stop();
        audio.offEnded();
        platform.srcIdxObj[res]["isStop"] = true;
        console.debug("进入关闭");
    }

    platform.compareVersion = function (version) {//QQ比较版本
        var version2 = "1.0.0";
        var v1 = version.split('.');
        var v2 = platform.qqVersion.split('.');
        var len = Math.max(v1.length, v2.length);
        while (v1.length < len) {
            v1.push('0');
        }
        while (v2.length < len) {
            v2.push('0');
        }
        for (var i = 0; i < len; i++) {
            var num1 = parseInt(v1[i]);
            var num2 = parseInt(v2[i]);
            if (num1 > num2) {
                return 1;
            } else if (num1 < num2) {
                return -1;
            }
        }
        return 0;
    }

    platform.vibrate = function (params) {
        if (params.isLong) {
            qq.vibrateLong();
        }
        else {
            qq.vibrateShort();
        }
    }

    platform.showToast = function (text, time = 1500) {
        qq.showToast({
            title: text,
            duration: time
        })
    }
    /**获取广告位置
     * @param pos 广告在Laya上的适配信息 {left,right,centerX,top,bottom,centerY}
     * @param width 广告的宽 手机屏幕像素宽
     * @param height 广告的高 手机屏幕像素高
     */
    platform.getAdPos = function (pos, width, height) {
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

    platform.sendAppFrom = function () {
        var self = this;
        if (zs.core.userId == null) {
            console.error("上报来路统计失败，用户id不存在,请检查是否初始化sdk");
            return;
        }

        var srcAppId = platform.launchInfo.referrerInfo && platform.launchInfo.referrerInfo.appId ? platform.launchInfo.referrerInfo.appId : "";
        console.debug("来路统计" + srcAppId);
        var url = "https://platform.qwpo2018.com/api/qq_jump/index";
        var data = {
            appid: zs.core.appId,
            from_id: srcAppId ? srcAppId : platform.launchInfo.scene,
            user_id: zs.core.userId
        }
        request(url, data, 'POST',
            function () {
                console.log("上报来路统计成功");
            },
            function (err) {
                console.log("上报来路统计失败" + JSON.stringify(err));
            },
            function (res) {
                console.log('上报来路统计完成', JSON.stringify(res));
            });
    }

    return platform;
}
)();
var request = function (url, data, method, success, fail, complete) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var response = xhr.responseText;
            if (xhr.status >= 200 && xhr.status < 400) {
                var result = {};
                try {
                    result = JSON.parse(response)
                } catch (e) {
                    console.error('json parse error ', response)
                    if (fail)
                        fail(e);
                }
                if (success)
                    success(result);
            } else {
                console.error('error ', response)
                if (fail)
                    fail(response);
            }
        } else {
        }
    };
    xhr.timeout = 3000;
    xhr.ontimeout = function (event) {
        console.error('error ', event)
        if (fail)
            fail(event);
    }
    xhr.open(method, url, true);
    if (method == "POST") {
        xhr.open('POST', url);
        xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
        xhr.send(object2Query(data));
    } else {
        xhr.send();
    }
}
var object2Query = function (obj) {
    var args = []
    for (var k in obj)
        args.push(k + "=" + obj[k])
    return args.join("&"); // 返回对象  
}