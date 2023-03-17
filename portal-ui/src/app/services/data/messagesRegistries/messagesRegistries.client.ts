import { PageableResources } from '../../../../server-types/common-contracts';
import {
  getMessagesRegistriesDataUrl,
  getMessagesRegistriesUrl,
  getMessagesRegistryUrl
} from '../../server-urls.service';
import { preparePageOptions } from '../../http.utils';
import { PageOptions } from '../../models';
import { http } from '../../http.service';

import { MessagesRegistriesMessages, MessagesRegistry } from './messagesRegistries.models';

export async function _reqGetMessagesRegistry(tableName: string): Promise<MessagesRegistry> {
  return http.get<MessagesRegistry>(await getMessagesRegistryUrl(tableName));
}

export async function _reqGetMessagesRegistries(
  pageOptions: PageOptions
): Promise<PageableResources<MessagesRegistry>> {
  const params = preparePageOptions(pageOptions, true);

  return http.get<PageableResources<MessagesRegistry>>(await getMessagesRegistriesUrl(), { params });
}

export async function _reqGetMessagesRegistriesWithParticularOne(
  tableName: string,
  pageOptions: PageOptions
): Promise<[{ content: MessagesRegistry }[], number, number]> {
  const params = preparePageOptions(pageOptions, true);
  const objectRecognizer = (item: { content: MessagesRegistry }) => item?.content?.tableName === tableName;

  return http.getPageWithObject<{ content: MessagesRegistry }>(
    await getMessagesRegistriesUrl(),
    preparePageOptions(pageOptions, true),
    objectRecognizer,
    { params },
    false
  );
}

export async function _reqGetMessagesRegistriesData(
  tableName: string,
  pageOptions: PageOptions
): Promise<PageableResources<MessagesRegistriesMessages>> {
  const params = preparePageOptions(pageOptions, true);

  return http.get<PageableResources<MessagesRegistriesMessages>>(await getMessagesRegistriesDataUrl(tableName), {
    params
  });
}
