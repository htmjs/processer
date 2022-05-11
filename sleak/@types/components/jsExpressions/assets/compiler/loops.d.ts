import { JsExpressions } from '../..';
import { Components } from '../../..';
import { Component } from './../../../parentComponent/index';
import { JsExpCompiler } from './index';
export default class JsELoops extends JsExpCompiler {
    private _component;
    caller: JsExpressions;
    ref: any[];
    name: string;
    refString: string;
    compiled: string;
    constructor(props: any);
    get component(): Component;
    set component(value: Component);
    run(...props: any[]): void;
    compile(...props: any[]): Promise<string>;
    changeParents(obj: Components): Promise<void>;
}
