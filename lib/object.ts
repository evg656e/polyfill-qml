export function setPrototypeOf(obj: any, proto: object | null) {
    obj.__proto__ = proto;
    return obj;
}
