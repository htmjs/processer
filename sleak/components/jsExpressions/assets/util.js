"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expLint = exports.tsCompile = exports.convertEnv = exports.getEnv = void 0;
const ts = __importStar(require("typescript"));
const eslint_1 = require("eslint");
function getEnv(env, name) {
    name = name.split('.')[0];
    return env.find(item => item.name === name);
}
exports.getEnv = getEnv;
function convertEnv(env) {
    let code = '';
    env.forEach(variable => {
        let kind = (variable.kind !== 'let' && variable.kind !== 'const' && variable.kind !== 'var') ? 'const' : variable.kind;
        code += `${kind} ${variable.name} = 'null__this_is_jsScript_text'; `;
    });
    return code;
}
exports.convertEnv = convertEnv;
function tsCompile(source, options = null) {
    // Default options -- you could also perform a merge, or use the project tsconfig.json
    if (null === options) {
        options = { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2016 } };
    }
    return ts.transpileModule(source, options).outputText;
}
exports.tsCompile = tsCompile;
function expLint(source, linter = new eslint_1.Linter()) {
    const fixTracker = [];
    linter.defineRule('code-checker', {
        meta: {
            type: 'problem',
            fixable: 'code',
            docs: {
                description: 'Rename all global variables.',
                category: 'Possible Errors'
            },
            schema: [],
        },
        create: (context) => {
            function loadExpressions(node, store = []) {
                let refracted = [];
                let item;
                switch (node.type) {
                    case 'Identifier':
                        store.push({
                            method: 'replaceText',
                            props: {
                                useRange: false,
                                node: node,
                                text: `_$.${node.name}`,
                                //@ts-ignore
                                range: [node.start, node.end]
                            }
                        });
                        break;
                    case 'ArrayExpression':
                        for (const obj of node.elements) {
                            if (obj.type == 'SpreadElement') {
                                loadExpressions(obj.argument, store);
                            }
                            else
                                loadExpressions(obj, store);
                        }
                        break;
                    case 'MemberExpression':
                        item = getRoot(node, 'MemberExpression', 'object');
                        return loadExpressions(item, store);
                    case 'CallExpression':
                        item = getRoot(node, 'CallExpression', 'callee');
                        return loadExpressions(item, store);
                    case 'TemplateLiteral':
                    case 'SequenceExpression':
                        for (const obj of node.expressions) {
                            const arr = loadExpressions(obj, store);
                        }
                        break;
                    case 'LogicalExpression':
                        return logical(node, store, 'LogicalExpression');
                    case 'AssignmentExpression':
                        return logical(node, store, 'AssignmentExpression');
                    case 'ConditionalExpression':
                        return loadExpressions(node.test, store);
                    case 'UpdateExpression':
                        break;
                    case 'BinaryExpression':
                        return logical(node, store, 'BinaryExpression');
                    case 'ChainExpression':
                        return loadExpressions(node.expression, store);
                }
                return store;
            }
            function getRoot(node, name, id) {
                if (node.type == name) {
                    //@ts-ignore
                    return getRoot(node[id]);
                }
                return node;
            }
            function logical(node, store, name) {
                loadExpressions(node.right, store);
                if (node.left.type == name) {
                    //@ts-ignore
                    return logical(node.left, store, name);
                }
                //@ts-ignore
                return loadExpressions(node.left, store);
            }
            function build(props, fixer, node) {
                fixTracker.push(node.loc.start.line);
                return props.map(prop => {
                    const { props: { range, useRange, node, text } } = prop;
                    const insider = useRange ? range : node;
                    //@ts-ignore
                    return fixer[prop.method](insider, text);
                });
            }
            function report(node, props, context) {
                context.report({
                    message: 'Create global flow',
                    node: node,
                    fix: (fixer) => build(props, fixer, node)
                });
            }
            return {
                ExpressionStatement(node) {
                    if (fixTracker.includes(node.loc.start.line))
                        return;
                    if (node.parent.type !== 'Program')
                        return;
                    let refracted;
                    switch (node.expression.type) {
                        default:
                            refracted = loadExpressions(node.expression);
                            break;
                    }
                    report(node, refracted, context);
                }
            };
        },
    });
    const msg = linter.verifyAndFix(source, {
        parserOptions: { ecmaVersion: 'latest', sourceType: 'module' }, rules: {
            'code-checker': 'error',
        }
    });
    return msg;
}
exports.expLint = expLint;
