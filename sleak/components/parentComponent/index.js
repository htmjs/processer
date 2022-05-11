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
exports.Component = void 0;
const __1 = require("..");
const func_1 = require("../../utils/func");
class Component extends __1.Components {
    /**
     *
     * @param props this represents two varibles, ist is the caller, 2nd is optional = the main parent component
     */
    constructor(...props) {
        super(props);
        this._useStrict = true;
        this._env = [];
        this._globals = {};
        this._components = [];
        this._scripts = [];
        this._imports = [];
        this._assets = [];
        this.hasSet = false;
        this.isSet = true;
        this.caller = props[0];
        this.parentComponent = props[1];
        this.type = 'Page';
        this.isBlock = true;
    }
    closeComponents() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.scripts.length !== 0) {
                this.scripts.forEach(item => {
                    item.compile();
                });
            }
            this.setGlobals().then((value) => __awaiter(this, void 0, void 0, function* () {
                this._globals['props'] = this.props;
                this.imports.filter(item => !item.useStrict).forEach(item => {
                    item.setGlobalObject(this.globals);
                });
                this.hasSet = true;
                if (value) {
                    yield this.compile();
                    if (this.type == 'Page')
                        console.log(this.compiledText);
                }
                ;
            })).catch((msg) => { throw msg; });
        });
    }
    get compiled() {
        return this._compiled;
    }
    set compiled(value) {
        if (value)
            this.hasSet = false;
        this._compiled = value;
    }
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.scripts.length !== 0) {
                this.scripts.forEach(item => {
                    item.compile();
                });
            }
            yield this.setGlobals();
            this._globals['props'] = this.props;
            this.imports.filter(item => !item.useStrict).forEach(item => {
                item.setGlobalObject(this.globals);
            });
            this.hasSet = true;
            return yield this.compile();
        });
    }
    setGlobals() {
        return new Promise((resolve, reject) => {
            (0, func_1.avoid)(e => {
                if (this.env.length > 0) {
                    this.env.forEach((value, index) => {
                        this.globals = value;
                        if (index == this.env.length - 1 || this.env.length == 0) {
                            resolve(true);
                        }
                    });
                }
                else
                    resolve(true);
            }).then((err, msg) => {
                if (err)
                    reject(msg);
            });
        });
    }
    compile(...props) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(this.components.length, this.scripts.length);
            this.compiledText = '***clear!!***';
            if (!this.hasSet) {
                this.imports.filter(item => !item.useStrict).forEach(item => item.setGlobalObject(this.globals));
            }
            if (this.components.length !== 0) {
                for (const item of this.components)
                    this.compiledText = yield item.compile();
            }
            this.compiled = true;
            return this.compiledText;
        });
    }
    setGlobalObject(object) {
        for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                const element = object[key];
                this._globals[key] = element;
            }
        }
        if (!(0, func_1.isEmpty)(Object.keys(this.props)))
            this._globals['props'] = this.props;
    }
    get globals() {
        return this._globals;
    }
    set globals(value) {
        if ((0, func_1.is)(value).null)
            return;
        this._globals[value.name] = value.value;
    }
    get props() {
        return super.props;
    }
    set props(value) {
        if (Array.isArray(value)) {
            value.forEach(map => {
                super.props[map.name] = map.compiledValue;
            });
        }
        else if (typeof value == 'object')
            super.props = value;
        if (this.compiled) {
            this.compile();
        }
    }
    get assets() {
        return this._assets;
    }
    set assets(value) {
        this._assets.push(value);
    }
    get path() {
        return this._path;
    }
    set path(value) {
        this._path = value;
    }
    get useStrict() {
        return this._useStrict;
    }
    set useStrict(value) {
        if ((0, func_1.is)(value).null)
            value = true;
        this._useStrict = value;
    }
    get allowChildNodes() {
        return this._allowChildNodes;
    }
    set allowChildNodes(value) {
        this._allowChildNodes = value;
    }
    get env() {
        return this._env;
    }
    set env(value) {
        if ((0, func_1.isEmpty)(this._env))
            this._env = value;
        else {
            value.forEach(item => {
                const existing = this.env.filter(val => val.name === item.name);
                if ((0, func_1.isEmpty)(existing))
                    this.env.push(item);
                else {
                    if (existing.every(i => i.kind == 'var')) {
                    }
                    else
                        throw `Variable with initializer "${item.name}" at ${item.kind} ${item.name} already exists  `;
                }
            });
        }
    }
    get scripts() {
        return this._scripts;
    }
    set scripts(value) {
        if ((0, func_1.is)(this.parentComponent).null || this.useStrict)
            this._scripts.push(value);
        else {
            value.parentComponent = this.parentComponent;
            this.parentComponent.scripts = value;
        }
        ;
    }
    get components() {
        return this._components;
    }
    set components(value) {
        if (Array.isArray(value)) {
            this._components = value;
            return;
        }
        //@ts-ignore
        this._components.push(value);
    }
    get imports() {
        return this._imports;
    }
    set imports(value) {
        //@ts-ignore
        this._imports.push(value);
    }
    get isClosed() {
        return super.isClosed;
    }
    set isClosed(value) {
    }
    get type() {
        return super.type;
    }
    set type(value) {
        super.type = value;
        if (value == 'Include' || value == 'Asset') {
            this.useStrict = false;
        }
    }
}
exports.Component = Component;
