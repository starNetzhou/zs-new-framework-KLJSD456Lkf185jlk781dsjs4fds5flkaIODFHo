window.zs = window.zs || {};
(function (exports) {
    'use strict';
    class td {
        static init() {
            if (typeof GameGlobal === 'undefined' || GameGlobal.tdAppSdk == null || GameGlobal.tdInit == null) {
                zs.log.warn("无法初始化TD SDK", 'Talking Data');
                return;
            }
            if (this.appKey == null || this.appKey.length <= 0) {
                zs.log.warn("appKey非法，无法正常设置TD SDK", 'Talking Data');
                return;
            }
            if (this.appName == null || this.appName.length <= 0) {
                zs.log.warn("appName非法，无法正常设置TD SDK", 'Talking Data');
                return;
            }
            if (this.appId == null || this.appId.length <= 0) {
                zs.log.warn("appId非法，无法正常设置TD SDK", 'Talking Data');
                return;
            }
            GameGlobal.tdInit.init();
            this.TDSDK = GameGlobal.tdAppSdk;
        }
        static registeInfo(evt, info) {
            if (typeof GameGlobal === 'undefined' || GameGlobal.tdAppSdk == null || GameGlobal.tdInit == null) {
                zs.log.warn("TD SDK不存在，无法注册配置", 'Talking Data');
                return;
            }
            if (this.infos == null) {
                this.infos = {};
            }
            if (this.infos[evt] == null) {
                this.infos[evt] = {};
            }
            if (info) {
                this.infos[evt] = info;
            }
        }
        static async registeConfig(cfg) {
            if (typeof GameGlobal === 'undefined' || GameGlobal.tdAppSdk == null || GameGlobal.tdInit == null) {
                zs.log.warn("TD SDK不存在，无法注册配置表", 'Talking Data');
                return;
            }
            if (cfg) {
                for (let c in cfg) { this.registeInfo(c, cfg[c]); }
                zs.log.debug("注册数据配置表成功", 'Talking Data');
            } else {
                zs.log.warn("注册数据配置表失败", 'Talking Data');
            }
        }
        // 内部调用接口，原则上不允许暴露使用
        static justTrack(evt, label, params) {
            if (!this.TDSDK) { return; }
            this.TDSDK.event({
                id: evt,
                label: label,
                params: params
            });
        }
        static track(evtId, params) {
            if (!this.TDSDK || this.infos == null) { return; }
            let evtIdSplit = evtId.split('_', 2);
            let info = null;
            let evtLabel = "";
            if (evtIdSplit.length > 1) {
                info = this.infos[evtIdSplit[0] + '_'];
                if (info) {
                    evtLabel = info.label + evtIdSplit[1];
                }
            } else {
                info = this.infos[evtId];
                evtLabel = info.label;
            }
            if (info == null) {
                zs.log.warn("数据时间未注册，无法上报数据： " + evtId, 'Talking Data');
                return;
            }
            let finalParams = {};
            let checkFailed = false;
            if (info.params != null && info.params.length > 0) {
                if (params == null) {
                    if (info.strict) {
                        zs.log.warn("缺少必要属性，无法上报数据: " + key, 'Talking Data');
                        checkFailed = true;
                    }
                } else {
                    for (let i = 0, n = info.params.length; i < n; i++) {
                        let key = info.params[i];
                        if (params[key] == null && info.strict) {
                            zs.log.warn("缺少必要属性，无法上报数据: " + key, 'Talking Data');
                            checkFailed = true;
                            break;
                        }
                        finalParams[key] = params[key];
                    }
                }
            }
            if (!checkFailed) {
                this.TDSDK.event({
                    id: evtId,
                    label: evtLabel,
                    params: finalParams
                });
            }
        }
        static get appKey() {
            if (typeof GameGlobal === 'undefined' || GameGlobal.appInfo == null) {
                zs.log.warn("TD SDK不存在，无法获取appKey", 'Talking Data');
                return null;
            }
            return GameGlobal.appInfo.app.appKey;
        }
        static set appKey(value) {
            if (typeof GameGlobal === 'undefined' || GameGlobal.appInfo == null) {
                zs.log.warn("TD SDK不存在，无法设置appKey", 'Talking Data');
                return;
            }
            GameGlobal.appInfo.app.appKey = value;
        }
        static get appName() {
            if (typeof GameGlobal === 'undefined' || GameGlobal.appInfo == null) {
                zs.log.warn("TD SDK不存在，无法获取appName", 'Talking Data');
                return null;
            }
            return GameGlobal.appInfo.app.displayName;
        }
        static set appName(value) {
            if (typeof GameGlobal === 'undefined' || GameGlobal.appInfo == null) {
                zs.log.warn("TD SDK不存在，无法设置appName", 'Talking Data');
                return;
            }
            GameGlobal.appInfo.app.displayName = value;
        }
        static get appId() {
            if (typeof GameGlobal === 'undefined' || GameGlobal.appInfo == null) {
                zs.log.warn("TD SDK不存在，无法获取appId", 'Talking Data');
                return null;
            }
            return GameGlobal.appInfo.app.uniqueId;
        }
        static set appId(value) {
            if (typeof GameGlobal === 'undefined' || GameGlobal.appInfo == null) {
                zs.log.warn("TD SDK不存在，无法设置appId", 'Talking Data');
                return;
            }
            GameGlobal.appInfo.app.uniqueId = value;
        }
        static get versionName() {
            if (typeof GameGlobal === 'undefined' || GameGlobal.appInfo == null) {
                zs.log.warn("TD SDK不存在，无法获取versionName", 'Talking Data');
                return null;
            }
            return GameGlobal.appInfo.app.versionName;
        }
        static set versionName(value) {
            if (typeof GameGlobal === 'undefined' || GameGlobal.appInfo == null) {
                zs.log.warn("TD SDK不存在，无法设置appKey", 'Talking Data');
                return;
            }
            GameGlobal.appInfo.app.versionName = value;
        }
        static get versionCode() {
            if (typeof GameGlobal === 'undefined' || GameGlobal.appInfo == null) {
                zs.log.warn("TD SDK不存在，无法获取versionCode", 'Talking Data');
                return null;
            }
            return GameGlobal.appInfo.app.versionCode;
        }
        static set versionCode(value) {
            if (typeof GameGlobal === 'undefined' || GameGlobal.appInfo == null) {
                zs.log.warn("TD SDK不存在，无法设置appKey", 'Talking Data');
                return;
            }
            GameGlobal.appInfo.app.versionCode = value;
        }
        static get channel() {
            if (typeof GameGlobal === 'undefined' || GameGlobal.appInfo == null) {
                zs.log.warn("TD SDK不存在，无法获取channel", 'Talking Data');
                return null;
            }
            return GameGlobal.appInfo.app.channel;
        }
        static set channel(value) {
            if (typeof GameGlobal === 'undefined' || GameGlobal.appInfo == null) {
                zs.log.warn("TD SDK不存在，无法设置channel", 'Talking Data');
                return;
            }
            GameGlobal.appInfo.app.channel = value;
        }
    }
    td.workflowKey = "workflow_";
    td.workflowDesc = "工作流-";
    td.startupKey = "startup";
    td.startupDesc = "启动游戏";
    td.gameStartKey = "gameStart";
    td.gameStartDesc = "开始游戏";

    exports.td = td;
}(window.zs = window.zs || {}));