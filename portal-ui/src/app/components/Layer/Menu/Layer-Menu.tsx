import React, { Component } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ListItemIcon, Menu, MenuItem } from '@mui/material';
import {
  AddCircleOutline,
  CropFree,
  Delete,
  DeleteOutline,
  Edit,
  ListAlt,
  UnarchiveOutlined
} from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { BBOX } from '@fiz/geoserver-types/BBOX';
import { isEqual } from 'lodash';

import { EditFeatureMode, sidebars } from '../../../stores/Sidebars.store';
import { currentProject } from '../../../stores/CurrentProject.store';
import { CrgLayer, CrgLayersGroup, CrgLayerType, TreeItemPayload } from '../../../services/crg/projects.models';
import { getProjection, olProjection, transform } from '../../../services/geoserver/projections.service';
import { getFeatureType } from '../../../services/geoserver/featuretypes.service';
import { getLayerCoverage } from '../../../services/geoserver/layers.service';
import { GeometryType, WfsFeature } from '../../../services/geoserver/wfs.models';
import { schemaService } from '../../../services/crg/schema.service';
import { exportService } from '../../../services/crg/export.service';
import { mapService } from '../../../services/map/map.service';
import {
  isFeaturesCreateAllowed,
  isTableExportAllowed,
  isLayersManagementAllowed
} from '../../../services/crg/permissions.service';
import { ImportOutlined } from '../../Icons/ImportOutlined';
import { ImportXmlDialog } from '../../ImportXmlDialog/ImportXmlDialog';
import { LayersGroupEditDialog } from '../../LayersGroupEditDialog/LayersGroupEditDialog';
import { Toast } from '../../Toast/Toast';

import { LayerTransparency } from '../Transparency/Layer-Transparency';

interface LayerMenuProps {
  entity: TreeItemPayload;
  open: boolean;
  x: number;
  y: number;
  anchor: HTMLElement;
  onClose: () => void;
  isGroup: boolean;
  editMode: boolean;
  layerWithError: boolean;
}

@observer
export class LayerMenu extends Component<LayerMenuProps> {
  @observable private editGroupDialogOpen = false;
  @observable private featuresCreateAllowed = false;
  @observable private layerExportAllowed = false;
  @observable private layersDeleteAllowed = false;
  @observable private geometryType?: GeometryType;
  @observable private importXmlDialogOpen = false;

  async componentDidMount() {
    await this.fetchGeometryType();
    await this.fetchPermissions();
  }

  render() {
    const { open, x, y, onClose, anchor, entity, isGroup, editMode, layerWithError } = this.props;

    return (
      <>
        <Menu
          open={open}
          anchorReference={anchor ? 'anchorEl' : 'anchorPosition'}
          anchorEl={anchor}
          anchorPosition={{ top: y, left: x }}
          onClose={onClose}
        >
          <MenuItem disableRipple>
            <LayerTransparency entity={entity} />
          </MenuItem>

          {!editMode && this.isVectorLayer && (
            <MenuItem onClick={this.openAttributeTable}>
              <ListItemIcon>
                <ListAlt />
              </ListItemIcon>
              Открыть таблицу атрибутов
            </MenuItem>
          )}

          {!editMode && this.isVectorLayer && this.featuresCreateAllowed && (
            <MenuItem onClick={this.addFeature}>
              <ListItemIcon>
                <AddCircleOutline />
              </ListItemIcon>
              Добавить объект
            </MenuItem>
          )}

          {!editMode && (this.isVectorLayer || this.isRasterLayer) && (
            <MenuItem onClick={this.goToLayer}>
              <ListItemIcon>
                <CropFree />
              </ListItemIcon>
              Перейти к слою
            </MenuItem>
          )}

          {!editMode &&
            this.isVectorLayer &&
            this.featuresCreateAllowed &&
            this.geometryType === GeometryType.MULTI_POLYGON && (
              <MenuItem onClick={this.openImportXmlDialog}>
                <ListItemIcon>
                  <ImportOutlined />
                </ListItemIcon>
                Импорт межевого плана из XML
              </MenuItem>
            )}

          {!editMode && this.isVectorLayer && this.layerExportAllowed && (
            <MenuItem onClick={this.export}>
              <ListItemIcon>
                <UnarchiveOutlined />
              </ListItemIcon>
              Экспорт ESRI Shape-файл
            </MenuItem>
          )}

          {((!isGroup && layerWithError) || (!isGroup && editMode && this.layersDeleteAllowed)) && (
            <MenuItem onClick={this.deleteLayer}>
              <ListItemIcon>
                <DeleteOutline />
              </ListItemIcon>
              Удалить слой
            </MenuItem>
          )}

          {isGroup && editMode && (
            <MenuItem onClick={this.openEditGroupDialog}>
              <ListItemIcon>
                <Edit />
              </ListItemIcon>
              Переименовать группу
            </MenuItem>
          )}

          {isGroup && editMode && (
            <MenuItem onClick={this.deleteGroup}>
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              Удалить группу
            </MenuItem>
          )}
        </Menu>

        <LayersGroupEditDialog
          open={this.editGroupDialogOpen}
          onClose={this.closeEditGroupDialog}
          title={entity.title}
          onEdit={this.editGroup}
        />
        {!editMode &&
          this.isVectorLayer &&
          this.featuresCreateAllowed &&
          this.geometryType === GeometryType.MULTI_POLYGON && (
            <ImportXmlDialog
              open={this.importXmlDialogOpen}
              onClose={this.closeImportXmlDialog}
              datasetId={(entity as CrgLayer).dataset}
              tableId={(entity as CrgLayer).tableName}
              complexName={(entity as CrgLayer).complexName}
            />
          )}
      </>
    );
  }

