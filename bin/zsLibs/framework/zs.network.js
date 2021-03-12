window.zs = window.zs || {};
(function (exports) {
    'user strict';

    let NetworkMode;
    (function (NetworkMode) {
        NetworkMode[NetworkMode["Local"] = 0] = "Local";
        NetworkMode[NetworkMode["Async"] = 1] = "Async";
        NetworkMode[NetworkMode["Sync"] = 2] = "Sync";
    })(NetworkMode = NetworkMode || (NetworkMode = {}));

    class MD5 {
        static rotateLeft(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }

        static addUnsigned(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            if (lX4 | lY4) {
                if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }

        static F(x, y, z) {
            return (x & y) | ((~x) & z);
        }

        static G(x, y, z) {
            return (x & z) | (y & (~z));
        }

        static H(x, y, z) {
            return (x ^ y ^ z);
        }

        static I(x, y, z) {
            return (y ^ (x | (~z)));
        }

        static FF(a, b, c, d, x, s, ac) {
            a = this.addUnsigned(a, this.addUnsigned(this.addUnsigned(this.F(b, c, d), x), ac));
            return this.addUnsigned(this.rotateLeft(a, s), b);
        }

        static GG(a, b, c, d, x, s, ac) {
            a = this.addUnsigned(a, this.addUnsigned(this.addUnsigned(this.G(b, c, d), x), ac));
            return this.addUnsigned(this.rotateLeft(a, s), b);
        }

        static HH(a, b, c, d, x, s, ac) {
            a = this.addUnsigned(a, this.addUnsigned(this.addUnsigned(this.H(b, c, d), x), ac));
            return this.addUnsigned(this.rotateLeft(a, s), b);
        }

        static II(a, b, c, d, x, s, ac) {
            a = this.addUnsigned(a, this.addUnsigned(this.addUnsigned(this.I(b, c, d), x), ac));
            return this.addUnsigned(this.rotateLeft(a, s), b);
        }

        static convertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWordsTempOne = lMessageLength + 8;
            var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
            var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        }

        static wordToHex(lValue) {
            var WordToHexValue = "",
                WordToHexValueTemp = "",
                lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValueTemp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
            }
            return WordToHexValue;
        }

        static uTF8Encode(string) {
            string = string.replace(/\x0d\x0a/g, "\x0a");
            var output = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    output += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    output += String.fromCharCode((c >> 6) | 192);
                    output += String.fromCharCode((c & 63) | 128);
                } else {
                    output += String.fromCharCode((c >> 12) | 224);
                    output += String.fromCharCode(((c >> 6) & 63) | 128);
                    output += String.fromCharCode((c & 63) | 128);
                }
            }
            return output;
        }

        static md5(string) {
            var x = Array();
            var k, AA, BB, CC, DD, a, b, c, d;
            var S11 = 7,
                S12 = 12,
                S13 = 17,
                S14 = 22;
            var S21 = 5,
                S22 = 9,
                S23 = 14,
                S24 = 20;
            var S31 = 4,
                S32 = 11,
                S33 = 16,
                S34 = 23;
            var S41 = 6,
                S42 = 10,
                S43 = 15,
                S44 = 21;
            string = this.uTF8Encode(string);
            x = this.convertToWordArray(string);
            a = 0x67452301;
            b = 0xEFCDAB89;
            c = 0x98BADCFE;
            d = 0x10325476;
            for (k = 0; k < x.length; k += 16) {
                AA = a;
                BB = b;
                CC = c;
                DD = d;
                a = this.FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
                d = this.FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                c = this.FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                b = this.FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                a = this.FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                d = this.FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                c = this.FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                b = this.FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                a = this.FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                d = this.FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                c = this.FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                b = this.FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                a = this.FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                d = this.FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                c = this.FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                b = this.FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                a = this.GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                d = this.GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                c = this.GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                b = this.GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
                a = this.GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                d = this.GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                c = this.GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                b = this.GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                a = this.GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                d = this.GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                c = this.GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                b = this.GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                a = this.GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                d = this.GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                c = this.GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                b = this.GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                a = this.HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                d = this.HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                c = this.HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                b = this.HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                a = this.HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                d = this.HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                c = this.HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                b = this.HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                a = this.HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                d = this.HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
                c = this.HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                b = this.HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                a = this.HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                d = this.HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                c = this.HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                b = this.HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                a = this.II(a, b, c, d, x[k + 0], S41, 0xF4292244);
                d = this.II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                c = this.II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                b = this.II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                a = this.II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                d = this.II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                c = this.II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                b = this.II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                a = this.II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                d = this.II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                c = this.II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                b = this.II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                a = this.II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                d = this.II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                c = this.II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                b = this.II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                a = this.addUnsigned(a, AA);
                b = this.addUnsigned(b, BB);
                c = this.addUnsigned(c, CC);
                d = this.addUnsigned(d, DD);
            }
            var tempValue = this.wordToHex(a) + this.wordToHex(b) + this.wordToHex(c) + this.wordToHex(d);
            return tempValue.toLowerCase();
        }

        static buildSign(params, isSecret) {
            isSecret = isSecret || true;
            var sortedKeys = Object.keys(params).sort();
            var signParam = '';
            for (var i = 0; i < sortedKeys.length; i++) {
                signParam += sortedKeys[i] + ":" + params[sortedKeys[i]];
            }
            if (isSecret) {
                signParam += zs.configs.gameCfg.secret;
            }
            var md5sign = this.md5(signParam);

            md5sign = md5sign.toLowerCase();

            return md5sign;
        }
    }

    class network {
        static async init() {
            let gameCfg = zs.configs.gameCfg;
            network.defaultData = gameCfg.network;

            await network.ping();
            let loginInfo = {
                user_id: 1,
                user_type: 1,
                update_time: Date.now(),
                is_new: 0
            };
            if (zs.platform.proxy) {
                let result = await zs.platform.async.getLoginParams();
                if (result) {
                    await network.login(result)
                        .then((result) => {
                            if (result.user_id) {
                                loginInfo = result;
                                zs.log.warn("登陆成功：", "Network", result);
                            }
                        });
                }
            }

            return loginInfo;
        }
        static getUrl(route) {
            if (network.domainIdx < 0 || network.domainIdx >= network.listDomain.length) {
                return null;
            }
            if (network.mapWebApi[route] == null) {
                zs.log.error('非法网络接口： ' + route, "Network");
                return null;
            }
            return network.listDomain[network.domainIdx] + '/' + network.version + '/' + network.mapWebApi[route];
        }
        static obj2arg(obj) {
            var args = []
            for (var k in obj)
                args.push(k + "=" + obj[k])
            return args.join("&"); // 返回对象  
        }
        static post(url, params, timeout) {
            return new Promise((resolve, reject) => {
                let xhr = new Laya.HttpRequest();
                let isTimeout = false;
                let isHandled = false;
                xhr.http.timeout = timeout ? timeout : 10000;
                zs.utils.sleep(xhr.http.timeout)
                    .then(() => {
                        if (!isHandled) {
                            reject();
                            isTimeout = true;
                        }
                    });
                xhr.once(Laya.Event.COMPLETE, this, (result) => {
                    if (!isTimeout) {
                        zs.log.debug('post ' + url + ' 成功', "Network", result);
                        let obj = JSON.parse(result);
                        resolve(obj.data);
                        isHandled = true;
                    }
                });
                xhr.once(Laya.Event.ERROR, this, (data) => {
                    if (!isTimeout) {
                        reject(data);
                        isHandled = true;
                    }
                });
                xhr.send(url, network.obj2arg(params), 'post', 'text');
            });
        }
        static get(url, params, timeout) {
            return new Promise((resolve, reject) => {
                let xhr = new Laya.HttpRequest();
                let isTimeout = false;
                let isHandled = false;
                xhr.http.timeout = timeout ? timeout : 10000;
                zs.utils.sleep(xhr.http.timeout)
                    .then(() => {
                        if (!isHandled) {
                            reject();
                            isTimeout = true;
                        }
                    });
                xhr.once(Laya.Event.COMPLETE, this, (result) => {
                    if (!isTimeout) {
                        let obj = JSON.parse(result);
                        resolve(obj.data);
                        isHandled = true;
                    }
                });
                xhr.once(Laya.Event.ERROR, this, (data) => {
                    if (!isTimeout) {
                        reject(data);
                        isHandled = true;
                    }
                });
                xhr.send(url, network.obj2arg(params), 'get', 'text');
            });
        }
        static nativeRequest(url, data, method, needSign, ignoreSecret) {
            if (needSign) {
                let sign = MD5.buildSign(data, !ignoreSecret);
                data = Object.assign(data, { sign: sign });
            }
            return new Promise((resolve, reject) => {
                zs.platform.async.request(
                    {
                        url: url,
                        data: data,
                        method: method
                    })
                    .then((result) => {
                        resolve(result);
                    })
                    .catch(() => {
                        var xhr = new XMLHttpRequest();
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == 4) {
                                var response = xhr.responseText;
                                if (xhr.status >= 200 && xhr.status < 400) {
                                    var result = {};
                                    try {
                                        result = JSON.parse(response)
                                    } catch (e) {
                                        zs.log.error('json parse error ', response)
                                        return reject(e);
                                    }
                                    return resolve(result);
                                } else {
                                    zs.log.error('error ', response)
                                    return reject(response);
                                }
                            }
                        };
                        xhr.timeout = 3000;
                        xhr.ontimeout = function (event) {
                            zs.log.error('error ', event)
                            return reject(event);
                        }
                        xhr.open(method, url, true);
                        if (method == "POST") {
                            xhr.open('POST', url);
                            xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
                            xhr.send(this.obj2arg(data));
                        } else {
                            xhr.send();
                        }
                    });
            });
        }
        static request(route, params, mode) {
            return new Promise((resolve, reject) => {
                let localData = null;
                let fullURL = network.getUrl(route);
                let defaultData = null;
                if (fullURL && (mode == null || mode == NetworkMode.Sync)) {
                    return network.post(fullURL, params)
                        .then((rep) => {
                            let key = null;
                            switch (route) {
                                case 'config':
                                    if (params && params.type === 'module') {
                                        key = params.module ? params.module : 'base_module';
                                        if (params.table) {
                                            key += '>>' + params.table;
                                        }
                                    }
                                    break;
                                case 'download':
                                    key = params.key;
                                    break;
                            }
                            if (rep != null && rep != "") {
                                network.setLocalData(route, rep, key);
                            }
                            resolve(rep);
                        })
                        .catch((rep) => {
                            reject(rep);
                        });
                } else if (fullURL == null || mode === NetworkMode.Local || mode === NetworkMode.Async) {
                    switch (route) {
                        case 'login':
                            localData = network.getLocalData(route);
                            break;
                        case 'config':
                            if (params && params.type === 'module') {
                                let key = params.module ? params.module : 'base_module';
                                if (params.table) {
                                    key += '>>' + params.table;
                                }
                                localData = network.getLocalData(route, key);
                            }
                            break;
                        case 'download':
                            if (params && params.key) {
                                localData = network.getLocalData(route, params.key);
                            }
                            break;
                        case 'update':
                            localData = true;
                            break;
                    }
                    if (localData == null) {
                        zs.log.fatal("本地网络缓存及默认值不存在: " + route, "Network");
                    }
                    defaultData = localData;
                    if (fullURL == null || mode === NetworkMode.Local) {
                        zs.log.debug(route + " 通讯返回本地数据", "Network");
                        return resolve(defaultData);
                    }
                }
                network.post(fullURL, params)
                    .then((rep) => {
                        let key = null;
                        switch (route) {
                            case 'config':
                                if (params && params.type === 'module') {
                                    key = params.module ? params.module : 'base_module';
                                    if (params.table) {
                                        key += '_' + params.table;
                                    }
                                }
                                break;
                            case 'download':
                                key = params.key;
                                break;
                        }
                        if (rep != null && rep != "") {
                            network.setLocalData(route, rep, key);
                        }
                    });
                return resolve(defaultData);
            });
        }
        static getLocalData(route, key) {
            let storageKey = route;
            if (key) {
                storageKey += '>>' + key;
            }
            let localData = Laya.LocalStorage.getItem('network_' + storageKey);
            if (localData) {
                return JSON.parse(localData);
            }
            let defaultData = network.defaultData[storageKey];
            return defaultData;
        }
        static setLocalData(route, data, key) {
            if (data == null || data == undefined) { return; }
            let storageKey = route;
            if (key) {
                storageKey += '>>' + key;
            }
            let strData = JSON.stringify(data);
            if (strData) {
                Laya.LocalStorage.setItem('network_' + storageKey, strData);
            }
        }
        static async ping() {
            network.domainIdx = -1;
            for (let i = 0; i < network.listDomain.length; i++) {
                let url = network.listDomain[i] + '/' + network.version + '/' + network.mapWebApi.ping;
                let params = {};
                zs.log.debug("ping: " + url);
                await network.get(url, params, 1000)
                    .then((res) => {
                        zs.log.debug("域名 " + url + " 正常通讯", "Network");
                        network.domainIdx = i;
                    })
                    .catch((res) => {
                        zs.log.warn("域名 " + url + " 无法正常通讯", "Network");
                    });
                if (network.domainIdx >= 0) {
                    break;
                }
            }
        }
        // --- request ---
        // gid 游戏标识（必填）
        // uid 用户ID（测试用，默认填1）
        // code 登录code，微信、手Q、OPPO、VIVO必填，头条非必填
        // is_old VIVO专用，区分新旧版本，0新1旧，默认为0
        // anonymous_code 头条登录字段
        // user_type 用户类型，默认为1
        // --- response ---
        // user_id 用户ID
        // user_type 用户类型
        // update_time 登录时间
        // is_new 是否为新玩家
        static async login(params, mode) {
            if (params == null) { params = {}; }
            params.gid = (zs.platform.proxy ? zs.platform.sync.mark : 'wx_') + zs.configs.gameCfg.gameId;
            zs.log.debug("登录参数：", "Network", params);
            return network.request('login', params, mode);
        }
        // --- request ---
        // gid 游戏标识（必填）
        // type 配置类型（switch 运营开关 module 模块配置）（必填）
        // module 模块名称（base_module 默认模块）
        // table 配置表名
        // version 配置版本（online 线上 test 测试）默认线上
        static async config(isSwitch, module, table, mode) {
            let params = {
                gid: (zs.platform.proxy ? zs.platform.sync.mark : 'wx_') + zs.configs.gameCfg.gameId,
                type: isSwitch ? 'switch' : 'module',
                pt: zs.configs.gameCfg.packgeTime
            };
            if (!isSwitch) {
                params.module = module ? module : 'base_module';
                if (table) {
                    params.table = table;
                }
            }
            if (zs.configs.gameCfg.debug) {
                params.version = 'test';
            }

            return network.request('config', params, mode);
        }
        // --- request ---
        // gid 游戏标识（必填）
        // uid 用户ID（必填）
        // key 关键词
        // data 数据
        static async update(key, data, mode) {
            let params = {
                gid: zs.platform.config.platformMark + zs.configs.gameCfg.gameId,
                uid: zs.core.userId,
                key: key,
                data: data
            };
            return network.request('update', params, mode);
        }
        // --- request ---
        // gid 游戏标识（必填）
        // uid 用户ID（必填）
        // key 关键词
        static async download(key, mode) {
            let params = {
                gid: zs.platform.config.platformMark + zs.configs.gameCfg.gameId,
                uid: zs.core.userId,
                key: key
            };
            return network.request('download', params, mode);
        }
    }
    network.version = 'v1';
    network.domainIdx = -1;
    network.defaultData = {};
    network.listDomain = [
        "https://gamesapi.zxmn2018.com",
        "https://gamesapi.zxmn2018.com",
        "https://gamesapi.zxmn2018.com"
    ];
    network.mapWebApi = {
        "ping": "game/ping",
        "login": "game/login",
        "config": "game/config",
        "update": "game/update",
        "download": "game/download"
    };

    exports.NetworkMode = NetworkMode;
    exports.MD5 = MD5;
    exports.network = network;
}(window.zs = window.zs || {}));