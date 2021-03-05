! function () {
    function e() {
      this.request = [], this.push = function (e) {
        if (this.request.length >= 18) {
          let t = this.request.shift();
          t().then(function (e) {}).catch(e => {}), this.request.push(e)
        } else this.request.push(e)
      }, this.concat = function () {
        this.request.map(function (e) {
          wx.Queue.push(e)
        }), this.request = []
      }
    }
  
    function t() {
      var e = "";
      try {
        e = wx.getStorageSync("aldstat_op")
      } catch (t) {
        e = wx.getStorageSync("aldstat_op")
      }
      if ("" === e) {
        if ("" === _) return "";
        try {
          O = e = wx.getStorageSync(_), e && wx.setStorageSync("aldstat_op", e)
        } catch (t) {
          O = e = wx.getStorageSync(_), e && wx.setStorageSync("aldstat_op", e)
        }
      }
      return e
    }
  
    function n() {
      function e(e) {
        return !/^\d+(.\d+)*$/.test(e.stageId) || e.stageId.length > 32 || isNaN(Number(e.stageId)) ? (console.error("关卡stageId必须符合传参规则，请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南-关卡分析！"), !1) : !("string" !== c(e.stageName) || e.stageName.length > 32) || (console.error("关卡名称为必传字段，且长度小于32个字符，请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南-关卡分析！"), !1)
      }
      var t = "",
        n = "",
        r = 0;
      this.onStart = function (o) {
        if (e(o)) {
          var a = {};
          r = Date.now(), a.sid = o.stageId, a.snm = o.stageName, ("string" === c(o.userId) && o.userId) < 32 ? a.uid = o.userId : a.uid = "", a.state = "start", n = d(), t = a, this.request()
        }
      }, this.onRunning = function (n) {
        if (e(n)) {
          var r = {
            params: {}
          };
          if (("string" === c(n.userId) && n.userId) < 32 ? r.uid = n.userId : r.uid = "", "" === n.event || "string" !== c(n.event) || (R.join(",") + ",").indexOf(n.event + ",") === -1) return void console.error("关卡running状态中仅支持" + R.join(",") + "事件类型，且为必传字段，请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南-关卡分析！");
          if (r.event = n.event, "object" !== c(n.params)) return void console.error("关卡running状态中params为必传字段，且该字段需为Object类型，请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南-关卡分析！");
          if ("string" !== c(n.params.itemName) || n.params.itemName.length > 32) return void console.error("道具/商品名称为必传字段，且长度小于32个字符，请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南-关卡分析！");
          r.params.itnm = n.params.itemName, "string" === c(n.params.itemId) && n.params.itemId.length < 32 && (r.params.itid = n.params.itemId), "number" === c(n.params.itemCount) && String(n.params.itemCount).length < 32 ? r.params.itco = n.params.itemCount : n.params.itemCount ? (console.error("关卡running状态中params.itemCount必须符合传参规则，请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南-关卡分析！"), r.params.itco = 1) : (console.info("关卡running状态中params.itemCount为选填项，请再次确认该项是否填写，如已确认，请忽略"), r.params.itco = 1), n.event.indexOf("pay") !== -1 && ("number" === c(n.params.itemMoney) && String(n.params.itemMoney).length < 32 ? r.params.money = n.params.itemMoney : n.params.itemMoney ? (console.error("关卡running状态中params.itemMoney必须符合传参规则，请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南-关卡分析！"), r.params.money = 0) : (console.info("关卡running状态中params.itemMoney为选填项，请再次确认该项是否填写，如已确认，请忽略"), r.params.money = 0)), "string" === c(n.params.desc) && n.params.desc.length < 64 && (r.params.desc = n.params.desc), r.state = "running", r.sid = n.stageId, r.snm = n.stageName, t = r, this.request()
        }
      }, this.onEnd = function (n) {
        if (e(n)) {
          var o = {};
          if (o.state = "end", ("string" === c(n.userId) && n.userId) < 32 ? o.uid = n.userId : o.uid = "", "" === n.event || "string" !== c(n.event) || (U.join(",") + ",").indexOf(n.event + ",") === -1) return void console.error("关卡end状态中仅支持" + U.join(",") + "事件类型，且为必传字段，请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南-关卡分析！");
          o.sid = n.stageId, o.snm = n.stageName, o.event = n.event, o.sdr = 0 !== r ? Date.now() - r : "", o.params = {}, "object" === c(n.params) && "string" === c(n.params.desc) && n.params.desc.length < 64 && (o.params.desc = n.params.desc), t = o, this.request()
        }
      }, this.request = function () {
        var e = g(I);
        t.ss = n, e.ct = t, f(e, "screen")
      }
    }
  
    function r() {
      function e(e) {
        return !/^\d+(.\d+)*$/.test(e.levelId) || e.levelId.length > 32 || isNaN(Number(e.levelId)) ? (console.error("levelId必须符合传参规则，请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南-等级分析！"), !1) : !("string" !== c(e.levelName) || e.levelName.length > 32) || (console.error("levelName为必传字段，且长度小于32个字符，请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南-等级分析！"), !1)
      }
      var t = "",
        n = "",
        r = 0;
      this.onInitLevel = function (r) {
        if (e(r)) {
          var o = {};
          "" == H ? (n = d(), wx.setStorageSync("ald_level_session", n)) : n = H, o.lid = r.levelId, o.lnm = r.levelName, ("string" === c(r.userId) && r.userId) < 32 ? o.uid = r.userId : o.uid = "", o.un = r.userName, o.state = "init", t = o, this.request()
        }
      }, this.onSetLevel = function (o) {
        if (e(o)) {
          var a = {};
          n = d(), wx.setStorageSync("ald_level_session", n), a.lid = o.levelId, a.lnm = o.levelName, ("string" === c(o.userId) && o.userId) < 32 ? a.uid = o.userId : a.uid = "", a.un = o.userName, a.state = "set", a.tmr = 0 !== K ? Date.now() - K : "", r = Date.now(), wx.setStorageSync("ald_level_time", r), t = a, this.request()
        }
      }, this.request = function () {
        var e = g(I);
        t.ls = n, e.ct = t, f(e, "level")
      }
    }
  
    function o() {
      return new Promise(function (e, t) {
        wx.getSetting({
          success: function (t) {
            t.authSetting["scope.userInfo"] ? wx.getUserInfo({
              success: function (t) {
                P = h(t.userInfo.avatarUrl.split("/")), e(t)
              },
              fail: function () {
                e("")
              }
            }) : e("")
          },
          fail: function () {
            e("")
          }
        })
      })
    }
  
    function a() {
      return new Promise(function (e, t) {
        wx.getNetworkType({
          success: function (t) {
            e(t)
          },
          fail: function () {
            e("")
          }
        })
      })
    }
  
    function s() {
      return new Promise(function (e, t) {
        "1044" == k.scene ? wx.getShareInfo({
          shareTicket: k.shareTicket,
          success: function (t) {
            e(t)
          },
          fail: function () {
            e("")
          }
        }) : e("")
      })
    }
  
    function i() {
      return new Promise(function (e, t) {
        y.getLocation ? wx.getLocation({
          success: function (t) {
            e(t)
          },
          fail: function () {
            e("")
          }
        }) : wx.getSetting({
          success: function (t) {
            t.authSetting["scope.userLocation"] ? (wx.getLocation({
              success: function (t) {
                e(t)
              },
              fail: function () {
                e("")
              }
            }), e("")) : e("")
          },
          fail: function () {
            e("")
          }
        })
      })
    }
  
    function c(e) {
      function t(e) {
        return Object.prototype.toString.call(e)
      }
      var n = {};
      return "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function (e, t) {
          n["[object " + e + "]"] = e.toLowerCase()
        }),
        function () {
          return null == e ? e : "object" == typeof e || "function" == typeof e ? n[t.call(e)] || "object" : typeof e
        }()
    }
  
    function u(e) {
      for (var t in e)
        if ("object" == typeof e[t] && null !== e[t]) return !0;
      return !1
    }
  
    function d() {
      function e() {
        return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
      }
      return e() + e() + e() + e() + e() + e() + e() + e()
    }
  
    function l() {
      this.concurrency = 4, this.queue = [], this.tasks = [], this.activeCount = 0;
      var e = this;
      this.push = function (t) {
        this.tasks.push(new Promise(function (n, r) {
          var o = function () {
            e.activeCount++, t().then(function (e) {
              n(e)
            }).then(function () {
              e.next()
            })
          };
          e.activeCount < e.concurrency ? o() : e.queue.push(o)
        }))
      }, this.all = function () {
        return Promise.all(this.tasks)
      }, this.next = function () {
        e.activeCount--, e.queue.length > 0 && e.queue.shift()()
      }
    }
  
    function f(e, n) {
      function r() {
        return new Promise(function (t, n) {
          var r = {
            se: b || "",
            op: O || "",
            img: P || ""
          };
          "" === w || (r.ai = w), wx.request({
            url: "https://" + v + ".aldwx.com/d.html",
            data: e,
            header: r,
            method: "GET",
            fail: function () {
              t("")
            },
            success: function (e) {
              t(200 == e.statusCode ? "" : "status error")
            }
          })
        })
      }
      y.useOpen && t(), j++, "show" == n && (e.uo = y.useOpen), e.as = C, e.at = D, e.rq_c = j, e.ifo = S, e.ak = y.app_key, e.uu = q, e.v = m, e.st = Date.now(), e.ev = n, e.te = x, e.wsr = k, "" !== p(e.ufo) && (e.ufo = e.ufo), e.ec = N, y.useOpen ? "" === O ? $.push(r) : (wx.Queue.push(r), $.concat()) : wx.Queue.push(r)
    }
  
    function p(e) {
      if (void 0 === e || "" === e) return "";
      var t = {};
      for (var n in e) "rawData" != n && "errMsg" != n && (t[n] = e[n]);
      return t
    }
  
    function g(e) {
      var t = {};
      for (var n in e) t[n] = e[n];
      return t
    }
  
    function h(e) {
      for (var t = "", n = 0; n < e.length; n++) e[n].length > t.length && (t = e[n]);
      return t
    }
    var m = "3.2.8",
      v = "glog",
      w = function () {
        return void 0 === wx.getAccountInfoSync ? "" : wx.getAccountInfoSync().miniProgram.appId.split("").map(function (e) {
          return e.charCodeAt(0) + 9
        }).join("-")
      }(),
      y = require("./ald-game-conf");
    "" === y.app_key && console.error("请在ald-game-conf.js文件中填写小游戏统计/广告监测平台创建小游戏后生成的app_key，请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南！"), y.useOpen && console.warn("提示：开启了useOpen配置后，如果不上传用户OpendID则不会上报数据，上传方式：http://doc.aldwx.com 小游戏统计/广告监测平台-快速接入指南-上传OpenID！"), y.app_key = y.app_key.replace(/\s/g, "");
    var _ = y.openKey,
      x = "wg";
    ! function () {
      wx.request({
        url: "https://" + v + ".aldwx.com/config/app.json",
        method: "GET",
        success: function (e) {
          200 === e.statusCode && (e.data.version > m && console.warn("您的SDK不是最新版本，部分功能不可用，请尽快前往 http://tj.aldwx.com/downSDK 升级"), e.data.warn && console.warn(e.data.warn), e.data.error && console.error(e.data.error))
        }
      })
    }();
    var S = "",
      q = function () {
        var e = "";
        try {
          e = wx.getStorageSync("aldstat_uuid"), wx.setStorageSync("ald_ifo", !0)
        } catch (t) {
          e = "uuid_getstoragesync"
        }
        if (e) S = !1;
        else {
          e = d(), S = !0;
          try {
            wx.setStorageSync("aldstat_uuid", e)
          } catch (e) {
            wx.setStorageSync("aldstat_uuid", "uuid_getstoragesync")
          }
        }
        return e
      }(),
      I = {},
      b = "",
      O = t(),
      N = 0,
      j = "",
      k = wx.getLaunchOptionsSync(),
      M = Date.now(),
      D = "" + Date.now() + Math.floor(1e7 * Math.random()),
      C = "" + Date.now() + Math.floor(1e7 * Math.random()),
      A = 0,
      L = "",
      P = "",
      E = !0,
      T = !1,
      Q = ["aldSendEvent", "aldOnShareAppMessage", "aldShareAppMessage", "aldSendSession", "aldSendOpenid", "aldLevelEvent", "aldRevenue"],
      R = ["payStart", "paySuccess", "payFail", "die", "revive", "tools", "award"],
      U = ["complete", "fail"],
      K = wx.getStorageSync("ald_level_time") || 0,
      H = wx.getStorageSync("ald_level_session") || "";
    void 0 === wx.Queue && (wx.Queue = new l, wx.Queue.all());
    var $ = new e;
    (function () {
      return Promise.all([o(), a(), i()])
    })().then(function (e) {
      "" !== e[2] ? (I.lat = e[2].latitude || "", I.lng = e[2].longitude || "", I.spd = e[2].speed || "") : (I.lat = "", I.lng = "", I.spd = ""), "" !== e[1] ? I.nt = e[1].networkType || "" : I.nt = "";
      var t = g(I);
      "" !== e[0] && (t.ufo = e[0], L = e[0]), f(t, "init")
    }), wx.onShow(function (e) {
      if (k = e, A = Date.now(), !E && !T) {
        D = "" + Date.now() + Math.floor(1e7 * Math.random()), S = !1;
        try {
          wx.setStorageSync("ald_ifo", !1)
        } catch (e) {}
      }
      E = !1, T = !1;
      var t = g(I),
        n = g(I);
      if (t.sm = A - M, e.query.ald_share_src && e.shareTicket && "1044" === e.scene ? (n.tp = "ald_share_click", s().then(function (e) {
          n.ct = e, f(n, "event")
        })) : e.query.ald_share_src && (n.tp = "ald_share_click", n.ct = "1", f(n, "event")), "" === O) {
        let e = wx.getAccountInfoSync().miniProgram.appId;
        wx.login({
          success(t) {
            wx.request({
              url: "https://glog.aldwx.com/authorize/mini_program_openid",
              data: {
                ai: e,
                uuid: q,
                jc: t.code,
                reqid: "1"
              },
              success(e) {
                e.data.code || (O = e.data.data.openid, wx.setStorageSync("aldstat_op", e.data.data.openid))
              }
            })
          },
          fail(e) {}
        })
      }
      f(t, "show")
    }), wx.onHide(function () {
      wx.setStorageSync("ald_level_session", "");
      var e = g(I);
      e.dr = Date.now() - A, "" === L ? wx.getSetting({
        success: function (t) {
          t.authSetting["scope.userInfo"] ? wx.getUserInfo({
            success: function (t) {
              e.ufo = t, L = t, P = h(t.userInfo.avatarUrl.split("/")), f(e, "hide")
            }
          }) : f(e, "hide")
        }
      }) : f(e, "hide")
    }), wx.onError(function (e) {
      var t = g(I);
      t.tp = "ald_error_message", t.ct = e, N++, f(t, "event")
    });
    var z = {
      aldSendEvent: function (e, t) {
        var n = g(I);
        if ("" !== e && "string" == typeof e && e.length <= 255)
          if (n.tp = e, "string" == typeof t && t.length <= 255) n.ct = String(t), f(n, "event");
          else if ("object" == typeof t) {
          if (JSON.stringify(t).length >= 255) return void console.error("自定义事件参数不能超过255个字符，请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南-自定义事件！");
          if (u(t)) return void console.error("事件参数内部只支持Number、String等类型，请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南-自定义事件！");
          n.ct = JSON.stringify(t), f(n, "event")
        } else void 0 === t || "" === t ? f(n, "event") : console.error("事件参数必须为String、Object类型，且参数长度不能超过255个字符，请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南-自定义事件！");
        else console.error("事件名称必须为String类型且不能超过255个字符，请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南-自定义事件！")
      },
      aldOnShareAppMessage: function (e) {
        wx.onShareAppMessage(function () {
          T = !0;
          var t = e(),
            n = "";
          void 0 !== t.query && (n = t.query), y.useOpen && (n += void 0 !== k.query.ald_share_op ? (k.query.ald_share_op.indexOf(O), (void 0 !== t.query ? "&" : "") + "ald_share_op=" + k.query.ald_share_op + "," + O) : (void 0 !== t.query ? "&" : "") + "ald_share_op=" + O), n += void 0 !== k.query.ald_share_src ? (k.query.ald_share_src.indexOf(q), (void 0 !== t.query || y.useOpen ? "&" : "") + "ald_share_src=" + k.query.ald_share_src + "," + q) : (void 0 !== t.query || y.useOpen ? "&" : "") + "ald_share_src=" + q, "undefined" != c(t.ald_desc) && (n += "&ald_desc=" + t.ald_desc), t.query = n;
          var r = g(I);
          return r.ct = t, r.ct.sho = 1, r.tp = "ald_share_chain", f(r, "event"), t
        })
      },
      aldShareAppMessage: function (e) {
        T = !0;
        var t = e,
          n = "";
        void 0 !== t.query && (n = t.query), y.useOpen && (n += void 0 !== k.query.ald_share_op ? (k.query.ald_share_op.indexOf(O), (void 0 !== t.query ? "&" : "") + "ald_share_op=" + k.query.ald_share_op + "," + O) : (void 0 !== t.query ? "&" : "") + "ald_share_op=" + O), n += void 0 !== k.query.ald_share_src ? (k.query.ald_share_src.indexOf(q), (void 0 !== t.query || y.useOpen ? "&" : "") + "ald_share_src=" + k.query.ald_share_src + "," + q) : (void 0 !== t.query || y.useOpen ? "&" : "") + "ald_share_src=" + q;
        var r = g(I);
        "undefined" != c(t.ald_desc) && (n += "&ald_desc=" + t.ald_desc), t.query = n, r.ct = t, r.tp = "ald_share_chain", f(r, "event"), wx.shareAppMessage(t)
      },
      aldSendSession: function (e) {
        if ("" === e || !e) return void console.error("请传入从后台获取的session_key");
        var t = g(I);
        t.tp = "session", t.ct = "session", b = e, "" === L ? wx.getSetting({
          success: function (e) {
            e.authSetting["scope.userInfo"] ? wx.getUserInfo({
              success: function (e) {
                t.ufo = e, f(t, "event")
              }
            }) : f(t, "event")
          }
        }) : (t.ufo = L, "" !== L && (t.gid = ""), f(t, "event"))
      },
      aldSendOpenid: function (e) {
        if ("" === e || !e) return void console.error("OpenID不符合规则，请参考接入文档 http://doc.aldwx.com 小游戏统计/广告监测平台-快速接入指南！");
        O = e, wx.setStorageSync("aldstat_op", e);
        var t = g(I);
        t.tp = "openid", t.ct = "openid", f(t, "event")
      },
      aldRevenue: function (e) {
        var t = g(I);
        if ("[object Object]" !== Object.prototype.toString.call(e)) return void console.error("wx.aldRevenue()传参不符合规则，请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南-营收分析！");
        var {
          group: group,
          money: money,
          name: name,
          stageId: stageId,
          stageName: stageName,
          desc: desc
        } = e;
        if (!group || 0 !== money && !money || !name) return void console.error("group、money、name为必传字段且数据类型必须符合规则,请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南-营收分析！");
        if (function (e, t, n) {
            if ("string" !== c(e)) return console.error("group必须符合传参规则，请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南-营收分析！"), !1;
            switch (e) {
              case "default":
                break;
              case "stage":
                break;
              case "grade":
                break;
              default:
                return console.error("group为固定字段不可随便修改，请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南-营收分析！"), !1
            }
            return "number" !== c(t) || t < 0 ? (console.error("money字段(付费金额)只支持Number类型，且不能小于0，请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南-营收分析！"), !1) : !("string" !== c(n) || n.length > 32) || (console.error("name字段(付费项目)只支持String类型，且长度小于32个字符，请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南-营收分析！"), !1)
          }(group, money, name)) {
          if ("stage" === group || "grade" === group) {
            var n;
            if (n = "stage" === group ? "关卡" : "等级", ! function (e, t) {
                if (e && t) {
                  return !/^\d+(.\d+)*$/.test(e) || e.length > 32 || isNaN(Number(e)) ? (console.error(`stageId(${n}Id)必须符合传参规则，请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南-${n}分析！`), !1) : !("string" !== c(t) || t.length > 32) || (console.error(`${n}名称为必传字段，且长度小于32个字符，请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南-${n}分析！`), !1)
                }
                return console.error(`stageId(${n}id)、stageName(${n}名称)为必传字段，且长度小于32个字符，请参考接入文档 http://doc.aldwx.com 小游戏统计平台-快速接入指南-${n}分析！`), !1
              }(stageId, stageName)) return
          }
          "string" === c(desc) && desc.length < 32 || console.warn("desc字段只支持String类型，且长度小于32个字符,请参考接入文档 http://doc.aldwx.com 小游戏统计平台"), t.ct = e, f(t, "income")
        }
      }
    };
    wx.aldStage = new n, wx.aldLevel = new r;
    for (var F = 0; F < Q.length; F++) ! function (e, t) {
      Object.defineProperty(wx, e, {
        value: t,
        writable: !1,
        enumerable: !0,
        configurable: !0
      })
    }(Q[F], z[Q[F]]);
    try {
      var G = wx.getSystemInfoSync();
      I.br = G.brand || "", I.md = G.model, I.pr = G.pixelRatio, I.sw = G.screenWidth, I.sh = G.screenHeight, I.ww = G.windowWidth, I.wh = G.windowHeight, I.lang = G.language, I.wv = G.version, I.sv = G.system, I.wvv = G.platform, I.fs = G.fontSizeSetting, I.wsdk = G.SDKVersion, I.bh = G.benchmarkLevel || "", I.bt = G.battery || "", I.wf = G.wifiSignal || "", I.lng = "", I.lat = "", I.nt = "", I.spd = "", I.ufo = ""
    } catch (e) {}
  }();