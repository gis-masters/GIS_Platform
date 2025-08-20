import { fiasClient } from './fias.client';
import { FiasApiItem, FiasValue } from './fias.models';

export async function getFiasAddressItems(address: string): Promise<FiasValue[]> {
  return await getFiasItems(address, fiasClient.getAddressItems);
}

export async function getFiasOktmoItems(cityName: string): Promise<FiasValue[]> {
  return await getFiasItems(cityName, fiasClient.getOktmoItems);
}

async function getFiasItems(
  address: string,
  method: (address: string) => Promise<FiasApiItem[]>
): Promise<FiasValue[]> {
  const apiItems: FiasApiItem[] = await method(address);

  return apiItems.map(({ fullAddress, locality, objectId, oktmo }: FiasApiItem) => ({
    id: objectId,
    oktmo,
    address: fullAddress || locality
  }));
}
