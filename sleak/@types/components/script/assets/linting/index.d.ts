import { Linter, Rule } from 'eslint';
import { Default } from './../../../../utils/default';
export declare class Linting extends Default {
    private _env;
    private _exportStmt;
    private _linter;
    private _vars;
    constructor();
    get env(): Array<{
        kind: string;
        name: string;
        range?: import('eslint').AST.Range;
    }>;
    set env(value: Array<{
        kind: string;
        name: string;
        range?: import('eslint').AST.Range;
    }> | {
        kind: string;
        name: string;
        range?: import('eslint').AST.Range;
    });
    get linter(): Linter;
    set linter(value: Linter);
    get vars(): Array<_Variables>;
    set vars(value: Array<_Variables> | _Variables);
    get exportStmt(): string;
    set exportStmt(value: string);
    static Lint(source: string): string;
    report: (context: Rule.RuleContext, fix: (fixer: Rule.RuleFixer) => any, node: any, msg?: string) => void;
    reportErr: (context: Rule.RuleContext, node: any, msg?: string) => void;
    returnType(node: Rule.NodeParentExtension, store: _Variables): void;
    jsScriptCompile(source: string, env: _Variables[]): {
        code: string;
        vars: _Variables[];
    };
    static ImportLint(source: string, obj?: Linting): ImportVars[];
    static ExportLint(source: string, obj?: Linting, rules?: any, existing?: _Variables[]): {
        code: string;
        vars: _Variables[];
    };
}
