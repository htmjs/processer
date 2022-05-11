import { Components } from '..';
export declare class Scriptlet extends Components {
    private _script;
    private _control;
    constructor(props: any);
    get script(): string;
    set script(value: string);
    get closed(): boolean;
    set closed(value: boolean);
    get control(): number;
    set control(value: number);
    linting(): void;
    compile(): Promise<string>;
    replace(): void;
}
