window.zs = window.zs || {};
(function (exports) {
    class product {
        static init(productDef) {
            if (productDef == null) { return; }
            this._defines = productDef;
            for (let key in productDef) {
                if (key == '_defines' || key == 'get' || key == 'init' || key == 'registe' || key == 'sync') {
                    zs.log.warn('固有关键词冲突，无法注册产品关键词： ' + key, 'Product');
                    continue;
                }
                this[key] = productDef[key];
            }
        }
        static sync(switchs) {
            if (switchs == null) { return; }
            for (let key in switchs) {
                this.registe(key, switchs[key]);
            }
        }
        static registe(key, define) {
            if (define == null) { return; }
            if (key == '_defines' || key == 'get' || key == 'init' || key == 'registe' || key == 'sync') {
                zs.log.warn('固有关键词冲突，无法注册产品关键词： ' + key, 'Product');
                return;
            }

            let def = this[key];
            if (def == null || (typeof def === typeof define)) {
                this[key] = define;
                if (this._defines) {
                    this._defines[key] = define;
                }
            } else if (typeof def === 'number' && typeof define === 'string') {
                let numVal = parseFloat(define);
                if (isNaN(numVal)) { numVal = 0; }
                this[key] = numVal;
                if (this._defines) {
                    this._defines[key] = numVal;
                }
            } else {
                zs.log.warn('关键词类型不匹配，无法注册产品关键词：' + key, 'Product');
            }
        }
        static get(key) {
            let def = this[key];
            if (typeof def === 'function') {
                return def.call(this);
            } else {
                if(def == null) {
                    zs.log.warn("产品开关 " + key + " 不存在");
                }
                return def;
            }
        }
    }

    exports.product = product;
}(window.zs = window.zs || {}));