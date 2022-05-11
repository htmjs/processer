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
const util_1 = require("../util");
const index_1 = require("./index");
class JsEConditionals extends index_1.JsExpCompiler {
    constructor(props) {
        super(props);
        this.ref = false;
        this.name = '';
        this.validated = false;
        this.isSet = true;
        this.caller = props;
    }
    run(...props) {
        let exp = props[0];
        if (this.caller.name.startsWith('else') && this.caller.parent.name !== 'condition')
            throw 'Please add a condition tag to use else statement \n at line ' + this.caller.line;
        else {
            this.lint();
        }
    }
    compile(...props) {
        return __awaiter(this, void 0, void 0, function* () {
            const { caller: obj } = this;
            // console.log(obj.name, obj.isVariable)
            if (obj.name === 'condition') {
                if (obj.children.length < 1)
                    throw '@condition tag cannot exist without logical statements \n at line ' + obj.line;
                else {
                    if (obj.children.every(child => ['if', 'else', 'else if'].includes(child.name))) {
                        yield this.compileNodes(obj);
                    }
                    else
                        throw '@condition tag must exist with only logical statements \n near line ' + obj.line;
                }
                return obj.compiledText;
            }
            else {
                if (obj.name === 'if')
                    return yield this.ifStmt();
                else if (obj.name === 'else')
                    return yield this.elseStmt();
            }
        });
    }
    compileNodes(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const child of obj.children) {
                obj.compiledText = yield child.compile();
            }
        });
    }
    ifStmt() {
        return __awaiter(this, void 0, void 0, function* () {
            const { caller: obj } = this;
            const { globals: _$ } = obj.parentComponent;
            try {
                eval(`this.ref = ${this.value}`);
                const condition = obj.parent.name === 'condition' && obj.parent.type == 'JsExpression';
                //@ts-ignore
                if (condition) {
                    //@ts-ignore
                    obj.parent.compiler.validated = this.ref;
                }
                if (this.ref) {
                    if (obj.children.length > 0) {
                        yield this.compileNodes(obj);
                    }
                }
            }
            catch (err) {
                console.log(err);
            }
            return obj.compiledText;
            ;
        });
    }
    elseStmt() {
        return __awaiter(this, void 0, void 0, function* () {
            const { caller: obj } = this;
            // console.log(obj.value.validated)
            //@ts-ignore
            if (!obj.parent.compiler.validated) {
                if (obj.children.length > 0) {
                    yield this.compileNodes(obj);
                }
            }
            return obj.compiledText;
        });
    }
    lint() {
        const { caller: obj } = this;
        this.value = (0, util_1.expLint)(obj.value, obj.linter).output;
    }
}
exports.default = JsEConditionals;
