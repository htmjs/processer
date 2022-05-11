"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Linting = void 0;
const eslint_1 = require("eslint");
const func_1 = require("../../../../utils/func");
const scraps_1 = require("../scraps");
const default_1 = require("./../../../../utils/default");
const utils_1 = require("./utils");
class Linting extends default_1.Default {
    constructor() {
        super();
        this._env = [];
        this._exportStmt = '';
        this._linter = new eslint_1.Linter();
        this._vars = [];
        this.report = (context, fix, node, msg = 'Fix the error') => {
            context.report({
                node,
                message: msg,
                //@ts-ignore
                fix: (fixer) => fix(fixer)
            });
        };
        this.reportErr = (context, node, msg = 'Fix the error') => {
            context.report({
                node,
                message: msg,
            });
        };
    }
    get env() {
        return this._env;
    }
    set env(value) {
        if (Array.isArray(value))
            this._env = value;
        else {
            this._env.push(value);
        }
    }
    get linter() {
        return this._linter;
    }
    set linter(value) {
        this._linter = value;
    }
    get vars() {
        return this._vars;
    }
    set vars(value) {
        if (Array.isArray(value))
            this._vars = value;
        else {
            this._vars.push(value);
        }
    }
    get exportStmt() {
        return this._exportStmt;
    }
    set exportStmt(value) {
        if (!(0, func_1.isEmpty)(this.exportStmt))
            this._exportStmt += ', ';
        this._exportStmt += value;
    }
    static Lint(source) {
        const obj = this.Create(Linting);
        const { linter, env } = obj;
        linter.defineRule('rename-globals', {
            meta: {
                type: 'problem',
                fixable: 'code',
                docs: {
                    description: 'Rename all global variables.',
                    category: 'Possible Errors'
                },
                schema: [],
            },
            create: (context) => ({
                VariableDeclaration(node) {
                    if (node.parent.type !== 'Program')
                        return;
                    node.declarations.forEach(dclr => {
                        let fixed = '';
                        switch (dclr.id.type) {
                            case 'Identifier':
                                env.push({
                                    kind: node.kind,
                                    name: dclr.id.name,
                                });
                                //@ts-ignore
                                this.report(context, (fixer) => fixer.replaceTextRange([node.start, dclr.id.end], `$.${dclr.id.name}`), node);
                                break;
                            case 'ObjectPattern':
                                const props = dclr.id.properties;
                                let rElement = null;
                                let exp = '';
                                if (dclr.init.type == 'MemberExpression')
                                    exp = utils_1.Ds.membership(dclr.init);
                                props.forEach((prop, index) => {
                                    if (prop.type === 'RestElement') {
                                        env.push({
                                            kind: node.kind,
                                            // @ts-ignore
                                            name: prop.argument.name
                                        });
                                        const rest = scraps_1.needed.find(item => item.name === 'RestElement');
                                        (0, func_1.avoid)(e => rest.added = true);
                                        rElement = rest;
                                        switch (dclr.init.type) {
                                            case 'Identifier':
                                                //@ts-ignore
                                                fixed += `$.${prop.argument.name} = $_$__rest(${dclr.init.name}, [${props.filter(prop => prop.type == 'Property')
                                                    //@ts-ignore
                                                    .map(prop => `"${prop.key.name}"`).join(',')}]);`;
                                                break;
                                            case 'MemberExpression':
                                                //@ts-ignore
                                                fixed += `$.${prop.argument.name} = $_$__rest(${exp}, [${props.filter(prop => prop.type == 'Property')
                                                    //@ts-ignore
                                                    .map(prop => `"${prop.key.name}"`).join(',')}]);`;
                                                break;
                                        }
                                    }
                                    else {
                                        env.push({
                                            kind: node.kind,
                                            // @ts-ignore
                                            name: prop.value.name
                                        });
                                        switch (dclr.init.type) {
                                            case 'Identifier':
                                                //@ts-ignore
                                                fixed += `$.${prop.value.name} = ${dclr.init.name}.${prop.key.name}; `;
                                                break;
                                            case 'MemberExpression':
                                                //@ts-ignore
                                                fixed += `$.${prop.value.name} = ${exp}.${prop.key.name}; `;
                                                break;
                                            case 'CallExpression':
                                                //@ts-ignore
                                                fixed += `$.${prop.value.name} = ${utils_1.Ds.callExp(dlcr.init)}.${prop.key.name}; `;
                                                break;
                                            case 'LogicalExpression':
                                                break;
                                            case 'ConditionalExpression':
                                                break;
                                        }
                                    }
                                });
                                if (!(0, func_1.isEmpty)(fixed)) {
                                    this.report(context, fixer => [
                                        fixer.insertTextBefore(node, (0, func_1.is)(rElement).null ? '' : rElement.value),
                                        fixer.replaceText(node, fixed)
                                    ], node);
                                }
                                break;
                            case 'ArrayPattern': {
                                const { id } = dclr;
                                const ids = id.elements.map(el => {
                                    //@ts-ignore
                                    if (el.type == 'RestElement')
                                        return `...${el.argument.name}`;
                                    //@ts-ignore
                                    else
                                        return el.name;
                                });
                                this.report(context, fixer => [
                                    //@ts-ignore
                                    fixer.replaceTextRange([id.start, id.end], `[${ids.map(name => {
                                        let results = '';
                                        let changed = false;
                                        if (name.startsWith('...')) {
                                            name = name.substring(3, name.length - 1);
                                            changed = true;
                                        }
                                        ;
                                        results = `$$${name}`;
                                        if (changed)
                                            results = `...${results}`;
                                        return results;
                                    }).join(', ')}]`),
                                    fixer.insertTextAfter(node, ids.map((name, index) => {
                                        let results = '';
                                        if (name.startsWith('...'))
                                            name = name.substring(3, name.length - 1);
                                        results = `$.${name} = $$${name};`;
                                        return results;
                                    }).join(' '))
                                ], node);
                                break;
                            }
                        }
                    });
                },
                FunctionDeclaration(node) {
                    if (node.parent.type !== 'Program')
                        return;
                    const name = node.id.name;
                    //@ts-ignore
                    const [start, end] = [node.start, node.id.end];
                    this.report(context, fixer => {
                        return fixer.replaceTextRange([start, end], `$.${name} = ${node.async ? 'async ' : ''}function`);
                    }, node);
                },
                ClassDeclaration(node) {
                    if (node.parent.type !== 'Program')
                        return;
                    const name = node.id.name;
                    //@ts-ignore
                    const [start, end] = [node.start, node.id.end];
                    this.report(context, fixer => {
                        return fixer.replaceTextRange([start, end], `$.${name} = class`);
                    }, node);
                },
            })
        });
        return '';
    }
    returnType(node, store) {
    }
    jsScriptCompile(source, env) {
        const { linter } = this;
        const obj = this;
        linter.defineRule('find-global-objects', {
            meta: {
                type: 'problem',
                fixable: 'code',
                docs: {
                    description: 'Rename all global variables.',
                    category: 'Possible Errors'
                },
                schema: [],
            },
            create: (context) => ({
                Identifier(node) {
                    const call = (node) => {
                        const report = (realName) => obj.report(context, fixer => fixer.replaceText(node, `this.${realName}`), node);
                        //@ts-ignore
                        if (node.name.startsWith('$')) {
                            //@ts-ignore
                            const realName = node.name.substring(1, node.name.length);
                            const match = env.filter(item => item.name === realName);
                            if ((0, func_1.isEmpty)(match))
                                obj.reportErr(context, node, `Variable with name '${realName}' doesn't exist..`);
                            else if (node.parent.type == 'AssignmentExpression') {
                                if (!match.every(item => item.kind == 'let' || item.kind == 'var'))
                                    obj.reportErr(context, node, `Cannot reassign variable '${realName}' `);
                                else
                                    report(realName);
                            }
                            else
                                report(realName);
                        }
                    };
                    const type = node.parent.type;
                    if (type === 'MemberExpression') {
                        const parent = (() => {
                            let refNode = node.parent;
                            while (refNode.type === 'MemberExpression') {
                                //@ts-ignore
                                if (refNode.parent.type == 'MemberExpression')
                                    refNode = refNode.parent;
                                else
                                    break;
                            }
                            return refNode;
                        })();
                        if ((0, func_1.is)(parent).null)
                            return;
                        //@ts-ignore 
                        const [start, main_start] = [node.start, parent.start];
                        if (start === main_start) {
                            call(node);
                        }
                    }
                    else {
                        if (node.parent.type == 'AssignmentExpression') {
                            //@ts-ignore
                            call(node);
                        }
                        else if (node.parent.type == 'ExpressionStatement')
                            call(node);
                    }
                }
            })
        });
        return Linting.ExportLint(source, this, { 'find-global-objects': 'error' });
    }
    static ImportLint(source, obj = this.Create(Linting)) {
        const { linter } = obj;
        const results = [];
        linter.defineRule('get-imports', {
            meta: {
                type: 'problem',
                fixable: 'whitespace',
                docs: {
                    description: 'Rename all global variables.',
                    category: 'Possible Errors'
                },
                schema: [],
            },
            create: (context) => ({
                ImportSpecifier(node) {
                    const vars = { imported: node.imported.name, local: node.local.name, default: false };
                    results.push(vars);
                },
                ImportDefaultSpecifier(node) {
                    const vars = { imported: node.local.name, local: node.local.name, default: true };
                    results.push(vars);
                }
            })
        });
        const msg = linter.verifyAndFix(source, {
            parserOptions: { ecmaVersion: 'latest', sourceType: 'module' }, rules: {
                'get-imports': 'error',
            }
        });
        if (!msg.fixed && msg.messages.length > 0)
            throw msg.messages;
        const output = msg.output + ` \n ${utils_1.Ds.export(obj.vars)}`;
        return results;
    }
    static ExportLint(source, obj = this.Create(Linting), rules = {}, existing = []) {
        const { linter } = obj;
        linter.defineRule('define-exports', {
            meta: {
                type: 'problem',
                fixable: 'code',
                docs: {
                    description: 'Rename all global variables.',
                    category: 'Possible Errors'
                },
                schema: [],
            },
            create: (context) => ({
                ExportNamedDeclaration(node) {
                    const { declaration } = node;
                    //@ts-ignore
                    let [start, end] = [node.start, declaration.start];
                    //@ts-ignore init 
                    const object = { type: declaration.type };
                    switch (declaration.type) {
                        case 'VariableDeclaration':
                            //@ts-ignore init 
                            object.kind = declaration.kind;
                            declaration.declarations.forEach(item => {
                                switch (item.id.type) {
                                    case 'Identifier':
                                        object.name = item.id.name;
                                        obj.vars = object;
                                        break;
                                    case 'ArrayPattern':
                                        item.id.elements.map(el => {
                                            //@ts-ignore
                                            if (el.type == 'RestElement')
                                                return el.argument.name;
                                            //@ts-ignore
                                            else
                                                return el.name;
                                        }).forEach(item => {
                                            const variable = (0, func_1.copyOBJ)(object);
                                            variable.name = item;
                                            obj.vars = variable;
                                        });
                                        break;
                                    case 'ObjectPattern':
                                        item.id.properties.forEach(prop => {
                                            const variable = (0, func_1.copyOBJ)(object);
                                            //@ts-ignore
                                            if (prop.type == 'RestElement')
                                                variable.name = prop.argument.name;
                                            //@ts-ignore
                                            else
                                                variable.name = el.name;
                                            obj.vars = variable;
                                        });
                                        break;
                                }
                            });
                            obj.report(context, fixer => fixer.removeRange([start, end]), node);
                            break;
                        case 'ClassDeclaration':
                            object.kind = 'class';
                            object.name = declaration.id.name;
                            obj.vars = object;
                            obj.report(context, fixer => fixer.removeRange([start, end]), node);
                            break;
                        case 'FunctionDeclaration':
                            object.kind = 'function';
                            object.name = declaration.id.name;
                            obj.vars = object;
                            obj.report(context, fixer => fixer.removeRange([start, end]), node);
                            break;
                    }
                }
            })
        });
        const msg = linter.verifyAndFix(source, {
            parserOptions: { ecmaVersion: 'latest', sourceType: 'module' }, rules: Object.assign({ 'no-const-assign': "error", semi: 2, 'define-exports': 'error' }, rules)
        });
        if (!msg.fixed && msg.messages.length > 0)
            throw msg.messages;
        const output = msg.output + ` \n ${utils_1.Ds.export(obj.vars)}`;
        return { code: output.trim(), vars: obj.vars };
    }
}
exports.Linting = Linting;
// const type = node.parent.type;
// console.log(context.getDeclaredVariables(node));
// if (type == 'VariableDeclarator') {
//     if (node.parent.init.type == 'Literal') {
//         if (node.parent.init.raw !== `'null__this_is_jsScript_text'`) {
//         } 
//     }
// } else if (type === 'MemberExpression') {
//     const parent = (() => {
//         let refNode = node.parent;
//         while (refNode.type === 'MemberExpression') {
//             //@ts-ignore
//             if (refNode.parent.type == 'MemberExpression') refNode = refNode.parent;
//             else break;
//         }
//         return refNode;
//     })();
//     if (is(parent).null) return;
//     //@ts-ignore 
//     const [start, main_start] = [node.start, parent.start];
//     if (start === main_start) {
//     }
// }
