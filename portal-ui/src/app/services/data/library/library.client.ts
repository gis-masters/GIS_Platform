import { boundClass } from 'autobind-decorator';

import { PageableResources } from '../../../../server-types/common-contracts';
import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { preparePageOptions } from '../../api/http.utils';
import { PageOptions } from '../../models';
import { RoleAssignmentBody } from '../../permissions/permissions.models';
import { OldSchema } from '../schema/schemaOld.models';
import { DocumentVersion, LibraryRaw, LibraryRecord, LibraryRecordNew, LibraryRecordRaw } from './library.models';

@boundClass
class LibraryClient extends Client {
  private static _instance: LibraryClient;
  static get instance(): LibraryClient {
    return this._instance || (this._instance = new this());
  }

  private getDocLibrariesUrl(): string {
    return `${this.getDataUrl()}/document-libraries`;
  }

  private getDocLibraryUrl(libraryTableName: string): string {
    return `${this.getDocLibrariesUrl()}/${libraryTableName}`;
  }

  private getDocLibrarySchemaUrl(libraryTableName: string): string {
    return `${this.getDocLibraryUrl(libraryTableName)}/schema`;
  }

  getDocumentLibraryRoleAssignmentUrl(libraryTableName: string): string {
    return `${this.getDocLibrariesUrl()}/${libraryTableName}/roleAssignment`;
  }

  private getDocLibraryRecordsUrl(libraryTableName: string): string {
    return `${this.getDocLibraryUrl(libraryTableName)}/records`;
  }

  getDocLibraryRecordUrl(libraryTableName: string, recordId: number): string {
    return `${this.getDocLibraryRecordsUrl(libraryTableName)}/${recordId}`;
  }

  getDocumentVersionsUrl(libraryTableName: string, recordId: number): string {
    return `${this.getDocLibraryRecordUrl(libraryTableName, recordId)}/versions`;
  }

  getDocumentRecoverUrl(libraryTableName: string, recordId: number, recoverFolderId?: number): string {
    return `${this.getDocLibraryRecordUrl(libraryTableName, recordId)}/recover?recoverFolderId=${
      recoverFolderId || ''
    }`;
  }

  private getDocLibraryRecordsAsRegistryUrl(libraryTableName: string): string {
    return `${this.getDocLibraryRecordsUrl(libraryTableName)}/as_registry`;
  }

  private getDocRegisterUrl(libraryTableName: string, recordId: number): string {
    return `${this.getDocLibraryRecordUrl(libraryTableName, recordId)}/register`;
  }

  private getDocLibraryRecordMoveUrl(libraryTableName: string, recordId: number): string {
    return `${this.getDocLibraryRecordUrl(libraryTableName, recordId)}/move`;
  }

  private getDocLibraryRecordMoveToFolderUrl(libraryTableName: string, recordId: number, newParentId?: number): string {
    return `${this.getDocLibraryRecordMoveUrl(libraryTableName, recordId)}/${newParentId}`;
  }

  getDocumentLibraryRecordRoleAssignmentUrl(libraryTableName: string, recordId: number): string {
    return `${this.getDocLibraryRecordUrl(libraryTableName, recordId)}/roleAssignment`;
  }

  private getDocumentLibraryIntegrationUrl(libraryTableName: string, recordId: number): string {
    return `${this.getDocLibraryRecordUrl(libraryTableName, recordId)}/integration`;
  }

  async getLibraries(pageOptions: PageOptions): Promise<PageableResources<LibraryRaw>> {
    const params = preparePageOptions(pageOptions, true);

    return await http.get<PageableResources<LibraryRaw>>(this.getDocLibrariesUrl(), { params });
  }

  async getLibrariesWithParticularOne(
    libraryTableName: string,
    pageOptions: PageOptions
  ): Promise<[LibraryRaw[], number, number] | undefined> {
    return await http.getPageWithObject<LibraryRaw>(
      this.getDocLibrariesUrl(),
      preparePageOptions(pageOptions, true),
      (item: LibraryRaw) => item.table_name === libraryTableName,
      {}
    );
  }

  async createLibrary(
    details: string,
    schemaId: string,
    versioned: boolean,
    readyForFts?: boolean
  ): Promise<LibraryRaw> {
    return await http.post<LibraryRaw>(this.getDocLibrariesUrl(), { details, schemaId, versioned, readyForFts });
  }

  async getLibrary(libraryTableName: string): Promise<LibraryRaw> {
    return await http.get<LibraryRaw>(this.getDocLibraryUrl(libraryTableName));
  }

  async getLibraryPermissions(libraryTableName: string): Promise<RoleAssignmentBody[]> {
    const url = this.getDocumentLibraryRoleAssignmentUrl(libraryTableName);

    return await http.getPaged<RoleAssignmentBody>(url);
  }

  async getLibraryRecord(libraryTableName: string, recordId: number): Promise<LibraryRecordRaw> {
    return http.get<LibraryRecordRaw>(this.getDocLibraryRecordUrl(libraryTableName, recordId));
  }

