import { _reqCreateFile, _reqGetFile, _reqGetFileConnections } from './files.client';
import { FileConnection, FileInfo } from './files.models';

export async function createFile(file: File): Promise<FileInfo> {
  const formData = new FormData();
  formData.append('files', file);

  const [createdFile] = await _reqCreateFile(file);

  return createdFile;
}

export async function getFile(id: string): Promise<FileInfo> {
  return await _reqGetFile(id);
}

export async function getFileConnections(fileId: string): Promise<FileConnection[]> {
  return await _reqGetFileConnections(fileId);
}
