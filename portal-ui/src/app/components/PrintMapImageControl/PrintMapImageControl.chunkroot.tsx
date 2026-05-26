import React, { useCallback, useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { type PropertySchema, PropertyType } from '../../services/data/schema/schema.models';
import { type WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { isWfsFeature } from '../../services/geoserver/wfs/wfs.typeguards';
import { type CrgLayer } from '../../services/gis/layers/layers.models';
import { isCrgLayer } from '../../services/gis/layers/layers.typeguards';
import { applyPrintFocusForFeatureExtract, exportMap, loadAllLayersStyles } from '../../services/map/map-print.service';
import { isArrayOf } from '../../services/util/typeGuards/isArrayOf';
import { currentProject } from '../../stores/CurrentProject.store';
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
  showSelectionInPrintByDefault: boolean;
  hideLegendInPrintByDefault: boolean;
  ensureVisibleLayers?: CrgLayer[];
};

function readPrintMapSchemaProperty(property: PropertySchema): PrintMapSchemaOptions {
  if (property.propertyType !== PropertyType.CUSTOM) {
    throw new Error('PrintMapImageControl: ожидается propertyType CUSTOM');
  }

  const {
    format,
    autoGenerate,
    focusFeature: focusRaw,
    showSelectionInPrintByDefault,
    ensureVisibleLayers: ensureVisibleLayersRaw
  } = property;
  const pageFormatId = typeof format === 'string' ? format : 'square';
  const focusFeature = focusRaw !== undefined && isWfsFeature(focusRaw) ? focusRaw : undefined;
  const autoGenerateEnabled = autoGenerate === true;
  const selectionDefault = showSelectionInPrintByDefault === true;
  const hideLegendInPrintByDefault = property.hideLegendInPrintByDefault === true;
  const ensureVisibleLayers = isArrayOf(ensureVisibleLayersRaw, isCrgLayer) ? ensureVisibleLayersRaw : undefined;

  return {
    pageFormatId,
    autoGenerate: autoGenerateEnabled,
    focusFeature,
    showSelectionInPrintByDefault: selectionDefault,
    hideLegendInPrintByDefault,
    ensureVisibleLayers
  };
}

function applyShowSelectionInPrintDefault(enabled: boolean) {
  if (!enabled) {
    return;
  }

  printSettings.setValues({
    showSystemLayers: { ...printSettings.showSystemLayers, draft: true }
  });
}

function applyLegendInPrintDefault(enabled: boolean) {
  printSettings.setValues({
    legend: { ...printSettings.legend, enabled }
  });
}

type PrintMapImageControlState = {
  printDialogOpen: boolean;
  mapLoading: boolean;
  setPrintDialogOpen(open: boolean): void;
  setMapLoading(loading: boolean): void;
};

const PrintMapImageControl = observer((props: FormControlProps) => {
  const { fieldValue, property, onChange } = props;
  const {
    pageFormatId,
    focusFeature,
    autoGenerate,
    showSelectionInPrintByDefault,
    hideLegendInPrintByDefault,
    ensureVisibleLayers
  } = readPrintMapSchemaProperty(property);

  const state = useLocalObservable<PrintMapImageControlState>(() => ({
    printDialogOpen: false,
    mapLoading: false,

    setPrintDialogOpen(open) {
      this.printDialogOpen = open;
    },

    setMapLoading(loading) {
      this.mapLoading = loading;
    }
  }));

  useEffect(() => {
    let cancelled = false;
    let temporaryLayerIds: number[] = [];

    async function init() {
      if (ensureVisibleLayers?.length) {
        temporaryLayerIds = ensureVisibleLayers.map(layer => layer.id);
        currentProject.addTemporaryVisibleLayers(temporaryLayerIds);
      }

      if (!autoGenerate || cancelled) {
        return;
      }

      state.setMapLoading(true);
      try {
        printSettings.setPageFormatId(pageFormatId);
        applyShowSelectionInPrintDefault(showSelectionInPrintByDefault);
        applyLegendInPrintDefault(!hideLegendInPrintByDefault);

        if (focusFeature) {
          await applyPrintFocusForFeatureExtract(focusFeature, { pageFormatId });
        }

        if (cancelled) {
          return;
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

    void init();

    return () => {
      cancelled = true;

      if (temporaryLayerIds.length) {
        currentProject.removeTemporaryVisibleLayers(temporaryLayerIds);
      }
    };
  }, [
    autoGenerate,
    ensureVisibleLayers,
    focusFeature,
    onChange,
    pageFormatId,
    property.name,
    hideLegendInPrintByDefault,
    showSelectionInPrintByDefault,
    state
  ]);

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

    applyShowSelectionInPrintDefault(showSelectionInPrintByDefault);
    applyLegendInPrintDefault(!hideLegendInPrintByDefault);
    state.setPrintDialogOpen(true);
  }, [fieldValue, focusFeature, pageFormatId, hideLegendInPrintByDefault, showSelectionInPrintByDefault, state]);

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
