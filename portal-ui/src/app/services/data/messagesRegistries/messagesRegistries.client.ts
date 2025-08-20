import { boundClass } from 'autobind-decorator';

import { PageableResources } from '../../../../server-types/common-contracts';
import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { preparePageOptions } from '../../api/http.utils';
import { PageOptions } from '../../models';
import { MessagesRegistriesMessages, MessagesRegistry } from './messagesRegistries.models';

@boundClass
class MessagesRegistriesClient extends Client {
  private static _instance: MessagesRegistriesClient;
  static get instance(): MessagesRegistriesClient {
    return this._instance || (this._instance = new this());
  }

  private getMessagesRegistriesUrl(): string {
    return this.getDataUrl() + '/reestrs';
  }

  private getMessagesRegistryUrl(tableName: string): string {
    return this.getMessagesRegistriesUrl() + `/${tableName}`;
  }

  private getMessagesRegistriesDataUrl(tableName: string): string {
    return this.getMessagesRegistryUrl(tableName) + '/records';
  }

  getMessagesRegistriesSchemaUrl(tableName: string): string {
    return this.getMessagesRegistryUrl(tableName) + '/schemas';
  }

  async getMessagesRegistry(tableName: string): Promise<MessagesRegistry> {
    return http.get<MessagesRegistry>(this.getMessagesRegistryUrl(tableName));
  }

  async getMessagesRegistries(pageOptions: PageOptions): Promise<PageableResources<MessagesRegistry>> {
    const params = preparePageOptions(pageOptions, true);

    return http.get<PageableResources<MessagesRegistry>>(this.getMessagesRegistriesUrl(), { params });
  }

  async getMessagesRegistriesWithParticularOne(
    tableName: string,
    pageOptions: PageOptions
  ): Promise<[{ content: MessagesRegistry }[], number, number] | undefined> {
    const params = preparePageOptions(pageOptions, true);
    const objectRecognizer = (item: { content: MessagesRegistry }) => item?.content?.tableName === tableName;

    return http.getPageWithObject<{ content: MessagesRegistry }>(
      this.getMessagesRegistriesUrl(),
      preparePageOptions(pageOptions, true),
      objectRecognizer,
      { params }
    );
  }

  async getMessagesRegistriesData(
    tableName: string,
    pageOptions: PageOptions
  ): Promise<PageableResources<MessagesRegistriesMessages>> {
    const params = preparePageOptions(pageOptions, true);

    return http.get<PageableResources<MessagesRegistriesMessages>>(this.getMessagesRegistriesDataUrl(tableName), {
      params
    });
  }
}

export const messagesRegistriesClient = MessagesRegistriesClient.instance;
