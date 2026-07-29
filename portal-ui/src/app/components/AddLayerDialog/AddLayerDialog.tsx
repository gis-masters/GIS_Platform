import React, { type FC, useCallback } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { type AxiosError } from 'axios';

import { FilePlacementMode } from '../../services/data/file-placement/file-placement.models';
import { placeFileWithProjection } from '../../services/data/file-placement/file-placement.service';
import { getFileInfo } from '../../services/data/files/files.service';
import { getFileBaseName } from '../../services/data/files/files.util';
import { getLibraryRecord } from '../../services/data/library/library.service';
import { awaitProcess } from '../../services/data/processes/processes.service';
import { isPlaceFileProcess } from '../../services/data/processes/processes.typeguards';
import { getProjectionCode } from '../../services/data/projections/projections.util';
import { type ContentType, type PropertySchema, type Schema } from '../../services/data/schema/schema.models';
import { buildComplexName } from '../../services/geoserver/featureType/featureType.util';
import { type CrgLayer, CrgLayerType } from '../../services/gis/layers/layers.models';
import { createLayer } from '../../services/gis/layers/layers.service';
import {
  externalLayerDefaults,
  generateNextLayerId,
  vectorLayerDefaults
} from '../../services/gis/layers/layers.utils';
import { getNspdKnownLayer } from '../../services/nspd/feature-info/nspd-feature-info.models';
import { services } from '../../services/services';
import { validateFormValue } from '../../services/util/form/formValidation.utils';
import { currentProject } from '../../stores/CurrentProject.store';
import { currentUser } from '../../stores/CurrentUser.store';
import { getDefaultValues } from '../Form/Form.utils';
import { FormDialog } from '../FormDialog/FormDialog';
import { Toast } from '../Toast/Toast';
import { type LayerFormValue } from './AddLayerDialog.models';
import { buildFields, buildFileCrgLayer } from './AddLayerDialog.utils';
const cnAddLayerDialog = cn('AddLayerDialog');

interface AddLayerDialogProps {
  open: boolean;
  onClose(): void;
  onAdd(layer: CrgLayer): void;
}

interface AddLayerDialogState {
  formValue: Partial<LayerFormValue>;
  readonly valid: boolean;
  readonly schema: Schema | undefined;
  readonly views: ContentType[];
  readonly fields: PropertySchema[];
  handleFormChange(formValue: LayerFormValue): void;
  clearForm(): void;
}

async function createVectorLayer(
  formValue: Partial<LayerFormValue>,
  views: ContentType[],
  schema?: Schema
): Promise<CrgLayer> {
  const { datasource = {}, title = '', minZoom, projection, view } = formValue;
  const { dataset, vectorTable } = datasource;

  if (!dataset || !vectorTable) {
    throw new Error('Не указаны обязательные параметры');
  }

  const workspace = currentUser.workspaceName;
  const crs = projection ? getProjectionCode(projection) : '';
  const styleName = views.find(({ id }) => id === view)?.styleName;

  const newCrgLayer: CrgLayer = {
    ...vectorLayerDefaults(),
    id: generateNextLayerId(),
    dataset: dataset.identifier,
    resourceId: vectorTable.identifier,
    complexName: buildComplexName(workspace, vectorTable.identifier, crs),
    title,
    nativeCRS: crs,
    minZoom,
    styleName: styleName || schema?.styleName || schema?.name,
    view,
    mode: FilePlacementMode.GEOSERVER
  };

  await createLayer(newCrgLayer, currentProject.id);
  newCrgLayer.mode = FilePlacementMode.FULL;

  return newCrgLayer;
}

