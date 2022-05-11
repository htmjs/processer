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
const main_1 = require("./../../../../main");
const index_1 = require("./index");
const func_1 = require("../../../../utils/func");
const sleak = new main_1.Sleak();
class Use extends index_1.JsExpCompiler {
    constructor(props) {
        super(props);
        this.isSet = true;
        this.caller = props;
    }
    run(...props) {
        const { caller: { line, column, parentComponent: { path: base } } } = this;
        if ((0, func_1.is)(props).null || (0, func_1.isEmpty)(props))
            throw `'Use' tag cannot be empty \n at line ${line}`;
        const vars = props[0].split('from');
        if (vars.length < 2 || vars.length > 2)
            throw `Syntax error; ${vars.length > 2 ? 'unknown' : 'missing'} properties at line ${line}`;
        let [name, path] = [vars[0].trim(), eval(vars[1].trim())];
        if ((0, func_1.isEmpty)(fileModule_1.Fs.ext(path)))
            path = `${path}.inc`;
        if (!(0, func_1.is)(name.charAt(0)).isCap())
            throw `Components must begin with capital letters \n at line ${line}`;
        const link = fileModule_1.Fs.join(fileModule_1.Fs.dirname(base), path);
        if (!fileModule_1.Fs.exists(link))
            throw `Path '${link}' does not exist \n near line ${line}, column ${column}`;
        this.main(link);
    }
    main(path) {
        this.caller.caller.opened.push(0);
        sleak.run(path, { props: {}, parent: this.caller.parentComponent, env: {} }, () => {
            while (sleak.opened.length > 0) { }
            ;
            this.caller.caller.opened.pop();
            sleak.compiled.type = 'Component';
            this.component = sleak.compiled;
            this.caller.value = this;
        });
    }
    get component() {
        return this._component;
    }
    set component(value) {
        this._component = value;
        this.caller.parentComponent.imports = value;
    }
    compile(...props) {
        return __awaiter(this, void 0, void 0, function* () {
            return '';
        });
    }
}
exports.default = Use;
