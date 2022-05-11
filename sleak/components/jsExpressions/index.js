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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsExpressions = void 0;
const fileModule_1 = require("./../../utils/fileModule");
const index_1 = require("./../script/assets/linting/index");
const eslint_1 = require("eslint");
const __1 = require("..");
const func_1 = require("../../utils/func");
const config_json_1 = __importDefault(require("./assets/config.json"));
const utils_1 = require("../script/assets/linting/utils");
const util_1 = require("./assets/util");
const linter = new index_1.Linting();
class JsExpressions extends __1.Components {
    constructor(props) {
        super(props);
        this.isVariable = false;
        this.jsScript = false;
        this.linter = new eslint_1.Linter();
        this.isSet = true;
        this.type = 'Printer';
        this.isClosed = false;
    }
    get preserveText() {
        return this._preserveText;
    }
    set preserveText(value) {
        this._preserveText = value;
    }
    get type() {
        return super.type;
    }
    set type(value) {
        if (value == 'JsScript')
            this.jsScript = true;
        super.type = value;
    }
    set name(value) {
        if (this.jsScript)
            return;
        if ((0, func_1.is)(value).null)
            value = '';
        if (value.startsWith('@')) {
            value = value.substring(1, value.length);
            super.name = value;
            const key = config_json_1.default.find(item => item.name === value);
            // console.log(key)
            if ((0, func_1.is)(key).notNull) {
                this.isBlock = key.isBlock;
            }
            else
                throw `Sorry!! Cannot find keyword '${value}'`;
        }
        else {
            this.isVariable = true;
        }
    }
    get name() {
        return super.name;
    }
    get isClosed() {
        return super.isClosed;
    }
    set isClosed(close) {
        super.isClosed = close;
        const { value, name } = this;
        if (close) {
            if (!this.jsScript) {
                if (this.isVariable || (0, func_1.isUndefined)(name)) {
                    if (this.value.startsWith('{') && this.value.endsWith('}')) {
                        this.value = `_$.props.${value.match(/\w+/g)[0]}`;
                    }
                    else
                        this.lint();
                }
                else
                    (0, func_1.avoid)(err => {
                        this.value = value.substring(name.length + 1, value.length);
                        this.statusRun();
                    }).then((err, msg) => {
                        if (err)
                            console.log(msg);
                    });
            }
        }
    }
    lint() {
        const msg = (0, util_1.expLint)(this.value, this.linter);
        this.value = msg.output;
    }
    statusRun() {
        const obj = config_json_1.default.find(item => item.name == this.name);
        this.getComponents(obj);
    }
    getComponents(obj) {
        const jCompiler = require(fileModule_1.Fs.join(__dirname, fileModule_1.Fs.join('./assets/config.json', obj.path)));
        //@ts-ignore
        const value = new jCompiler.default(this).run(this.value.trim());
    }
    compile(...props) {
        return __awaiter(this, void 0, void 0, function* () {
            this.compiledText = '***clear!!***';
            if (this.isVariable) {
                //env is the global object
                const { globals: _$ } = this.parentComponent;
                let result = eval(`${this.value}`);
                switch (typeof result) {
                    case 'string':
                        if ((result.trim().startsWith('**') && result.trim().endsWith('**')) || !result.trim().startsWith('__')) {
                            (0, func_1.avoid)(err => {
                                const props = this.value.split('.');
                                if (props[1] === 'props') {
                                    const prop = this.parentComponent.props[props[2]];
                                    if ((0, func_1.isEmpty)(prop) || prop == 'literal')
                                        return;
                                    else {
                                    }
                                }
                                // const comps = 
                            }).then((err, msg) => {
                                if (err) {
                                    console.log(msg);
                                }
                            });
                            this.compiledText = result;
                        }
                        else if (result.trim().startsWith('__') && result.trim().endsWith('__')) {
                        }
                        break;
                    case 'object':
                        if (result instanceof __1.Components) {
                        }
                        else if (Array.isArray(result)) {
                            result.every;
                        }
                        break;
                }
            }
            else {
                if (this.jsScript) {
                    // const code = convertEnv(this.parentComponent.env) + '\n' + this.value;
                    const msg = linter.jsScriptCompile(this.value, this.parentComponent.env);
                    const { code, vars } = msg;
                    if (vars.length > 0)
                        this.parentComponent.env = vars;
                    //env is the global object
                    const { globals, env } = this.parentComponent;
                    (0, utils_1.extractVars)(code, ({ key, value }) => {
                        const obj = env.find(item => item.name == key);
                        (0, func_1.avoid)(() => {
                            obj.value = value;
                        }).then((er, msg) => {
                            if (er)
                                throw msg;
                        });
                    }, globals);
                    yield this.parentComponent.setGlobals();
                    return '';
                }
                else {
                    return yield this.compiler.compile();
                }
            }
            return this.compiledText;
        });
    }
    compileResult(source) {
        let result = null;
        return result;
    }
}
exports.JsExpressions = JsExpressions;
