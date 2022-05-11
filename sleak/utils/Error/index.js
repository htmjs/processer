"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = void 0;
const default_1 = require("../default");
class Errors extends default_1.Default {
    constructor(props, error) {
        super(props);
        this.isSet = true;
        this.type = props;
    }
    init() {
    }
    throw() {
        return false;
    }
}
exports.Errors = Errors;
