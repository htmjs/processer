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
const main_1 = require("./../../../../main");
const index_1 = require("./index");
let sleak;
class JsLoader extends index_1.JsExpCompiler {
    constructor(props) {
        super(props);
        this._props = {};
        this.caller = props;
        this.line = props.line;
        this.isSet = true;
    }
    run(props) {
        return __awaiter(this, void 0, void 0, function* () {
            sleak = new main_1.Sleak();
            const base = this.caller.parentComponent.path;
            let match = null;
            if (props.startsWith("'"))
                match = props.match(/'[^']*'/g);
            else
                match = props.match(/"[^"]*'/g);
            if (!(0, func_1.is)(match).null) {
                this.path = fileModule_1.Fs.join(fileModule_1.Fs.dirname(base), match[0].substring(1, match[0].length - 1));
                if (!fileModule_1.Fs.exists(this.path))
                    throw 'path does not exist at include at line ' + this.line;
                const objstring = props.substring(match[0].length + 1, props.length);
                let value = `value = ${objstring}`;
                eval(value);
                if (typeof value == 'object') {
                    this.props = value;
                }
                yield this.main();
            }
            else
                throw 'No path found at include at line ' + this.line;
        });
    }
    compile(...props) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.component.compile();
        });
    }
    main(props) {
        return __awaiter(this, void 0, void 0, function* () {
            this.caller.caller.opened.push(0);
            sleak.run(this.path, { props: this.props, parent: this.caller.parentComponent, env: {} }, () => {
                while (sleak.opened.length > 0) { }
                ;
                this.caller.caller.opened.pop();
                sleak.compiled.type = 'Include';
                this.component = sleak.compiled;
            });
        });
    }
    get props() {
        return this._props;
    }
    set props(value) {
        this._props = value;
    }
    get path() {
        return this._path;
    }
    set path(value) {
        this._path = value;
    }
    get component() {
        return this._component;
    }
    set component(value) {
        this._component = value;
        this.caller.parentComponent.imports = value;
    }
}
exports.default = JsLoader;
