import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { ContentCopyOutlined, DeleteOutlined, EditOutlined } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogContentText, Tooltip } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { pluralize } from 'numeralize-ru';
import { AxiosError } from 'axios';

import { isFeaturesUpdateAllowed } from '../../../services/data/permissions.service';
import { copyFeatures, deleteFeatures } from '../../../services/data/data.service';
import { mapSelectionService } from '../../../services/map/map-selection.service';
import { CrgLayer, CrgVectorLayer } from '../../../services/gis/projects.models';
import { EditFeatureMode, sidebars } from '../../../stores/Sidebars.store';
import { MapSelectionTypes, mapStore } from '../../../stores/Map.store';
import { schemaService } from '../../../services/data/schema.service';
import { currentProject } from '../../../stores/CurrentProject.store';
import { WfsFeature } from '../../../services/geoserver/wfs.models';
import { ChooseXTable } from '../../ChooseXTable/ChooseXTable';
import { mapService } from '../../../services/map/map.service';
import { IconButton } from '../../IconButton/IconButton';
import { PageOptions } from '../../../services/models';
import { XTableColumn } from '../../XTable/XTable';
import { Button } from '../../Button/Button';
import { Toast } from '../../Toast/Toast';

import { AttributesBarActionExport } from '../BarActionExport/Attributes-BarActionExport';
import { AttributesTableRecord } from '../Table/Attributes-Table';

import '!style-loader!css-loader!sass-loader!./Attributes-BarActions.scss';

const cnAttributesBarActions = cn('Attributes', 'BarActions');

interface CopyErrors {
  field: string;
  message: string[];
}

interface AttributesBarActionsProps {
  layer: CrgVectorLayer;
  cols: XTableColumn<AttributesTableRecord>[];
  pageOptions: PageOptions;
  featuresTotal: number;
  getData(pageOptions: PageOptions): Promise<[AttributesTableRecord[], number]>;
}

@observer
export class AttributesBarActions extends Component<AttributesBarActionsProps> {
  @observable private multipleCopyDialogOpen = false;
  @observable private multipleDeleteDialogOpen = false;
  @observable private featuresUpdateAllowed = false;
  @observable private multipleCopyTargetLayer: CrgVectorLayer;
  @observable private layersAvailableForCopy: CrgVectorLayer[];
  private operationId: symbol;

  private readonly layerDialogCols: XTableColumn<CrgLayer>[] = [
    {
      field: 'title',
      title: 'Название',
      filterable: true
    }
  ];

