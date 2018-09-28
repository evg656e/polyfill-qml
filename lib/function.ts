export const nativeToString = Function.prototype.toString;

export function toString(fn: Function) {
    let ret = nativeToString.call(fn) as string;
    if (fn.name !== undefined)
        ret = ret.slice(0, 8) + ' ' + fn.name + ret.slice(8); // 8 === 'function'.length
    return ret;
}
