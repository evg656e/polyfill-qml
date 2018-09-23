import '../lib/object';

export function test_setPrototypeOf(test: any) {
    const proto = {
        getX(this: any) {
            return this.x;
        }
    };

    const p = {
        x: 10
    };

    Object.setPrototypeOf(p, proto);

    test.compare(p.x, (<any>p).getX());
}
