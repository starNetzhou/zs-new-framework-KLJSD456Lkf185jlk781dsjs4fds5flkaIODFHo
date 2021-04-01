window.zs = window.zs || {};
(function (exports) {
    class product {

        static get keys() {
            if (this._keys == null) {
                this._keys = {};
            }
            return this._keys;
        }

        static cleanProductKey(value) {
            return value.replace(/\s/g, "").replace('（', '(').replace('）', ')');
        }

        static init(productDef) {
            if (productDef == null) { return; }
            this._defines = productDef;
            for (let key in productDef) {
                key = this.cleanProductKey(key);
                if (zs.configs.gameCfg.pure) {
                    this.keys[key] = null;
                    this._defines[key] = null;
                } else {
                    this.keys[key] = productDef[key];
                }
            }
        }
        static sync(switchs) {
            if (switchs == null || zs.configs.gameCfg.pure) { return; }
            for (let key in switchs) {
                this.registe(key, switchs[key]);
            }

            this.scene = Laya.LocalStorage.getItem(this.firstSceneCache);
            if (!this.scene) {
                this.scene = zs.platform.sync.getScene();
                if (this.scene) {
                    Laya.LocalStorage.setItem(this.firstSceneCache, this.scene);
                }
            }

            let sceneMask = this.sceneCheck(this.keys[product.switchScene]);

            for (let key in this.keys) {
                if (!sceneMask) {
                    this.keys[key] = null;
                    if (this._defines) {
                        this._defines[key] = null;
                    }
                    continue;
                }

                let sceneKey = key + '(' + this.sceneMark + ')';
                let sceneInfo = this.keys[sceneKey];
                if (this.scene && sceneInfo && sceneInfo.length > 0) {
                    let sceneValue = this.sceneCheck(sceneInfo);
                    this.keys[key] = sceneValue;
                    if (this._defines) {
                        this._defines[key] = sceneValue;
                    }

                    if (!sceneValue) { continue; }
                }

                let cityKey = key + '(' + this.cityMark + ')';
                let cityInfo = this.keys[cityKey];
                if (this.city && cityInfo && cityInfo.length > 0) {
                    let cityValue = this.cityCheck(cityInfo);
                    this.keys[key] = cityValue;
                    if (this._defines) {
                        this._defines[key] = cityValue;
                    }

                    if (!cityValue) { continue; }
                }

                let timeKey = key + '(' + this.timeMark + ')';
                let timeInfo = this.keys[timeKey];
                if (this.timestamp && timeInfo && timeInfo.length > 0) {
                    let timeInfoSplit = timeInfo.split(/[|｜]/);
                    let timeValue = 1;
                    if (timeInfoSplit.length > 1) {
                        timeValue = 0;
                        for (let i = 0, n = timeInfoSplit.length; i < n; i++) {
                            if (!this.timeCheck(timeInfoSplit[i])) {
                                timeValue = i + 1;
                                break;
                            }
                        }
                    } else {
                        timeValue = this.timeCheck(timeInfo);
                    }

                    this.keys[key] = timeValue;
                    if (this._defines) {
                        this._defines[key] = timeValue;
                    }
                }
            }
        }
        static cityCheck(cities) {
            if (!this.city || !cities || cities === "") { return 1; }
            if (cities.replace(/\s/g, "").split(/[|｜]/).indexOf(this.city) < 0) { return 1; }
            return 0;
        }
        static sceneCheck(sceneVal) {
            if (!this.scene || !sceneVal || sceneVal === "") { return 1; }
            if (sceneVal.replace(/\s/g, "").split(/[|｜]/).indexOf(this.scene) < 0) { return 1; }
            return 0;
        }
        static timeCheck(times) {
            if (!this.timestamp || !times || times === "") { return 1; }
            let timeSplit = times.split('-');
            if (timeSplit.length < 2) { return 1; }

            let startTime = timeSplit[0].split(/[:：]/);
            let endTime = timeSplit[1].split(/[:：]/);

            let date = new Date(this.timestamp);
            let hour = date.getHours();
            let minute = date.getMinutes();

            if (startTime.length > 0) {
                let startHour = parseInt(startTime[0]);
                if (isNaN(startHour)) {
                    startHour = 0;
                }
                if (hour < startHour) { return 1; }
                if (hour == startHour && startTime.length > 1) {
                    let startMinute = parseInt(startTime[1]);
                    if (isNaN(startMinute)) {
                        startMinute = 0;
                    }
                    if (minute < startMinute) { return 1; }
                }
            }

            if (endTime.length > 0) {
                let endHour = parseInt(endTime[0]);
                if (isNaN(endHour)) {
                    endHour = 0;
                }
                if (hour > endHour) { return 1; }
                if (minute == endHour && endTime.length > 1) {
                    let endMinute = parseInt(endTime[1]);
                    if (isNaN(endMinute)) {
                        endMinute = 0;
                    }
                    if (minute > endMinute) { return 1; }
                }
            }

            return 0;
        }
        static registe(key, define) {
            if (define == null) { return; }
            key = this.cleanProductKey(key);

            let def = this.keys[key];
            if (def == null || (typeof def === typeof define)) {
                this.keys[key] = define;
                if (this._defines) {
                    this._defines[key] = define;
                }
            } else if (typeof def === 'number' && typeof define === 'string') {
                let numVal = parseFloat(define);
                if (isNaN(numVal)) { numVal = 0; }
                this.keys[key] = numVal;
                if (this._defines) {
                    this._defines[key] = numVal;
                }
            } else {
                zs.log.warn('关键词类型不匹配，无法注册产品关键词：' + key, 'Product');
            }
        }
        static get(key) {
            key = this.cleanProductKey(key);
            let def = this.keys[key];
            if (typeof def === 'function') {
                return def.call(this);
            } else {
                if (def == null) {
                    zs.log.warn("产品开关 " + key + " 不存在");
                }
                return def;
            }
        }
    }
    product.scene = null;
    product.city = null;
    product.timestamp = null;
    product.firstSceneCache = "first_enter_scene";
    product.switchScene = 'zs_scene_value';
    product.sceneMark = 'scene'
    product.cityMark = 'city';
    product.timeMark = 'time';

    exports.product = product;
}(window.zs = window.zs || {}));