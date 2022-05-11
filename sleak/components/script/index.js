"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scriptlet = void 0;
const index_1 = require("./assets/linting/index");
const __1 = require("..");
const func_1 = require("../../utils/func");
const utils_1 = require("./assets/linting/utils");
const $ = global;
const $_$ = {};
class Scriptlet extends __1.Components {
    constructor(props) {
        super(props);
        this.control = -2;
        this.isSet = true;
    }
    get script() {
        //@ts-ignore
        return this._script;
    }
    set script(value) {
        this._script = value;
    }
    get closed() {
        return super.closed;
    }
    set closed(value) {
        super.closed = value;
        this.value = this.value.trim();
        this.linting();
    }
    get control() {
        return this._control;
    }
    set control(value) {
        if (this.control == value)
            this.control = -1;
        else
            this._control = value;
    }
    linting() {
        const { code, vars } = index_1.Linting.ExportLint(this.value);
        this.parentComponent.env = vars;
        this.script = code;
    }
    compile() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, utils_1.extractVars)(this.script, ({ key, value }) => {
                const obj = this.parentComponent.env.find(item => item.name == key);
                (0, func_1.avoid)(() => {
                    obj.value = value;
                }).then((er, msg) => {
                    if (er)
                        throw msg;
                });
            });
            return '';
        });
    }
    replace() {
    }
}
exports.Scriptlet = Scriptlet;
