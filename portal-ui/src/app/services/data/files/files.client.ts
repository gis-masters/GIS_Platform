import { boundClass } from 'autobind-decorator';

import { VerifyEcpResponse } from '../../../../server-types/common-contracts';
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

  verifyEcpUrl(id: string): string {
    return `${this.getFileUrl(id)}/verify`;
  }

  checkFileEcpUrl(fileId: string, expId: string): string {
    return `${this.verifyEcpUrl(fileId)}/${expId}`;
  }

  fileHashUrl(id: string): string {
    return `${this.getFileUrl(id)}/hash`;
  }

  signFileUrl(id: string): string {
    return `${this.getFileUrl(id)}/sign`;
  }

  getFileEcpUrl(id: string): string {
    return `${this.getFileDownloadUrl(id)}/ecp`;
  }

  getFileWithEcpUrl(id: string): string {
    return `${this.getFileDownloadUrl(id)}/with-ecp`;
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

  getZipDownloadWithEcpUrl(id: string): string {
    return `${this.getFileUrl(id)}/download/zip/with-ecp`;
  }

  async createFile(file: File): Promise<FileInfo[]> {
    const formData = new FormData();
    formData.append('files', file);

    return http.post<FileInfo[]>(this.getFilesUrl(), formData);
  }

  async signFile(id: string, file: File): Promise<void> {
    const formData = new FormData();
    formData.append('sign', file);

    return http.post(this.signFileUrl(id), formData);
  }

  async getFileEcp(id: string): Promise<ArrayBuffer> {
    return http.get<ArrayBuffer>(this.getFileEcpUrl(id), { responseType: 'arraybuffer' });
  }

  async getFileInfo(id: string): Promise<FileInfo> {
    return http.get<FileInfo>(this.getFileUrl(id));
  }

  async getFile(id: string): Promise<string> {
    return http.get<string>(this.getFileDownloadUrl(id));
  }

  async verifyEcp(id: string): Promise<VerifyEcpResponse[]> {
    return http.get<VerifyEcpResponse[]>(this.verifyEcpUrl(id));
  }

  async checkFileEcp(fileId: string, ecpId: string): Promise<VerifyEcpResponse[]> {
    return http.get<VerifyEcpResponse[]>(this.checkFileEcpUrl(fileId, ecpId));
  }

  async getFileHash(id: string): Promise<string> {
    return http.get<string>(this.fileHashUrl(id));
  }

  async getFileConnections(fileId: string): Promise<FileConnection[]> {
    const params = { fileId };

    return http.get<FileConnection[]>(this.getFileConnectionsUrl(), { params });
  }
}

export const filesClient = FilesClient.instance;
