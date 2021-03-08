window.zs = window.zs || {};
window.zs.exporter = window.zs.exporter || {};

(function (exports) {
    'use strict';

    let AlignType = zs.fgui.AlignType;
    let AdaptType;
    (function (AdaptType) {
        AdaptType[AdaptType["None"] = 0] = "None";
        AdaptType[AdaptType["Horizontal"] = 1] = "Horizontal";
        AdaptType[AdaptType["Vertical"] = 2] = "Vertical";
    })(AdaptType = AdaptType || (AdaptType = {}));

    class utils {
        static get cache() {
            if (this._cache == null) {
                this._cache = {};
            }
            return this._cache;
        }
        static get bases() {
            if (this._bases == null) {
                this._bases = {};
            }
            return this._bases;
        }
        static isSameDay(checkTime) {
            return new Date(checkTime).toDateString() === new Date().toDateString();;
        }
        static getStorageSync(key) {
            return this.cache[key];
        }
        static setStorageSync(key, value) {
            this.cache[key] = value;
        }
        static getCache(key, expire) {
            if (!expire) {
                return this.getStorageSync(key);
            } else {
                let lastCacheTime = this.getStorageSync(key + "_time");
                if (lastCacheTime == null || Date.now() - Number(lastCacheTime) < expire) {
                    return this.getStorageSync(key);
                } else {
                    return null;
                }
            }
        }
        static setCache(key, value) {
            this.setStorageSync(key, value);
            this.setStorageSync(key + "_time", Date.now());
        }
        static getCacheNewDay(key, checkNewDay) {
            if (!checkNewDay) {
                return this.getStorageSync(key);
            } else {
                let lastCacheTime = this.getStorageSync(key + "_time");
                if (lastCacheTime == null || !this.isSameDay(lastCacheTime)) {
                    return this.getStorageSync(key);
                } else {
                    return null;
                }
            }
        }
        static getDistance(x1, x2, y1, y2) {
            return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
        }
        static checkScroll(x, y, distance) {
            return this.getDistance(x, Laya.stage.mouseX, y, Laya.stage.mouseY) > distance;
        }
        static navigateToMiniProgram(appInfo, forbidA2B) {
            return new Promise((resolve, reject) => {
                if (appInfo) {
                    let targetMini = appInfo;
                    let unlinkAd = this.getCacheNewDay("unlinkAd") || {};
                    if (unlinkAd[targetMini.appid]) {
                        console.log("广告位今日点击过")
                        let allAdList = [];
                        let adCfg = this.getCache("zsAd");
                        for (const key in adCfg) {
                            if (adCfg.hasOwnProperty(key)) {
                                let subAd = adCfg[key];
                                for (let index = 0; index < subAd.length; index++) {
                                    const adData = subAd[index];
                                    allAdList.push(adData);
                                }
                            }
                        }
                        let filterArr = allAdList.filter(element => unlinkAd[element.appid] ? false : true)
                        let idx = Math.floor(Math.random() * filterArr.length);
                        targetMini = filterArr[idx];
                        console.log("新的导出", targetMini);
                    }
                    if (!targetMini) {
                        // 清空今日导出数据
                        targetMini = appInfo;
                        this.setCache("unlinkAd", {});
                    }

                    zs.platform.async.navigateToOther({ appInfo: appInfo })
                        .then(() => {
                            // 跳转成功
                            let unlinkAd = utils.getCacheNewDay("unlinkAd") || {};
                            unlinkAd[appInfo.appid] = true;
                            utils.setCache("unlinkAd", unlinkAd);
                            dataMgr.collectExport(appInfo.app_id);
                            resolve(null);
                        }).catch(() => {
                            utils.navigateErrorHandler && utils.navigateErrorHandler.run();
                            reject(null);
                        });
                } else {
                    zs.log.warn("跳转信息丢失，无法完成跳转！", "Exporter");
                    reject(null);
                }
            })
        }
        static addBase(key, type) {
            this.bases[key] = type;
        }
        static removeBase(key) {
            if (this.bases[key]) {
                delete this.bases[key];
            }
        }
    }
    utils.navigateErrorHandler = null;

    class dataMgr {
        static get cache() {
            if (this._cache == null) {
                this._cache = {};
            }
            return this._cache;
        }

        static setCache(key, data, expire) {
            this.cache[key] = {
                data: data,
                timestamp: Date.now(),
                expire: expire || this.expireTime
            }
        }

        static getCache(key) {
            let cache = this.cache[key];
            if (cache != null && Date.now() - cache.timestamp < cache.expire) {
                return cache.data;
            }
            return null;
        }

        static collectExport(appid) {
            if (window.wx == null) { return; }
            let url = (zs.configs.gameCfg.exportURL || dataMgr.URL) + "appad_new/collect";
            let curTime = Math.round(new Date().getTime() / 1000).toString();
            let sysInfo = null;
            sysInfo = wx.getLaunchOptionsSync();
            let signParams = {
                user_id: zs.core.userId,
                from_id: zs.core.appId,
                to_id: appid,
                timestamp: curTime,
                scene: (sysInfo && sysInfo.scene) ? sysInfo.scene : 0,
                zhise: (sysInfo && sysInfo.query && sysInfo.query.zhise) ? sysInfo.query.zhise : ""
            };
            zs.network.nativeRequest(url, signParams, 'POST', true)
                .then((res) => {
                    console.log("collect export success!");
                }).catch((res) => {
                    console.log("collect export failed!");
                });
        }

        static load() {
            let url = (zs.configs.gameCfg.exportURL || dataMgr.URL) + "appad_new/index";
            let currentTime = Math.round(new Date().getTime() / 1000).toString();
            let data = {
                appid: zs.configs.gameCfg.appId,
                timestamp: currentTime
            }
            return new Promise((resolve, reject) => {
                let cache = dataMgr.getCache(dataMgr.exportCache);
                if (cache) {
                    return resolve(cache);
                }
                if (dataMgr.cacheSetting) {
                    if (dataMgr.requestList == null) {
                        dataMgr.requestList = [];
                    }
                    dataMgr.requestList.push((data) => {
                        resolve(data);
                    })
                    return;
                }
                dataMgr.cacheSetting = true;
                zs.network.nativeRequest(url, data, 'POST', true)
                    .then((result) => {
                        let data = {
                            more: result.data["position-1"] || [],
                            promotion: result.data["position-2"] || [],
                            indexFloat: result.data["position-3"] || [],
                            banner: result.data["position-4"] || [],
                            indexLeft: result.data["position-7"] || [],
                            gameFloat: result.data["position-8"] || [],
                            endPage: result.data["position-9"] || [],
                            indexLeftFloat: result.data["position-11"] || [],
                            backAd: result.data["position-12"] || [],
                            iosLinkAd: result.data["position-13"] || []
                        }
                        dataMgr.setCache(dataMgr.exportCache, data);
                        if (dataMgr.requestList && dataMgr.requestList.length > 0) {
                            for (let i = 0, n = dataMgr.requestList.length; i < n; i++) {
                                dataMgr.requestList[i].call(this, data);
                            }
                        }
                        dataMgr.requestList = null;
                        dataMgr.cacheSetting = false;
                        resolve(data);
                    })
                    .catch((error) => {
                        let data = {
                            more: [],
                            promotion: [],
                            indexFloat: [],
                            banner: [],
                            indexLeft: [],
                            gameFloat: [],
                            endPage: [],
                            indexLeftFloat: [],
                            backAd: [],
                            iosLinkAd: []
                        }
                        if (dataMgr.requestList && dataMgr.requestList.length > 0) {
                            for (let i = 0, n = dataMgr.requestList.length; i < n; i++) {
                                dataMgr.requestList[i].call(this, data);
                            }
                        }
                        dataMgr.requestList = null;
                        dataMgr.cacheSetting = false;
                        resolve(data);
                    });
            });
        }

    }
    dataMgr.URL = "https://ad.ali-yun.wang/api/";
    dataMgr.expireTime = 60000;
    dataMgr.exportCache = 'ExpCache';

    class list extends zs.fgui.base {
        constructor(component) {
            super(component);
            this._cellWidth = 0;
            this._cellHeight = 0;
            this._effectWidth = 0;
            this._effectHeight = 0;
            this._itemType = null;
            this._datas = [];
            this._maxItems = 0;
            this._adaptScale = false;
            this._keepRatio = AdaptType.None;
            this._autoScrollSpeed = 0;
            this._autoScrollForward = true;
            this._isAutoScrolling = false;
            this._dragRecoverTime = 0;
            this._dragStopCount = 0;
            this._readyDrag = false;
            this._clickHandler = null;
            this._transition = null;
            this._bScrollExport = false;
            if (component && component instanceof zs.ui.FGUI_list) {
                component.list.itemProvider = Laya.Handler.create(this, this.onItemProvider, null, false);
                component.list.itemRenderer = Laya.Handler.create(this, this.onItemRenderer, null, false);
                component.list.on(fairygui.Events.CLICK_ITEM, this, this.onClickItem);
                component.list.on(Laya.Event.MOUSE_DOWN, this, this.onDragStateBegin);
                component.list.on(Laya.Event.MOUSE_MOVE, this, this.onDragStateChanged);

            }
        }
        static make() {
            let view = zs.ui.FGUI_list.createInstance();
            return view;
        }
        static type() {
            return zs.ui.FGUI_list;
        }
        dispose() {
            super.dispose();
            if (this.shakeTime > 0) {
                this.stopShake();
            }
        }
        check(component) {
            if (component instanceof zs.ui.FGUI_list) {
                return true;
            }
            return false;
        }

        setHorizontalList(type, height, max, autoApply) {
            this.setItem(type)
                .setLayout(fairygui.ListLayoutType.FlowVertical)
                .setAlign(AlignType.Center)
                .setAdaptScale(true)
                .setKeepRatio(AdaptType.Vertical)
                .setScrollType(fairygui.ScrollType.Horizontal)
                .setColumnGap(25)
                .setGridHeight(height)
                .snapWidth()
                .setAutoScrollSpeed(100)
                .setDragRecoverTime(3)
                .loop()
                .setScrollExport()
                .setMaxItems(max);
            dataMgr.load().then((result) => {
                if (this.disposed) return;
                this.setDatas(result.promotion)
                    .apply();
            });
            if (autoApply) {
                return this.apply();
            }
            return this;
        }
        setVerticalList(type, width, max, autoApply) {
            this.setItem(type)
                .setLayout(fairygui.ListLayoutType.FlowHorizontal)
                .setAlign(AlignType.Center)
                .setAdaptScale(true)
                .setKeepRatio(AdaptType.Horizontal)
                .setScrollType(fairygui.ScrollType.Vertical)
                .setLineGap(25)
                .setGridWidth(width)
                .snapHeight()
                .setAutoScrollSpeed(100)
                .setDragRecoverTime(3)
                .loop()
                .setMaxItems(max);
            dataMgr.load().then((result) => {
                if (this.disposed) return;
                this.setDatas(result.promotion)
                    .apply();
            });
            if (autoApply) {
                return this.apply();
            }
            return this;
        }
        setSideList(type, width, max, autoApply) {
            this.setItem(type)
                .setLayout(fairygui.ListLayoutType.FlowHorizontal)
                .setAlign(AlignType.Center)
                .setAdaptScale(true)
                .setKeepRatio(AdaptType.Horizontal)
                .setCellWidth(width * 0.7)
                .setScrollType(fairygui.ScrollType.Vertical)
                .setLineGap(25)
                .setGridWidth(width)
                .setListFit(true)
                .bounce(false)
                .setMaxItems(max);
            dataMgr.load().then((result) => {
                if (this.disposed) return;
                // 数据打乱一下
                result && result.promotion && result.promotion.sort((a, b) => {
                    return a < b ? -1 : 1
                })
                this.setDatas(result.promotion)
                    .apply();
            });
            if (autoApply) {
                return this.apply();
            }
            return this;
        }
        setHorizontalGrid(type, width, height, lineLimit, max, autoApply) {
            this.setItem(type)
                .setLayout(fairygui.ListLayoutType.FlowHorizontal)
                .setAlign(AlignType.Center)
                .setAdaptScale(true)
                .setKeepRatio(AdaptType.Horizontal)
                .setCellWidth((width - 30 * lineLimit) / lineLimit)
                .setScrollType(fairygui.ScrollType.Both)
                .setLineGap(30)
                .setLineCount(lineLimit)
                .setColumnGap(30)
                .setGridSize(width, height)
                .bounce(false)
                .setMaxItems(max);
            dataMgr.load().then((result) => {
                if (this.disposed) return;
                this.setDatas(result.promotion)
                    .apply();
            });
            if (autoApply) {
                return this.apply();
            }
            return this;
        }
        setVerticalGrid(type, width, height, columnLimit, max, autoApply) {
            this.setItem(type)
                .setLayout(fairygui.ListLayoutType.FlowHorizontal)
                .setAlign(AlignType.Center)
                .setAdaptScale(true)
                .setKeepRatio(AdaptType.Vertical)
                .setCellHeight((height - 30 * columnLimit) / columnLimit)
                .setScrollType(fairygui.ScrollType.Both)
                .setLineGap(30)
                .setLineCount(columnLimit)
                .setColumnGap(30)
                .setGridSize(width, height)
                .bounce(false)
                .setMaxItems(max);
            dataMgr.load().then((result) => {
                if (this.disposed) return;
                this.setDatas(result.promotion)
                    .apply();
            });
            if (autoApply) {
                return this.apply();
            }
            return this;
        }
        get adaptScale() {
            return this._adaptScale;
        }
        setAdaptScale(value) {
            this._adaptScale = value;
            return this;
        }
        get listFit() {
            return this._listFit;
        }
        setListFit(value) {
            this._listFit = value;
            return this;
        }
        get keepRatio() {
            return this._keepRatio;
        }
        setKeepRatio(value) {
            this._keepRatio = value;
            return this;
        }
        get align() {
            let listView = this.view;
            let result = AlignType.Center;
            if (listView && listView.list) {
                let horizontal = listView.list.align;
                let vertical = listView.list.verticalAlign;
                switch (horizontal) {
                    case list.AlignMiddle:
                        switch (vertical) {
                            case list.AlignBottom:
                                result = AlignType.Bottom;
                                break;
                            case list.AlignCenter:
                                result = AlignType.Center;
                                break;
                            default:
                                result = AlignType.Top;
                                break;
                        }
                        break;
                    case list.AlignRight:
                        switch (vertical) {
                            case list.AlignBottom:
                                result = AlignType.BottomRight;
                                break;
                            case list.AlignCenter:
                                result = AlignType.Right;
                                break;
                            default:
                                result = AlignType.TopRight;
                                break;
                        }
                        break;
                    default:
                        switch (vertical) {
                            case list.AlignBottom:
                                result = AlignType.BottomLeft;
                                break;
                            case list.AlignCenter:
                                result = AlignType.Left;
                                break;
                            default:
                                result = AlignType.TopLeft;
                                break;
                        }
                        break;
                }
            }
            return result;
        }
        setAlign(type) {
            let listView = this.view;
            if (listView && listView.list) {
                switch (type) {
                    case AlignType.Center:
                        listView.list.align = list.AlignCenter;
                        listView.list.verticalAlign = list.AlignMiddle;
                        break;
                    case AlignType.Top:
                        listView.list.align = list.AlignCenter;
                        listView.list.verticalAlign = list.AlignTop;
                        break;
                    case AlignType.Bottom:
                        listView.list.align = list.AlignCenter;
                        listView.list.verticalAlign = list.AlignBottom;
                        break;
                    case AlignType.Left:
                        listView.list.align = list.AlignLeft;
                        listView.list.verticalAlign = list.AlignMiddle;
                        break;
                    case AlignType.Right:
                        listView.list.align = list.AlignRight;
                        listView.list.verticalAlign = list.AlignMiddle;
                        break;
                    case AlignType.TopLeft:
                        listView.list.align = list.AlignLeft;
                        listView.list.verticalAlign = list.AlignTop;
                        break;
                    case AlignType.BottomLeft:
                        listView.list.align = list.AlignLeft;
                        listView.list.verticalAlign = list.AlignBottom;
                        break;
                    case AlignType.TopRight:
                        listView.list.align = list.AlignRight;
                        listView.list.verticalAlign = list.AlignTop;
                        break;
                    case AlignType.BottomRight:
                        listView.list.align = list.AlignRight;
                        listView.list.verticalAlign = list.AlignBottom;
                        break;
                }
            }
            return this;
        }
        get lineCount() {
            let listView = this.view;
            if (listView && listView.list) {
                return listView.list.lineCount;
            }
            return 0;
        }
        setLineCount(count) {
            let listView = this.view;
            listView && listView.list && (listView.list.lineCount = count);
            return this;
        }
        get lineGap() {
            let listView = this.view;
            if (listView && listView.list) {
                return listView.list.lineGap;
            }
            return 0;
        }
        setLineGap(gap) {
            let listView = this.view;
            listView && listView.list && (listView.list.lineGap = gap);
            return this;
        }
        get columnCount() {
            let listView = this.view;
            if (listView && listView.list) {
                return listView.list.columnCount;
            }
            return 0;
        }
        setColumnCount(count) {
            let listView = this.view;
            listView && listView.list && (listView.list.columnCount = count);
            return this;
        }
        get columnGap() {
            let listView = this.view;
            if (listView && listView.list) {
                return listView.list.columnGap;
            }
            return 0;
        }
        setColumnGap(gap) {
            let listView = this.view;
            listView && listView.list && (listView.list.columnGap = gap);
            return this;
        }
        get layout() {
            let listView = this.view;
            return listView ? listView.list.layout : fairygui.ListLayoutType.FlowHorizontal;
        }
        setLayout(type) {
            let listView = this.view;
            listView && listView.list && (listView.list.layout = type);
            return this;
        }
        get cellWidth() {
            return this._cellWidth;
        }
        setCellWidth(width) {
            this._cellWidth = width;
            return this;
        }
        get cellHeight() {
            return this._cellHeight;
        }
        setCellHeight(height) {
            this._cellHeight = height;
            return this;
        }
        setCellSize(width, height) {
            this._cellWidth = width;
            this._cellHeight = height;
            return this;
        }
        get x() {
            return this.view ? this.view.x : 0;
        }
        setX(x) {
            this.view && (this.view.x = x);
            return this;
        }
        get y() {
            return this.view ? this.view.y : 0;
        }
        setY(y) {
            this.view && (this.view.y = y);
            return this;
        }
        setXY(x, y) {
            if (this.view) {
                this.view.x = x;
                this.view.y = y;
            }
            return this;
        }
        get scaleX() {
            return this.view ? this.view.scaleX : 1;
        }
        setScaleX(x) {
            this.view && (this.view.scaleX = x);
            return this;
        }
        get scaleY() {
            return this.view ? this.view.scaleY : 1;
        }
        setScaleY(y) {
            this.view && (this.view.scaleY = y);
            return this;
        }
        setScaleXY(x, y) {
            if (this.view) {
                this.view.scaleX = x;
                this.view.scaleY = y;
            }
            return this;
        }
        get gridWidth() {
            return this.view ? this.view.width : 0;
        }
        setGridWidth(width) {
            this.view && (this.view.width = width);
            return this;
        }
        snapWidth() {
            this.view && (this.view.width = fairygui.GRoot.inst.width * (1 / this.view.scaleX));
            return this;
        }
        get gridHeight() {
            return this.view ? this.view.height : 0;
        }
        setGridHeight(height) {
            this.view && (this.view.height = height);
            return this;
        }
        snapHeight() {
            this.view && (this.view.height = fairygui.GRoot.inst.height * (1 / this.view.scaleY));
            return this;
        }
        setGridSize(width, height) {
            if (this.view) {
                this.view.width = width;
                this.view.height = height;
            }
            return this;
        }
        get marginLeft() {
            if (this.view && this.view instanceof zs.ui.FGUI_list) {
                return this.view.list.margin.left;
            }
            return 0;
        }
        setMarginLeft(left) {
            let listView = this.view;
            listView && listView.list && (listView.list.margin.left = left);
            return this;
        }
        get marginRight() {
            if (this.view && this.view instanceof zs.ui.FGUI_list) {
                return this.view.list.margin.right;
            }
            return 0;
        }
        setMarginRight(right) {
            let listView = this.view;
            listView && listView.list && (listView.list.margin.right = right);
            return this;
        }
        get marginTop() {
            if (this.view && this.view instanceof zs.ui.FGUI_list) {
                return this.view.list.margin.top;
            }
            return 0;
        }
        setMarginTop(top) {
            let listView = this.view;
            listView && listView.list && (listView.list.margin.top = top);
            return this;
        }
        get marginBottom() {
            if (this.view && this.view instanceof zs.ui.FGUI_list) {
                return this.view.list.margin.bottom;
            }
            return 0;
        }
        setMarginBottom(bottom) {
            let listView = this.view;
            listView && listView.list && (listView.list.margin.bottom = bottom);
            return this;
        }
        get margin() {
            if (this.view && this.view instanceof zs.ui.FGUI_list) {
                return this.view.list.margin;
            }
            return null;
        }
        setMargin(left, right, top, bottom) {
            let listView = this.view;
            if (listView && listView.list) {
                listView.list.margin.left = left;
                listView.list.margin.right = right;
                listView.list.margin.top = top;
                listView.list.margin.bottom = bottom;
            }
            return this;
        }
        get background() {
            if (this.view && this.view instanceof zs.ui.FGUI_list) {
                return this.view.background.url;
            }
            return null;
        }
        setBackground(url) {
            let listView = this.view;
            if (listView && listView.background) {
                if (Array.isArray(url) && url.length > 1) {
                    zs.fgui.loadPack(url[0]).then((res) => {
                        listView.background.url = zs.ui.readURL(res, url[1]);
                    });
                } else {
                    listView.background.url = url;
                }
            }
            return this;
        }
        get item() {
            return this._itemType;
        }
        setItem(type) {
            this._itemType = type;
            let listView = this.view;
            if (listView && listView.list) {
                listView.list.defaultItem = this._itemType.URL;
            }
            return this;
        }
        get datas() {
            return this._datas;
        }
        setDatas(datas) {
            this._datas = datas.filter(element => true);
            this._datas.sort((a, b) => Math.random() > 0.5 ? -1 : 1)
            return this;
        }
        get maxItems() {
            return this._maxItems;
        }
        setMaxItems(value) {
            this._maxItems = value;
            return this;
        }
        get scrollType() {
            let listView = this.view;
            if (listView && listView.list) {
                return listView.list.scrollPane["_scrollType"];
            }
            return fairygui.ScrollType.Both;
        }
        setScrollType(type) {
            let listView = this.view;
            if (listView && listView.list) {
                listView.list.scrollPane["_scrollType"] = type;
            }
            return this;
        }
        get autoScrollSpeed() {
            return this._autoScrollSpeed;
        }
        setAutoScrollSpeed(value) {
            this._autoScrollSpeed = value;
            return this;
        }
        get dragRecoverTime() {
            return this._dragRecoverTime;
        }
        setDragRecoverTime(value) {
            this._dragRecoverTime = value;
            return this;
        }
        get transition() {
            return this._transition;
        }
        setTransition(transition) {
            this._transition = transition;
            return this;
        }
        setDataHandler(handler) {
            if (handler) {
                handler.once = false;
                this._itemRendererHandler = handler;
            }
            return this;
        }
        setClickHandler(handler) {
            this._clickHandler = handler;
            return this;
        }
        setScrollExport() {
            this._bScrollExport = true;
            return this;
        }
        fit() {
            let listView = this.view;
            if (listView && listView.list) {
                listView.list.resizeToFit();
                let width = listView.list.width;
                let height = listView.list.height;
                listView.width = width;
                listView.height = height;
                listView.list.width = width;
                listView.list.height = height;
            }
            return this;
        }
        loop() {
            let listView = this.view;
            if (listView && listView.list && this._itemType) {
                if (listView.list.layout == fairygui.ListLayoutType.FlowHorizontal) {
                    listView.list.layout = fairygui.ListLayoutType.SingleColumn;
                } else if (listView.list.layout == fairygui.ListLayoutType.FlowVertical) {
                    listView.list.layout = fairygui.ListLayoutType.SingleRow;
                }
                listView.list.setVirtualAndLoop();
            }
            if (!this._itemType) {
                zs.log.warn("请先使用SetItem设置列表组件，再执行loop", "Exporter");
            }
            return this;
        }
        virtual() {
            let listView = this.view;
            if (listView && listView.list && this._itemType) {
                listView.list.setVirtual();
            }
            if (!this._itemType) {
                zs.log.warn("请先使用SetItem设置列表组件，再执行virtual", "Exporter");
            }
            return this;
        }
        bounce(value) {
            let listView = this.view;
            if (listView && listView.list) {
                listView.list.scrollPane.bouncebackEffect = value;
            }
            return this;
        }
        setShakeTime(value) {
            this.shakeTime = value;
            return this;
        }
        apply() {
            let listView = this.view;
            if (listView && listView.list && !this.disposed) {
                listView.list.handleSizeChanged();
                let margin = this.margin;
                this._effectWidth = this.gridWidth - margin.left - margin.right;
                this._effectHeight = this.gridHeight - margin.top - margin.bottom;
                if (this._effectWidth <= 0 || this._effectHeight <= 0) {
                    listView.list.numItems = 0;
                } else {
                    if (this.maxItems > 0) {
                        listView.list.numItems = this._datas ? Math.min(this._datas.length, this._maxItems) : 0;
                    } else {
                        listView.list.numItems = this._datas ? this._datas.length : 0;
                    }
                }
                if (this._listFit) {
                    listView.list.resizeToFit(listView.list.numItems);
                }
                if (this._autoScrollSpeed != 0) {
                    Laya.timer.clear(this, this.onAutoScroll);
                    Laya.timer.frameLoop(1, this, this.onAutoScroll);
                    this._isAutoScrolling = true;
                }
                if (this._bScrollExport) {
                    listView.list.off(fairygui.Events.DRAG_START, this, this.scrollStart);
                    listView.list.off(fairygui.Events.DRAG_END, this, this.scrollJumpExport);
                    listView.list.on(fairygui.Events.DRAG_START, this, this.scrollStart);
                    listView.list.on(fairygui.Events.DRAG_END, this, this.scrollJumpExport);
                }
                if (this.shakeTime && this.shakeTime > 0) {
                    Laya.timer.once(this.shakeTime, this, this.refreshItem)
                }
            }
            return this;
        }
        applyConfig(config) {
            if (config) {
                config.scalex != null && config.scalex != undefined && (this.setScaleX(config.scalex));
                config.scaley != null && config.scaley != undefined && (this.setScaleY(config.scaley));
                let item = zs.fgui.configs.items[config.item];
                if (config.mode && item != null) {
                    switch (config.mode) {
                        case "hlist":
                            if (config.height) {
                                this.setHorizontalList(item, config.height, config.max || 0, false);
                                item == null;
                            }
                            break;
                        case "vlist":
                            if (config.width) {
                                this.setVerticalList(item, config.width, config.max || 0, false);
                                item == null;
                            }
                            break;
                        case "hgrid":
                            if (config.width && config.height && config.lineLimit) {
                                this.setHorizontalGrid(item, config.width, config.height, config.lineLimit, config.max || 0, false);
                                item == null;
                            }
                            break;
                        case "vgrid":
                            if (config.width && config.height && config.columnLimit) {
                                this.setVerticalGrid(item, config.width, config.height, config.columnLimit, config.max || 0, false);
                                item == null;
                            }
                            break;
                        case "side":
                            if (config.width) {
                                this.setSideList(item, config.width, config.max || 0, false);
                                item == null;
                            }
                            break;
                    }
                }
                config.adaptscale != null && config.adaptscale != undefined && (this.setAdaptScale(config.adaptscale));
                config.listfit != null && config.listfit != undefined && (this.setListFit(config.listfit));
                if (config.keepratio) {
                    switch (config.keepratio) {
                        case "horizontal":
                            this.setKeepRatio(zs.AdaptType.Horizontal);
                            break;
                        case "vertical":
                            this.setKeepRatio(zs.AdaptType.Vertical);
                            break;
                        default:
                            this.setKeepRatio(zs.AdaptType.None);
                            break;
                    }
                }
                if (config.align) {
                    switch (config.align) {
                        case "center":
                            this.setAlign(zs.AlignType.Center);
                            break;
                        case "top":
                            this.setAlign(zs.AlignType.Top);
                            break;
                        case "bottom":
                            this.setAlign(zs.AlignType.Bottom);
                            break;
                        case "left":
                            this.setAlign(zs.AlignType.Left);
                            break;
                        case "right":
                            this.setAlign(zs.AlignType.Right);
                            break;
                        case "topleft":
                            this.setAlign(zs.AlignType.TopLeft);
                            break;
                        case "bottomleft":
                            this.setAlign(zs.AlignType.BottomLeft);
                            break;
                        case "topright":
                            this.setAlign(zs.AlignType.TopRight);
                            break;
                        case "bottomright":
                            this.setAlign(zs.AlignType.BottomRight);
                            break;
                    }
                }
                config.linecount != null && config.linecount != undefined && (this.setLineCount(config.linecount));
                config.linegap != null && config.linegap != undefined && (this.setLineGap(config.linegap));
                config.columncount != null && config.columncount != undefined && (this.setColumnCount(config.columncount));
                config.columngap != null && config.columngap != undefined && (this.setColumnGap(config.columngap));
                if (config.layout) {
                    switch (config.layout) {
                        case "singlecolumn":
                            this.setLayout(fairygui.ListLayoutType.SingleColumn);
                            break;
                        case "singlerow":
                            this.setLayout(fairygui.ListLayoutType.SingleRow);
                            break;
                        case "flowhorizontal":
                            this.setLayout(fairygui.ListLayoutType.FlowHorizontal);
                            break;
                        case "flowvertical":
                            this.setLayout(fairygui.ListLayoutType.FlowVertical);
                            break;
                        case "pagination":
                            this.setLayout(fairygui.ListLayoutType.Pagniation);
                            break;
                    }
                }
                config.cellwidth != null && config.cellwidth != undefined && (this.setCellWidth(config.cellwidth));
                config.cellheight != null && config.cellheight != undefined && (this.setCellHeight(config.cellheight));
                config.x != null && config.x != undefined && (this.setX(x));
                config.y != null && config.y != undefined && (this.setY(y));
                config.gridwidth != null && config.gridwidth != undefined && (this.setGridWidth(config.gridWidth));
                config.gridheight != null && config.gridheight != undefined && (this.setGridHeight(config.gridHeight));
                config.snapwidth && (this.snapWidth());
                config.snapheight && (this.snapheight());
                config.marginleft != null && config.marginleft != undefined && (this.setMarginLeft(config.marginleft));
                config.marginright != null && config.marginright != undefined && (this.setMarginRight(config.marginright));
                config.margintop != null && config.margintop != undefined && (this.setMarginTop(config.margintop));
                config.marginbottom != null && config.marginbottom != undefined && (this.setMarginBottom(config.marginbottom));
                config.background && (this.setBackground(config.background));
                item && (this.setItem(item));
                config.max && (this.setMaxItems(config.max));
                if (config.scrolltype) {
                    switch (config.scrolltype) {
                        case "horizontal":
                            this.setScrollType(fairygui.ScrollType.Horizontal);
                            break;
                        case "vertical":
                            this.setScrollType(fairygui.ScrollType.Vertical);
                            break;
                        case "both":
                            this.setScrollType(fairygui.ScrollType.Both);
                            break;

                    }
                }
                config.autoscrollspeed != null && config.autoscrollspeed != undefined && (this.setAutoScrollSpeed(config.autoscrollspeed));
                config.dragrecovertime != null && config.dragrecovertime != undefined && (this.setDragRecoverTime(config.dragrecovertime));
                config.transition && (this.setTransition(config.transition));
                config.fit && (this.fit());
                config.loop && (this.loop());
                config.virtual && (this.virtual());
                config.bounce != null && config.bounce != undefined && (this.bounce(config.bounce));
                config.shaketime != null && config.shaketime != undefined && (this.setShakeTime(config.shaketime));
            }
            return this.apply();
        }
        startShake() {
            for (let index = 0; index < this.view.list.numChildren; index++) {
                let item = this.view.list.getChildAt(index);
                this.shakeNode(item);
            }

            Laya.timer.once(this.shakeTime, this, () => {
                this.refreshItem();
            })
        }
        stopShake() {
            for (let index = 0; index < this.view.list.numChildren; index++) {
                let item = this.view.list.getChildAt(index);
                Laya.Tween.clearAll(item)
            }
        }
        refreshItem() {
            this._datas.sort((a, b) => Math.random() > 0.5 ? -1 : 1);
            if (this.maxItems > 0) {
                this.view.list.numItems = this._datas ? Math.min(this._datas.length, this._maxItems) : 0;
            } else {
                this.view.list.numItems = this._datas ? this._datas.length : 0;
            }
            if (this.view.list._virtual)
                this.view.list.refreshVirtualList();
            this.startShake()
        }
        shakeNode(node, index = 0) {
            var dt = 100;
            var rotation = 10
            index++;
            switch (index) {
                case 0:
                    node.rotation = 0;
                    Laya.Tween.to(node, { rotation: rotation / 2 }, dt / 2, null, Laya.Handler.create(this, this.shakeNode, [node, index]))
                    break;
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    Laya.Tween.to(node, { rotation: rotation * (index % 2 == 0 ? 1 : -1) }, dt, null, Laya.Handler.create(this, this.shakeNode, [node, index]))
                    break
                case 6:
                    Laya.Tween.to(node, { rotation: 0 }, dt / 2)
                    break
            }
        }
        onDragStateBegin() {
            this._readyDrag = true;
        }
        onDragStateChanged() {
            if (this._readyDrag && this._dragRecoverTime > 0) {
                this._isAutoScrolling = false;
                this._dragStopCount = 0;
            }
            if (this._readyDrag) {
                this._readyDrag = false;
            }
        }
        onItemProvider() {
            return this._itemType.URL;
        }
        onItemRenderer(index, item) {
            if (index < 0 || index >= this._datas.length) {
                item.picture.icon = '';
                item.title.text = '';
                item.desc && (item.desc = '');
                item.data = null;
                return;
            }
            let data = this._datas[index];
            if (this._cellWidth > 0 || (this._adaptScale && item.width > this._effectWidth)) {
                let realWidth = this._adaptScale ? this._effectWidth : item.width;
                if (this._cellWidth > 0) {
                    realWidth = Math.min(realWidth, this._cellWidth);
                }
                if (this.keepRatio == AdaptType.None || this.keepRatio == AdaptType.Horizontal) {
                    let scale = realWidth / item.width;
                    item.width = realWidth;
                    item.height *= scale;
                }
            }
            if (this._cellHeight > 0 || (this._adaptScale && item.height > this._effectHeight)) {
                let realHeight = this._adaptScale ? this._effectHeight : item.height;
                if (this._cellHeight > 0) {
                    realHeight = Math.min(realHeight, this._cellHeight);
                }
                if (this.keepRatio == AdaptType.None || this.keepRatio == AdaptType.Vertical) {
                    let scale = realHeight / item.height;
                    item.height = realHeight;
                    item.width *= scale;
                }
            }
            if (this._transition && this._transition.length >= 0) {
                let transition = item.getTransition(this._transition);
                if (transition) { transition.play(); }
            }
            if (this._itemRendererHandler) {
                this._itemRendererHandler.runWith([item, data]);
            } else {
                item.picture.icon = data.app_icon;
                if (data.app_title && item.title) {
                    item.title.text = data.app_title;
                } else if (item.title) {
                    item.title.text = "";
                }
                if (data.app_desc && item.desc) {
                    item.desc.text = data.app_desc;
                } else if (item.desc) {
                    item.desc.text = "";
                }
            }
            item.data = data;
        }
        onAutoScroll() {
            let listView = this.view;
            if (listView && listView.list) {
                if (this._isAutoScrolling && this.scrollType != fairygui.ScrollType.Both) {
                    let scrollDis = this._autoScrollSpeed * Laya.timer.delta * 0.001 * (this._autoScrollForward ? 1 : -1);
                    let scrollPane = listView.list.scrollPane;
                    if (this.scrollType == fairygui.ScrollType.Horizontal) {
                        scrollPane.setPosX(scrollDis + listView.list.scrollPane.posX);
                        if (scrollPane.percX >= 1) {
                            this._autoScrollForward = false;
                        }
                        else if (scrollPane.percX <= 0) {
                            this._autoScrollForward = true;
                        }
                    }
                    else {
                        scrollPane.setPosY(scrollDis + listView.list.scrollPane.posY);
                        if (scrollPane.percY >= 1) {
                            this._autoScrollForward = false;
                        }
                        else if (scrollPane.percY <= 0) {
                            this._autoScrollForward = true;
                        }
                    }
                }
                else if (this.scrollType != fairygui.ScrollType.Both) {
                    this._dragStopCount += Laya.timer.delta * 0.001;
                    if (this._dragStopCount > this._dragRecoverTime) {
                        this._dragStopCount = 0;
                        this._isAutoScrolling = true;
                    }
                }
            }
        }
        refreshSingleItem(index) {
            var newIdx = Math.floor(Math.random() * this._datas.length);
            if (this._datas.length > 1 && newIdx == index) {
                // 防止自己换自己
                return this.refreshSingleItem(index);
            }
            // console.log("新的随机数是：", newIdx)
            var newData = this._datas[newIdx];
            var oldData = this._datas[index];
            if (newData) {
                this._datas[index] = newData;
                this._datas[newIdx] = oldData;
                this.apply();
                if (this.view.list._virtual)
                    this.view.list.refreshVirtualList();
            }
        }
        onClickItem(item, evt) {
            if (this._clickHandler) {
                this._clickHandler.runWith(item);
            } else {
                utils.navigateToMiniProgram(item.data).then(() => {
                    // 刷新该icon
                    let index = this._datas.indexOf(item.data)
                    this.refreshSingleItem(index)
                });
            }
        }
        scrollStart() {
            this.touchX = Laya.stage.mouseX;
            this.touchY = Laya.stage.mouseY;
        }
        scrollJumpExport() {
            // 滑动跳出
            if (utils.checkScroll(this.touchX, this.touchY, list.checkScrollDistance)) {
                var bScrollJump = zs.product.get("zs_slide_jump_switch");
                console.log("滑动跳转开关", bScrollJump)
                if (bScrollJump) {
                    this.randomJumpExport();
                }
            }
        }
        randomJumpExport() {
            if (!this._datas || this._datas.length <= 0) { return; }
            let data = this._datas[Math.floor(Math.random() * this._datas.length)];
            utils.navigateToMiniProgram(data);
        }
    }
    list.checkScrollDistance = 30;
    list.AlignTop = 'top';
    list.AlignBottom = 'bottom';
    list.AlignMiddle = 'middle';
    list.AlignLeft = 'left';
    list.AlignRight = 'right';
    list.AlignCenter = 'center';
    list.transitionShakeLeft = 'shakeLeft';
    list.transitionShakeRight = 'shakeRight';

    class card extends zs.fgui.base {
        constructor(component) {
            super(component);
            if (component && component instanceof zs.ui.FGUI_card) {
                component.on(Laya.Event.CLICK, this, this.onClickItem);
            }
        }
        static make() {
            let view = zs.ui.FGUI_card.createInstance();
            return view;
        }
        static type() {
            return zs.ui.FGUI_card;
        }
        check(component) {
            if (component instanceof zs.ui.FGUI_card) {
                return true;
            }
            return false;
        }
        get itemURL() {
            if (this.view && this.view instanceof zs.ui.FGUI_card) {
                return this.view.loader.url;
            }
            return null;
        }
        setItem(type) {
            let cardView = this.view;
            cardView && cardView.loader && (cardView.loader.url = type.URL);
            return this;
        }
        get autoSize() {
            if (this.view && this.view instanceof zs.ui.FGUI_card) {
                return this.view.loader.autoSize;
            }
            return null;
        }
        setAutoSize(value) {
            let cardView = this.view;
            cardView && cardView.loader && (cardView.loader.autoSize = value);
            return this;
        }
        get width() {
            if (this.view && this.view instanceof zs.ui.FGUI_card) {
                return this.view.loader.width;
            }
            return null;
        }
        setWidth(width, keepRatio) {
            this.setAutoSize(false);
            let cardView = this.view;
            if (cardView && cardView.loader) {
                let scale = width / cardView.loader.sourceWidth;
                cardView.loader.width = width;
                if (keepRatio) {
                    cardView.loader.height = scale * cardView.loader.sourceHeight;
                }
            }
            return this;
        }
        get height() {
            if (this.view && this.view instanceof zs.ui.FGUI_card) {
                return this.view.loader.height;
            }
            return null;
        }
        setHeight(height, keepRatio) {
            this.setAutoSize(false);
            let cardView = this.view;
            if (cardView && cardView.loader) {
                let scale = height / cardView.loader.sourceHeight;
                cardView.loader.height = height;
                if (keepRatio) {
                    cardView.loader.width = scale * cardView.loader.sourceWidth;
                }
            }
            return this;
        }
        setTransition(transition, stop) {
            let cardView = this.view;
            if (cardView) {
                let t = cardView.getTransition(transition);
                if (t) {
                    if (stop) {
                        t.stop();
                    }
                    else {
                        t.play();
                    }
                }
            }
            return this;
        }
        setData(data) {
            let cardView = this.view;
            if (cardView && cardView.loader) {
                let item = cardView.loader.component;
                item.data = data;
                if (this._cardRendererHandler) {
                    this._cardRendererHandler.runWith([item, data]);
                } else {
                    if (item instanceof zs.ui.FGUI_item) {
                        item.picture.icon = data.url;
                        item.title.text = data.title;
                        if (item.desc && data.desc) {
                            item.desc.text = data.desc;
                        } else if (item.desc) {
                            item.desc.text = "";
                        }
                    }
                }
            }
            return this;
        }
        applyConfig(config) {
            if (config) {
                let item = null;
                config.item && (item = zs.fgui.configs.items[config.item]);
                item && (this.setItem(item));
                if (config.autosize != null && config.autosize != undefined) {
                    this.setAutoSize(config.autosize);
                } else {
                    config.width && this.setWidth(config.width, config.keepratio);
                    config.height && this.setHeight(config.height, config.keepratio);
                }
            }
        }
        setDataHandler(handler) {
            if (handler) {
                handler.once = false;
                this._cardRendererHandler = handler;
            }
            return this;
        }
        setClickHandler(clickHandler) {
            this._clickHandler = clickHandler;
            return this;
        }
        onClickItem(item, evt) {
            if (this._clickHandler) {
                this._clickHandler.runWith(item);
            } else {
                utils.navigateToMiniProgram(item.info);
            }
        }
    }

    class full extends zs.fgui.base {
        setMistaken() { return this; }
        setClickContinue(handler) {
            this._clickContinue = handler;
            return this;
        }
        onClickContinue() {
            this._clickContinue && this._clickContinue.run();
        }
        enterJumpExport() {
            // 进入跳出
            var bAutoJump = zs.product.get("zs_auto_jump_switch");
            console.log("自动跳转开关", bAutoJump)
            if (bAutoJump) {
                this.randomJumpExport();
            }
            return this;
        }
        scrollJumpExport() {
            // 滑动跳出
            if (utils.checkScroll(this.touchX, this.touchY, full.checkScrollDistance)) {
                var bScrollJump = zs.product.get("zs_slide_jump_switch");
                console.log("滑动跳转开关", bScrollJump)
                if (bScrollJump) {
                    this.randomJumpExport();
                }
            }
        }
        randomJumpExport() { }
        apply() { return this; }
    }
    full.checkScrollDistance = 30;

    exports.utils = utils;
    exports.dataMgr = dataMgr;
    exports.list = list;
    exports.card = card;
    exports.full = full;
    exports.AdaptType = AdaptType;
}(window.zs.exporter = window.zs.exporter || {}));