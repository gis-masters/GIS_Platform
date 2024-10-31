import { VerifyEcpResponse } from '../../../../server-types/common-contracts';
import { filesClient } from './files.client';
import { FileConnection, FileInfo } from './files.models';

export async function createFile(file: File): Promise<FileInfo> {
  const formData = new FormData();
  formData.append('files', file);

  const [createdFile] = await filesClient.createFile(file);

  return createdFile;
}

export async function getFileInfo(id: string): Promise<FileInfo> {
  return await filesClient.getFileInfo(id);
}

export async function getEcpInfo(id: string): Promise<VerifyEcpResponse> {
  return await filesClient.getEcpInfo(id);
}

export async function getFileConnections(fileId: string): Promise<FileConnection[]> {
  return await filesClient.getFileConnections(fileId);
}

export async function getFile(fileId: string): Promise<string> {
  return await filesClient.getFile(fileId);
}
