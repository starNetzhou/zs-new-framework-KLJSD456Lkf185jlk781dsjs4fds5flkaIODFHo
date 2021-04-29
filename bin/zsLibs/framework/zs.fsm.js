window.zs = window.zs || {};
(function (exports, Laya) {
    'use strict';

    class fsm {
        get list() {
            if (this._list == null) {
                this._list = {};
            }
            return this._list;
        }
        init(state, auto) {
            this.current = state || this.defaultState;
            this.target = null;
            if (this.current) {
                this.onChanged && this.onChanged.runWith(this.current);
                if (auto || this.defaultAuto) { this.runNext(); }
            }
        }
        registe(from, to, priority, auto, thisObj, transition, condition, canBreak) {
            if (this.list[from] == null) {
                this.list[from] = {};
            }
            if (auto) {
                for (let state in this.list[from]) {
                    this.list[from][state].auto = null;
                }
            }
            if (thisObj == null) {
                thisObj = this;
            }
            if (!transition) {
                transition = (complete) => { complete.run(); }
            }
            this.list[from][to] = {
                priority: priority || 0,
                thisObj: thisObj,
                transition: transition,
                condition: condition,
                auto: auto,
                canBreak: canBreak
            };
            return this;
        }
        setDefault(state, auto) {
            this.defaultState = state;
            this.defaultAuto = auto;
            return this;
        }
        unregiste(from, to) {
            if (this.list[from] != null) {
                if (this.list[from][to] != null) {
                    delete this.list[from][to];
                }
            }
            return this;
        }
        runTransition(target) {
            if (this.current == null || this.current.length <= 0) {
                return false;
            }
            let fsm = this.list[this.current];
            if (fsm == null) {
                return false;
            }
            if (this.target != null) {
                if (fsm != null) {
                    let targetTransition = fsm[this.target];
                    if (targetTransition != null) {
                        if (!targetTransition.canBreak) {
                            return false;
                        }
                    }
                }
            }
            let transition = fsm[target];
            if (transition == null) {
                return false;
            }
            if (transition.thisObj == null) {
                return false;
            }
            let condition = transition.condition ? transition.condition.call(transition.thisObj) : true;
            if (!condition) {
                return false;
            }
            this.target = target;
            zs.log.debug('runTransition: ' + this.current + ' - ' + this.target);
            this.onBeforeChange && this.onBeforeChange.runWith(this.target);
            transition.transition.call(transition.thisObj, Laya.Handler.create(this, this.onTransitionComplete));
            return true;
        }
        runNext() {
            if (this.current == null || this.current.length <= 0) {
                return null;
            }
            let fsm = this.list[this.current];
            if (fsm == null) { return null; }
            if (this.target != null) {
                if (fsm != null) {
                    let targetTransition = fsm[this.target];
                    if (targetTransition != null) {
                        if (!targetTransition.canBreak) {
                            return null;
                        }
                    }
                }
            }

            let keys = [];
            let transitions = [];
            for (let key in fsm) {
                let transition = fsm[key];
                let isInserted = false;
                for (let i = 0, n = transitions.length; i < n; i++) {
                    if (transition.priority > transitions[i].priority) {
                        keys.splice(i, 0, key);
                        transitions.splice(i, 0, transition);
                        isInserted = true;
                        break;
                    }
                }
                if (!isInserted) {
                    keys.push(key);
                    transitions.push(transition);
                }
            }

            for (let i = 0, n = keys.length; i < n; i++) {
                let transition = transitions[i];
                if (transition.thisObj == null) { continue; }
                let condition = transition.condition ? transition.condition.call(transition.thisObj) : true;
                if (!condition) { continue; }
                this.target = keys[i];
                zs.log.debug('runNext: ' + this.current + ' - ' + this.target);
                this.onBeforeChange && this.onBeforeChange.runWith([this.target, this.current]);
                transition.transition.call(transition.thisObj, Laya.Handler.create(this, this.onTransitionComplete));
                return keys[i];
            }

            return null;

        }
        onTransitionComplete() {
            this.current = this.target;
            this.target = null;
            let fsm = this.list[this.current];
            if (fsm != null) {
                for (let state in fsm) {
                    let transition = fsm[state];
                    if (transition.auto) {
                        this.runTransition(state);
                        break;
                    }
                }
            }
            this.onChanged && this.onChanged.runWith(this.current);
        }
    }

    exports.fsm = fsm;
}(window.zs = window.zs || {}, Laya));