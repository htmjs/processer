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
const _1 = require(".");
const func_1 = require("../../../../utils/func");
const fileModule_1 = require("../../../../utils/fileModule");
const linting_1 = require("../../../script/assets/linting");
const utils_1 = require("../../../script/assets/linting/utils");
class Imports extends _1.JsExpCompiler {
    constructor(props) {
        super(props);
        this.var = { kind: 'const', type: 'VariableDeclaration', name: '', value: '' };
        this.isSet = true;
    }
    run(...props) {
        return __awaiter(this, void 0, void 0, function* () {
            const { caller: { line, column, parentComponent: { path: base, env } } } = this;
            if ((0, func_1.is)(props).null || (0, func_1.isEmpty)(props))
                throw `'Use' tag cannot be empty \n at line ${line}`;
            const vars = props[0].split('from');
            if (vars.length < 2 || vars.length > 2)
                throw `Syntax error; ${vars.length > 2 ? 'unknown' : 'missing'} properties at line ${line}`;
            let [name, path] = [vars[0].trim(), eval(vars[1].trim())];
            const link = fileModule_1.Fs.join(fileModule_1.Fs.dirname(base), path);
            if (!fileModule_1.Fs.exists(link))
                throw `Path '${link}' does not exist \n near line ${line}, column ${column}`;
            const script = `import ${name} from '${path}'; console.log(${name})`;
            const imports = linting_1.Linting.ImportLint(script);
            const code = this.buildCode(imports, link.replace(/\\/g, '/'));
            (0, utils_1.extractVars)(code, ({ value, key }) => __awaiter(this, void 0, void 0, function* () {
                const prop = [{
                        kind: "const",
                        type: "VariableDeclaration",
                        name: key,
                        value: value
                    }];
                this.caller.parentComponent.env = prop;
                yield this.caller.parentComponent.setGlobals();
            }));
        });
    }
    compile(...props) {
        return __awaiter(this, void 0, void 0, function* () {
            return '';
        });
    }
    buildCode(props, path) {
        let code = 'var require = global.require || global.process.mainModule.constructor._load; ', returnCode = 'return {';
        props.forEach((prop, index) => {
            if (prop.default)
                code += `const ${prop.local} = require('${path}').default;`;
            else
                code += `const ${prop.local} = require('${path}').${prop.imported}; \n`;
            if (index == props.length - 1)
                returnCode += prop.local + '};';
            else
                returnCode += prop.local + ' ,';
        });
        return code + returnCode;
    }
}
exports.default = Imports;
