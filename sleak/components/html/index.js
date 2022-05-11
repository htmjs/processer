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
exports.Html = void 0;
const __1 = require("..");
const func_1 = require("../../utils/func");
const parser_1 = require("../../utils/parser");
const AttributeMap_1 = require("./assets/AttributeMap");
const parser = new parser_1.Parser();
class Html extends __1.Components {
    constructor(props) {
        super(props);
        this._attributes = [];
        this._attrTemp = '';
        this.isSet = true;
        this.type = 'HTML';
        this.isComponent = false;
        this.words = '';
        this.attributes = [];
    }
    closing(char) {
        let res = false;
        if (char == '>') {
            if (this.attr) {
                if (!this.attr.qoutes.uses) {
                    res = true;
                    this.close();
                }
            }
            else {
                this.close();
                res = true;
            }
            ;
        }
        if (this.words.length === 2) {
            this.words = '';
            this.lookup = false;
        }
        return res;
    }
    close() {
        this.caller.justClosed = true;
        if (this.lookup)
            this.closed = true;
        this.lookup = false;
        if (!this.isClosed)
            this.isClosed = true;
    }
    parseAttr(char) {
        const { isWs } = parser;
        const { caller } = this;
        if ((0, func_1.is)(this.attr).null) {
            if (char === '/') {
                this.lookup = true;
                this.words += char;
            }
            // get the Attributes here
            if (this.closing(char))
                return;
            this.attrTemp += char;
            if (isWs(char) && (0, func_1.isEmpty)(this.attrTemp))
                return;
            if (char === '=' && !(0, func_1.isEmpty)(this.attrTemp)) {
                const attr = new AttributeMap_1.AttributesMap(this);
                attr.name = this.attrTemp;
                attr.isClosed = true;
                this.attr = attr;
            }
            else if (char === '=' && (0, func_1.isEmpty)(this.attrTemp))
                throw 'TypeError character `' + char + '` at line ' + caller.line + ' at column ' + caller.column;
            if (isWs(char)) {
                const attr = new AttributeMap_1.AttributesMap(this);
                attr.name = this.attrTemp;
                this.attr = attr;
            }
        }
        else {
            if (this.closing(char))
                return;
            const { attr } = this;
            // console.log(attr.name);
            const close = (prop, recompile) => {
                attr[prop] = true;
                this.attrTemp = '';
                if (recompile)
                    caller.htmlParser(char);
            };
            if (attr.isClosed) {
                attr.char = char;
            }
            else {
                // check chars 
                if (char === '=')
                    close('isClosed');
                else if (parser.isWord(char))
                    close('closed', true);
                else if (parser.isWN(char))
                    return;
            }
        }
    }
    compile(...props) {
        return __awaiter(this, void 0, void 0, function* () {
            this.compiledText = '***clear!!***';
            if (!this.isComponent) {
                const store = [];
                for (const item of this.attributes)
                    store.push(yield item.compile());
                const attrs = this.attributes.length == 0 ? '' : ` ${store.join(' ')}`;
                this.compiledText = `<${this.name}${attrs}`;
                if (this.children.length === 0) {
                    if (this.isBlock)
                        this.compiledText = `></${this.name}>`;
                    else
                        this.compiledText = '/>';
                }
                else {
                    this.compiledText = `>`;
                    for (const child of this.children) {
                        this.compiledText = yield child.compile();
                    }
                    this.compiledText = `</${this.name}>`;
                }
            }
            else {
                const component = this.parentComponent.imports.find(item => item.type == 'Component' && item.name === this.name);
                if ((0, func_1.isUndefined)(component))
                    throw `Couldn't find component with name '${this.name}' \n at line ${this.line}`;
                for (const item of this.attributes)
                    yield item.compile();
                component.props = this.attributes;
                if (component.useStrict) {
                    if (component.allowChildNodes)
                        component.props['children'] = this.children;
                    this.compiledText = yield component.getText();
                    return this.compiledText;
                }
                else {
                    this.compiledText = yield component.compile();
                }
            }
            return this.compiledText;
        });
    }
    ///////////////================= setters and getters
    get attr() {
        return this._attr;
    }
    set attr(value) {
        this._attr = value;
        if ((0, func_1.is)(value).notNull)
            this.attributes = value;
    }
    get attrTemp() {
        return this._attrTemp;
    }
    set attrTemp(value) {
        value = value.trim();
        value = value.endsWith('=') ? value.substring(0, value.length - 1) : value;
        // console.log(value);
        this._attrTemp = value;
    }
    get attributes() {
        return this._attributes;
    }
    set attributes(value) {
        if ((0, func_1.is)(value).notNull) {
            if (Array.isArray(value))
                this._attributes = value;
            else
                this._attributes.push(value);
        }
    }
    set name(value) {
        const char = value.charAt(0);
        if ((0, func_1.is)(char).isCap()) {
            this.isBlock = true;
            this.isComponent = true;
        }
        else {
            this.isBlock = (0, func_1.is)(value).blockElement();
        }
        if (value === 'pre')
            this.preserveText = true;
        super.name = value;
    }
    get name() {
        return super.name;
    }
    get lookup() {
        return this._lookup;
    }
    set lookup(value) {
        this._lookup = value;
    }
    get words() {
        return this._words;
    }
    set words(value) {
        this._words = value;
    }
    get preserveText() {
        return this._preserveText;
    }
    set preserveText(value) {
        this._preserveText = value;
    }
}
exports.Html = Html;
