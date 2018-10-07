//! \see https://github.com/zloirock/core-js/blob/master/packages/core-js/internals/global.js
export default typeof window != 'undefined' && (<any>window).Math == Math ? window :
    typeof self != 'undefined' && (<any>self).Math == Math ? self :
    Function('return this')();
