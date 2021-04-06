import React from 'react';
import moment from 'moment';
import { pluralize } from 'numeralize-ru';
import { MapOutlined } from '@material-ui/icons';

import { staticImplements } from '../../../../services/util/staticImplements';
import { CrgProject } from '../../../../services/crg/projects.models';

import { ExplorerItemData } from '../../Explorer.models';
import { Adapter } from '../Explorer-Adapter';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.PROJECT]: CrgProject;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeProject {
  static getId(item: ExplorerItemData<CrgProject>) {
    return `${item.type}:${item.payload.id}`;
  }

  static getTitle(item: ExplorerItemData<CrgProject>) {
    return item.payload.name;
  }

  static getMeta(item: ExplorerItemData<CrgProject>) {
    const { layersCount, createdAt, id } = item.payload;
    moment.locale('ru');
    const date = createdAt ? `, ${moment(createdAt).format('LL')}` : '';

    return `${layersCount} ${pluralize(layersCount, 'слой', 'слоя', 'слоёв')}${date} (id: ${id})`;
  }

  static getIcon() {
    return <MapOutlined color='primary' />;
  }

  static isFolder() {
    return false;
  }
}
