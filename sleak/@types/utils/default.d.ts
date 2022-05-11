export declare class Default {
    private _isSet;
    constructor(props?: any);
    init(): void;
    main(props?: any): void;
    run(...props: any[]): void;
    static Create(props: any): any;
    listenFor(value: string, callback: (timer?: any, value?: any) => any): {
        stop: () => void;
    };
    get isSet(): boolean;
    set isSet(value: boolean);
}
