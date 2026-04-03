import React, { useCallback, useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { type PropertySchema, PropertyType } from '../../services/data/schema/schema.models';
import { isWfsFeature, type WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { applyPrintFocusForFeatureExtract, exportMap, loadAllLayersStyles } from '../../services/map/map-print.service';
import { printSettings } from '../../stores/PrintSettings.store';
import { Button } from '../Button/Button';
import { type FormControlProps } from '../Form/Control/Form-Control';
import { PrintMapDialog } from '../PrintMapDialog/PrintMapDialog';
import { PrintMapImageControlClear } from './Clear/PrintMapImageControl-Clear';
import { PrintMapImageControlPreview } from './Preview/PrintMapImageControl-Preview';
import { PrintMapImageControlRow } from './Row/PrintMapImageControl-Row';

const cnPrintMapImageControl = cn('PrintMapImageControl');

const previewEditLabel = 'Изменить фрагмент карты';

type PrintMapSchemaOptions = {
  pageFormatId: string;
  autoGenerate: boolean;
  focusFeature?: WfsFeature;
};

function readPrintMapSchemaProperty(property: PropertySchema): PrintMapSchemaOptions {
  if (property.propertyType !== PropertyType.CUSTOM) {
    throw new Error('PrintMapImageControl: ожидается propertyType CUSTOM');
  }

  const { format, autoGenerate, focusFeature: focusRaw } = property;
  const pageFormatId = typeof format === 'string' ? format : 'square';
  const focusFeature = focusRaw !== undefined && isWfsFeature(focusRaw) ? focusRaw : undefined;
  const autoGenerateEnabled = autoGenerate === true;

  return { pageFormatId, autoGenerate: autoGenerateEnabled, focusFeature };
}

const PrintMapImageControl = observer((props: FormControlProps) => {
  const { fieldValue, property, onChange } = props;
  const { pageFormatId, focusFeature, autoGenerate } = readPrintMapSchemaProperty(property);

  const state = useLocalObservable(() => ({
    printDialogOpen: false,
    mapLoading: false,

    setPrintDialogOpen(open: boolean) {
      this.printDialogOpen = open;
    },

    setMapLoading(loading: boolean) {
      this.mapLoading = loading;
    }
  }));

  useEffect(() => {
    if (!autoGenerate) {
      return;
    }

    let cancelled = false;

    async function runAutoGenerate() {
      state.setMapLoading(true);
      try {
        printSettings.setPageFormatId(pageFormatId);

        if (focusFeature) {
          await applyPrintFocusForFeatureExtract(focusFeature, { pageFormatId });
        }

        await loadAllLayersStyles();

        const image = await exportMap();
        if (!cancelled) {
          onChange?.({ value: image, propertyName: property.name });
        }
      } finally {
        if (!cancelled) {
          state.setMapLoading(false);
        }
      }
    }

    void runAutoGenerate();

    return () => {
      cancelled = true;
    };
  }, [autoGenerate, focusFeature, onChange, pageFormatId, property.name, state]);

  const handleExport = useCallback(
    (value: string) => {
      onChange?.({ value, propertyName: property.name });
    },
    [onChange, property.name]
  );

  const handleClear = useCallback(() => {
    onChange?.({ value: '', propertyName: property.name });
  }, [onChange, property.name]);

  const openPrintDialog = useCallback(async () => {
    const fragmentAlreadyChosen = typeof fieldValue === 'string' && fieldValue.length > 0;

    if (focusFeature && !fragmentAlreadyChosen) {
      state.setMapLoading(true);
      try {
        await applyPrintFocusForFeatureExtract(focusFeature, { pageFormatId });
      } finally {
        state.setMapLoading(false);
      }
    }

    state.setPrintDialogOpen(true);
  }, [fieldValue, focusFeature, pageFormatId, state]);

  const closePrintDialog = useCallback(() => {
    state.setPrintDialogOpen(false);
  }, [state]);

  const previewBusy = state.mapLoading || printSettings.printingInProcess;

  return (
    <>
      <div className={cnPrintMapImageControl()}>
        {typeof fieldValue === 'string' && fieldValue ? (
          <PrintMapImageControlRow>
            <PrintMapImageControlPreview
              imageSrc={fieldValue}
              editLabel={previewEditLabel}
              disabled={previewBusy}
              mapLoading={state.mapLoading || printSettings.printingInProcess}
              onOpenPrintDialog={openPrintDialog}
            />
            <PrintMapImageControlClear onClear={handleClear} />
          </PrintMapImageControlRow>
        ) : (
          <Button
            className={cnPrintMapImageControl('ChooseButton')}
            onClick={openPrintDialog}
            loading={state.mapLoading || printSettings.printingInProcess}
          >
            Выбрать фрагмент карты
          </Button>
        )}
      </div>

      <PrintMapDialog
        onClose={closePrintDialog}
        open={state.printDialogOpen}
        onExport={handleExport}
        format={pageFormatId}
        allowJpg
      />
    </>
  );
});

export default PrintMapImageControl;
