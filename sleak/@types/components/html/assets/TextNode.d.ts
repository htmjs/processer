import { Components } from './../../index';
export declare class TextNode extends Components {
    constructor(props: any);
    get isClosed(): boolean;
    set isClosed(value: boolean);
    compile(...props: any[]): Promise<any>;
}
