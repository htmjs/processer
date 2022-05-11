import { JsExpressions } from './../../index';
import { Component } from './../../../parentComponent/index';
import { JsExpCompiler } from './index';
export default class Use extends JsExpCompiler {
    private _component;
    caller: JsExpressions;
    constructor(props: any);
    run(...props: any[]): void;
    main(path: string): void;
    get component(): Component;
    set component(value: Component);
    compile(...props: any[]): Promise<string>;
}
