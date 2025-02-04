import { PageOptions } from '../../models';
import { Schema } from '../schema/schema.models';
import { schemaService } from '../schema/schema.service';
import { messagesRegistriesClient } from './messagesRegistries.client';
import { MessagesRegistriesMessages, MessagesRegistry } from './messagesRegistries.models';

export async function getMessagesRegistry(tableName: string): Promise<MessagesRegistry> {
  return await messagesRegistriesClient.getMessagesRegistry(tableName);
}

export async function getMessagesRegistries(pageOptions: PageOptions): Promise<[MessagesRegistry[], number]> {
  const response = await messagesRegistriesClient.getMessagesRegistries(pageOptions);

  return [response.content || [], response.page.totalPages];
}

export async function getMessagesRegistriesWithParticularOne(
  tableName: string,
  pageOptions: PageOptions
): Promise<[MessagesRegistry[], number, number] | undefined> {
  const response = await messagesRegistriesClient.getMessagesRegistriesWithParticularOne(tableName, pageOptions);

  if (response) {
    const [content, totalPages, page] = response;

    const records = content.map(item => {
      return item.content;
    });

    return [records, totalPages, page];
  }
}

export async function getMessagesRegistriesSchema(tableName: string): Promise<Schema> {
  return schemaService.getSchemaAtUrl(messagesRegistriesClient.getMessagesRegistriesSchemaUrl(tableName));
}

export async function getMessagesRegistriesData(
  tableName: string,
  pageOptions: PageOptions
): Promise<[MessagesRegistriesMessages[], number]> {
  const response = await messagesRegistriesClient.getMessagesRegistriesData(tableName, pageOptions);

  if (!response) {
    return [[], 0];
  }

  const { content, page } = response;

  return [content || [], page.totalPages];
}
