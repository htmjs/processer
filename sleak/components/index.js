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
exports.Components = void 0;
const default_1 = require("../utils/default");
const func_1 = require("../utils/func");
class Components extends default_1.Default {
    constructor(props) {
        super(props);
        this._props = {};
        this._children = [];
        this._compiledText = '';
        this.isLooped = false;
        this.name = '';
        this.temp = '';
        this.caller = props;
        this.value = '';
        this.children = [];
        this.count = 0;
        this._isClosed = false;
        this._closed = false;
        this._isBlock = false;
        this.firstRun = true;
    }
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value;
    }
    get compiledText() {
        return this._compiledText;
    }
    set compiledText(value) {
        if (value == '***clear!!***') {
            this._compiledText = '';
            return;
        }
        this._compiledText += value;
    }
    get parentComponent() {
        return this._parentComponet;
    }
    set parentComponent(value) {
        this._parentComponet = value;
    }
    get props() {
        return this._props;
    }
    set props(value) {
        this._props = value;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    set __name(value) {
        this._name = value;
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
    }
    get closed() {
        return this._closed;
    }
    get isClosed() {
        return this._isClosed;
    }
    set isClosed(value) {
        this._isClosed = value;
        if (!this.isBlock && !this.closed)
            this.closed = value;
        // else this.caller.current = null;
    }
    set closed(value) {
        this._closed = value;
        if (!this.isClosed)
            this._isClosed = value;
        if (value) {
            (0, func_1.avoid)(err => this.caller.opened.pop());
            this.closeComponents();
        }
    }
    get isBlock() {
        return this._isBlock;
    }
    set isBlock(value) {
        this._isBlock = value;
    }
    get temp() {
        const word = this._temp;
        if (this.closed)
            this.temp = '';
        return word;
    }
    set temp(value) {
        this._temp = value;
    }
    set __temp(value) {
        this._temp = value;
    }
    get line() {
        return this._line;
    }
    set line(value) {
        this._line = value;
    }
    get column() {
        return this._column;
    }
    set column(value) {
        this._column = value;
    }
    get parent() {
        return this._parent;
    }
    set parent(value) {
        this._parent = value;
        if (this.type !== 'Scriptlet') {
            //@ts-ignore
            if (!(0, func_1.is)(this.parent).null)
                this._parent.children = this;
        }
    }
    get children() {
        return this._children;
    }
    set children(value) {
        if (Array.isArray(value))
            this._children = value;
        else {
            // if (value.type == 'TextNode') console.warn(value.value);
            if (value instanceof Components) {
                //@ts-ignore
                if (this.type == 'HTML' || this.type === 'Printer') {
                    //@ts-ignore
                    if (this.preserveText)
                        value.preserveText = true;
                }
                // stop text node if its not closed
                if (value.type == 'TextNode' && !value.closed)
                    return;
                this._children.push(value);
                //@ts-ignore
                if (!this.preserveText) {
                    if (value.type === 'TextNode' && (0, func_1.isEmpty)(value.value))
                        this._children.pop();
                }
            }
        }
    }
    get count() {
        return this._count;
    }
    set count(value) {
        this._count = value;
    }
    get stop() {
        return this._stop;
    }
    set stop(value) {
        this._stop = value;
    }
    get firstRun() {
        return this._firstRun;
    }
    set firstRun(value) {
        this._firstRun = value;
    }
    closeComponents() {
        if (!this.useless) {
            const { current, builder } = this.caller;
            builder.clear();
            let ref = current.parent;
            if ((0, func_1.is)(ref).null) {
                this.caller.__current = null;
                return;
            }
            while (true) {
                if (ref.closed) {
                    ref = ref.parent;
                }
                else
                    break;
            }
            this.count++;
            this.caller.__current = ref;
        }
    }
    compile(...props) {
        return __awaiter(this, void 0, void 0, function* () {
            return '';
        });
    }
}
exports.Components = Components;