async function createFileLayer(formValue: Partial<LayerFormValue>): Promise<CrgLayer> {
  const { datasource = {}, title = '', projection } = formValue;
  const { libraryRecord, file, library } = datasource;

  if (!libraryRecord || !file || !library) {
    throw new Error('Не указаны обязательные параметры');
  }

  const workspace = currentUser.workspaceName;
  const crs = projection ? getProjectionCode(projection) : '';
  const record = await getLibraryRecord(library.table_name, libraryRecord.id);
  const { path } = await getFileInfo(file.id);

  if (!path) {
    throw new Error('Не указаны обязательные параметры');
  }

  const fileTableName = `${record.libraryTableName}_${record.id}__${file.id}`;

  const generalCrgLayerProps = {
    title: title || getFileBaseName(file.title),
    resourceId: fileTableName,
    sourceId: record.libraryTableName,
    sourceRecordId: record.id,
    dataStoreName: workspace,
    complexName: buildComplexName(workspace, fileTableName, crs),
    id: generateNextLayerId(),
    enabled: true,
    nativeCRS: crs,
    mode: FilePlacementMode.GIS
  };

  let crgLayer = buildFileCrgLayer(file, path, generalCrgLayerProps);

  if (!crgLayer) {
    throw new Error('Не удалось подключить слой');
  }

  const process = await placeFileWithProjection(file, currentProject.id, crs, FilePlacementMode.GEOSERVER);
  const processResult = await awaitProcess(Number(process._links.process.href.split('/').at(-1)));

  if (processResult && isPlaceFileProcess(processResult.details)) {
    const details = processResult.details;

    crgLayer = {
      ...crgLayer,
      dataset: details.geoserverPublicationData.storeName,
      nativeName: details.geoserverPublicationData.nativeName
    };
  }

  return crgLayer;
}

function createExternalLayer(formValue: Partial<LayerFormValue>): CrgLayer {
  const { title = '', minZoom, dataSourceUri, resourceId, errorText } = formValue;

  return {
    ...externalLayerDefaults(dataSourceUri),
    id: generateNextLayerId(),
    title,
    dataSourceUri,
    minZoom,
    resourceId,
    errorText
  };
}

function createNspdLayer(formValue: Partial<LayerFormValue>): CrgLayer {
  const option = getNspdKnownLayer(formValue.nspdLayer);

  if (!option) {
    throw new Error('Не указан слой НСПД');
  }

  const { title = option.title, minZoom } = formValue;

  return {
    ...externalLayerDefaults(option.url),
    id: generateNextLayerId(),
    title,
    minZoom,
    resourceId: option.resourceId,
    dataSourceUri: option.url,
    type: CrgLayerType.EXTERNAL_NSPD
  };
}

export const AddLayerDialog: FC<AddLayerDialogProps> = observer(({ open, onClose, onAdd }) => {
  const state = useLocalObservable<AddLayerDialogState>(() => ({
    formValue: getDefaultValues(buildFields({})),

    get valid() {
      return !validateFormValue(this.formValue, this.fields).length;
    },

    get schema() {
      return this.formValue?.datasource?.vectorTable?.schema;
    },

    get views() {
      return this.schema?.views || [];
    },

    get fields() {
      return buildFields(this.formValue);
    },

    handleFormChange(formValue) {
      this.formValue = formValue;
    },

    clearForm() {
      this.formValue = getDefaultValues(this.fields);
    }
  }));

  const close = useCallback(() => {
    state.clearForm();
    onClose();
  }, [onClose, state]);

  const add = useCallback(async () => {
    const { layerType } = state.formValue;

    if (state.valid && (!layerType || layerType === CrgLayerType.VECTOR)) {
      const newCrgLayer = await createVectorLayer(state.formValue, state.views, state.schema);

      onAdd(newCrgLayer);
      state.clearForm();
      close();
    }

    if (state.valid && layerType === CrgLayerType.RASTER && state.formValue.datasource) {
      try {
        onAdd(await createFileLayer(state.formValue));
      } catch (error) {
        Toast.error('Не удалось подключить слой');
        services.logger.error('Не удалось удалить файл: ', (error as AxiosError).message);

        return;
      }

      state.clearForm();
      close();
    }

    if (state.valid && layerType === CrgLayerType.EXTERNAL) {
      onAdd(createExternalLayer(state.formValue));
      state.clearForm();
      close();
    }

    if (state.valid && layerType === CrgLayerType.EXTERNAL_NSPD) {
      onAdd(createNspdLayer(state.formValue));
      state.clearForm();
      close();
    }
  }, [close, onAdd, state]);

  return (
    <FormDialog
      className={cnAddLayerDialog()}
      open={open}
      schema={{ properties: state.fields }}
      actionFunction={add}
      onFormChange={state.handleFormChange}
      actionButtonProps={{ children: 'Добавить' }}
      onClose={close}
      value={state.formValue}
      title='Добавить слой'
    />
  );
});
