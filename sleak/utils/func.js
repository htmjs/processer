"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$style = exports.isEmpty = exports.copyOBJ = exports.parseBoolean = exports.watchPropChange = exports.$createElement = exports.is = exports.isUndefined = exports.isFalse = exports.avoid = void 0;
const jsdom_1 = require("jsdom");
let document = (() => {
    const window = new jsdom_1.JSDOM('<html><body></body></html>').window;
    return window.document;
})();
function avoid(e) {
    try {
        e();
        return {
            then: function (r) {
                r(false, 'Success...');
            }
        };
    }
    catch (error) {
        return {
            then: function (e) {
                e(true, error);
            }
        };
    }
}
exports.avoid = avoid;
function isFalse(args) {
    return args === false;
}
exports.isFalse = isFalse;
function isUndefined(args) {
    if (args !== null && args !== undefined) {
        return false;
    }
    else {
        return true;
    }
}
exports.isUndefined = isUndefined;
function is(el) {
    const obj = {
        array: Array.isArray(el),
        object: typeof el == 'object',
        number: typeof el == 'number',
        string: typeof el == 'string',
        null: isUndefined(el),
        emptyArray: Array.isArray(el) ? el.length == 0 : 0,
        blockElement: function (args) {
            const node = document.createElement(args ? el.match(/(?<=<|<\/)(\w|-)+/g)[0] : el);
            // console.log(node);
            return node.outerHTML.indexOf('</') !== -1;
        },
        closingEl: function () {
            return el.match(/(?<=<\/)(\w|-)+/g) !== null;
        },
        notEmptyArr: Array.isArray(el) ? el.length > 0 : 0,
        notNull: isFalse(isUndefined(el)),
        equal: function (args) {
            return el == args;
        },
        NaN: function () {
            if (typeof el == 'number')
                return false;
            let trimed = el.trim();
            let has = trimed.search(/([^\d|\.]|([^\d]\.))/g);
            return (has !== -1);
        },
        isCap() {
            return /^[A-Z]*$/.test(el);
        }
    };
    return obj;
}
exports.is = is;
function $createElement(attr, el, html) {
    const ele = document.createElement(el);
    // loop through
    if (Object.keys(attr).length !== 0) {
        for (let i = 0; i < Object.keys(attr).length; i++) {
            const key = Object.keys(attr)[i];
            const val = Object.values(attr)[i];
            if (typeof val === 'object' && is(val).notNull) {
                for (let i = 0; i < Object.keys(val).length; i++) {
                    const obj = Object.values(val)[i];
                    const obj2 = Object.keys(val)[i];
                    ele[key][obj2] = obj;
                }
            }
            else {
                ele.setAttribute(key, val);
            }
        }
    }
    if (is(html).notNull) {
        if (typeof html == 'string') {
            ele.innerHTML = html;
        }
        else if (html instanceof HTMLElement) {
            ele.appendChild(html);
        }
        else if (typeof html == 'function') {
            const result = html();
            if (is(result).string) {
                ele.innerHTML = result;
            }
            else if (result instanceof HTMLElement) {
                ele.append(result);
            }
            else if (Array.isArray(result)) {
                result.forEach(item => ele.append(item));
            }
        }
        else if (Array.isArray(html)) {
            html.forEach(item => ele.append(item));
        }
    }
    return ele;
}
exports.$createElement = $createElement;
function watchPropChange(key, callback, value) {
    let watched = key[0][key[1]];
    const watch = setInterval(() => {
        if (is(value).notNull) {
            if (key[0][key[1]] == value) {
                clearInterval(watch);
                callback(watch);
            }
        }
        else {
            if (key[0][key[1]] !== watched) {
                watched = key[0][key[1]];
                callback(watch, watched);
            }
        }
    }, 100);
    return {
        stop: function () {
            clearInterval(watch);
        }
    };
}
exports.watchPropChange = watchPropChange;
function parseBoolean(text) {
    return text === 'true';
}
exports.parseBoolean = parseBoolean;
function copyOBJ(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.copyOBJ = copyOBJ;
function isEmpty(args) {
    if (is(args).null)
        return true;
    try {
        if (typeof args == 'object') {
            if (args.value !== undefined) {
                return args.value.trim().length === 0;
            }
            else if (Array.isArray(args)) {
                return args.length < 1;
            }
            else {
                return $style(args, 'display') == 'none' ?
                    args.innerHTML.trim().length > 0 :
                    args.innerText.trim().length === 0;
            }
        }
        else if (typeof args == "number") {
            return args === 0;
        }
        else {
            return args.trim().length < 1;
        }
    }
    catch (e) {
        return true;
    }
}
exports.isEmpty = isEmpty;
function $style(item, prop) {
    if (is(prop).notNull)
        return getComputedStyle(item)[prop];
    return getComputedStyle(item);
}
exports.$style = $style;
