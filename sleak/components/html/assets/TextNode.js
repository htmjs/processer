"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextNode = void 0;
const index_1 = require("./../../jsExpressions/index");
const __1 = require("..");
const index_2 = require("./../../index");
class TextNode extends index_2.Components {
    constructor(props) {
        super(props);
        this.type = "TextNode";
        this.isSet = true;
    }
    get isClosed() {
        return super.isClosed;
    }
    set isClosed(value) {
        this.closed = value;
        this.parent = this.parent;
    }
    compile(...props) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.parent instanceof __1.Html || this.parent instanceof index_1.JsExpressions) {
                if (this.parent.preserveText)
                    return this.value;
            }
            return this.value;
        });
    }
}
exports.TextNode = TextNode;
