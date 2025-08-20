import React, { FC, ReactNode, useCallback, useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link } from '@mui/material';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { communicationService } from '../../services/communication.service';
import { projectionsClient } from '../../services/data/projections/projections.client';
import { EditProjectionModel, Projection } from '../../services/data/projections/projections.models';
import { TablesData } from '../../services/data/vectorData/vectorData.models';
import { getTablesBySrid } from '../../services/data/vectorData/vectorData.service';
import { RelatedVectorLayers } from '../../services/gis/layers/layers.models';
import { getRelatedLayers } from '../../services/gis/layers/layers.service';
import { achtung } from '../../services/utility-dialogs.service';
import { Button } from '../Button/Button';
import { datasetRootUrlItems } from '../DataManagement/DataManagement.utils';
import { Loading } from '../Loading/Loading';
import { Toast } from '../Toast/Toast';

import '!style-loader!css-loader!sass-loader!./OrgProjectionsChangeConfirm.scss';

const cnOrgProjectionsChangeConfirm = cn('OrgProjectionsChangeConfirm');

export interface OrgProjectionsChangeInfo {
  title: string;
  message: ReactNode;
}

interface OrgProjectionsChangeConfirmProps {
  type: 'deletion' | 'edit';
  projection: Projection;
  open: boolean;
  editValue?: EditProjectionModel;
  closeDialog: () => void;
  closeParentDialog?: () => void;
}

interface OrgProjectionsChangeConfirmState {
  dialogInfo?: OrgProjectionsChangeInfo;
  loadingConnections: boolean;
  loading: boolean;
  setDialogInfo(info: OrgProjectionsChangeInfo): void;
  setLoadingConnections(loading: boolean): void;
  setLoading(loading: boolean): void;
}

