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
exports.AttributesMap = void 0;
const __1 = require("../..");
const func_1 = require("../../../utils/func");
const parser_1 = require("../../../utils/parser");
const jsExpressions_1 = require("../../jsExpressions");
const parser = new parser_1.Parser();
class AttributesMap extends __1.Components {
    constructor(props) {
        super(props);
        this.isSet = true;
    }
    init() {
        this.qoutes = {
            type: '',
            count: 0,
            uses: false
        };
        this.useless = true;
        this.store = 0;
    }
    get char() {
        return this._char;
    }
    set char(char) {
        this._char = char;
        if (!this.started) {
            if (!parser.isWN(char) || parser.isQuote(char)) {
                this.started = true;
                this.temp += char;
                if (parser.isQuote(char)) {
                    this.qoutes.type = char;
                    this.qoutes.count = 1;
                    this.qoutes.uses = true;
                    this.temp = '';
                    this.valueType = 'String';
                }
                else if (char === '{') {
                    if (this.prev == null) {
                        this.started = false;
                        this.prev = char;
                    }
                    else if (this.prev == char) {
                        this.started = true;
                        this.prev = '';
                        this.temp = '';
                        this.valueType = 'JsExpression';
                        this.value = new jsExpressions_1.JsExpressions(this);
                        this.value.isVariable = true;
                        //@ts-ignore
                        this.value.parentComponent = this.caller.parentComponent;
                        this.value.useless = true;
                    }
                }
            }
            return;
        }
        if (this.valueType == 'JsExpression' && this.value instanceof jsExpressions_1.JsExpressions) {
            const { value: current, store } = this;
            const ref = '}';
            if (char == '{')
                this.store++;
            if (char == '}')
                this.store--;
            if (char == '}' && store > 0) {
                current.value += char;
            }
            else if (char === '}' && current.temp == ref) {
                let value = current.value;
                let text = '======$$+====04fojo';
                const match = value.match(/@\w+/g);
                if ((0, func_1.is)(match).notNull)
                    text = match[0];
                if (value.trim().startsWith(text)) {
                    //@ts-ignore
                    throw `JsExpression must be a variable not a keyword \n at line ${this.caller.caller.line} column ${this.caller.caller.column}`;
                }
                else {
                    current.name = '';
                }
                if (current.isBlock)
                    throw 'error occured...';
                current.isClosed = true;
                this.closed = true;
            }
            else {
                if (char == ref) {
                    current.temp = char;
                }
                else {
                    current.value += char;
                }
            }
        }
        else {
            if (parser.isQuote(char)) {
                if (this.qoutes.type == char && this.qoutes.count == 1 && this.qoutes.uses) {
                    this.qoutes.count++;
                    this.value = this.temp;
                    this.compiledValue = this.value;
                    this.closed = true;
                    // console.log(this.value);
                    return;
                }
                else {
                    this.temp += char;
                }
            }
            this.temp += char;
        }
        this.prev = char;
    }
    compile(...props) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.nameType == 'JsExpression') {
                // this
            }
            else {
                this.compiledText = `${this.name}`;
            }
            if (this.valueType == 'JsExpression' && this.value instanceof jsExpressions_1.JsExpressions) {
                //@ts-ignore
                this.compiledValue = yield this.value.compile();
                this.compiledText = `="${this.compiledValue}"`;
            }
            else if (!(0, func_1.isEmpty)(this.value))
                this.compiledText = `="${this.value}"`;
            return this.compiledText;
        });
    }
    get prev() {
        return this._prev;
    }
    set prev(value) {
        this._prev = value;
    }
    get started() {
        return this._started;
    }
    set started(value) {
        this._started = value;
    }
    get store() {
        return this._store;
    }
    set store(value) {
        this._store = value <= 0 ? 0 : value;
    }
    set closed(value) {
        super.closed = value;
        //@ts-ignore
        this.caller.attr = null;
    }
    set isClosed(value) {
        super.isClosed = value;
        //@ts-ignore
        if (value)
            this.caller.attrTemp = '';
    }
    get isClosed() {
        return super.isClosed;
    }
    get closed() {
        return super.closed;
    }
    get compiledValue() {
        return this._compiledValue;
    }
    set compiledValue(value) {
        this._compiledValue = value;
    }
}
exports.AttributesMap = AttributesMap;