  async getLibraryRecords(
    libraryTableName: string,
    pageOptions: PageOptions
  ): Promise<PageableResources<{ content: LibraryRecordRaw }>> {
    const url = this.getDocLibraryRecordsUrl(libraryTableName);
    const requestOptions = { params: preparePageOptions(pageOptions, true) };

    return http.get<PageableResources<{ content: LibraryRecordRaw }>>(url, requestOptions);
  }

  async getAllLibraryRecords(libraryTableName: string): Promise<{ content: LibraryRecord }[]> {
    const url = this.getDocLibraryRecordsAsRegistryUrl(libraryTableName);

    return http.getPaged<{ content: LibraryRecord }>(url);
  }

  async getDocumentVersions(libraryTableName: string, docId: number): Promise<[DocumentVersion]> {
    const url = this.getDocumentVersionsUrl(libraryTableName, docId);

    return http.get<[DocumentVersion]>(url, { cache: { disabled: true } });
  }

  async getLibraryRecordsAsRegistry(
    libraryTableName: string,
    pageOptions: PageOptions
  ): Promise<PageableResources<{ content: LibraryRecordRaw }>> {
    const url = this.getDocLibraryRecordsAsRegistryUrl(libraryTableName);
    const requestOptions = { params: preparePageOptions(pageOptions, true) };

    return http.get<PageableResources<{ content: LibraryRecordRaw }>>(url, requestOptions);
  }

  async getAllLibraryRecordsAsRegistry(
    libraryTableName: string,
    pageOptions: PageOptions
  ): Promise<{ content: LibraryRecordRaw }[]> {
    const url = this.getDocLibraryRecordsAsRegistryUrl(libraryTableName);
    const requestOptions = { params: preparePageOptions({ ...pageOptions, pageSize: 0 }, true) };

    return http.getPaged<{ content: LibraryRecordRaw }>(url, requestOptions);
  }

  async getLibraryRecordsWithParticularOne(
    libraryTableName: string,
    id: number,
    pageOptions: PageOptions
  ): Promise<[{ content: LibraryRecordRaw }[], number, number] | undefined> {
    const objectRecognizer = (item: { content: LibraryRecordRaw }) => Number(item.content.id) === Number(id);

    return http.getPageWithObject<{ content: LibraryRecordRaw }>(
      this.getDocLibraryRecordsUrl(libraryTableName),
      preparePageOptions(pageOptions, true),
      objectRecognizer,
      {}
    );
  }

  async createLibraryRecord(data: LibraryRecordNew, libraryTableName: string): Promise<LibraryRecordRaw> {
    return http.post<LibraryRecord>(this.getDocLibraryRecordsUrl(libraryTableName), this.prepareFormData(data));
  }

  private prepareFormData(data: LibraryRecordNew): FormData {
    const formData = new FormData();
    if (data.binary) {
      formData.append('file', data.binary as File);
      delete data.binary;
    }

    formData.append('body', JSON.stringify(data));

    return formData;
  }

  async registerDocument(libraryTableName: string, recordId: number): Promise<void> {
    return http.post<void>(this.getDocRegisterUrl(libraryTableName, recordId));
  }

  async deleteLibraryRecord(recordId: number, libraryTableName: string): Promise<void> {
    return http.delete(this.getDocLibraryRecordUrl(libraryTableName, recordId));
  }

  async updateLibraryRecord(libraryTableName: string, recordId: number, patch: Partial<LibraryRecord>): Promise<void> {
    return http.patch(this.getDocLibraryRecordUrl(libraryTableName, recordId), patch);
  }

  async recoverLibraryRecord(libraryTableName: string, recordId: number, recoverFolderId?: number): Promise<void> {
    return http.post(this.getDocumentRecoverUrl(libraryTableName, recordId, recoverFolderId));
  }

  async moveLibraryRecord(libraryTableName: string, recordId: number, newParentId?: number): Promise<void> {
    return newParentId
      ? http.post(this.getDocLibraryRecordMoveToFolderUrl(libraryTableName, recordId, newParentId))
      : http.post(this.getDocLibraryRecordMoveUrl(libraryTableName, recordId));
  }

  async getDocumentPermissions(libraryTableName: string, recordId: number): Promise<RoleAssignmentBody[]> {
    const url = this.getDocumentLibraryRecordRoleAssignmentUrl(libraryTableName, recordId);

    return await http.getPaged<RoleAssignmentBody>(url);
  }

  async sendToSed(libraryTableName: string, recordId: number): Promise<void> {
    return http.post(this.getDocumentLibraryIntegrationUrl(libraryTableName, recordId), {
      type: 'SED'
    });
  }

  async updateLibrarySchema(libraryTableName: string, schema: OldSchema): Promise<void> {
    return http.put(this.getDocLibrarySchemaUrl(libraryTableName), schema);
  }
}

export const libraryClient = LibraryClient.instance;