export const OrgProjectionsChangeConfirm: FC<OrgProjectionsChangeConfirmProps> = observer(
  ({ open, projection, type, editValue, closeDialog, closeParentDialog }) => {
    const state = useLocalObservable(
      (): OrgProjectionsChangeConfirmState => ({
        dialogInfo: undefined,
        loadingConnections: false,
        loading: false,
        setDialogInfo(info: OrgProjectionsChangeInfo) {
          this.dialogInfo = info;
        },
        setLoadingConnections(loading: boolean) {
          this.loadingConnections = loading;
        },
        setLoading(loading: boolean) {
          this.loading = loading;
        }
      })
    );

    const { dialogInfo, loadingConnections, loading, setDialogInfo, setLoadingConnections, setLoading } = state;

    const createItemsListForDeletion = useCallback(
      (tablesList?: TablesData[], relatedLayers?: RelatedVectorLayers[]): ReactNode | undefined => {
        const tables = tablesList?.map(({ tableName, datasetTitle, tableTitle, datasetIdentifier }) => {
          const vectorTablePath = JSON.stringify([
            ...datasetRootUrlItems,
            'dataset',
            datasetIdentifier,
            'table',
            tableName
          ]);

          const url = `/data-management?path_dm=${vectorTablePath}`;

          return (
            <li key={`${datasetIdentifier}-${tableName}`}>
              Набор данных: {datasetTitle}. Таблица:{' '}
              <Link className={cnOrgProjectionsChangeConfirm('Link')} href={url || ''} target='_blank'>
                {tableTitle}
              </Link>
            </li>
          );
        });

        const layers = relatedLayers?.map(({ layer, project }) => {
          const url = `/projects/${project.id}/map`;

          return (
            <li key={layer.id}>
              Проект: {project.name}. Слой:{' '}
              <Link className={cnOrgProjectionsChangeConfirm('Link')} href={url || ''} target='_blank'>
                {layer.title}
              </Link>
            </li>
          );
        });

        if (tables?.length === 0 && layers?.length === 0) {
          return undefined;
        }

        return (
          <>
            <p>
              Уверены что хотите {type === 'deletion' ? 'удалить' : 'отредактировать'} проекцию? Слои и таблицы по ней
              перестанут работать.
            </p>

            {!!tables?.length && (
              <>
                <p>Список таблиц:</p>
                <ul>{tables}</ul>
              </>
            )}

            {!!layers?.length && (
              <>
                <p>Список слоёв:</p>
                <ul>{layers}</ul>
              </>
            )}
          </>
        );
      },
      [type]
    );

    const deletionRequest = useCallback(async () => {
      setLoading(true);

      try {
        await projectionsClient.deleteProjection(projection.authSrid);

        Toast.success('Система координат успешно удалена.');

        communicationService.projectionUpdated.emit({
          type: 'update'
        });
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        await achtung({
          title: 'Ошибка',
          message: err.response?.data.message || 'Не удалось удалить систему координат'
        });
      } finally {
        setLoading(false);
        closeDialog();
      }
    }, [closeDialog, projection.authSrid, setLoading]);

    const editRequest = useCallback(async () => {
      if (!editValue) {
        return;
      }

      setLoading(true);

      try {
        const customCrs = await projectionsClient.updateProjection(projection.authSrid, editValue);
        const message = `Система координат ${customCrs.authSrid} обновлена. Изменение СК займет некоторое время. Некоторые функции могут быть недоступны`;

        Toast.success(message, { duration: 10_000 });

        if (closeParentDialog) {
          closeParentDialog();
        }

        communicationService.projectionUpdated.emit({
          type: 'update'
        });
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        await achtung({
          title: 'Ошибка',
          message: err.response?.data.message || 'Не удалось отредактировать систему координат'
        });
      } finally {
        setLoading(false);
      }

      closeDialog();
    }, [closeDialog, closeParentDialog, editValue, projection.authSrid, setLoading]);

    const checkActiveConnections = useCallback(async () => {
      setLoadingConnections(true);

      let linksToItems: ReactNode | undefined;

      try {
        const tables = await getTablesBySrid(projection.authSrid);
        const layers = await getRelatedLayers('nativeCRS', `${projection.authName}:${projection.authSrid}`);

        if (tables || layers) {
          linksToItems = createItemsListForDeletion(tables, layers);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        await achtung({
          title: 'Ошибка',
          message: err.response?.data.message || 'Не удалось получить данные о связанных таблицах'
        });
      } finally {
        setLoadingConnections(false);
      }

      let title = 'Подтверждение удаления';
      let message = 'Вы действительно хотите удалить систему координат';

      if (type === 'edit') {
        title = 'Подтверждение редактирования';
        message = 'Вы действительно хотите изменить систему координат';
      }

      setDialogInfo({
        title,
        message: linksToItems || `${message} "${projection.title}"?`
      });
    }, [
      createItemsListForDeletion,
      projection.authName,
      projection.authSrid,
      projection.title,
      setDialogInfo,
      setLoadingConnections,
      type
    ]);

    useEffect(() => {
      if (open) {
        void checkActiveConnections();
      }
    }, [open, checkActiveConnections]);

    return (
      <Dialog open={open} onClose={closeDialog} maxWidth={'sm'} fullWidth className={cnOrgProjectionsChangeConfirm()}>
        {dialogInfo?.title && <DialogTitle>{dialogInfo.title}</DialogTitle>}
        <DialogContent>
          <DialogContentText>{dialogInfo?.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            loading={loading}
            onClick={type === 'deletion' ? deletionRequest : editRequest}
            color='primary'
            variant='outlined'
            disabled={loadingConnections}
          >
            {type === 'deletion' ? 'Удалить' : 'Сохранить'}
          </Button>
          <Button onClick={closeDialog} variant='outlined' disabled={loading || loadingConnections}>
            Отмена
          </Button>
        </DialogActions>

        {loadingConnections ? <Loading /> : null}
      </Dialog>
    );
  }
);
