import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { RestorePageOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { Library, LibraryRecord } from '../../../services/data/library/library.models';
import { getLibrary, getLibraryRecord, recoverLibraryRecord } from '../../../services/data/library/library.service';
import { konfirmieren } from '../../../services/utility-dialogs.service';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { emptyItem, ExplorerItemData, ExplorerItemType } from '../../Explorer/Explorer.models';
import { SelectFolderDialog } from '../../SelectFolderDialog/SelectFolderDialog';
import { Toast } from '../../Toast/Toast';

const cnLibraryDeletedDocumentActionsRestore = cn('LibraryDeletedDocumentActions', 'Restore');

interface LibraryDeletedDocumentActionsRestoreProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
}

@observer
export class LibraryDeletedDocumentActionsRestore extends Component<LibraryDeletedDocumentActionsRestoreProps> {
  @observable private loading = false;
  @observable private dialogOpen = false;
  @observable private currentLibrary?: Library;
  @observable private parentFolderPath?: ExplorerItemData[];

  constructor(props: LibraryDeletedDocumentActionsRestoreProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount(): Promise<void> {
    const library = await getLibrary(this.props.document?.libraryTableName);
    this.setCurrentLibrary(library);
  }

  render() {
    const { as, document } = this.props;

    return (
      <>
        <ActionsItem
          className={cnLibraryDeletedDocumentActionsRestore()}
          title='Восстановить документ'
          as={as}
          onClick={this.restoreDocument}
          icon={<RestorePageOutlined />}
        />

        <SelectFolderDialog
          title='Выберите папку для восстановления документа'
          subtitle='(восстановление возможно только в папку с доступом на редактирование)'
          document={document}
          startPath={
            this.parentFolderPath ||
            ([{ type: ExplorerItemType.LIBRARY, payload: this.currentLibrary }, emptyItem] as ExplorerItemData[])
          }
          onClose={this.closeDialog}
          loading={this.loading}
          open={this.dialogOpen}
          onSelect={this.selectFolder}
        />
      </>
    );
  }

  @action.bound
  private async selectFolder(folder: LibraryRecord | null) {
    this.setLoading(true);

    try {
      await recoverLibraryRecord(this.props.document, folder?.is_folder ? folder.id : undefined);
    } catch (error) {
      const err = error as AxiosError<{ message?: string[] }>;

      if (err?.response?.data?.message) {
        Toast.error(err.response.data.message);
      }
    }

    this.setLoading(false);
    this.closeDialog();
  }

  @boundMethod
  private async restoreDocument() {
    const { document } = this.props;
    if (document && document.path) {
      const pathParts = document.path.split('/');
      pathParts.shift();

      if (pathParts.length > 1) {
        const parent = await getLibraryRecord(document.libraryTableName, Number(pathParts.at(-1)));

        if (parent?.is_deleted) {
          if (
            await konfirmieren({
              title: 'Невозможно восстановить документ в изначальную папку. Выбрать другую папку для восстановления?'
            })
          ) {
            this.openDialog();
          }
        } else {
          const pathParts = document.path.split('/').slice(2);
          const parents: ExplorerItemData[] = await Promise.all(
            pathParts.map(async part => {
              const folder = await getLibraryRecord(document.libraryTableName, Number(part));

              return { type: ExplorerItemType.FOLDER, payload: folder };
            })
          );
          if (this.currentLibrary) {
            this.setParentFolderPath([{ type: ExplorerItemType.LIBRARY, payload: this.currentLibrary }, ...parents]);
            this.openDialog();
          }
        }
      } else {
        this.openDialog();
      }
    }
  }

  @action.bound
  private setCurrentLibrary(currentLibrary: Library) {
    this.currentLibrary = currentLibrary;
  }

  @action.bound
  private setParentFolderPath(parentFolderPath: ExplorerItemData[]) {
    this.parentFolderPath = parentFolderPath;
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  @action
  private setLoading(loading: boolean) {
    this.loading = loading;
  }
}
