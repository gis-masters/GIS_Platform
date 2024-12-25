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
import { mapDrawService } from '../../services/map/draw/map-draw.service';
import { EditFeatureMode, sidebars } from '../../stores/Sidebars.store';
import { FormDialog } from '../FormDialog/FormDialog';
import { SelectSuitableLayerDialog } from '../SelectSuitableLayerDialog/SelectSuitableLayerDialog';

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

      sidebars.closeEdit();

      const reader = new GeoJSONReader(new GeometryFactory());
      const writer = new GeoJSONWriter();
      const geom = BufferOp.bufferOp(reader.read(feature.geometry), formValue.buffer) as Geometry;
      const featureWithBuffer = { ...cloneDeep(feature), geometry: writer.write(geom) as WfsMultiPolygonGeometry };
      const emptyFeature = (await getEmptyFeature(formValue.layer as CrgVectorLayer)) as WfsFeature;
      featureWithBuffer.id = emptyFeature.id;
      featureWithBuffer.properties = emptyFeature.properties;

      sidebars.openEdit({
        features: [featureWithBuffer],
        mode: EditFeatureMode.single,
        layer: formValue.layer as CrgVectorLayer,
        isNew: true
      });

      void mapDrawService.highlightFeatures([featureWithBuffer]);
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
      closeWithConfirm
      title='Создание буфера'
      actionFunction={createBuffer}
      schema={schema}
      actionButtonProps={{ children: 'Создать' }}
    />
  );
});
