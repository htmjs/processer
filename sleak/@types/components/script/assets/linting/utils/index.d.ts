export declare const Ds: {
    membership: (object: any, store?: Array<string>) => string;
    callExp(object: any): string;
    conditional(object: any, store?: string[]): string;
    logical(object: any, store?: string[]): string;
    export(object: _Variables[]): string;
};
export declare function extractVars(source: string, func: ({ value, key }: {
    value: any;
    key: any;
}) => any, _$?: any): void;
