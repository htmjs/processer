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
const fileModule_1 = require("./../../../../utils/fileModule");
const func_1 = require("../../../../utils/func");
const index_1 = require("./../../../parentComponent/index");
const index_2 = require("./index");
const util_1 = require("../util");
class JsELoops extends index_2.JsExpCompiler {
    constructor(props) {
        super(props);
        this.name = '';
        this.isSet = true;
        this.caller = props;
    }
    get component() {
        return this._component;
    }
    set component(value) {
        this._component = value;
        this.caller.parentComponent.imports = value;
    }
    run(...props) {
        let exp = props[0];
        if ((0, func_1.is)(exp).null)
            throw 'Error ocurred at line ' + this.caller.line;
        (0, func_1.avoid)(e => {
            exp = exp.match(/\w+\s?of[^]*/g)[0];
            const array = exp.split('of');
            if (array.length == 2) {
                const refString = (0, util_1.expLint)(array[1].trim()).output;
                this.refString = refString;
                const { globals: _$ } = this.caller.parentComponent;
                eval(`this.ref = ${refString}`);
                this.name = array[0].trim();
                this.component = new index_1.Component(this.caller, this.caller.parentComponent);
                this.component.type = 'Asset';
                this.component.isClosed = true;
            }
            else
                throw 'There is a problem with your code at line ' + this.caller.line;
        }).then((err, msg) => {
            if (err)
                throw 'There is a problem with your code at line ' + this.caller.line + ' \n ' + msg;
        });
    }
    compile(...props) {
        return __awaiter(this, void 0, void 0, function* () {
            this.component.components = this.caller.children;
            let result = '';
            if ((0, func_1.isUndefined)(this.ref)) {
                this.ref = this.component.globals[this.refString];
                if (!Array.isArray(this.ref))
                    throw `'${this.refString}' is not iterable \n at ${fileModule_1.Fs.name(this.component.parentComponent.path)}:${this.caller.line}`;
            }
            yield this.changeParents(this.caller);
            for (const ref of this.ref) {
                this.component.globals[this.name] = ref;
                result += yield this.component.compile();
            }
            return result;
        });
    }
    changeParents(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            let [size, index] = [obj.children.length - 1, 0];
            for (const child of obj.children) {
                child.parentComponent = this.component;
                if (!(0, func_1.isEmpty)(child.children)) {
                    yield this.changeParents(child);
                }
                if (size == index)
                    return;
                index++;
            }
        });
    }
}
exports.default = JsELoops;
