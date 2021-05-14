import React, { Component } from 'react';
import GeometryType from 'ol/geom/GeometryType';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ListItemIcon, Menu, MenuItem } from '@material-ui/core';
import {
  AddCircleOutline,
  CropFree,
  Delete,
  DeleteOutline,
  Edit,
  ListAlt,
  UnarchiveOutlined
} from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';
import { BBOX } from '@fiz/geoserver-types/BBOX';

import { sidebars } from '../../../stores/Sidebars.store';
import { currentProject } from '../../../stores/CurrentProject.store';
import { CrgLayer, CrgLayersGroup, CrgLayerType, TreeItemPayload } from '../../../services/crg/projects.models';
import { getProjection, olProjection, transform } from '../../../services/geoserver/projections.service';
import { getFeatureType } from '../../../services/geoserver/featuretypes.service';
import { getLayerCoverage } from '../../../services/geoserver/layers.service';
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
import { EditFeatureMode } from '../../edit-feature/edit-feature.component';

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
    const { open, x, y, onClose, anchor, entity, isGroup, editMode } = this.props;

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
                Импорт объектов из XML
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

          {!isGroup && editMode && this.layersDeleteAllowed && (
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
    this.layersDeleteAllowed = layersDeleteAllowed;
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
    const emptyFeature = await schemaService.getEmptyFeature(entity as CrgLayer);

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
    const { nativeBoundingBox } = await getFeatureType(entity as CrgLayer);

    this.goToBoundingBox(nativeBoundingBox);
  }

  private async goToRasterLayer() {
    const { entity } = this.props;
    const { nativeBoundingBox } = await getLayerCoverage(entity as CrgLayer);
    this.goToBoundingBox(nativeBoundingBox);
  }

  private goToBoundingBox({ maxx, maxy, minx, miny, crs }: BBOX) {
    // https://github.com/FanaticFiz/geoserver-types/pull/1
    // @ts-ignore
    const crsStr = typeof crs === 'string' ? crs : (crs.$ as string);
    const projection = getProjection(crsStr);
    const [x1, y1] = transform(projection, olProjection, [minx, miny]);
    const [x2, y2] = transform(projection, olProjection, [maxx, maxy]);
    mapService.fitToBbox([x1, y1, x2, y2], [50, 50, 50, 50]);
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

  @action.bound
  private editGroup(title: string) {
    this.props.entity.title = title;
  }

  @action.bound
  private async deleteGroup() {
    currentProject.deleteGroup(this.props.entity as CrgLayersGroup);
    this.testAttributesBar();
  }

  @action.bound
  private async deleteLayer() {
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