  constructor(props: AttributesBarActionsProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount(): Promise<void> {
    await this.init();
  }

  async componentDidUpdate(prevProps: Readonly<AttributesBarActionsProps>): Promise<void> {
    const { layer } = this.props;

    if (prevProps.layer.id !== layer.id) {
      await this.init();
    }
  }

  render() {
    const { layer, cols, pageOptions, featuresTotal, getData } = this.props;
    const count = this.selectedFeatures.length;
    const objLabel = ` ${count} объект${pluralize(count, '', 'а', 'ов')}`;
    const objToOtherLabel = objLabel + ' в другой слой';

    return (
      <div className={cnAttributesBarActions()}>
        {!!count && (
          <>
            {this.featuresUpdateAllowed && (
              <Tooltip title={`Редактировать${objLabel}`}>
                <IconButton size='small' onClick={this.multipleEdit}>
                  <EditOutlined fontSize='small' />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title={`Копировать${objToOtherLabel}`}>
              <IconButton size='small' onClick={this.openMultipleCopyDialog}>
                <ContentCopyOutlined fontSize='small' />
              </IconButton>
            </Tooltip>

            {this.featuresUpdateAllowed && (
              <Tooltip title={`Удалить${objLabel}`}>
                <IconButton size='small' onClick={this.openMultipleDeleteDialog}>
                  <DeleteOutlined fontSize='small' />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}

        {!!featuresTotal && (
          <AttributesBarActionExport
            layer={layer}
            cols={cols}
            pageOptions={pageOptions}
            featuresTotal={featuresTotal}
            getData={getData}
          />
        )}

        <Dialog open={this.multipleDeleteDialogOpen} onClose={this.closeMultipleDeleteDialog}>
          <DialogContent>
            <DialogContentText>Вы действительно хотите удалить {objLabel}?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.multipleDelete} color='primary'>
              Удалить
            </Button>
            <Button onClick={this.closeMultipleDeleteDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={this.multipleCopyDialogOpen} onClose={this.closeMultipleCopyDialog} maxWidth='lg'>
          <DialogContent>
            <DialogContentText>
              Для копирования доступны только слои с тем же типом геометрии, что исходный слой и в той же проекции{' '}
              {layer.nativeCRS}
            </DialogContentText>
            <ChooseXTable<CrgLayer>
              data={this.layersAvailableForCopy}
              cols={this.layerDialogCols}
              onSelect={this.onSelect}
              single
              filterable
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.multipleCopy} color='primary'>
              Копировать
            </Button>
            <Button onClick={this.closeMultipleCopyDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  @computed
  private get selectedFeatures(): WfsFeature[] {
    return mapStore.selectedFeaturesByTableName[this.props.layer.tableName] || [];
  }

  @boundMethod
  private multipleEdit() {
    const features: WfsFeature[] = mapStore.selectedFeaturesByTableName[this.props.layer.tableName];

    sidebars.openEdit({
      features,
      mode: features.length > 1 ? EditFeatureMode.multipleEdit : EditFeatureMode.single
    });
  }

  @boundMethod
  private async multipleDelete() {
    this.closeMultipleDeleteDialog();

    const features: WfsFeature[] = mapStore.selectedFeaturesByTableName[this.props.layer.tableName];
    const { dataset, tableName } = this.props.layer;

    await deleteFeatures(dataset, tableName, features);

    mapSelectionService.selectFeatures(features, MapSelectionTypes.REMOVE);
    mapService.refreshAllLayers();
  }

  @boundMethod
  private async multipleCopy() {
    try {
      const features: WfsFeature[] = mapStore.selectedFeaturesByTableName[this.props.layer.tableName];

      await copyFeatures(this.props.layer, this.multipleCopyTargetLayer, features);
      this.closeMultipleCopyDialog();

      Toast.success(
        `Успешно ${pluralize(features.length, 'скопирован', 'скопировано', 'скопировано')} ${
          features.length
        } ${pluralize(features.length, 'объект', 'объекта', 'объектов')}`
      );
    } catch (error) {
      const err = error as AxiosError<{ errors: CopyErrors[]; message?: string }>;

      Toast.error({
        message: err.response.data.message,
        details: err.response.data.errors.map(item => item.message).join('. ')
      });
    }
  }

  private async fetchAvailableForCopyingLayers() {
    const schemas = await Promise.all(
      currentProject.vectorLayers.map(({ schemaId }) => schemaService.getSchema(schemaId))
    );
    const currentSchema = await schemaService.getSchema(this.props.layer.schemaId);

    const layersUpdatePermissions = [];
    for (const layer of currentProject.vectorLayers) {
      layersUpdatePermissions.push(await isFeaturesUpdateAllowed(layer.dataset, layer.tableName, layer.schemaId));
    }

    this.setLayersAvailableForCopy(
      currentProject.vectorLayers.filter((layer, i) => {
        if (!schemas[i]) {
          return false;
        }

        const { geometryType } = schemas[i];

        return (
          this.props.layer.complexName !== layer.complexName &&
          this.props.layer.nativeCRS === layer.nativeCRS &&
          currentSchema.geometryType === geometryType &&
          layersUpdatePermissions[i]
        );
      })
    );
  }

  private async init() {
    const operationId = Symbol();
    this.operationId = operationId;

    const { layer } = this.props;

    const updateAllowed = await isFeaturesUpdateAllowed(layer.dataset, layer.tableName, layer.schemaId);

    if (this.operationId === operationId) {
      this.setFeaturesUpdateAllowed(updateAllowed);
    }
  }

  @action.bound
  private setLayersAvailableForCopy(layersAvailableForCopy: CrgVectorLayer[]) {
    this.layersAvailableForCopy = layersAvailableForCopy;
  }

  @action.bound
  private onSelect([layer]: CrgVectorLayer[]) {
    this.multipleCopyTargetLayer = layer;
  }

  @action.bound
  private async openMultipleCopyDialog() {
    await this.fetchAvailableForCopyingLayers();
    this.multipleCopyDialogOpen = true;
  }

  @action.bound
  private closeMultipleCopyDialog() {
    this.multipleCopyDialogOpen = false;
  }

  @action.bound
  private openMultipleDeleteDialog() {
    this.multipleDeleteDialogOpen = true;
  }

  @action.bound
  private closeMultipleDeleteDialog() {
    this.multipleDeleteDialogOpen = false;
  }

  @action.bound
  private setFeaturesUpdateAllowed(featuresUpdateAllowed: boolean) {
    this.featuresUpdateAllowed = featuresUpdateAllowed;
  }
}
