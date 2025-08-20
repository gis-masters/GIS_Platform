import React, { FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Geometry } from 'jsts/org/locationtech/jts/geom';
import GeometryFactory from 'jsts/org/locationtech/jts/geom/GeometryFactory';
import { GeoJSONReader, GeoJSONWriter } from 'jsts/org/locationtech/jts/io';
import { BufferOp } from 'jsts/org/locationtech/jts/operation/buffer';
import { cloneDeep } from 'lodash';

import { PropertyType, SimpleSchema } from '../../services/data/schema/schema.models';
import { WfsFeature, WfsMultiPolygonGeometry } from '../../services/geoserver/wfs/wfs.models';
import { getEmptyFeature } from '../../services/geoserver/wfs/wfs.service';
import { CrgLayer, CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { EditFeatureMode } from '../../services/map/a-map-mode/edit-feature/EditFeature.models';
import { mapModeManager } from '../../services/map/a-map-mode/MapModeManager';
import { mapDrawService } from '../../services/map/draw/map-draw.service';
import { MapMode } from '../../services/map/map.models';
import { FormDialog } from '../FormDialog/FormDialog';
import { SelectSuitableLayerDialog } from '../SelectSuitableLayerDialog/SelectSuitableLayerDialog';
import { Toast } from '../Toast/Toast';

const cnCreateBufferDialog = cn('CreateBufferDialog');

interface CreateBufferDialogProps {
  open: boolean;
  layer: CrgLayer;
  feature: WfsFeature;
  onClose(): void;
}

interface BufferForm {
  buffer: number;
  layer: CrgLayer;
}

export const CreateBufferDialog: FC<CreateBufferDialogProps> = observer(({ open, layer, feature, onClose }) => {
  const createBuffer = useCallback(
    async (formValue: BufferForm) => {
      if (!(formValue.layer?.dataset && formValue.layer?.tableName)) {
        return;
      }

      const reader = new GeoJSONReader(new GeometryFactory());
      const writer = new GeoJSONWriter();
      const geom = BufferOp.bufferOp(reader.read(feature.geometry), formValue.buffer) as Geometry;
      const featureWithBuffer = { ...cloneDeep(feature), geometry: writer.write(geom) as WfsMultiPolygonGeometry };
      const emptyFeature = await getEmptyFeature(formValue.layer as CrgVectorLayer);
      featureWithBuffer.id = emptyFeature.id;
      featureWithBuffer.properties = emptyFeature.properties;

      if (!featureWithBuffer.geometry.coordinates[0].length) {
        Toast.warn('Буфер не создан: внутренний отступ слишком большой.');

        return;
      }

      await mapModeManager.changeMode(
        MapMode.DRAW_FEATURE,
        {
          payload: {
            features: [featureWithBuffer],
            mode: EditFeatureMode.single,
            layer: formValue.layer as CrgVectorLayer
          }
        },
        'add buffer'
      );

      // TODO: "режим" сам должен принимать решение, что подсвечивать
      void mapDrawService.reDrawFeatures([featureWithBuffer]);
    },
    [feature]
  );

  const schema: SimpleSchema = {
    properties: [
      {
        propertyType: PropertyType.CUSTOM,
        name: 'layer',
        required: true,
        title: 'Слой',
        description: 'Слой, в котором будет создана буферная зона',
        ControlComponent: props => {
          return <SelectSuitableLayerDialog {...props} currentLayer={layer} feature={feature} />;
        }
      },
      {
        name: 'buffer',
        title: 'Размер буферной зоны (метры)',
        required: true,
        defaultValue: 10,
        maxValue: 100_000,
        minValue: -100_000,
        propertyType: PropertyType.INT
      }
    ]
  };

  return (
    <FormDialog<BufferForm>
      className={cnCreateBufferDialog()}
      open={open}
      onClose={onClose}
      title='Создание буфера'
      actionFunction={createBuffer}
      schema={schema}
      actionButtonProps={{ children: 'Создать' }}
    />
  );
});
