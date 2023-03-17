import { PageOptions } from '../../models';
import { getMessagesRegistriesSchemaUrl } from '../../server-urls.service';
import { Schema } from '../schema/schema.models';
import { schemaService } from '../schema/schema.service';

import { MessagesRegistriesMessages, MessagesRegistry } from './messagesRegistries.models';
import {
  _reqGetMessagesRegistries,
  _reqGetMessagesRegistriesData,
  _reqGetMessagesRegistriesWithParticularOne,
  _reqGetMessagesRegistry
} from './messagesRegistries.client';

export async function getMessagesRegistry(tableName: string): Promise<MessagesRegistry> {
  return await _reqGetMessagesRegistry(tableName);
}

export async function getMessagesRegistries(pageOptions: PageOptions): Promise<[MessagesRegistry[], number]> {
  const response = await _reqGetMessagesRegistries(pageOptions);

  return [response.content || [], response.page.totalPages];
}

export async function getMessagesRegistriesWithParticularOne(
  tableName: string,
  pageOptions: PageOptions
): Promise<[MessagesRegistry[], number, number] | undefined> {
  const response = await _reqGetMessagesRegistriesWithParticularOne(tableName, pageOptions);

  if (response) {
    const [content, totalPages, page] = response;

    const records = content.map(item => {
      return item.content;
    });

    return [records, totalPages, page];
  }
}

export async function getMessagesRegistriesSchema(tableName: string): Promise<Schema> {
  return schemaService.getSchemaAtUrl(await getMessagesRegistriesSchemaUrl(tableName));
}

export async function getMessagesRegistriesData(
  tableName: string,
  pageOptions: PageOptions
): Promise<[MessagesRegistriesMessages[], number]> {
  const response = await _reqGetMessagesRegistriesData(tableName, pageOptions);

  if (response) {
    const { content, page } = response;

    return [content || [], page.totalPages];
  }
}
