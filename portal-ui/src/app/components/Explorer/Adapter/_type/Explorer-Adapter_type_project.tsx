import React, { ReactNode } from 'react';
import { MapOutlined } from '@mui/icons-material';

import { crgProjectSchema, ProjectsActions } from '../../../ProjectsActions/ProjectsActions';
import { getProjectPermissionsUrl } from '../../../../services/server-urls.service';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';
import { ViewContentWidget } from '../../../ViewContentWidget/ViewContentWidget';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { staticImplements } from '../../../../services/util/staticImplements';
import { CrgProject } from '../../../../services/crg/projects.models';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { Role } from '../../../../services/crg/permissions.models';
import { formatDate } from '../../../../services/util/date.util';
import { Schema } from '../../../../services/crg/schema.models';

import { Adapter, ExplorerItemData, ExplorerItemEntityType } from '../../Explorer.models';

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

  static async getWidgets(item: ExplorerItemData<CrgProject>): Promise<ReactNode> {
    const url = await getProjectPermissionsUrl(item.payload.id);
    const currentProject = item.payload as unknown as Record<string, unknown>;

    return (
      <>
        <ExplorerInfoDescItem multiline>
          <ViewContentWidget schema={crgProjectSchema as unknown as Schema} data={currentProject} />
        </ExplorerInfoDescItem>

        <PermissionsWidget
          url={url}
          title={item.payload.name}
          itemEntityType={ExplorerItemEntityType.PROJECT}
          disabled={!(currentUser.isAdmin || item.payload.role === Role.OWNER)}
        />
      </>
    );
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
