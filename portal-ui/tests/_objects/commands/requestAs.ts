/* eslint-disable no-console */

import { AxiosError } from 'axios';

import { _reqAuthenticate } from '../../../src/app/services/auth/auth/auth.client';
import { http } from '../../../src/app/services/api/http.service';
import { getTestUser, TestUser } from './auth/testUsers';
import { fetchUserToken } from './auth/fetchUserToken';

const colors = {
  red: '\u001B[31m',
  green: '\u001B[32m',
  yellow: '\u001B[33m',
  blue: '\u001B[34m',
  magenta: '\u001B[35m',
  cyan: '\u001B[36m',
  gray: '\u001B[37m',
  none: '\u001B[0m'
};

const methodColors = {
  get: colors.yellow,
  post: colors.blue,
  put: colors.magenta,
  patch: colors.magenta,
  delete: colors.red
};

let currentUser: TestUser | undefined;

http.axios.interceptors.request.use(config => {
  console.log('');
  console.log(
    colors.gray,
    'REQUEST',
    methodColors[config.method?.toLocaleLowerCase() as keyof typeof methodColors] || colors.none,
    config.method?.toLocaleUpperCase(),
    colors.cyan,
    config.url
  );

  if (config.data) {
    try {
      console.log(colors.gray, 'REQUEST DATA:', colors.none, JSON.stringify(config.data));
    } catch {
      console.log(colors.gray, 'REQUEST DATA:', colors.none, config.data);
    }
  }

  if (currentUser) {
    console.log(colors.gray, 'USER:', colors.none, currentUser.email);

    config.headers.Authorization = 'Bearer ' + currentUser?.token;
    currentUser = undefined;
  }

  console.log('');

  return config;
});

http.axios.interceptors.response.use(
  response => {
    console.log('');
    console.log(
      colors.gray,
      'RESPONSE',
      colors.green,
      response.status,
      methodColors[response.config.method?.toLocaleLowerCase() as keyof typeof methodColors] || colors.none,
      response.config.method?.toLocaleUpperCase(),
      colors.cyan,
      response.config.url
    );
    console.log(colors.gray, 'RESPONSE DATA:', colors.none, response.data);
    console.log('');

    return response;
  },
  (error: AxiosError) => {
    console.log('');
    console.log(
      colors.gray,
      'RESPONSE',
      colors.red,
      error?.response?.status,
      methodColors[error?.config?.method?.toLocaleLowerCase() as keyof typeof methodColors] || colors.none,
      error?.config?.method?.toLocaleUpperCase(),
      colors.cyan,
      error?.config?.url
    );
    console.log('');

    return Promise.reject(error);
  }
);

http.cache.config.disabled = true;
http.cache.config.maxAge = 0;

export async function requestAs<R, A extends unknown[]>(
  user: TestUser,
  clientMethod: (...b: A) => Promise<R>,
  ...args: A
): Promise<R> {
  if (!user.token) {
    await fetchUserToken(user);
  }

  currentUser = user;

  return await clientMethod(...args);
}

export const requestAsAdmin = requestAs.bind(null, getTestUser('Администратор организации')) as <
  R,
  A extends unknown[]
>(
  clientMethod: (...b: A) => Promise<R>,
  ...args: A
) => Promise<R>;
