import React, { ReactNode } from 'react';
import { MapOutlined } from '@mui/icons-material';

import { staticImplements } from '../../../../services/util/staticImplements';
import { ProjectsActions } from '../../../ProjectsActions/ProjectsActions';
import { CrgProject } from '../../../../services/crg/projects.models';
import { formatDate } from '../../../../services/util/date.util';

import { Adapter, ExplorerItemData } from '../../Explorer.models';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.PROJECT]: CrgProject;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeProject {
  static getId(item: ExplorerItemData<CrgProject>): string {
    return String(item.payload.id);
  }

  static getTitle(item: ExplorerItemData<CrgProject>): string {
    return item.payload.name;
  }

  static getMeta(item: ExplorerItemData<CrgProject>): string {
    const { createdAt, id } = item.payload;
    const date = createdAt ? `${formatDate(createdAt, 'LL')}` : '';

    return `${date} (id: ${id})`;
  }

  static getIcon(): ReactNode {
    return <MapOutlined color='primary' />;
  }

  static isFolder(): boolean {
    return false;
  }

  static getActions({ payload }: ExplorerItemData<CrgProject>): ReactNode {
    return <ProjectsActions project={payload} />;
  }
}
