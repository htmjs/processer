import { JsExpressions } from '../..';
import { JsExpCompiler } from './index';
export default class JsEConditionals extends JsExpCompiler {
    caller: JsExpressions;
    ref: boolean;
    name: string;
    validated: boolean;
    compiled: string;
    value: string;
    constructor(props: any);
    run(...props: any[]): void;
    compile(...props: any[]): Promise<string>;
    compileNodes(obj: any): Promise<void>;
    ifStmt(): Promise<string>;
    elseStmt(): Promise<string>;
    lint(): void;
}
