import { http } from '../../api/http.service';
import { getFileConnectionsUrl, getFilesUrl, getFileUrl } from '../../api/server-urls.service';

import { FileConnection, FileInfo } from './files.models';

export async function _reqCreateFile(file: File): Promise<FileInfo[]> {
  const formData = new FormData();
  formData.append('files', file);

  return http.post<FileInfo[]>(await getFilesUrl(), formData);
}

export async function _reqGetFile(id: string): Promise<FileInfo> {
  return http.get<FileInfo>(await getFileUrl(id));
}

export async function _reqGetFileConnections(fileId: string): Promise<FileConnection[]> {
  const params = { fileId };

  return http.get<FileConnection[]>(await getFileConnectionsUrl(), { params });
}
