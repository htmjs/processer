"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractVars = exports.Ds = void 0;
exports.Ds = {
    membership: (object, store = []) => {
        switch (object.type) {
            case 'MemberExpression':
                if (object.computed) {
                    if (object.property.type === 'Literal') {
                        store.unshift(`[${object.property.raw}]`);
                    }
                    else
                        store.unshift(`[${object.property.name}]`);
                }
                else
                    store.unshift(`.${object.property.name}`);
                return exports.Ds.membership(object.object, store);
            case 'Identifier':
                store.unshift(object.name);
                break;
            case 'ArrayExpression':
                store.unshift(`[${object.elements.map(item => {
                    if (item.type === 'Identifier')
                        return item.name;
                    else if (item.type == 'Literal')
                        return item.raw;
                }).join(', ')}]`);
                break;
            case 'CallExpression':
                store.unshift(exports.Ds.callExp(object));
                break;
        }
        return store.join('');
    },
    callExp(object) {
        //@ts-ignore
        const { callee, arguments: elements } = object;
        const args = elements.map(item => {
            if (item.type === 'Literal')
                return item.raw;
            else
                return item.name;
        }).join(', ');
        return `${callee.name}(${args})`;
    },
    conditional(object, store = []) {
        return store.join('');
    },
    logical(object, store = []) {
        return store.join('');
    },
    export(object) {
        if (object.length == 0)
            return '';
        return `return {${object.map(item => item.name).join(', ')}}`;
    }
};
function extractVars(source, func, _$ = false) {
    let ctx = {};
    let fn = Function(source);
    if (_$)
        fn.bind(_$);
    ctx = Object.assign(ctx, fn.call(ctx));
    for (const key in ctx) {
        if (Object.prototype.hasOwnProperty.call(ctx, key)) {
            const value = ctx[key];
            func({ key: key, value: value });
        }
    }
}
exports.extractVars = extractVars;
