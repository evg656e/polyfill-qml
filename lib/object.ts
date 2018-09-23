if (!Object.setPrototypeOf) {
    Object.setPrototypeOf = function (obj: any, proto: object | null) {
        obj.__proto__ = proto;
        return obj;
    }
}
