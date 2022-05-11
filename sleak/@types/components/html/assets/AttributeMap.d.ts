import { Components } from "../..";
export declare class AttributesMap extends Components {
    fullText: string;
    nameType: 'String' | 'JsExpression';
    valueType: 'String' | 'JsExpression';
    qoutes: {
        type: string;
        count: number;
        uses: boolean;
    };
    private _char;
    private _prev;
    private _started;
    private _store;
    private _compiledValue;
    constructor(props: any);
    init(): void;
    get char(): string;
    set char(char: string);
    compile(...props: any[]): Promise<string>;
    get prev(): string;
    set prev(value: string);
    get started(): boolean;
    set started(value: boolean);
    get store(): number;
    set store(value: number);
    set closed(value: boolean);
    set isClosed(value: boolean);
    get isClosed(): boolean;
    get closed(): boolean;
    get compiledValue(): string;
    set compiledValue(value: string);
}
