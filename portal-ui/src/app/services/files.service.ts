import { getFileConnectionsUrl, getFilesUrl, getFileUrl } from './server-urls.service';
import { CrgLayer, CrgProject } from './crg/projects.models';
import { http } from './http.service';

export interface CrgFile {
  id: string;
  title: string;
  size: number;
  extension: string;
  path: string;
  contentType: string;
  intents: string;
  resourceType: string;
  resourceQualifier: ResourceQualifier;
  createdBy: string;
  createdAt: string;
}

export interface ResourceQualifier {
  schema: string;
  table: string;
  recordId: string;
  field: string;
}

export interface FileInfo {
  id: string;
  title: string;
  size: number;
  notLoaded?: boolean;
}

export interface FileConnection {
  layer?: CrgLayer;
  project: CrgProject;
}

export async function createFile(file: File): Promise<CrgFile> {
  const formData = new FormData();
  formData.append('files', file);

  const result = await http.post<CrgFile[]>(await getFilesUrl(), formData);

  return result[0];
}

export async function getFile(id: string): Promise<CrgFile> {
  return await http.get<CrgFile>(await getFileUrl(id));
}

export async function getFileConnections(fileId: string): Promise<FileConnection[]> {
  const params = {
    fileId: fileId
  };

  return await http.get<FileConnection[]>(await getFileConnectionsUrl(), { params });
}
