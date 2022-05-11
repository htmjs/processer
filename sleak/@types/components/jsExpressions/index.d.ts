import { Linter } from 'eslint';
import { Components } from '..';
export declare class JsExpressions extends Components {
    private _preserveText;
    isVariable: boolean;
    jsScript: boolean;
    linter: Linter;
    compiler: import('./assets/compiler/').JsExpCompiler;
    constructor(props: any);
    get preserveText(): boolean;
    set preserveText(value: boolean);
    get type(): ComponentType;
    set type(value: ComponentType);
    set name(value: string);
    get name(): string;
    get isClosed(): boolean;
    set isClosed(close: boolean);
    lint(): void;
    statusRun(): void;
    getComponents(obj: any): void;
    compile(...props: any[]): Promise<any>;
    compileResult(source: string): string;
}
