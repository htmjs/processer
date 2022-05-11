"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
class Parser {
    constructor() {
    }
    isWord(char) {
        return /\w/.test(char);
    }
    isWs(char) {
        return char.match(/\s/g) !== null;
    }
    isNl(char) {
        return char.indexOf('\n') === 0;
    }
    isWN(char) {
        return this.isWs(char) || this.isNl(char);
    }
    parse(word) {
        var result = "TextNode";
        if (word === '{{')
            result = 'JsExpression';
        if (word === '{%')
            result = 'JsScript';
        else if (word.trim().startsWith('<@'))
            result = 'Scriptlet';
        else if (word.trim().startsWith('<&'))
            result = 'Script';
        else if (word.trim().match(/<\w+/g))
            result = 'HTML';
        return result;
    }
    isCaped(word) {
        return /[A-Z]/.test(word);
    }
    isQuote(char) {
        return char === `'` || char === `"`;
    }
    isBrace(char) {
        return char === '{' || char === '}';
    }
}
exports.Parser = Parser;
