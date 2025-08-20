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

export async function verifyEcp(id: string): Promise<VerifyEcpResponse[]> {
  return await filesClient.verifyEcp(id);
}

export async function checkFileEcp(fileId: string, ecpId: string): Promise<VerifyEcpResponse[]> {
  return await filesClient.checkFileEcp(fileId, ecpId);
}

export async function getFileEcp(id: string): Promise<ArrayBuffer> {
  return await filesClient.getFileEcp(id);
}

export async function getFileHash(id: string): Promise<string> {
  return await filesClient.getFileHash(id);
}

export async function signFile(id: string, file: File): Promise<void> {
  return await filesClient.signFile(id, file);
}

export async function getFileConnections(fileId: string): Promise<FileConnection[]> {
  return await filesClient.getFileConnections(fileId);
}

export async function getFile(fileId: string): Promise<string> {
  return await filesClient.getFile(fileId);
}
