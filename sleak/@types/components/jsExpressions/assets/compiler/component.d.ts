import { JsExpressions } from '../..';
import { JsExpCompiler } from './index';
export default class JsEComponents extends JsExpCompiler {
    private _component;
    caller: JsExpressions;
    ref: any[];
    name: string;
    compiled: string;
    constructor(props: any);
    run(...args: any[]): void;
    compile(...props: any[]): Promise<string>;
}
