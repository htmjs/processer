import { AttributesMap } from './../html/assets/AttributeMap';
import { Components } from '..';
export declare class Component extends Components {
    private _path;
    private _useStrict;
    private _allowChildNodes;
    private _env;
    private _globals;
    private _components;
    private _scripts;
    private _imports;
    private _assets;
    hasSet: boolean;
    private _compiled;
    /**
     *
     * @param props this represents two varibles, ist is the caller, 2nd is optional = the main parent component
     */
    constructor(...props: any[]);
    closeComponents(): Promise<void>;
    get compiled(): boolean;
    set compiled(value: boolean);
    getText(): Promise<string>;
    setGlobals(): Promise<boolean>;
    compile(...props: any[]): Promise<string>;
    setGlobalObject(object: object): void;
    get globals(): any;
    set globals(value: _Variables);
    get props(): object;
    set props(value: object | AttributesMap[]);
    get assets(): Component[];
    set assets(value: any | Component);
    get path(): string;
    set path(value: string);
    get useStrict(): boolean;
    set useStrict(value: boolean);
    get allowChildNodes(): boolean;
    set allowChildNodes(value: boolean);
    get env(): _Variables[];
    set env(value: _Variables[]);
    get scripts(): Scriptlet[];
    set scripts(value: any | Scriptlet);
    get components(): Components[];
    set components(value: Components[] | Components);
    get imports(): Component[];
    set imports(value: Component[] | Component);
    get isClosed(): boolean;
    set isClosed(value: boolean);
    get type(): ComponentType;
    set type(value: ComponentType);
}
