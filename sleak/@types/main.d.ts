import { Components } from './components';
import { Default } from './utils/default';
import { Component } from './components/parentComponent';
export declare class Sleak extends Default {
    builder: IncBuilder;
    private _line;
    private _column;
    private _comment;
    classes: Array<{
        name: ComponentType;
        type: typeof Components;
    }>;
    lookout: boolean;
    word: string;
    esc: boolean;
    count: number;
    compiled: Component;
    private _current;
    private _html;
    type: ComponentType;
    private _store;
    private _justClosed;
    private _previous;
    static openComponets: number[];
    opened: any[];
    stop: boolean;
    constructor(props?: any);
    get justClosed(): boolean;
    set justClosed(value: boolean);
    get store(): number;
    set store(value: number);
    get previous(): Components;
    set previous(value: Components);
    get current(): Components;
    set __current(v: Components);
    set current(value: Components);
    get html(): boolean;
    set html(value: boolean);
    get comment(): boolean;
    set comment(value: boolean);
    get column(): number;
    set column(value: number);
    get line(): number;
    set line(value: number);
    init(): void;
    /**
     * Code begis here ==========================================================
     *
    */
    /**
     *
     * @param compileText This is either the path to .dx file or a sleak text for compilation
     * @param variables optional: global varibles needed for compilation
     * @param callback optional: compilation options
     */
    run(compileText: string, variables?: {
        env?: any;
        props: any;
        parent?: any;
    }, callback?: Function): void;
    handle(char: string, prevChar?: string): boolean;
    compile(): void;
    charTracker(char: string): void;
    currentParser(char: string): boolean;
    parseChar(char: string): void;
    htmlParser(char: string): void;
    closeHTML(char: string): boolean;
    jsExpressParser(char: string): void;
    textParser(char: string): boolean;
    scriptParser(char: string): void;
    findComponent(type: typeof Components, name: string, from?: Components): Components;
}
