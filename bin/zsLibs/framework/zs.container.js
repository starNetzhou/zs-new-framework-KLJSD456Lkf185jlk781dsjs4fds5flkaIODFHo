window.zs = window.zs || {};
window.zs.container = window.zs.container || {};

(function (exports) {
    'use strict';

    class vec3 {
        static make(value) {
            let result = Laya.Vector3();
            result.x = value;
            result.y = value;
            result.z = value;
            return result;
        }
        static add(v1, v2) {
            let result = v1.clone();
            if (typeof v2 === 'number') {
                result.x += v2;
                result.y += v2;
                result.z += v2;
            } else {
                result.x += v2.x;
                result.y += v2.y;
                result.z += v2.z;
            }
            return result;
        }
        static sub(v1, v2) {
            let result = v1.clone();
            if (typeof v2 === 'number') {
                result.x -= v2;
                result.y -= v2;
                result.z -= v2;
            } else {
                result.x -= v2.x;
                result.y -= v2.y;
                result.z -= v2.z;
            }
            return result;
        }
        static mul(v1, v2) {
            let result = v1.clone();
            if (typeof v2 === 'number') {
                result.x *= v2;
                result.y *= v2;
                result.z *= v2;
            } else {
                result.x *= v2.x;
                result.y *= v2.y;
                result.z *= v2.z;
            }
            return result;
        }
        static div(v1, v2) {
            let result = v1.clone();
            if (typeof v2 === 'number') {
                result.x /= v2;
                result.y /= v2;
                result.z /= v2;
            } else {
                result.x /= v2.x;
                result.y /= v2.y;
                result.z /= v2.z;
            }
            return result;
        }
    }

    exports.vec3 = vec3;
}(window.zs.container = window.zs.container || {}));