import { JsExpressions } from './../../index';
import { Default } from './../../../../utils/default';
export declare class JsExpCompiler extends Default {
    private _env;
    caller: JsExpressions;
    constructor(props?: any);
    init(): void;
    get env(): _Variables[];
    set env(value: _Variables[]);
    compile(...props: any[]): any;
}
