import global from '../global';
import * as timers from '../timers';

Object.keys(timers).forEach(name => {
    if (!global[name])
        global[name] = (<any>timers)[name];
});
