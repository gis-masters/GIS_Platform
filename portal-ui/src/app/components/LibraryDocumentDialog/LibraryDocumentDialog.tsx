import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Paper, Tooltip } from '@mui/material';
import { FileOpenOutlined, FolderOutlined, InsertDriveFileOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { RegistryConsumer } from '@bem-react/di';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { LibraryRecord } from '../../services/data/library/library.models';
import { getLibraryRecord } from '../../services/data/library/library.service';
import { CommonDiRegistry } from '../../services/di-registry';
import { services } from '../../services/services';
import { notFalsyFilter } from '../../services/util/NotFalsyFilter';
import { getIdsFromPath, libraryRootUrlItems } from '../DataManagement/DataManagement.utils';
import { Explorer } from '../Explorer/Explorer';
import { ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';
import { LibraryDeletedDocumentActions } from '../LibraryDeletedDocumentActions/LibraryDeletedDocumentActions';
import { TextBadge } from '../TextBadge/TextBadge';
import { Toast } from '../Toast/Toast';

import '!style-loader!css-loader!sass-loader!./LibraryDocumentDialog.scss';

const cnLibraryDocumentDialog = cn('LibraryDocumentDialog');

interface LibraryDocumentDialogProps {
  document: LibraryRecord;
  open: boolean;
  onClose(): void;
}

@observer
export class LibraryDocumentDialog extends Component<LibraryDocumentDialogProps> {
  render() {
    const { document, open, onClose } = this.props;
    const { is_deleted: isDeleted } = document;
    const path: ExplorerItemData[] = [{ type: ExplorerItemType.FOLDER, payload: document }];

    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth='xl'
        PaperProps={{ className: cnLibraryDocumentDialog() }}
      >
        <DialogTitle>
          <div className={cnLibraryDocumentDialog('TypeIcon')}>
            {document.is_folder ? <FolderOutlined color='primary' /> : <InsertDriveFileOutlined color='primary' />}
          </div>
          {isDeleted ? (
            <span className={cnLibraryDocumentDialog('TitleDeleted')}>Документ удален</span>
          ) : (
            `Просмотр ${document.is_folder ? 'папки' : 'документа'}`
          )}
          {document.id && <TextBadge id={document.id} />}
        </DialogTitle>

        <DialogContent className='scroll'>
          <RegistryConsumer id='common'>
            {({ LibraryDocument }: CommonDiRegistry) => (
              <LibraryDocument document={document} className={cnLibraryDocumentDialog('Document')} />
            )}
          </RegistryConsumer>

          {!!document.is_folder && (
            <>
              <span className={cnLibraryDocumentDialog('FolderContentTitle')}>Содержимое папки:</span>
              <Paper className={cnLibraryDocumentDialog(null, ['scroll'])} variant='outlined' square>
                <Explorer
                  className={cnLibraryDocumentDialog('Explorer')}
                  explorerRole='FolderPreview'
                  path={path}
                  withoutTitle
                  fixedHeight
                  hideItemsSort
                  hidePageSize
                  adaptersOverride={{
                    folder: {
                      hasSearch: () => false,
                      getToolbarActions: () => '',
                      getChildrenFilterField: () => '',
                      customOpenActionIcon: this.folderCustomOpenActionIcon,
                      customOpenAction: this.customOpenAction,
                      getDescription: () => '',
                      getActions: () => ''
                    },
                    doc: {
                      customOpenActionIcon: this.docCustomOpenActionIcon,
                      customOpenAction: this.customOpenAction,
                      isFolder: () => {
                        return true;
                      }
                    }
                  }}
                />
              </Paper>
            </>
          )}
        </DialogContent>

        <DialogActions>
          {isDeleted && (
            <LibraryDeletedDocumentActions forDialog onDialogClose={onClose} hideOpen document={document} as='button' />
          )}
          {!isDeleted && (
            <RegistryConsumer id='common'>
              {({ LibraryDocumentActions }: CommonDiRegistry) => (
                <LibraryDocumentActions document={document} as='iconButton' forDialog onDialogClose={onClose} />
              )}
            </RegistryConsumer>
          )}
        </DialogActions>
      </Dialog>
    );
  }

  private folderCustomOpenActionIcon() {
    return (
      <Tooltip title='Перейти к папке'>
        <FileOpenOutlined />
      </Tooltip>
    );
  }

  private docCustomOpenActionIcon() {
    return (
      <Tooltip title='Перейти к документу'>
        <FileOpenOutlined />
      </Tooltip>
    );
  }

  @boundMethod
  private async customOpenAction(item: ExplorerItemData) {
    if (item.type === ExplorerItemType.DOCUMENT || item.type === ExplorerItemType.FOLDER) {
      const { libraryTableName, path, id, is_folder: isFolder } = item.payload;
      const currentItem = isFolder ? ['folder', id] : ['doc', id];

      try {
        let parentsInfo = await Promise.all(
          getIdsFromPath(path || '').map(async pathId => {
            const { id, title } = await getLibraryRecord(libraryTableName, pathId);

            return { id, title };
          })
        );

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

        const url = `/data-management?path_dm=${pathWithCurrent}`;

        await services.provided;

        services.ngZone.run(() => {
          setTimeout(() => {
            void services.router.navigateByUrl(url);
          }, 0);
        });
      } catch (error) {
        const err = error as AxiosError;

        Toast.warn(`Ошибка получения документа. ${err.message}`);
        services.logger.warn(`Ошибка получения документа. ${err.message}`);
      }
    }
  }
}