  @computed
  private get isVectorLayer(): boolean {
    const { entity, isGroup } = this.props;

    return !isGroup && (entity as CrgLayer).type === CrgLayerType.VECTOR;
  }

  @computed
  private get isRasterLayer(): boolean {
    const { entity, isGroup } = this.props;

    return !isGroup && (entity as CrgLayer).type === CrgLayerType.RASTER;
  }

  private async fetchPermissions() {
    const { entity, isGroup } = this.props;

    if (isGroup) {
      return;
    }

    const { dataset, tableName, schemaId, type } = entity as CrgLayer;

    if (type === CrgLayerType.RASTER) {
      this.setLayersDeleteAllowed(isLayersManagementAllowed());

      return;
    }

    if (type !== CrgLayerType.VECTOR) {
      return;
    }

    const allowed = await Promise.all([
      isFeaturesCreateAllowed(dataset, tableName, schemaId),
      isTableExportAllowed(dataset, tableName),
      isLayersManagementAllowed()
    ]);

    this.setPermissions(...allowed);
  }

  @action
  private setPermissions(featuresCreateAllowed: boolean, layerExportAllowed: boolean, layersDeleteAllowed: boolean) {
    this.featuresCreateAllowed = featuresCreateAllowed;
    this.layerExportAllowed = layerExportAllowed;
    this.setLayersDeleteAllowed(layersDeleteAllowed);
  }

  @boundMethod
  private openAttributeTable() {
    const { entity, onClose } = this.props;

    sidebars.openAttributes(entity as CrgLayer);

    onClose();
  }

  @boundMethod
  private async addFeature() {
    const { entity, onClose } = this.props;
    const emptyFeature = (await schemaService.getEmptyFeature(entity as CrgLayer)) as WfsFeature;
    sidebars.openEdit({
      features: [emptyFeature],
      mode: EditFeatureMode.single,
      layer: entity as CrgLayer,
      isNew: true
    });

    onClose();
  }

  @boundMethod
  private async goToLayer() {
    if (this.isVectorLayer) {
      await this.goToVectorLayer();
    }
    if (this.isRasterLayer) {
      await this.goToRasterLayer();
    }
    this.props.onClose();
  }

  private async goToVectorLayer() {
    const { entity } = this.props;
    try {
      const { nativeBoundingBox } = await getFeatureType(entity as CrgLayer);
      this.goToBoundingBox(nativeBoundingBox);
    } catch {
      this.showGoToBoundingBoxError();
    }
  }

  private async goToRasterLayer() {
    const { entity } = this.props;
    try {
      const { nativeBoundingBox } = await getLayerCoverage(entity as CrgLayer);
      this.goToBoundingBox(nativeBoundingBox);
    } catch {
      this.showGoToBoundingBoxError();
    }
  }

  private goToBoundingBox({ maxx, maxy, minx, miny, crs }: BBOX) {
    const crsStr = typeof crs === 'string' ? crs : crs.$;
    const projection = getProjection(crsStr);

    if (isEqual([maxx, maxy, minx, miny], [-1, -1, 0, 0])) {
      this.showGoToBoundingBoxError();

      return;
    }

    const [x1, y1] = transform(projection, olProjection, [minx, miny]);
    const [x2, y2] = transform(projection, olProjection, [maxx, maxy]);

    if (Number.isNaN(x1) || Number.isNaN(x2) || Number.isNaN(y1) || Number.isNaN(y2)) {
      this.showGoToBoundingBoxError();

      return;
    }

    mapService.fitToBbox([x1, y1, x2, y2], [50, 50, 50, 50]);
  }

  private showGoToBoundingBoxError() {
    const message = 'Не удалось перейти к слою';
    Toast.warn(message);
    Toast.error({ message, suppress: true });
  }

  @boundMethod
  private async export() {
    const { entity, onClose } = this.props;
    const { dataset, tableName, schemaId } = entity as CrgLayer;

    await exportService.exportAsShape([{ dataset, table: tableName, schemaId }]);
    sidebars.openInfo();

    onClose();
  }

  private async fetchGeometryType() {
    const { entity } = this.props;
    if (this.isVectorLayer) {
      const { schemaId } = entity as CrgLayer;
      const schema = await schemaService.getSchema(schemaId);
      this.setGeometryType(schema.geometryType);
    }
  }

  @action.bound
  private openEditGroupDialog() {
    this.editGroupDialogOpen = true;
    this.props.onClose();
  }

  @action.bound
  private closeEditGroupDialog() {
    this.editGroupDialogOpen = false;
  }

  @action.bound
  private openImportXmlDialog() {
    this.importXmlDialogOpen = true;
    this.props.onClose();
  }

  @action.bound
  private closeImportXmlDialog() {
    this.importXmlDialogOpen = false;
  }

  @action
  private setGeometryType(geometryType: GeometryType) {
    this.geometryType = geometryType;
  }

  @action
  private setLayersDeleteAllowed(layersDeleteAllowed: boolean) {
    this.layersDeleteAllowed = layersDeleteAllowed;
  }

  @action.bound
  private editGroup(title: string) {
    this.props.entity.title = title;
  }

  @action.bound
  private deleteGroup() {
    currentProject.deleteGroup(this.props.entity as CrgLayersGroup);
    this.testAttributesBar();
  }

  @action.bound
  private deleteLayer() {
    const layer = this.props.entity as CrgLayer;
    currentProject.deleteLayer(layer);
    this.testAttributesBar();
  }

  private testAttributesBar() {
    if (sidebars.attributesOpen && !currentProject.layers.some(({ id }) => sidebars.layerForAttributes.id === id)) {
      sidebars.closeAttributes();
    }
  }
}
