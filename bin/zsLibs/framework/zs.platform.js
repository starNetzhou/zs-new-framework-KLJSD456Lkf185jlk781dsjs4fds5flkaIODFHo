window.zs = window.zs || {};
window.zs.platform = window.zs.platform || {};
(function (exports) {
    const proxy = window["platform"];
    const syncList = ['share', 'userInfoHide', 'userInfoShow', 'userInfoDestroy', 'initVideo', 'isVideoEnable',
        'initInsert', 'loadInsert', 'createBanner', 'initBanner', 'checkBanner', 'clearDelayBanner', 'showBanner',
        'updateBanner', 'updateBannerPos', 'hideBanner', 'recorderStart', 'recorderStop', 'recorderPause',
        'recorderResume', 'recorderCreate', 'recorderHide', 'canShareRecorder', 'statusBarHeight',
        'screenWidth', 'screenHeight', 'vibrate', 'isNetValid', 'addEventShow', 'addEventHide', 'recorderClip',
        'recorderShare', 'showFavoriteGuide', 'setDefaultShare', 'updateReviveTypeInfo', 'setNativeLastShowTime',
        'initNativeAd', 'sendReqAdShowReport', 'sendReqAdClickReport', 'initGamePortalAd', 'showToast',
        'setIsInOneMin', 'getIsInOneMin', 'getLaunchOptions', 'getScene'];
    const asyncList = ['login', 'getLoginParams', 'request', 'playVideo', 'setCloudStorage', 'getCloudStorage',
        'userInfoCreate', 'navigateToOther', 'loadSubpackage', 'showModel', 'getUserInfo', 'authorize', 'addShortcut',
        'openAwemeUserProfile', 'checkFollowAwemeState', 'loadNativeAd', 'isBeforeGameAccount', 'getAdReporteStatus',
        'showGamePortalAd', 'hasDesktopIcon', 'createDesktopIcon'];

    function init() {
        if (proxy) { proxy.init(); }
        for (let key in proxy) {
            let func = proxy[key];
            if (func != null && typeof func === 'function') {
                if (asyncList.indexOf(key) >= 0) {
                    async[key] = proxy[key];
                } else {
                    sync[key] = proxy[key];
                }
            }
        }
        for (let i = 0, n = syncList.length; i < n; i++) {
            let key = syncList[i];
            if (sync[key] == null) {
                sync[key] = function () {
                    zs.log.warn("Sync方法 " + key + " 在当前平台不存在", 'Platform');
                    return null;
                }
            }
        }
        for (let i = 0, n = asyncList.length; i < n; i++) {
            let key = asyncList[i];
            if (async[key] == null) {
                async[key] = function _async() {
                    return new Promise((resolve, reject) => {
                        zs.log.warn("Async方法 " + key + " 在当前平台不存在", 'Platform');
                        reject();
                    });
                }
            }
        }
    }

    class async { }
    class sync { }

    exports.init = init;
    exports.proxy = proxy;
    exports.async = async;
    exports.sync = sync;
}(window.zs.platform = window.zs.platform || {}));