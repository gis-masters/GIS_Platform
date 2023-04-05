import { CrgLayer } from '../../gis/layers/layers.models';
import { CrgProject } from '../../gis/projects/projects.models';

export interface FileInfo {
  id: string;
  title: string;
  size: number;
  path?: string;
  createdBy?: string;
  createdAt?: string;
  notLoaded?: boolean;
}

export interface FileConnection {
  layer?: CrgLayer;
  project: CrgProject;
}
