import { Component } from './../../../parentComponent/index';
import { JsExpCompiler } from './index';
import { JsExpressions } from '../..';
export default class JsLoader extends JsExpCompiler {
    private _path;
    private _props;
    private _component;
    line: number;
    caller: JsExpressions;
    constructor(props: any);
    run(props: string): Promise<void>;
    compile(...props: any[]): Promise<string>;
    main(props?: any): Promise<void>;
    get props(): object;
    set props(value: object);
    get path(): string;
    set path(value: string);
    get component(): Component;
    set component(value: Component);
}
