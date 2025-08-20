import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { DriveFileMove, DriveFileMoveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { Library, LibraryRecord } from '../../../services/data/library/library.models';
import { getLibrary, getLibraryRecord, moveLibraryRecord } from '../../../services/data/library/library.service';
import { Schema } from '../../../services/data/schema/schema.models';
import { ActionTypes, DataTypes } from '../../../services/permissions/permissions.models';
import { getAvailableActionsTooltipByRole } from '../../../services/permissions/permissions.utils';
import { services } from '../../../services/services';
import { notFalsyFilter } from '../../../services/util/NotFalsyFilter';
import { isAxiosError } from '../../../services/util/typeGuards/isAxiosError';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { getIdsFromPath, libraryRootUrlItems } from '../../DataManagement/DataManagement.utils';
import { emptyItem, ExplorerItemData, ExplorerItemType } from '../../Explorer/Explorer.models';
import { Link } from '../../Link/Link';
import { SelectFolderDialog } from '../../SelectFolderDialog/SelectFolderDialog';
import { Toast } from '../../Toast/Toast';

const cnLibraryDocumentActionsMove = cn('LibraryDocumentActions', 'Move');

interface LibraryDocumentActionsFilesPlacementProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
  schema?: Schema;
  disabled?: boolean;
}

@observer
export class LibraryDocumentActionsMove extends Component<LibraryDocumentActionsFilesPlacementProps> {
  @observable private documentMoveDialogOpen = false;
  @observable private loading = false;
  @observable private currentLibrary?: Library;
  @observable private url?: string;

  private folder?: LibraryRecord;

  constructor(props: LibraryDocumentActionsFilesPlacementProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount(): Promise<void> {
    const library = await getLibrary(this.props.document?.libraryTableName);
    this.setCurrentLibrary(library);
  }

  render() {
    const { as, document, disabled } = this.props;

    const role = document.role;

    if (!role) {
      return;
    }

    return (
      <>
        <ActionsItem
          title='Переместить'
          tooltipText={disabled ? getAvailableActionsTooltipByRole(ActionTypes.MOVE, role, DataTypes.DOC) : undefined}
          className={cnLibraryDocumentActionsMove()}
          icon={this.documentMoveDialogOpen ? <DriveFileMove /> : <DriveFileMoveOutlined />}
          onClick={this.openDocumentMoveDialog}
          as={as}
          disabled={disabled}
        />

        <SelectFolderDialog
          document={document}
          title='Укажите папку для перемещения'
          startPath={
            this.currentLibrary
              ? ([{ type: ExplorerItemType.LIBRARY, payload: this.currentLibrary }, emptyItem] as ExplorerItemData[])
              : undefined
          }
          open={this.documentMoveDialogOpen}
          loading={this.loading}
          onClose={this.closeDocumentMoveDialog}
          onSelect={this.selectFolder}
        />
      </>
    );
  }

  @boundMethod
  private async selectFolder(folder: LibraryRecord | null) {
    this.setLoading(true);

    if (folder) {
      this.folder = folder;
    }

    try {
      await moveLibraryRecord(this.props.document, folder?.is_folder ? folder.id : undefined);

      await this.createDocumentUrl();
      this.successMessage();
    } catch (error) {
      if (isAxiosError<{ message?: string }>(error)) {
        Toast.error({
          message: error.response?.data?.message || error?.message
        });
      } else {
        Toast.error({ message: 'Не удалось переместить' });
      }
    } finally {
      this.setLoading(false);
      this.closeDocumentMoveDialog();
    }
  }

  @boundMethod
  private successMessage() {
    const { document } = this.props;
    const { is_folder, title } = document;

    Toast.success(
      <>
        {is_folder ? `Папка с документами "${title}" успешно перемещена. ` : `Документ "${title}" успешно перемещен. `}
        {this.url && <Link href={this.url}>Перейти к {is_folder ? 'папке' : 'документу'}</Link>}
      </>,
      { duration: 15_000 }
    );
  }

  @boundMethod
  private async createDocumentUrl() {
    const { document } = this.props;

    if (!this.folder) {
      Toast.warn(`Ошибка перемещения ${document.is_folder ? 'папки' : 'документа'}. Не найдена папка.`);

      return;
    }

    const { libraryTableName, path, is_folder: isFolder } = this.folder;
    const currentItem = isFolder ? ['folder', document.id] : ['doc', document.id];

    try {
      let parentsInfo = await Promise.all(
        getIdsFromPath(path || '').map(async pathId => {
          const { id, title } = await getLibraryRecord(libraryTableName, pathId);

          return { id, title };
        })
      );

      parentsInfo.push({ id: this.folder.id, title: this.folder.title });
      parentsInfo = parentsInfo.filter(notFalsyFilter);

      let pathWithCurrent = '';

      parentsInfo?.map((parent, index) => {
        const folders: (string | number)[] = [];
        for (let i = 0; i < index + 1; i++) {
          folders.push('folder', parentsInfo[i].id);
        }

        pathWithCurrent = JSON.stringify([
          ...libraryRootUrlItems,
          'library',
          libraryTableName,
          ...folders,
          ...currentItem
        ]);
      });

      this.setUrl(`/data-management?path_dm=${pathWithCurrent}`);
    } catch (error) {
      const err = error as AxiosError;

      Toast.warn(`Ошибка перемещения ${document.is_folder ? 'папки' : 'документа'}. ${err.message}`);
      services.logger.warn(`Ошибка перемещения документа. ${document.id} ${err.message}`);
    }
  }

  @action.bound
  private setCurrentLibrary(currentLibrary: Library) {
    this.currentLibrary = currentLibrary;
  }

  @action.bound
  private openDocumentMoveDialog() {
    this.documentMoveDialogOpen = true;
  }

  @action.bound
  private closeDocumentMoveDialog() {
    this.documentMoveDialogOpen = false;
  }

  @action
  private setLoading(loading: boolean) {
    this.loading = loading;
  }

  @action
  private setUrl(url: string) {
    this.url = url;
  }
}
