import React, { ReactNode } from 'react';
import moment from 'moment';
import { MapOutlined, SaveOutlined } from '@mui/icons-material';

import { staticImplements } from '../../../../services/util/staticImplements';
import { CrgProject, crgProjectSchema } from '../../../../services/crg/projects.models';

import { ActionType, Adapter, AllowedActions, ExplorerItemData } from '../../Explorer.models';
import { communicationService } from '../../../../services/communication.service';
import { projectsService } from '../../../../services/crg/projects.service';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { Role } from '../../../../services/crg/permissions.models';
import { getPatch } from '../../../../services/util/patch';
import { TextBadge } from '../../../TextBadge/TextBadge';

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
    moment.locale('ru');
    const date = createdAt ? `${moment(createdAt).format('LL')}` : '';

    return `${date} (id: ${id})`;
  }

  static getIcon(): ReactNode {
    return <MapOutlined color='primary' />;
  }

  static isFolder(): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  static async getAllowedActions({ payload }: ExplorerItemData<CrgProject>): Promise<AllowedActions> {
    return {
      [ActionType.EDIT]: {
        visible: false, // не работает на стороне сервера
        disabled: !(currentUser.isAdmin || payload.role === Role.OWNER),
        fields: crgProjectSchema,
        payload: payload,
        actionFunction: async (value: CrgProject) => {
          await projectsService.update(payload.id, getPatch(value, payload));
        },
        dialogTitle: (
          <>
            Редактирование таблицы векторного слоя
            <TextBadge id={payload.id} />
          </>
        ),
        actionButtonProps: { startIcon: <SaveOutlined />, children: 'Сохранить' }
      },

      [ActionType.DELETE]: {
        visible: true,
        disabled: !(currentUser.isAdmin || payload.role === Role.OWNER),
        itemTitle: payload.name,
        needConfirmation: true
      }
    };
  }

  static async deleteItem(item: ExplorerItemData<CrgProject>): Promise<void> {
    await projectsService.delete(item.payload.id);
    communicationService.projectsUpdated.emit();
  }
}
