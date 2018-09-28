import * as timers from '../timers';

declare const global: any;

Object.keys(timers).forEach(name => {
    if (!global[name])
        global[name] = (<any>timers)[name];
});
