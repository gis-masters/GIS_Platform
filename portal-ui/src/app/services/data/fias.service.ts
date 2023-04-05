import { http } from '../api/http.service';
import { getFiasAddresses, getFiasOktmo } from '../api/server-urls.service';

export interface Fias {
  address?: string;
  locality?: string;
  id?: number;
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
