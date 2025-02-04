import { AxiosError } from 'axios';
import { isObject } from 'lodash';

import { isRecordStringUnknown } from './isRecordStringUnknown';

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
export function isAxiosError<T = unknown, D = unknown>(payload: unknown): payload is AxiosError<T, D> {
  return (
    isObject(payload) &&
    isRecordStringUnknown(payload) &&
    (payload.isAxiosError === true || payload.name === 'AxiosError')
  );
}
