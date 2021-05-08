window.zs = window.zs || {};
(function (exports, Laya) {
    'use strict';

    class utils {
        static getOrAddComponent(node, type) {
            if (node == null) {
                return;
            }
            let component = node.getComponent(type);
            if (component == null) {
                component = node.addComponent(type);
            }
            return component;
        }
        static sleep(timeout) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, timeout);
            });
        }
        static isToday(timestamp) {
            let tsNow = Date.now();
            if (tsNow - timestamp > 86400000) { return false; }
            let now = new Date(tsNow);
            let target = new Date(timestamp);
            if (now.getDate() != target.getDate()) {
                return false;
            } else {
                return true;
            }
        }
        static randInt(min, max) {
            return Math.random() * (max - min) + min << 0;
        }
        static srandInt(min, max) {
            return this.seedRandom() * (max - min) + min << 0;
        }
        static rand(min, max) {
            return Math.random() * (max - min) + min;
        }
        static srand(min, max) {
            return this.seedRandom() * (max - min) + min;
        }
        static seedRandom() {
            this.randSeed = (this.randSeed * 9301 + 49297) % 233280;
            return this.randSeed / 233280;
        }
        static setRandSeed(seed) {
            this.randSeed = seed;
            this.randSeed = (this.randSeed * 9301 + 49297) % 233280;
        }
        static pickNumbers(from, to, numPick) {
            if (numPick <= 0) { return []; }
            (from > to) && ([from, to] = [to, from]);

            let result = [];
            let picks = [];
            for (let i = from; i <= to; i++) { picks.push(i); }
            if (numPick >= picks.length) { numPick = picks.length; }

            for (let i = 0; i < numPick; i++) {
                let idx = this.randInt(0, picks.length);
                result.push(picks[idx]);
                picks.splice(idx, 1);
            }

            return result;
        }
        static spickNumbers(from, to, numPick, seed) {
            if (numPick <= 0) { return []; }
            (from > to) && ([from, to] = [to, from]);

            let result = [];
            let picks = [];
            for (let i = from; i <= to; i++) { picks.push(i); }
            if (numPick >= picks.length) { numPick = picks.length; }

            if (seed) { this.setRandSeed(seed); }
            for (let i = 0; i < numPick; i++) {
                let idx = this.srandInt(0, picks.length);
                result.push(picks[idx]);
                picks.splice(idx, 1);
            }

            return result;
        }
        static pickArray(array, numPick) {
            if (array == null || array.length <= 0 || numPick <= 0) { return []; }

            let result = [];
            let picks = array.concat();
            if (numPick >= picks.length) { numPick = picks.length; }

            for (let i = 0; i < numPick; i++) {
                let idx = this.randInt(0, picks.length);
                result.push(picks[idx]);
                picks.splice(idx, 1);
            }
            return result;
        }
        static spickArray(array, numPick, seed) {
            if (array == null || array.length <= 0 || numPick <= 0) { return []; }

            let result = [];
            let picks = array.concat();
            if (numPick >= picks.length) { numPick = picks.length; }

            if (seed) { this.setRandSeed(seed); }
            for (let i = 0; i < numPick; i++) {
                let idx = this.srandInt(0, picks.length);
                result.push(picks[idx]);
                picks.splice(idx, 1);
            }
            return result;
        }
        static isNumber(val) {
            let regPos = /^\d+(\.\d+)?$/; //非负浮点数
            let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
            if (regPos.test(val) || regNeg.test(val)) {
                return true;
            } else {
                return false;
            }
        }
        static startwith(str1, str2) {
            if (str1.length < str2.length) { return false; }

            return str1.slice(0, str2.length) == str2;
        }
        static flatKVJson(jsonObj, numParse) {
            let result = {};
            if (!Array.isArray(jsonObj) || jsonObj.length <= 0) { return result; }
            for (let i = 0, n = jsonObj.length; i < n; i++) {
                let kv = jsonObj[i];
                if (kv.key && kv.value) {
                    let val = kv.value;
                    if (numParse && typeof kv.value !== 'number') {
                        let tryNum = parseFloat(kv.value);
                        if (!isNaN(tryNum)) {
                            val = kv.value;
                        }
                    }
                    result[kv.key] = val;
                }
            }
            return result;
        }
        static getItem(key) {
            return Laya.LocalStorage.getItem(zs.core.appId + '.' + key);
        }
        static setItem(key, value) {
            Laya.LocalStorage.setItem(zs.core.appId + '.' + key, value);
        }

    }
    utils.randSeed = 5;

    exports.utils = utils;

}(window.zs = window.zs || {}, Laya));