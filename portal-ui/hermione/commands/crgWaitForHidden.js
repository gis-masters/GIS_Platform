'use strict';

/**
 *
 * @alias browser.crgWaitForHidden
 * @param {String}   selector   element to wait for
 * @param {Number=}  ms         time in ms
 * @param {String=}  errorMsg   error message
 * @param {Boolean=} reverse    if true it waits for the opposite (default: false)
 *
 */

module.exports = function (selector, ms, errorMsg, reverse) {
    if (typeof ms === 'string' || typeof ms === 'boolean') {
        reverse = errorMsg;
        errorMsg = ms;
        ms = null;
    }

    if (typeof errorMsg === 'boolean') {
        reverse = errorMsg;
        errorMsg = null;
    }

    return this.browser.crgWaitForVisible(selector, ms, errorMsg, !reverse);
};
