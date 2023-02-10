import { http } from '../http.service';
import { PageOptions } from '../models';
import { preparePageOptions } from '../http.utils';
import {
  getMessagesRegistriesDataUrl,
  getMessagesRegistriesSchemaUrl,
  getMessagesRegistriesUrl,
  getMessagesRegistryUrl
} from '../server-urls.service';
import { OldSchema } from './schemaOld.models';
import { convertOldToNewSchema } from './schema.utils';
import { Schema } from './schema.models';
import { PageableResources } from '../../../server-types/common-contracts';

export interface MessagesRegistry {
  id: number;
  title?: string;
  description?: string;
  tableName?: string;
  schemaName?: string;
  createdBy?: string;
  createdAt?: string;
  lastModified?: string;
}

export interface MessagesRegistriesMessages {
  [key: string]: unknown;

  id: number;
  system: string;
  user_from?: string;
  user_to?: string;
  status: string;
  body?: string;
  date_in?: string;
  date_out?: string;
  response_to?: string;
}

export async function getMessagesRegistries(pageOptions: PageOptions): Promise<[MessagesRegistry[], number]> {
  const params = preparePageOptions(pageOptions, true);

  const response = await http.get<PageableResources<MessagesRegistry>>(await getMessagesRegistriesUrl(), { params });

  return [response.content || [], response.page.totalPages];
}

export async function getMessagesRegistriesWithParticularOne(
  tableName: string,
  pageOptions: PageOptions
): Promise<[MessagesRegistry[], number, number] | undefined> {
  const params = preparePageOptions(pageOptions, true);
  const objectRecognizer = (item: { content: MessagesRegistry }) => item?.content?.tableName === tableName;

  const response = await http.getPageWithObject<{ content: MessagesRegistry }>(
    await getMessagesRegistriesUrl(),
    preparePageOptions(pageOptions, true),
    objectRecognizer,
    { params },
    false
  );

  if (response) {
    const [content, totalPages, page] = response;

    const records = content.map(item => {
      return item.content;
    });

    return [records, totalPages, page];
  }
}

export async function getMessagesRegistry(tableName: string): Promise<MessagesRegistry> {
  return await http.get<MessagesRegistry>(await getMessagesRegistryUrl(tableName));
}

export async function getMessagesRegistriesSchema(tableName: string): Promise<Schema> {
  return convertOldToNewSchema(await http.get<OldSchema>(await getMessagesRegistriesSchemaUrl(tableName)));
}

export async function getMessagesRegistriesData(
  tableName: string,
  pageOptions: PageOptions
): Promise<[MessagesRegistriesMessages[], number]> {
  const params = preparePageOptions(pageOptions, true);

  const response = await http.get<PageableResources<MessagesRegistriesMessages>>(
    await getMessagesRegistriesDataUrl(tableName),
    { params }
  );

  if (response) {
    const { content, page } = response;

    return [content || [], page.totalPages];
  }
}
