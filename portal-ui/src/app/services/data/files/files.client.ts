import { boundClass } from 'autobind-decorator';

import { Client } from '../../api/Client';
import { http } from '../../api/http.service';

import { FileConnection, FileInfo } from './files.models';

@boundClass
class FilesClient extends Client {
  private static _instance: FilesClient;

  static get instance(): FilesClient {
    return this._instance || (this._instance = new this());
  }

  private getFilesUrl(): string {
    return this.getDataUrl() + '/files';
  }

  private getFileUrl(id: string): string {
    return `${this.getFilesUrl()}/${id}`;
  }

  private getFileConnectionsUrl(): string {
    return `${this.getProjectsUrl()}/find-related-to-file-layers`;
  }

  getFileDownloadUrl(id: string): string {
    return `${this.getFileUrl(id)}/download`;
  }

  getZipDownloadUrl(id: string): string {
    return `${this.getFileUrl(id)}/download/zip`;
  }

  async createFile(file: File): Promise<FileInfo[]> {
    const formData = new FormData();
    formData.append('files', file);

    return http.post<FileInfo[]>(this.getFilesUrl(), formData);
  }

  async getFile(id: string): Promise<FileInfo> {
    return http.get<FileInfo>(this.getFileUrl(id));
  }

  async getFileConnections(fileId: string): Promise<FileConnection[]> {
    const params = { fileId };

    return http.get<FileConnection[]>(this.getFileConnectionsUrl(), { params });
  }
}

export const filesClient = FilesClient.instance;
