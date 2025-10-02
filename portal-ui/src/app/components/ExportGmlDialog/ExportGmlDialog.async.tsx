import React, { FC, useCallback, useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { cn } from '@bem-react/classname';

import { ExportResourceModel } from '../../services/data/export/export.models';
import { exportVectorTableAsGML } from '../../services/data/export/export.service';
import { Projection } from '../../services/data/projections/projections.models';
import { getProjectionCode } from '../../services/data/projections/projections.util';
import { getVectorTable } from '../../services/data/vectorData/vectorData.service';
import { CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { currentProject } from '../../stores/CurrentProject.store';
import { projectionsStore } from '../../stores/Projections.store';
import { sidebars } from '../../stores/Sidebars.store';
import { ActionsLeft } from '../ActionsLeft/ActionsLeft';
import { ActionsRight } from '../ActionsRight/ActionsRight';
import { Button } from '../Button/Button';
import { CoordinateAxes } from '../CoordinateAxes/CoordinateAxes';
import { Form } from '../Form/Form';
import { LayersList } from '../LayersList/LayersList';
import { Loading } from '../Loading/Loading';
import { SelectProjection } from '../SelectProjection/SelectProjection';
import { Toast } from '../Toast/Toast';

import '!style-loader!css-loader!sass-loader!./ExportGmlDialog.scss';

const cnExportGmlDialog = cn('ExportGmlDialog');

interface SpatialPlanningSchema {
  value: string;
  title: string;
}

const knownSchemas: SpatialPlanningSchema[] = [
  {
    value: 'Doc.20201010000',
    title: 'Проекты генеральных планов поселений и генеральных планов городских округов'
  },
  {
    value: 'Doc.20204010000',
    title: 'Генеральные планы поселений и генеральные планы городских округов'
  },
  {
    value: 'Doc.20201010314',
    title: 'Наша дополненная схема'
  },
  {
    value: 'Doc.20201010315',
    title: 'Проекты генеральных планов поселений и генеральных планов городских округов с зонами'
  }
];

export interface ExportGmlDialogProps {
  open: boolean;
  onClose(): void;
}

const filterLayersWidthOrderTags = async (): Promise<CrgVectorLayer[]> => {
  const filteredLayers: CrgVectorLayer[] = [];

  for (const layer of currentProject.vectorLayers) {
    try {
      const vectorTable = await getVectorTable(layer.dataset, layer.tableName);
      const hasOrderTag = vectorTable.schema.tags?.some(
        tag => typeof tag === 'string' && tag.toLowerCase().includes('приказ')
      );

      if (hasOrderTag) {
        filteredLayers.push(layer);
      }
    } catch {
      Toast.warn(`Ошибка при получении схемы для слоя ${layer.tableName}:`);
    }
  }

  return filteredLayers;
};

export const ExportGmlDialog: FC<ExportGmlDialogProps> = observer(({ open, onClose }) => {
  const state = useLocalObservable(() => ({
    selectedLayers: [] as CrgVectorLayer[],
    selectedSchema: '',
    invertedCoordinates: false,
    projection: undefined as Projection | undefined,
    filteredLayers: [] as CrgVectorLayer[],
    busy: false,

    setSelectedLayers(layers: CrgVectorLayer[]): void {
      this.selectedLayers = layers;
    },

    setSelectedSchema(schema: string): void {
      this.selectedSchema = schema;
    },

    setInvertedCoordinates(inverted: boolean): void {
      this.invertedCoordinates = inverted;
    },

    setProjection(projection: Projection): void {
      this.projection = projection;
    },

    setFilteredLayers(layers: CrgVectorLayer[]): void {
      this.filteredLayers = layers;
    },

    setBusy(busy: boolean): void {
      this.busy = busy;
    },

    reset(): void {
      this.selectedLayers = [];
      this.selectedSchema = '';
      this.filteredLayers = [];
      this.busy = false;
    }
  }));

  const {
    selectedLayers,
    selectedSchema,
    invertedCoordinates,
    projection,
    filteredLayers,
    busy,
    setSelectedLayers,
    setSelectedSchema,
    setInvertedCoordinates,
    setProjection,
    setFilteredLayers,
    setBusy,
    reset
  } = state;

  useEffect(() => {
    if (projectionsStore.defaultProjection) {
      setProjection(projectionsStore.defaultProjection);
    }
  }, [setProjection]);

  const handleSelect = useCallback(
    (inverted: boolean) => {
      setInvertedCoordinates(inverted);
    },
    [setInvertedCoordinates]
  );

  const exportNotAllowed = !selectedSchema || !selectedLayers.length;

  const onSelectLayers = useCallback(
    (layers: CrgVectorLayer[]) => {
      setSelectedLayers(layers);
    },
    [setSelectedLayers]
  );

  const handleSchemaChange = useCallback(
    (e: SelectChangeEvent) => {
      setSelectedSchema(e.target.value);
    },
    [setSelectedSchema]
  );

  const closeDialog = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const handleSetProjection = useCallback(
    (projection: Projection) => {
      setProjection(projection);
    },
    [setProjection]
  );

  const executeExport = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const resources: ExportResourceModel[] = selectedLayers.map(layer => {
        return {
          dataset: layer.dataset,
          table: layer.tableName
        };
      });

      if (projection) {
        await exportVectorTableAsGML(selectedSchema, resources, getProjectionCode(projection), invertedCoordinates);
      }

      closeDialog();
      sidebars.openInfo();
    },
    [selectedSchema, selectedLayers, projection, invertedCoordinates, closeDialog]
  );

  useEffect(() => {
    const loadFilteredLayers = async () => {
      setBusy(true);
      const filteredLayers = await filterLayersWidthOrderTags();

      setFilteredLayers(filteredLayers);
      setBusy(false);
    };

    if (open) {
      void loadFilteredLayers();
    }
  }, [open]);

  return (
    <Dialog className={cnExportGmlDialog()} maxWidth={'md'} fullWidth open={open}>
      <DialogTitle className={cnExportGmlDialog('Title')}>
        <span>Экспорт в ГМЛ по Приказу 10</span>
        <div className={cnExportGmlDialog('Total')}>Всего выбрано: {selectedLayers.length}</div>
      </DialogTitle>

      <DialogContent>
        <Form className={cnExportGmlDialog('Form')} id='exportGmlForm' onSubmit={executeExport}>
          <InputLabel id='schema-select-id'>Схемы территориального планирования</InputLabel>
          <Select
            className={cnExportGmlDialog('SchemaSelector')}
            labelId='schema-select-id'
            value={selectedSchema}
            onChange={handleSchemaChange}
            variant='standard'
          >
            {knownSchemas.map(schema => (
              <MenuItem key={schema.value} value={schema.value}>
                {schema.title}
              </MenuItem>
            ))}
          </Select>
        </Form>

        <Loading visible={busy} />
        <LayersList layers={filteredLayers} onSelect={onSelectLayers} />
      </DialogContent>

      <DialogActions>
        <ActionsLeft>
          <CoordinateAxes onSelect={handleSelect} invertedCoordinates={invertedCoordinates} />
          <SelectProjection value={projection} onChange={handleSetProjection} />
        </ActionsLeft>

        <ActionsRight>
          <Button type='submit' form='exportGmlForm' color='primary' disabled={exportNotAllowed}>
            Экспорт
          </Button>
          <Button onClick={closeDialog}>Отмена</Button>
        </ActionsRight>
      </DialogActions>
    </Dialog>
  );
});

export default ExportGmlDialog;
