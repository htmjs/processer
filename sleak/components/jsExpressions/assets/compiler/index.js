"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsExpCompiler = void 0;
const default_1 = require("./../../../../utils/default");
class JsExpCompiler extends default_1.Default {
    constructor(props) {
        super(props);
        this.caller = props;
    }
    init() {
        this.caller.compiler = this;
    }
    get env() {
        return this._env;
    }
    set env(value) {
        this._env = value;
    }
    compile(...props) {
        return '';
    }
}
exports.JsExpCompiler = JsExpCompiler;
