import { http } from './http.service';
import { getFiasAddresses, getFiasOktmo } from './server-urls.service';

export interface Fias {
  fullAddress?: string;
  locality?: string;
  objectId?: number;
  oktmo?: string;
}

export async function getFiasAddress(address: string): Promise<Fias[]> {
  return await http.get<Fias[]>(await getFiasAddresses(), {
    params: { address }
  });
}

export async function getFiasOktmoAddress(cityName: string): Promise<Fias[]> {
  return await http.get<Fias[]>(await getFiasOktmo(), {
    params: { cityName }
  });
}
