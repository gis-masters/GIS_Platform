import { boundClass } from 'autobind-decorator';

import { PageableResources } from '../../../../server-types/common-contracts';
import { preparePageOptions } from '../../api/http.utils';
import { PageableResponse, PageOptions } from '../../models';
import { RoleAssignmentBody } from '../permissions/permissions.models';
import { http } from '../../api/http.service';
import { Client } from '../../api/Client';

import {
  DocumentLibrary,
  DocumentVersion,
  LibraryRecord,
  LibraryRecordNew,
  LibraryRecordRaw
} from './docLibrary.models';

@boundClass
class DocLibraryClient extends Client {
  private static _instance: DocLibraryClient;

  static get instance(): DocLibraryClient {
    return this._instance || (this._instance = new this());
  }

  private getDocLibrariesUrl(): string {
    return `${this.getDataUrl()}/document-libraries`;
  }

  private getDocLibraryUrl(libraryTableName: string): string {
    return `${this.getDocLibrariesUrl()}/${libraryTableName}`;
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

  async getLibraries(pageOptions: PageOptions): Promise<PageableResources<DocumentLibrary>> {
    const params = preparePageOptions(pageOptions, true);

    return await http.get<PageableResources<DocumentLibrary>>(this.getDocLibrariesUrl(), { params });
  }

  async getLibrariesWithParticularOne(
    libraryTableName: string,
    pageOptions: PageOptions
  ): Promise<[DocumentLibrary[], number, number]> {
    return await http.getPageWithObject<DocumentLibrary>(
      this.getDocLibrariesUrl(),
      preparePageOptions(pageOptions, true),
      (item: DocumentLibrary) => item.table_name === libraryTableName,
      {},
      false
    );
  }

  async createLibrary(details: string, schemaId: string, versioned: boolean): Promise<void> {
    await http.post(this.getDocLibrariesUrl(), {
      details,
      schemaId,
      versioned
    });
  }

  async getLibrary(libraryTableName: string): Promise<DocumentLibrary> {
    return await http.get<DocumentLibrary>(this.getDocLibraryUrl(libraryTableName));
  }

  async getLibraryPermissions(libraryTableName: string): Promise<RoleAssignmentBody[]> {
    const url = this.getDocumentLibraryRoleAssignmentUrl(libraryTableName);

    return await http.getPagedOld<RoleAssignmentBody>(url);
  }

  async getLibraryRecord(libraryTableName: string, recordId: number): Promise<LibraryRecordRaw> {
    return http.get<LibraryRecordRaw>(this.getDocLibraryRecordUrl(libraryTableName, recordId));
  }

  async getLibraryRecords(
    libraryTableName: string,
    pageOptions: PageOptions
  ): Promise<PageableResponse<{ content: LibraryRecordRaw }>> {
    const url = this.getDocLibraryRecordsUrl(libraryTableName);
    const requestOptions = { params: preparePageOptions(pageOptions, true) };

    return http.get<PageableResponse<{ content: LibraryRecordRaw }>>(url, requestOptions);
  }

  async getAllLibraryRecords(libraryTableName: string): Promise<{ content: LibraryRecord }[]> {
    const url = this.getDocLibraryRecordsUrl(libraryTableName);

    return http.getPagedOld<{ content: LibraryRecord }>(url);
  }

  async getDocumentVersions(libraryTableName: string, docId: number): Promise<[DocumentVersion]> {
    const url = this.getDocumentVersionsUrl(libraryTableName, docId);

    return http.get<[DocumentVersion]>(url, { cache: { disabled: true } });
  }

  async getLibraryRecordsAsRegistry(
    libraryTableName: string,
    pageOptions: PageOptions
  ): Promise<PageableResponse<{ content: LibraryRecordRaw }>> {
    const url = this.getDocLibraryRecordsAsRegistryUrl(libraryTableName);
    const requestOptions = { params: preparePageOptions(pageOptions, true) };

    return http.get<PageableResponse<{ content: LibraryRecordRaw }>>(url, requestOptions);
  }

  async getAllLibraryRecordsAsRegistry(
    libraryTableName: string,
    pageOptions: PageOptions
  ): Promise<{ content: LibraryRecordRaw }[]> {
    const url = this.getDocLibraryRecordsAsRegistryUrl(libraryTableName);
    const requestOptions = { params: preparePageOptions({ ...pageOptions, pageSize: null }, true) };

    return http.getPagedOld<{ content: LibraryRecordRaw }>(url, requestOptions);
  }

  async getLibraryRecordsWithParticularOne(
    libraryTableName: string,
    id: number,
    pageOptions: PageOptions
  ): Promise<[{ content: LibraryRecord }[], number, number]> {
    const objectRecognizer = (item: { content: LibraryRecord }) => Number(item.content.id) === Number(id);

    return http.getPageWithObject<{ content: LibraryRecord }>(
      this.getDocLibraryRecordsUrl(libraryTableName),
      preparePageOptions(pageOptions, true),
      objectRecognizer,
      {},
      true
    );
  }

  async createLibraryRecord(data: LibraryRecordNew, libraryTableName: string): Promise<LibraryRecord> {
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

  async moveLibraryRecord(libraryTableName: string, recordId: number, newParentId?: number): Promise<void> {
    return newParentId
      ? http.post(this.getDocLibraryRecordMoveToFolderUrl(libraryTableName, recordId, newParentId))
      : http.post(this.getDocLibraryRecordMoveUrl(libraryTableName, recordId));
  }

  async getDocumentPermissions(libraryTableName: string, recordId: number): Promise<RoleAssignmentBody[]> {
    const url = this.getDocumentLibraryRecordRoleAssignmentUrl(libraryTableName, recordId);

    return await http.getPagedOld<RoleAssignmentBody>(url);
  }

  async sendToSed(libraryTableName: string, recordId: number): Promise<void> {
    return http.post(this.getDocumentLibraryIntegrationUrl(libraryTableName, recordId), {
      type: 'SED'
    });
  }
}

export const docLibraryClient = DocLibraryClient.instance;
