import { JsExpCompiler } from ".";
export default class Imports extends JsExpCompiler {
    var: _Variables;
    constructor(props: any);
    run(...props: any[]): Promise<void>;
    compile(...props: any[]): Promise<string>;
    buildCode(props: ImportVars[], path: string): string;
}
