window.zs = window.zs || {};

(function (exports, Laya) {
    'use strict';

    class EggKnock {
        static init() {
            this.markGameNum();
            this.markAwardNum();
            this.markReadyNum();
        }

        static markGameNum(autoPlus) {
            let timestamp = zs.utils.getItem(EggKnock.key_game_num_time_stamp);
            if (timestamp == null || timestamp == "" || zs.utils.isToday(Number(timestamp)) == false) {
                zs.utils.setItem(EggKnock.key_game_num_time_stamp, Date.now().toString());
                zs.utils.setItem(EggKnock.key_game_num, "0");
            }
            EggKnock.day_game_num = zs.utils.getItem(EggKnock.key_game_num) || 0;
            if (autoPlus) {
                EggKnock.day_game_num = Number(EggKnock.day_game_num) + 1;
            } else {
                EggKnock.day_game_num = Number(EggKnock.day_game_num);
            }
            zs.utils.setItem(EggKnock.key_game_num, EggKnock.day_game_num.toString());
        }

        static markAwardNum(autoPlus) {
            let timestamp = zs.utils.getItem(EggKnock.key_award_num_time_stamp);
            if (timestamp == null || timestamp == "" || zs.utils.isToday(Number(timestamp)) == false) {
                zs.utils.setItem(EggKnock.key_award_num_time_stamp, Date.now().toString());
                zs.utils.setItem(EggKnock.key_award_num, "0");
            }
            EggKnock.open_award_num = zs.utils.getItem(EggKnock.key_award_num) || 0;
            if (autoPlus) {
                EggKnock.open_award_num = Number(EggKnock.open_award_num) + 1;
            } else {
                EggKnock.open_award_num = Number(EggKnock.open_award_num);
            }
            zs.utils.setItem(EggKnock.key_award_num, EggKnock.open_award_num.toString());
        }

        static markReadyNum(autoPlus) {
            let timestamp = zs.utils.getItem(EggKnock.key_ready_num_time_stamp);
            if (timestamp == null || timestamp == "" || zs.utils.isToday(Number(timestamp)) == false) {
                zs.utils.setItem(EggKnock.key_ready_num_time_stamp, Date.now().toString());
                zs.utils.setItem(EggKnock.key_ready_num, "0");
            }
            EggKnock.open_ready_num = zs.utils.getItem(EggKnock.key_ready_num) || 0;
            if (autoPlus) {
                EggKnock.open_ready_num = Number(EggKnock.open_ready_num) + 1;
            } else {
                EggKnock.open_ready_num = Number(EggKnock.open_ready_num);
            }
            zs.utils.setItem(EggKnock.key_ready_num, EggKnock.open_ready_num.toString());
        }

        static checkEggOpen(isCommon) {
            if (!EggKnock.switch) { return false; }
            let zs_click_award_since = zs.product.get("zs_click_award_since");
            if (zs_click_award_since && zs_click_award_since > 0) {
                if (!EggKnock.day_game_num || Number(EggKnock.day_game_num) < zs_click_award_since) {
                    return false;
                }
            }
            let numClick = isCommon ? zs.product.get("zs_ready_click_num") : zs.product.get("zs_click_award_num");
            if (numClick == null || numClick.trim() == "") { numClick = "0"; }
            numClick = JSON.parse(numClick);
            if (Array.isArray(numClick)) {
                if (numClick.length <= 0) { return false; }
                if (numClick.length == 0 && numClick[0] < 0) { return true; }
                let index = numClick.indexOf(EggKnock.day_game_num);
                if (index >= 0) { return true; }
            } else {
                numClick = parseInt(numClick);
                if (isNaN(numClick)) { return false; }
                if (numClick < 0) { return true; }
                if (numClick > (isCommon ? EggKnock.open_ready_num : EggKnock.open_award_num)) { return true; }
            }
            return false;
        }
    }
    EggKnock.switch = true;
    EggKnock.key_game_num = "day_game_num";
    EggKnock.key_award_num = "open_award_num";
    EggKnock.key_ready_num = "open_ready_num";
    EggKnock.key_award_num_time_stamp = "open_award_num_time_stamp";
    EggKnock.key_ready_num_time_stamp = "open_ready_num_time_stamp";
    EggKnock.key_game_num_time_stamp = "game_num_time_stamp";
    EggKnock.open_award_num = 0;
    EggKnock.open_ready_num = 0;
    EggKnock.day_game_num = 0;

    exports.EggKnock = EggKnock;
}(window.zs = window.zs || {}, Laya))