import React, { type FC, useCallback, useEffect, useMemo } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip } from '@mui/material';
import { FileOpenOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { type Library, type LibraryRecord } from '../../services/data/library/library.models';
import { getLibrary } from '../../services/data/library/library.service';
import { type PropertySchemaFile, PropertyType, type Schema } from '../../services/data/schema/schema.models';
import { applyContentType } from '../../services/data/schema/utils/applyContentType';
import { isRecordUpdateAllowed } from '../../services/permissions/permissions.service';
import { ActionsRight } from '../ActionsRight/ActionsRight';
import { Button } from '../Button/Button';
import { ChooseXTable } from '../ChooseXTable/ChooseXTable';
import { Explorer } from '../Explorer/Explorer';
import { type Adapter, type ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';
import { type XTableColumn } from '../XTable/XTable.models';

import './GpkgRasterPlacementDialog.scss';

const cnGpkgRasterPlacementDialog = cn('GpkgRasterPlacementDialog');

export type GpkgRasterPlacementTarget = {
  libraryIdentifier: string;
  documentId: number;
  field: string;
};

export interface GpkgRasterPlacementDialogProps {
  open: boolean;
  tableName?: string;
  onClose(): void;
  onPlace(target: GpkgRasterPlacementTarget): void;
}

type GpkgRasterPlacementDialogStep = 'document' | 'field';

type GpkgRasterPlacementDialogState = {
  step: GpkgRasterPlacementDialogStep;
  selectedDocument: LibraryRecord | undefined;
  fileFields: PropertySchemaFile[];
  selectedField: PropertySchemaFile | undefined;
  confirming: boolean;
  confirmGeneration: number;
  libraryByTableName: Record<string, Promise<Library>>;
  setStep(step: GpkgRasterPlacementDialogStep): void;
  setSelectedDocument(document: LibraryRecord | undefined): void;
  setFileFields(fields: PropertySchemaFile[]): void;
  setSelectedField(field: PropertySchemaFile | undefined): void;
  setConfirming(value: boolean): void;
  beginConfirm(): number;
  isConfirmCurrent(generation: number): boolean;
  getLibraryCached(tableName: string): Promise<Library>;
  reset(): void;
};

const fileFieldCols: XTableColumn<PropertySchemaFile>[] = [
  {
    field: 'title',
    title: 'Название',
    filterable: true,
    sortable: true
  },
  {
    field: 'name',
    title: 'Имя',
    filterable: true,
    sortable: true
  }
];

export function getGpkgRasterWritableFileFields(schema: Schema): PropertySchemaFile[] {
  return schema.properties.filter(
    (property): property is PropertySchemaFile =>
      property.propertyType === PropertyType.FILE && !property.hidden && !property.readOnly
  );
}

function getFileFieldRowId(field: PropertySchemaFile): string {
  return field.name;
}

async function loadGpkgRasterWritableFileFields(
  document: LibraryRecord,
  getLibraryCached: (tableName: string) => Promise<Library>
): Promise<PropertySchemaFile[]> {
  const library = await getLibraryCached(document.libraryTableName);

  return getGpkgRasterWritableFileFields(applyContentType(library.schema, document.content_type_id));
}

async function loadGpkgRasterPlaceableFileFields(
  document: LibraryRecord,
  getLibraryCached: (tableName: string) => Promise<Library>
): Promise<PropertySchemaFile[]> {
  if (!(await isRecordUpdateAllowed(document))) {
    return [];
  }

  return loadGpkgRasterWritableFileFields(document, getLibraryCached);
}

function toGpkgRasterPlacementTarget(document: LibraryRecord, field: PropertySchemaFile): GpkgRasterPlacementTarget {
  return {
    libraryIdentifier: document.libraryTableName,
    documentId: document.id,
    field: field.name
  };
}

export const GpkgRasterPlacementDialog: FC<GpkgRasterPlacementDialogProps> = observer(
  ({ open, tableName, onClose, onPlace }) => {
    const state = useLocalObservable<GpkgRasterPlacementDialogState>(() => ({
      step: 'document',
      selectedDocument: undefined,
      fileFields: [],
      selectedField: undefined,
      confirming: false,
      confirmGeneration: 0,
      libraryByTableName: {},

      setStep(step) {
        this.step = step;
      },

      setSelectedDocument(document) {
        this.selectedDocument = document;
      },

      setFileFields(fields) {
        this.fileFields = fields;
      },

      setSelectedField(field) {
        this.selectedField = field;
      },

      setConfirming(value) {
        this.confirming = value;
      },

      beginConfirm() {
        this.confirming = true;
        this.confirmGeneration += 1;

        return this.confirmGeneration;
      },

      isConfirmCurrent(generation) {
        return this.confirmGeneration === generation;
      },

      getLibraryCached(tableName) {
        const cached = this.libraryByTableName[tableName];
        if (cached) {
          return cached;
        }

        const next = getLibrary(tableName);
        this.libraryByTableName = { ...this.libraryByTableName, [tableName]: next };

        return next;
      },

      reset() {
        this.step = 'document';
        this.selectedDocument = undefined;
        this.fileFields = [];
        this.selectedField = undefined;
        this.confirming = false;
        this.confirmGeneration += 1;
        this.libraryByTableName = {};
      }
    }));

    useEffect(() => {
      if (!open) {
        state.reset();
      }
    }, [open, state]);

    const handleClose = useCallback(() => {
      state.reset();
      onClose();
    }, [onClose, state]);

    const placeTarget = useCallback(
      (document: LibraryRecord, field: PropertySchemaFile) => {
        onPlace(toGpkgRasterPlacementTarget(document, field));
      },
      [onPlace]
    );

    const confirmDocument = useCallback(
      async (document: LibraryRecord) => {
        if (state.confirming) {
          return;
        }

        const generation = state.beginConfirm();

        try {
          const fields = await loadGpkgRasterPlaceableFileFields(document, libraryTableName =>
            state.getLibraryCached(libraryTableName)
          );
          if (!state.isConfirmCurrent(generation)) {
            return;
          }

          const [onlyField] = fields;

          if (fields.length === 0) {
            return;
          }

          if (fields.length === 1 && onlyField) {
            placeTarget(document, onlyField);

            return;
          }

          state.setSelectedDocument(document);
          state.setFileFields(fields);
          state.setSelectedField(undefined);
          state.setStep('field');
        } finally {
          if (state.isConfirmCurrent(generation)) {
            state.setConfirming(false);
          }
        }
      },
      [placeTarget, state]
    );

    const handleExplorerSelect = useCallback(
      (item: ExplorerItemData) => {
        if (item.type === ExplorerItemType.DOCUMENT) {
          state.setSelectedDocument(item.payload);

          return;
        }

        state.setSelectedDocument(undefined);
      },
      [state]
    );

    const handleSubmitDocument = useCallback(() => {
      if (!state.selectedDocument) {
        return;
      }

      void confirmDocument(state.selectedDocument);
    }, [confirmDocument, state]);

    const handleBackToDocument = useCallback(() => {
      state.setStep('document');
      state.setFileFields([]);
      state.setSelectedField(undefined);
    }, [state]);

    const handleFieldSelect = useCallback(
      (fields: PropertySchemaFile[]) => {
        const [field] = fields;
        state.setSelectedField(field);
      },
      [state]
    );

    const handleSubmitField = useCallback(() => {
      if (!state.selectedDocument || !state.selectedField) {
        return;
      }

      placeTarget(state.selectedDocument, state.selectedField);
    }, [placeTarget, state]);

    const handleDisabledTester = useCallback(
      async (item: ExplorerItemData): Promise<boolean> => {
        if (item.type === ExplorerItemType.FILE) {
          return true;
        }

        if (item.type !== ExplorerItemType.DOCUMENT) {
          return false;
        }

        try {
          const fields = await loadGpkgRasterPlaceableFileFields(item.payload, libraryTableName =>
            state.getLibraryCached(libraryTableName)
          );

          return fields.length === 0;
        } catch {
          return true;
        }
      },
      [state]
    );

    const documentAdaptersOverride = useMemo<Record<string, Partial<Adapter>>>(
      () => ({
        [ExplorerItemType.DOCUMENT]: {
          isFolder: () => true,
          getActions: () => null,
          customOpenActionIcon: () => (
            <Tooltip title='Выбрать'>
              <FileOpenOutlined />
            </Tooltip>
          ),
          customOpenAction: (item: ExplorerItemData) => {
            if (item.type === ExplorerItemType.DOCUMENT) {
              state.setSelectedDocument(item.payload);
              void confirmDocument(item.payload);
            }
          }
        }
      }),
      [confirmDocument, state]
    );

    const fieldStep = state.step === 'field';
    const submitDisabled = fieldStep ? !state.selectedField : !state.selectedDocument;

    return (
      <Dialog
        maxWidth='md'
        fullWidth
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: { className: cnGpkgRasterPlacementDialog() }
        }}
      >
        <DialogTitle>{tableName ? 'Размещение растрового слоя' : 'Размещение растровых слоёв'}</DialogTitle>

        <DialogContent className={cnGpkgRasterPlacementDialog('Content')}>
          {fieldStep ? (
            <>
              <DialogContentText>Выберите файловое поле документа.</DialogContentText>
              <ChooseXTable<PropertySchemaFile>
                className={cnGpkgRasterPlacementDialog('FieldTable')}
                cols={fileFieldCols}
                data={state.fileFields}
                selectedItems={state.selectedField ? [state.selectedField] : []}
                getRowId={getFileFieldRowId}
                single
                filterable
                onSelect={handleFieldSelect}
              />
            </>
          ) : (
            <Explorer
              explorerRole='GpkgRasterPlacement'
              className={cnGpkgRasterPlacementDialog('Explorer')}
              preset={ExplorerItemType.LIBRARY_ROOT}
              adaptersOverride={documentAdaptersOverride}
              disabledTester={handleDisabledTester}
              hideToolbarActions
              onSelect={handleExplorerSelect}
            />
          )}
        </DialogContent>

        <DialogActions>
          <ActionsRight>
            {fieldStep && (
              <Button onClick={handleBackToDocument} disabled={state.confirming}>
                Назад
              </Button>
            )}
            <Button
              color='primary'
              loading={state.confirming}
              disabled={submitDisabled || state.confirming}
              onClick={fieldStep ? handleSubmitField : handleSubmitDocument}
            >
              Выбрать
            </Button>
            <Button onClick={handleClose}>Отмена</Button>
          </ActionsRight>
        </DialogActions>
      </Dialog>
    );
  }
);
