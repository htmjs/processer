export declare function avoid(e: Function): {
    then: (r: Function) => void;
};
export declare function isFalse(args: any): boolean;
export declare function isUndefined(args: any): boolean;
export declare function is(el: any): {
    array: boolean;
    object: boolean;
    number: boolean;
    string: boolean;
    null: boolean;
    emptyArray: number | boolean;
    blockElement: (args?: boolean) => boolean;
    closingEl: () => boolean;
    notEmptyArr: number | boolean;
    notNull: boolean;
    equal: (args: any) => boolean;
    NaN: () => boolean;
    isCap(): boolean;
};
export declare function $createElement(attr: object, el: string, html?: string | Function | HTMLElement | HTMLElement[]): HTMLElement;
export declare function watchPropChange(key: [] | any, callback: Function, value?: any): {
    stop: () => void;
};
export declare function parseBoolean(text: string): boolean;
export declare function copyOBJ(obj: object): any;
export declare function isEmpty(args: any): boolean;
export declare function $style(item: HTMLElement, prop?: any): string | CSSStyleDeclaration;
