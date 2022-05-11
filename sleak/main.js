"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sleak = void 0;
const html_1 = require("./components/html");
const TextNode_1 = require("./components/html/assets/TextNode");
const jsExpressions_1 = require("./components/jsExpressions");
const script_1 = require("./components/script");
const config_json_1 = __importDefault(require("./utils/config.json"));
const default_1 = require("./utils/default");
const fileModule_1 = require("./utils/fileModule");
const func_1 = require("./utils/func");
const parser_1 = require("./utils/parser");
const parentComponent_1 = require("./components/parentComponent");
const parser = new parser_1.Parser();
class Sleak extends default_1.Default {
    constructor(props) {
        super(props);
        this.opened = [];
        this.isSet = true;
        this.word = '';
        this.count = 0;
        this.store = 0;
    }
    get justClosed() {
        return this._justClosed;
    }
    set justClosed(value) {
        this._justClosed = value;
    }
    get store() {
        return this._store;
    }
    set store(value) {
        this._store = value <= 0 ? 0 : value;
    }
    get previous() {
        return this._previous;
    }
    set previous(value) {
        this._previous = value;
    }
    get current() {
        return this._current;
    }
    set __current(v) {
        this._current = v;
    }
    set current(value) {
        let previous = this.previous;
        let parent = (() => {
            if (previous instanceof TextNode_1.TextNode) {
                previous = previous.parent;
            }
            let ref = previous;
            if ((0, func_1.is)(previous).notNull) {
                while (ref.closed) {
                    if (ref instanceof TextNode_1.TextNode)
                        ref = ref.parent;
                    ref = ref.parent;
                    if (ref == null)
                        break;
                }
            }
            return ref;
        })();
        value.parentComponent = this.compiled;
        this._current = value;
        this._current.parent = parent;
        if ((0, func_1.is)(this.current).notNull) {
            this.current.line = this.line;
            this.current.column = this.column;
            this.opened.push(`line-${this.current.line}-${this.current.type}-${fileModule_1.Fs.name(this.compiled.path)}`);
        }
        if ((0, func_1.is)(parent).null) {
            //@ts-ignore
            if (this.current.type === 'Scriptlet')
                this.compiled.scripts = this.current;
            else
                this.compiled.components = this.current;
        }
        else {
            if (this.current.type === 'Scriptlet')
                throw 'Scriptlet cannot be initialised within a component.. \n near line ' + value.line;
        }
        this.previous = this.current;
    }
    get html() {
        return this._html;
    }
    set html(value) {
        this.word = '';
        this.count = 0;
        this._html = value;
    }
    get comment() {
        return this._comment;
    }
    set comment(value) {
        this._comment = value;
    }
    get column() {
        return this._column;
    }
    set column(value) {
        this._column = value;
    }
    get line() {
        return this._line;
    }
    set line(value) {
        this._line = value;
        this.column = 1;
    }
    init() {
        this.classes = [
            {
                name: 'HTML',
                type: html_1.Html
            },
            {
                name: 'JsExpression',
                type: jsExpressions_1.JsExpressions
            },
            {
                name: 'JsScript',
                type: jsExpressions_1.JsExpressions
            },
            {
                name: 'Script',
                type: script_1.Scriptlet
            },
            {
                name: 'Scriptlet',
                type: script_1.Scriptlet
            },
            {
                name: 'TextNode',
                type: TextNode_1.TextNode
            }
        ];
        this.builder = {
            word: '',
            text: '',
            temp: '',
            type: '',
            build: '',
            clear: (args) => {
                // console.log(args);
                this.builder.word = '';
                this.builder.text = '';
                this.builder.build = '';
                this.builder.type = '';
            },
            clearText: () => {
                this.builder.word = this.builder.text;
                this.builder.text = '';
                this.builder.build = '';
                this.builder.type = '';
            },
            clearBuild: () => {
            }
        };
        this.line = 1;
    }
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
    run(compileText, variables = { env: {}, props: {}, parent: null }, callback = () => this.compile()) {
        if (fileModule_1.Fs.exists(compileText)) {
            this.compiled = new parentComponent_1.Component(this, variables.parent);
            this.compiled.props = variables.props;
            this.compiled.path = compileText;
            this.compiled.isClosed = true;
            this.compiled.setGlobalObject(variables.env);
            fileModule_1.Fs.readChar2(compileText, (char) => this.handle(char), () => callback());
        }
        else {
        }
    }
    handle(char, prevChar) {
        if (this.stop)
            return;
        // variables
        const { builder, current } = this;
        let newline = char == null ? false : parser.isNl(char);
        let whitespace = char == null ? false : parser.isWs(char);
        let charTrack = char == null && true;
        prevChar = (0, func_1.isEmpty)(prevChar) ? '' : prevChar;
        let text = char == null ? '' : char;
        //==####  watch textnodes here
        if (current instanceof TextNode_1.TextNode && charTrack) {
            text = current.temp + prevChar;
            current.stop = true;
            current.isClosed = true;
        }
        //--------- line and column increments ------------------
        if (!charTrack)
            this.column++;
        if (newline)
            this.line++;
        //-------------------
        // compile current 
        if (!this.currentParser(text))
            return;
        // ---##
        if (this.justClosed)
            return (this.justClosed = false);
        //-----------------
        builder.text += text;
        //=== is closing html tag
        if (this.closeHTML(text))
            return;
        //----------------
        if (this.justClosed)
            return (this.justClosed = false);
        //===============
        this.charTracker(char);
        //---------------
        // character parser
        this.parseChar(char);
        ////////////////////////
        if (newline || whitespace || charTrack) {
            builder.clearText();
            // parse new word
            const type = parser.parse(builder.word);
            const objType = this.classes.find(obj => obj.name === type).type;
            const call = () => {
                this.store = 0;
                const obj = new objType(this);
                if (obj instanceof script_1.Scriptlet || obj instanceof jsExpressions_1.JsExpressions)
                    obj.type = type;
                this.current = obj;
                // console.log(prevChar, builder.word, isEmpty(builder.word), objType.name, type, `line: ${this.line}, column: ${this.column}`);
            };
            if (type !== 'TextNode') {
                if (current instanceof TextNode_1.TextNode)
                    if (!current.closed)
                        current.isClosed = true;
                call();
            }
            else {
                if ((0, func_1.is)(this.current).null) {
                    if (!(0, func_1.isEmpty)(builder.word))
                        call();
                }
                else
                    call();
            }
        }
    }
    compile() {
        // console.log(Fs.name(this.compiled.path), this.opened);
        //Halt propgram
        while (this.opened.length > 0) { }
        ;
        this._current = null;
        this.line = 0;
        this.compiled.closed = true;
    }
    charTracker(char) {
        if ((0, func_1.is)(char).null)
            return;
        const active = !(0, func_1.is)(this.current).null;
        // check current component 
        if (active) {
            // return if component is script component
            if (this.current instanceof script_1.Scriptlet || this.current instanceof jsExpressions_1.JsExpressions)
                return;
        }
        //####################
        const play = (run) => run && this.handle(null, char);
        //-------
        if (this.lookout) {
            if (this.type == 'Printer') {
                if (active)
                    play(!(this.current instanceof jsExpressions_1.JsExpressions));
                else
                    play(true);
            }
            else if ((0, func_1.isEmpty)(this.type)) {
                play(char === '@' || char === '&' || parser.isWord(char));
                if (char === '/')
                    this.html = true;
                this.lookout = false;
            }
            else if (this.type == 'HTML')
                this.html = true;
        }
        else {
            if (parser.isWord(char) && (!(this.current instanceof TextNode_1.TextNode)) && !this.html)
                play(true);
            else
                play(!(0, func_1.isEmpty)(char) && !config_json_1.default.specialChars.includes(char) && !parser.isWord(char) && (!(this.current instanceof TextNode_1.TextNode)));
        }
    }
    currentParser(char) {
        //###
        if ((0, func_1.is)(this.current).null)
            return true;
        if (this.current.isClosed)
            return true;
        //######
        this.scriptParser(char);
        this.jsExpressParser(char);
        this.htmlParser(char);
        this.textParser(char);
        if ((0, func_1.is)(this.current).null)
            return true;
        return this.current.isClosed;
    }
    //parser char
    parseChar(char) {
        const { current } = this;
        switch (char) {
            case '<':
                this.lookout = true;
                this.type = null;
                break;
            case '{':
                this.lookout = true;
                this.type = 'Printer';
                if (current) {
                    if (current instanceof jsExpressions_1.JsExpressions) {
                        if (!current.isClosed) {
                            this.type = null;
                            this.lookout = false;
                        }
                    }
                }
                break;
            case '%':
                this.lookout = true;
                if (current) {
                    if (current instanceof jsExpressions_1.JsExpressions) {
                        if (!current.isClosed) {
                            this.type = null;
                            this.lookout = false;
                        }
                    }
                }
                break;
            case '/':
                if (this.lookout) {
                    this.lookout = true;
                    this.type = 'HTML';
                }
                else
                    this.esc = true;
                break;
            default: this.lookout = false;
        }
    }
    // Parsers 
    htmlParser(char) {
        const { current, builder } = this;
        if (current instanceof html_1.Html) {
            // first compile run get html name 
            if (current.firstRun) {
                let { word } = builder;
                let pre = char;
                if (char == '/') {
                    this.lookout = true;
                    pre = 'this is wrong';
                }
                ;
                if (!parser.isWN(char) && char !== '>') {
                    if (pre.length <= 1)
                        this.lookout = false;
                    current.temp += (() => {
                        let text = word.match(/[^<]+/)[0];
                        if (!(0, func_1.isEmpty)(current.temp))
                            text = '';
                        return text + char;
                    })();
                }
                else {
                    current.name = current.temp;
                    if (char == '>') {
                        if (this.lookout)
                            current.closed = true;
                        this.lookout = false;
                        this.justClosed = true;
                        current.isClosed = true;
                    }
                }
                if (!(0, func_1.isEmpty)(current.name))
                    current.firstRun = false;
            }
            else {
                //@ts-ignore
                const htmlObj = current;
                if (!htmlObj.isClosed) {
                    htmlObj.parseAttr(char);
                }
            }
        }
    }
    closeHTML(char) {
        const { current } = this;
        let word = '';
        const run = (char) => {
            if (char === '>') {
                this.word = this.word.substring(0, this.word.length - 1).trim();
                word = this.word;
                this.html = false;
                this.justClosed = true;
            }
            return !this.html;
        };
        if (this.html) {
            this.count++;
            this.word += char;
            if (this.count == 1) {
                if ((0, func_1.isEmpty)(this.word)) {
                    word = this.word;
                    this.html = false;
                    console.warn(`Suspected 'closing tag error' at line ${this.line} column ${this.column} \nif its an error please fix to avoid compile errors if not, ignore.`);
                }
                else {
                    if (current instanceof TextNode_1.TextNode) {
                        const { value } = current;
                        if (value.trim().endsWith('</'))
                            current.value = value.substring(0, value.length - 2);
                        current.isClosed = true;
                        this.word = '';
                    }
                    if (run(char)) {
                        const component = this.findComponent(html_1.Html, word);
                        component.closed = true;
                    }
                }
            }
            else {
                if (run(char)) {
                    (0, func_1.avoid)(e => {
                        const component = this.findComponent(html_1.Html, word);
                        component.closed = true;
                    }).then(err => {
                        if (err)
                            console.error('component does not exist');
                    });
                }
            }
        }
        return this.html;
    }
    jsExpressParser(char) {
        const { current, store } = this;
        if (current instanceof jsExpressions_1.JsExpressions) {
            const ref = current.jsScript ? '%' : '}';
            if (char == '{')
                this.store++;
            if (char == '}')
                this.store--;
            if (char == '}' && store > 0) {
                current.value += char;
            }
            else if (char === '}' && current.temp == ref) {
                let value = current.value;
                let text = ' ';
                const match = value.match(/@\w+/g);
                if (!(0, func_1.is)(match).null)
                    text = match[0];
                if (!value.trim().includes(' ') && value.startsWith('/')) {
                    /// close to avoid errors ============
                    current.parent.children.pop();
                    current.useless = true;
                    current.closed = true;
                    //==========
                    ///==========variables
                    const name = value.substring(1, value.length);
                    const component = this.findComponent(jsExpressions_1.JsExpressions, name);
                    //================ throw Error
                    if ((0, func_1.is)(component).null)
                        throw `Couldn't find any component with name: '${name}' at line: ${this.line} column: ${this.column}, Unknown tag error..`;
                    else {
                        this._current = component;
                        component.closed = true;
                        this.justClosed = true;
                        return;
                    }
                }
                else if (value.trim().startsWith(text)) {
                    current.name = text;
                }
                else {
                    current.name = null;
                }
                this.justClosed = true;
                current.isClosed = true;
            }
            else {
                if (char == ref) {
                    current.temp = char;
                }
                else {
                    current.value += char;
                }
            }
        }
    }
    textParser(char) {
        const { current, builder, html } = this;
        if (current instanceof TextNode_1.TextNode) {
            this.charTracker(char);
            this.parseChar(char);
            if (this.lookout)
                current.temp += char;
            if (html) {
                this.closeHTML(char);
                return false;
            }
            // make sure char is a text
            let { word } = builder;
            if (current.firstRun) {
                current.temp = '';
                current.value += word + char;
                current.firstRun = false;
            }
            else {
                if (!this.lookout) {
                    if (current.stop) {
                        const text = current.temp + char;
                        if (current.value.endsWith(text)) {
                            current.value = current.value.substring(0, (current.value.length - text.length));
                        }
                    }
                    else
                        current.value += current.temp + char;
                    if (current.temp.length > 1)
                        current.temp = '';
                }
            }
        }
    }
    scriptParser(char) {
        const { current } = this;
        if (current instanceof script_1.Scriptlet) {
            const refChar = current.type === 'Scriptlet' ? '@' : '&';
            if (char === refChar && (current.value.endsWith(' ') || current.value.endsWith('\n'))) {
                current.temp += char;
            }
            else {
                if (current.temp === refChar) {
                    if (char == '>') {
                        current.closed = true;
                        this.justClosed = true;
                    }
                    else {
                        current.value += current.temp + char;
                        current.temp = '';
                    }
                }
                else {
                    current.value += char;
                }
            }
        }
    }
    ///=======================
    findComponent(type, name, from) {
        if ((0, func_1.is)(from).null)
            from = this.current;
        //==######
        let component;
        if ((0, func_1.is)(from).null)
            return;
        while (true) {
            if (from instanceof type && from.name === name && from.isBlock) {
                if (from.closed)
                    from = from.parent;
                else {
                    component = from;
                    break;
                }
            }
            else {
                if ((0, func_1.is)(from.parent).null) {
                    throw `error code at line: ${this.line} column: ${this.column}, \n No closing component with name '${name}' and type '${type.name}' available`;
                }
                else {
                    from = from.parent;
                }
            }
        }
        return component;
    }
}
exports.Sleak = Sleak;
Sleak.openComponets = [];
