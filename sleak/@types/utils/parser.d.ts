export declare class Parser {
    constructor();
    isWord(char: string): boolean;
    isWs(char: string): boolean;
    isNl(char: string): boolean;
    isWN(char: string): boolean;
    parse(word: string): ComponentType;
    isCaped(word: string): boolean;
    isQuote(char: string): boolean;
    isBrace(char: string): boolean;
}
