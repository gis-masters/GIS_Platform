import { http } from './http.service';
import { getFilesUrl } from './server-urls.service';

export interface FileInfo {
  id: string;
  title: string;
  size: number;
  notLoaded?: boolean;
}

export async function createFile(file: File): Promise<FileInfo> {
  const formData = new FormData();
  formData.append('files', file);

  const result = await http.post<FileInfo[]>(await getFilesUrl(), formData);

  return result[0];
}
