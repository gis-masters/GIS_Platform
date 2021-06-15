import axios, { AxiosError } from 'axios';

import { KadItem, KadObject } from './kad-search.models';
import { Toast } from '../components/Toast/Toast';
import { services } from './services';

const rosreestrApi = 'https://pkk.rosreestr.ru/api/';

export async function getRosreestrSingleAreaData(kadNum: string): Promise<KadItem | void> {
  try {
    const response = await axios.get(`${rosreestrApi}features/1?&text=${kadNum}`);

    return response.data.features;
  } catch (e) {
    showError(e, kadNum);
  }
}

export async function getRosreestrMultipleAreaData(kadNum: string): Promise<KadObject[] | void> {
  try {
    const response = await axios.get(`${rosreestrApi}typeahead/1?&text=${kadNum}`);

    return response.data.results;
  } catch (e) {
    showError(e, kadNum);
  }
}

export async function getRosreestrSingleOksData(kadNum: string): Promise<KadItem | void> {
  try {
    const response = await axios.get(`${rosreestrApi}features/5?&text=${kadNum}`);

    return response.data.features;
  } catch (e) {
    showError(e, kadNum);
  }
}

export async function getRosreestrMultipleOksData(kadNum: string): Promise<KadObject[] | void> {
  try {
    const response = await axios.get(`${rosreestrApi}typeahead/5?&text=${kadNum}`);

    return response.data.results;
  } catch (e) {
    showError(e, kadNum);
  }
}

function showError(e: AxiosError, kadNum: string) {
  Toast.error('Ошибка запроса к росреестру ' + kadNum);
  services.logger.error('Ошибка запроса к росреестру: ' + kadNum, e.message);
}
