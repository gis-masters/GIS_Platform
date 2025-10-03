import React, { FC, useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { ContentCopy, ContentCopyOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { Library, LibraryRecord } from '../../../services/data/library/library.models';
import { createLibraryRecord, getLibrary, getLibraryRecord } from '../../../services/data/library/library.service';
import { PropertySchema, PropertyType, Schema } from '../../../services/data/schema/schema.models';
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

const cnLibraryDocumentActionsCopy = cn('LibraryDocumentActions', 'Copy');

interface LibraryDocumentActionsFilesPlacementProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
  schema?: Schema;
}

type LibraryDocumentActionsCopyState = {
  documentCopyDialogOpen: boolean;
  loading: boolean;
  currentLibrary?: Library;
  url?: string;

  setCurrentLibrary(currentLibrary: Library): void;
  openDocumentCopyDialog(): void;
  closeDocumentCopyDialog(): void;
  setLoading(loading: boolean): void;
  setUrl(url: string): void;
};

export const LibraryDocumentActionsCopy: FC<LibraryDocumentActionsFilesPlacementProps> = observer(
  ({ document, schema, as }) => {
    const state = useLocalObservable(
      (): LibraryDocumentActionsCopyState => ({
        documentCopyDialogOpen: false,
        loading: false,
        currentLibrary: undefined,
        url: undefined,

        setCurrentLibrary(this: LibraryDocumentActionsCopyState, currentLibrary: Library) {
          this.currentLibrary = currentLibrary;
        },

        openDocumentCopyDialog(this: LibraryDocumentActionsCopyState) {
          this.documentCopyDialogOpen = true;
        },

        closeDocumentCopyDialog(this: LibraryDocumentActionsCopyState) {
          this.documentCopyDialogOpen = false;
        },

        setLoading(this: LibraryDocumentActionsCopyState, loading: boolean) {
          this.loading = loading;
        },

        setUrl(this: LibraryDocumentActionsCopyState, url: string) {
          this.url = url;
        }
      })
    );

    const clearedFields = (): PropertySchema[] => {
      const { properties = [] } = schema || {};
      const excludedNames = new Set(['regdate', 'regnum']);

      return properties
        .filter(({ propertyType }) => propertyType !== PropertyType.BINARY)
        .filter(({ name }) => !excludedNames.has(name));
    };

    useEffect(() => {
      const fetchLibrary = async () => {
        if (document?.libraryTableName) {
          const library = await getLibrary(document.libraryTableName);
          state.setCurrentLibrary(library);
        }
      };

      void fetchLibrary();
    }, [document?.libraryTableName, state]);

    const selectFolder = async (selectedFolder: LibraryRecord | null) => {
      state.setLoading(true);

      try {
        const schemaPropertyNames = clearedFields().map(prop => prop.name) || [];

        const newDoc: Record<string, unknown> = {
          content_type_id: document.content_type_id,
          path: selectedFolder?.path + '/' + selectedFolder?.id
        };

        schemaPropertyNames.forEach(propName => {
          if (Object.hasOwn(document, propName) && propName !== 'path') {
            newDoc[propName] = document[propName];
          }
        });

        await createLibraryRecord(newDoc, document.libraryTableName);

        await createDocumentUrl(selectedFolder);
        successMessage();
      } catch (error) {
        if (isAxiosError<{ message?: string }>(error)) {
          Toast.error({
            message: error.response?.data?.message || error?.message
          });
        } else {
          Toast.error({ message: 'Не удалось копировать' });
        }
      } finally {
        state.setLoading(false);
        state.closeDocumentCopyDialog();
      }
    };

    const successMessage = () => {
      const { title } = document;

      Toast.success(
        <>
          {`Документ "${title}" успешно скопирован. `}
          {state.url && <Link href={state.url}>Перейти к документу</Link>}
        </>,
        { duration: 15_000 }
      );
    };

    const createDocumentUrl = async (targetFolder: LibraryRecord | null) => {
      if (!targetFolder) {
        Toast.warn('Ошибка копирования документа');

        return;
      }

      const { libraryTableName, path } = targetFolder;
      const currentItem = ['doc', document.id];

      try {
        let parentsInfo = await Promise.all(
          getIdsFromPath(path || '').map(async pathId => {
            const { id, title } = await getLibraryRecord(libraryTableName, pathId);

            return { id, title };
          })
        );

        parentsInfo.push({ id: targetFolder.id, title: targetFolder.title });
        parentsInfo = parentsInfo.filter(notFalsyFilter);

        let pathWithCurrent = '';

        parentsInfo?.forEach((_, index) => {
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

        state.setUrl(`/data-management?path_dm=${pathWithCurrent}`);
      } catch (error) {
        const err = error as AxiosError;
        Toast.warn(`Ошибка копирования документа. ${err.message}`);
        services.logger.warn(`Ошибка копирования документа. ${document.id} ${err.message}`);
      }
    };

    const { role } = document;

    if (!role) {
      return null;
    }

    return (
      <>
        <ActionsItem
          title='Копировать'
          className={cnLibraryDocumentActionsCopy()}
          icon={state.documentCopyDialogOpen ? <ContentCopy /> : <ContentCopyOutlined />}
          onClick={state.openDocumentCopyDialog}
          as={as}
        />

        <SelectFolderDialog
          document={document}
          title='Укажите папку для копирования'
          startPath={
            state.currentLibrary
              ? ([{ type: ExplorerItemType.LIBRARY, payload: state.currentLibrary }, emptyItem] as ExplorerItemData[])
              : undefined
          }
          open={state.documentCopyDialogOpen}
          loading={state.loading}
          onClose={state.closeDocumentCopyDialog}
          onSelect={selectFolder}
        />
      </>
    );
  }
);
