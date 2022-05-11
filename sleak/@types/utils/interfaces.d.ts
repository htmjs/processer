interface CompilerOptions {
    path: string;
}
interface IncBuilder {
    word: string;
    text: string;
    build?: string;
    temp?: string;
    type: string;
    clear: (args?: any) => any;
    clearText: () => any;
    clearBuild: () => any;
}
declare type compileTypes = 'print' | 'scriptlet' | 'script';
declare type printKeywords = 'each' | 'use' | 'if' | 'else' | 'import' | null;
declare type ComponentType = 'JsExpression' | 'JsScript' | 'TextNode' | 'HTML' | 'Printer' | 'Script' | 'Scriptlet' | 'Page' | 'Component' | 'Include' | 'Asset';
declare type Scriptlet = import('./../components/script/index').Scriptlet;
declare type Declaration = 'FunctionDeclaration' | 'VariableDeclaration' | 'ClassDeclaration';
interface _Variables {
    type: Declaration;
    name: string;
    kind: 'const' | 'var' | 'let' | 'function' | 'class';
    value?: any;
    isJsx?: boolean;
}
interface ImportVars {
    imported: string;
    local: string;
    default: boolean;
}
declare type compiledText = '***clear!!***' | string;
