import { Fias } from './fias.models';
import { fiasClient } from './fias.client';

export async function getFiasAddress(address: string): Promise<Fias[]> {
  return await fiasClient.getFiasAddresses(address);
}

export async function getFiasOktmoAddress(cityName: string): Promise<Fias[]> {
  return await fiasClient.getFiasOktmoAddresses(cityName);
}
