import { Default } from "../default";
export declare class Errors extends Default {
    type: ErrorTypes;
    constructor(props: ErrorTypes, error: string);
    init(): void;
    throw(): boolean;
}
declare type ErrorTypes = 'warning' | 'error';
export {};
