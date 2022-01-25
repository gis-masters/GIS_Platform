import axios from 'axios';

import { KadItem, KadObject } from './kad-search.models';

const rosreestrApi = 'https://pkk.rosreestr.ru/api/';

export async function getRosreestrSingleAreaData(kadNum: string): Promise<KadItem | void> {
  const response = await axios.get<{ features: KadItem }>(`${rosreestrApi}features/1?&text=${kadNum}`);

  return response.data.features;
}

export async function getRosreestrMultipleAreaData(kadNum: string): Promise<KadObject[] | void> {
  const response = await axios.get<{ results: KadObject[] }>(`${rosreestrApi}typeahead/1?&text=${kadNum}`);

  return response.data.results;
}

export async function getRosreestrSingleOksData(kadNum: string): Promise<KadItem | void> {
  const response = await axios.get<{ features: KadItem }>(`${rosreestrApi}features/5?&text=${kadNum}`);

  return response.data.features;
}

export async function getRosreestrMultipleOksData(kadNum: string): Promise<KadObject[] | void> {
  const response = await axios.get<{ results: KadObject[] }>(`${rosreestrApi}typeahead/5?&text=${kadNum}`);

  return response.data.results;
}
