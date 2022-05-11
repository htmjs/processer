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
const func_1 = require("../../../../utils/func");
const index_1 = require("./index");
class JsEComponents extends index_1.JsExpCompiler {
    constructor(props) {
        super(props);
        this.name = '';
        this.isSet = true;
        this.caller = props;
    }
    run(...args) {
        const { caller: { parentComponent: compiled, value, name, props } } = this;
        let error = false;
        if (name == 'Component') {
            (0, func_1.avoid)(err => {
                eval(`this.ref = ${value}`);
            }).then((err, msg) => {
                if (err) {
                    console.log(msg);
                    error = true;
                }
            });
            if (error || (0, func_1.is)(this.ref).null) {
                this.caller.stop = true;
                return;
            }
            for (const key in this.ref) {
                if (Object.prototype.hasOwnProperty.call(this.ref, key)) {
                    const element = this.ref[key];
                    compiled[key] = element;
                }
            }
        }
    }
    compile(...props) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, func_1.isEmpty)(this.caller.parentComponent.props['children']))
                this.caller.parentComponent.props['children'] = [];
            if (this.caller.name == 'content')
                for (const child of this.caller.parentComponent.props['children'])
                    this.caller.compiledText = yield child.compile();
            else
                for (const child of this.caller.children)
                    this.caller.compiledText = yield child.compile();
            return this.caller.compiledText;
        });
    }
}
exports.default = JsEComponents;
