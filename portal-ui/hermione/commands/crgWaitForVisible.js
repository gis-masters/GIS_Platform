'use strict';

/* eslint-disable */

Object.defineProperty(exports, '__esModule', {
    value: true
});

const _getIterator2 = require('babel-runtime/core-js/get-iterator');

const _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
}

/**
 *
 * Wait for an element (selected by css selector) for the provided amount of
 * milliseconds to be (in)visible. If multiple elements get queried by a given
 * selector, it returns true (or false if reverse flag is set) if at least one
 * element is visible.
 *
 * Форк waitForVisible.
 * Добавлена возможность задавать свой error message.
 *
 * @alias browser.crgWaitForVisible
 * @param {String}      selector element to wait for
 * @param {Number=}     ms       time in ms (default: 500)
 * @param {String=}     errorMsg error message
 * @param {Boolean=}    reverse  if true it waits for the opposite (default: false)
 * @uses utility/waitUntil, state/isVisible
 * @type utility
 *
 */

const crgWaitForVisible = function crgWaitForVisible(selector, ms, errorMsg, reverse) {
    const _this = this;

    if (typeof ms === 'string' || typeof ms === 'boolean') {
        reverse = errorMsg;
        errorMsg = ms;
        ms = null;
    }

    if (typeof errorMsg === 'boolean') {
        reverse = errorMsg;
        errorMsg = null;
    }

    reverse = typeof reverse === 'boolean' ? reverse : false;

    /*!
     * ensure that ms is set properly
     */
    if (typeof ms !== 'number') {
        ms = this.options.waitforTimeout;
    }

    if (typeof errorMsg !== 'string') {
        const isReversed = reverse ? '' : 'not';
        errorMsg = `element ("${selector || this.lastResult.selector}") still ${isReversed} visible after ${ms}ms`;
    }

    return this.waitUntil(() => {
        return _this.isVisible(selector).then((isVisible) => {
            if (!Array.isArray(isVisible)) {
                return isVisible !== reverse;
            }

            var result = reverse;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError;

            try {
                for (
                    var _iterator = (0, _getIterator3.default)(isVisible), _step;
                    !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
                    _iteratorNormalCompletion = true) {
                    const val = _step.value;

                    if (!reverse) {
                        result = result || val;
                    } else {
                        result = result && val;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return result !== reverse;
        });
    }, ms, errorMsg);
};

exports.default = crgWaitForVisible;
module.exports = exports.default;
