import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, ListItemIcon, Menu, MenuItem } from '@mui/material';
import {
  AddCircleOutline,
  CropFree,
  Delete,
  DeleteOutline,
  Edit,
  FileOpenOutlined,
  ListAlt,
  TuneOutlined,
  UnarchiveOutlined
} from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { communicationService, DataChangeEventDetail } from '../../../services/communication.service';
import { LibraryRecord } from '../../../services/data/library/library.models';
import { getLibraryRecord } from '../../../services/data/library/library.service';
import { Projection } from '../../../services/data/projections/projections.models';
import { Schema } from '../../../services/data/schema/schema.models';
import { VectorTable } from '../../../services/data/vectorData/vectorData.models';
import { getVectorTable } from '../../../services/data/vectorData/vectorData.service';
import { GeometryType } from '../../../services/geoserver/wfs/wfs.models';
import { getEmptyFeature } from '../../../services/geoserver/wfs/wfs.service';
import { exportShape } from '../../../services/gis/export/export.service';
import {
  CrgLayer,
  CrgLayersGroup,
  CrgLayerType,
  CrgRasterLayer,
  CrgVectorLayer
} from '../../../services/gis/layers/layers.models';
import { getLayerSchema } from '../../../services/gis/layers/layers.service';
import { isVectorFromFile } from '../../../services/gis/layers/layers.utils';
import { TreeItemPayload } from '../../../services/gis/projects/projects.models';
import { projectsService } from '../../../services/gis/projects/projects.service';
import { EditFeatureMode } from '../../../services/map/a-map-mode/edit-feature/EditFeature.models';
import { mapModeManager } from '../../../services/map/a-map-mode/MapModeManager';
import { MapAction, MapMode, MapSelectionTypes, ToolMode } from '../../../services/map/map.models';
import {
  isLayersManagementAllowed,
  isShapeImportAllowed,
  isTableExportAllowed,
  isUpdateAllowed
} from '../../../services/permissions/permissions.service';
import { services } from '../../../services/services';
import { focusToLayer } from '../../../services/sidebarActions.service';
import { currentProject } from '../../../stores/CurrentProject.store';
import { mapStore } from '../../../stores/Map.store';
import { Button } from '../../Button/Button';
import { EditLayerDialog } from '../../EditLayerDialog/EditLayerDialog';
import { ImportOutlined } from '../../Icons/ImportOutlined';
import { ImportShapeDialog } from '../../ImportShapeDialog/ImportShapeDialog';
import { ImportXmlDialog } from '../../ImportXmlDialog/ImportXmlDialog';
import { LayersGroupEditDialog } from '../../LayersGroupEditDialog/LayersGroupEditDialog';
import { LibraryDocumentDialog } from '../../LibraryDocumentDialog/LibraryDocumentDialog';
import { MenuNestedItem } from '../../MenuNestedItem/MenuNestedItem';
import { SelectProjectionDialog } from '../../SelectProjectionDialog/SelectProjectionDialog';
import { Toast } from '../../Toast/Toast';
import { VectorTableCard } from '../../VectorTableCard/VectorTableCard';
import { LayerTransparency } from '../Transparency/Layer-Transparency';

const cnLayerMenu = cn('Layer', 'Menu');

interface LayerMenuProps {
  entity: TreeItemPayload;
  open: boolean;
  x: number;
  y: number;
  isGroup: boolean;
  editMode: boolean;
  layerWithError: boolean;
  anchor?: HTMLElement;
  onClose(): void;
}

@observer
export class LayerMenu extends Component<LayerMenuProps> {
  @observable private editGroupDialogOpen = false;
  @observable private featuresCreateAllowed = false;
  @observable private layerExportAllowed = false;
  @observable private layersDeleteAllowed = false;
  @observable private geometryType?: GeometryType;
  @observable private selectProjectionDialogOpen = false;
  @observable private importXmlDialogOpen = false;
  @observable private importShapeDialogOpen = false;
  @observable private importShapeAllowed = false;
  @observable private rasterDocument?: LibraryRecord;
  @observable private vectorTable?: VectorTable;
  @observable private schema?: Schema;
  @observable private dialogOpen = false;
  @observable private layerEditDialogOpen = false;

  constructor(props: LayerMenuProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    const { layerWithError } = this.props;

    if (!layerWithError) {
      await this.fetchGeometryType();
      await this.fetchPermissions();
    }

    this.setLayersDeleteAllowed(isLayersManagementAllowed());

    communicationService.libraryRecordUpdated.on(async (e: CustomEvent<DataChangeEventDetail<LibraryRecord>>) => {
      const { data } = e.detail;

      if (data.id === this.rasterDocument?.id) {
        await this.updateDocument(data);
      }
    }, this);
  }

  render() {
    const { open, x, y, anchor, entity, isGroup, onClose, editMode, layerWithError } = this.props;

    return (
      <>
        <Menu
          PaperProps={{ className: cnLayerMenu() }}
          open={open}
          anchorReference={anchor ? 'anchorEl' : 'anchorPosition'}
          anchorEl={anchor}
          anchorPosition={{ top: y, left: x }}
          onClose={onClose}
        >
          {!layerWithError && (
            <>
              <MenuItem disableRipple>
                <LayerTransparency entity={entity} />
              </MenuItem>

              {!editMode && (this.isVectorLayer || this.isVectorFromFileWithPaginationLayer) && (
                <MenuItem
                  onClick={this.openAttributeTable}
                  disabled={!mapStore.allowedActions.includes(MapAction.OPEN_ATTRIBUTE_TABLE)}
                >
                  <ListItemIcon>
                    <ListAlt />
                  </ListItemIcon>
                  Открыть таблицу атрибутов
                </MenuItem>
              )}

              {!editMode && this.isVectorLayer && this.featuresCreateAllowed && (
                <MenuItem onClick={this.addFeature} disabled={!mapStore.allowedActions.includes(MapAction.ADD_FEATURE)}>
                  <ListItemIcon>
                    <AddCircleOutline />
                  </ListItemIcon>
                  Добавить объект
                </MenuItem>
              )}

              {!editMode && (this.isVectorLayer || this.isRasterLayer || this.isVectorFromFileLayer) && (
                <MenuItem onClick={this.goToLayer}>
                  <ListItemIcon>
                    <CropFree />
                  </ListItemIcon>
                  Перейти к слою
                </MenuItem>
              )}
            </>
          )}
          {!editMode && this.isVectorLayer && this.isVectorTableInfoEnabled && (
            <MenuItem
              onClick={this.getLayerVectorTable}
              disabled={!mapStore.allowedActions.includes(MapAction.OPEN_LAYER_SOURCE)}
            >
              <ListItemIcon>
                <FileOpenOutlined />
              </ListItemIcon>
              Источник данных
            </MenuItem>
          )}

          {!editMode && (this.isVectorFromFileLayer || this.isRasterLayer) && this.isDocumentInfoEnabled && (
            <MenuItem
              onClick={this.getLayerDocument}
              disabled={!mapStore.allowedActions.includes(MapAction.OPEN_LAYER_SOURCE)}
            >
              <ListItemIcon>
                <FileOpenOutlined />
              </ListItemIcon>
              Источник данных
            </MenuItem>
          )}
          {!layerWithError && (
            <>
              {!editMode && this.isVectorLayer && this.featuresCreateAllowed && (
                <MenuNestedItem
                  parentMenuOpen={open}
                  disabled={!mapStore.allowedActions.includes(MapAction.OPEN_IMPORTS_SUBMENU)}
                  submenu={[
                    (this.geometryType === GeometryType.MULTI_POLYGON ||
                      this.geometryType === GeometryType.POLYGON) && (
                      <MenuItem key='xml' onClick={this.openImportXmlDialog}>
                        Импорт межевого плана из XML
                      </MenuItem>
                    ),
                    this.importShapeAllowed && (
                      <MenuItem key='shp' onClick={this.openImportShapeDialog}>
                        Импорт из Shape-файла
                      </MenuItem>
                    )
                  ]}
                  icon={<ImportOutlined />}
                  title='Импорт'
                />
              )}

              {!editMode && this.isVectorLayer && this.layerExportAllowed && (
                <MenuItem
                  onClick={this.openSelectProjectionDialog}
                  disabled={!mapStore.allowedActions.includes(MapAction.EXPORT_SHP)}
                >
                  <ListItemIcon>
                    <UnarchiveOutlined />
                  </ListItemIcon>
                  Экспорт ESRI Shape-файл
                </MenuItem>
              )}
            </>
          )}
          {!isGroup && (
            <MenuItem
              onClick={this.openLayerEditDialog}
              disabled={!mapStore.allowedActions.includes(MapAction.OPEN_LAYER_PROPERTIES)}
            >
              <ListItemIcon>
                <TuneOutlined />
              </ListItemIcon>
              Свойства
            </MenuItem>
          )}

          {((!isGroup && layerWithError) || (!isGroup && editMode && this.layersDeleteAllowed)) && (
            <MenuItem onClick={this.deleteLayer} disabled={!mapStore.allowedActions.includes(MapAction.DELETE_LAYER)}>
              <ListItemIcon>
                <DeleteOutline color='error' />
              </ListItemIcon>
              Удалить слой
            </MenuItem>
          )}

          {isGroup && editMode && (
            <MenuItem
              onClick={this.openEditGroupDialog}
              disabled={!mapStore.allowedActions.includes(MapAction.RENAME_LAYER_GROUP)}
            >
              <ListItemIcon>
                <Edit />
              </ListItemIcon>
              Переименовать группу
            </MenuItem>
          )}

          {isGroup && editMode && (
            <MenuItem onClick={this.deleteGroup} disabled={!mapStore.allowedActions.includes(MapAction.DELETE_GROUP)}>
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
          (this.geometryType === GeometryType.MULTI_POLYGON || this.geometryType === GeometryType.POLYGON) && (
            <ImportXmlDialog
              open={this.importXmlDialogOpen}
              onClose={this.closeImportXmlDialog}
              datasetId={(entity as CrgVectorLayer).dataset}
              tableId={(entity as CrgVectorLayer).tableName}
              complexName={(entity as CrgLayer).complexName}
            />
          )}

        {!editMode && this.isVectorLayer && (
          <ImportShapeDialog
            open={this.importShapeDialogOpen}
            onClose={this.closeImportShapeDialog}
            datasetId={(entity as CrgVectorLayer).dataset}
            tableId={(entity as CrgVectorLayer).tableName}
          />
        )}

        {this.vectorTable && (
          <Dialog open={this.dialogOpen} onClose={this.closeDialog} fullWidth maxWidth='md'>
            <DialogTitle>{entity.title}</DialogTitle>
            <DialogContent>
              <VectorTableCard vectorTable={this.vectorTable} />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeDialog}>Закрыть</Button>
            </DialogActions>
          </Dialog>
        )}

        {!editMode && this.isVectorLayer && (
          <SelectProjectionDialog
            open={this.selectProjectionDialogOpen}
            onSelect={this.export}
            defaultCrs={(entity as CrgVectorLayer).nativeCRS}
            onClose={this.closeSelectProjectionDialog}
          />
        )}

        {this.rasterDocument && (
          <LibraryDocumentDialog document={this.rasterDocument} open={this.dialogOpen} onClose={this.closeDialog} />
        )}

        {!isGroup && (
          <EditLayerDialog
            open={this.layerEditDialogOpen}
            onClose={this.closeLayerEditDialog}
            schema={this.schema}
            layer={entity}
            geometryType={this.geometryType}
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
  private get isVectorFromFileLayer(): boolean {
    const { entity, isGroup } = this.props;
    const { type } = entity as CrgLayer;

    if (!type) {
      return false;
    }

    return !isGroup && isVectorFromFile(type);
  }

  @computed
  private get isVectorFromFileWithPaginationLayer(): boolean {
    const { entity, isGroup } = this.props;
    const { type } = entity as CrgLayer;

    if (!type) {
      return false;
    }

    return !isGroup && type === CrgLayerType.SHP;
  }

  @computed
  private get isRasterLayer(): boolean {
    const { entity, isGroup } = this.props;

    return !isGroup && (entity as CrgLayer).type === CrgLayerType.RASTER;
  }

  @computed
  private get isDocumentInfoEnabled(): boolean {
    const { libraryId, recordId } = this.props.entity as CrgRasterLayer;

    return !!(libraryId && recordId);
  }

  @computed
  private get isVectorTableInfoEnabled(): boolean {
    const { dataset, tableName } = this.props.entity as CrgVectorLayer;

    return !!(dataset && tableName);
  }

  private async fetchPermissions() {
    if (this.isVectorLayer) {
      const { dataset, tableName } = this.props.entity as CrgVectorLayer;
      const allowed = await Promise.all([
        isUpdateAllowed(this.props.entity),
        isShapeImportAllowed(dataset, tableName),
        isTableExportAllowed(dataset, tableName),
        isLayersManagementAllowed()
      ]);

      this.setPermissions(...allowed);
    }
  }

  @action
  private setPermissions(
    featuresCreateAllowed: boolean,
    importShapeAllowed: boolean,
    layerExportAllowed: boolean,
    layersDeleteAllowed: boolean
  ) {
    this.featuresCreateAllowed = featuresCreateAllowed;
    this.importShapeAllowed = importShapeAllowed;
    this.layerExportAllowed = layerExportAllowed;
    this.setLayersDeleteAllowed(layersDeleteAllowed);
  }

  @boundMethod
  private async openAttributeTable() {
    const { entity, onClose } = this.props;
    const layer = entity as CrgVectorLayer;

    const isHealthy = await projectsService.checkLayerHealthy(layer);
    if (!isHealthy) {
      return;
    }

    communicationService.openAttributesBar.emit(layer);

    onClose();
  }

  @boundMethod
  private async addFeature() {
    const { entity, onClose } = this.props;
    const emptyFeature = await getEmptyFeature(entity as CrgVectorLayer);

    mapStore.setToolMode(ToolMode.NONE);

    await mapModeManager.changeMode(
      MapMode.SELECTED_FEATURES,
      {
        payload: {
          features: [emptyFeature],
          type: MapSelectionTypes.ADD
        }
      },
      'addFeature 1.1'
    );

    await mapModeManager.changeMode(
      MapMode.DRAW_FEATURE,
      {
        payload: {
          features: [emptyFeature],
          mode: EditFeatureMode.single,
          layer: entity as CrgVectorLayer
        }
      },
      'addFeature 1.2'
    );

    onClose();
  }

  @boundMethod
  private async goToLayer() {
    const layer = this.props.entity as CrgVectorLayer;

    const isHealthy = await projectsService.checkLayerHealthy(layer);
    if (!isHealthy) {
      return;
    }

    await focusToLayer(layer);
    this.props.onClose();
  }

  @boundMethod
  private async export(projection: Projection) {
    const { entity, onClose } = this.props;
    const { complexName, title } = entity as CrgVectorLayer;

    if (!complexName) {
      Toast.error('Некорректный слой: отсутствует complexName');
      onClose();

      return;
    }

    await exportShape(complexName, projection, title);

    onClose();
  }

  private async fetchGeometryType() {
    if (this.isVectorLayer || this.isVectorFromFileLayer) {
      const schema = await getLayerSchema(this.props.entity as CrgVectorLayer);

      if (schema) {
        this.setSchema(schema);
        this.setGeometryType(schema.geometryType);
      }
    }
  }

  private async updateDocument(record: LibraryRecord) {
    const { libraryTableName, id } = record;

    await this.setDocument(libraryTableName, id);
  }

  @boundMethod
  private async getLayerDocument() {
    await this.setDocument(
      (this.props.entity as CrgRasterLayer).libraryId,
      (this.props.entity as CrgRasterLayer).recordId,
      true
    );
  }

  private async setDocument(libraryId: string, recordId: number, openDialog = false) {
    try {
      const document = await getLibraryRecord(libraryId, recordId);
      this.setRasterDocument(document);
      if (openDialog) {
        this.openDialog();
      }
    } catch (error) {
      const err = error as AxiosError;
      Toast.warn(`Ошибка получения документа. ${err.message}`);
      services.logger.warn(`Ошибка получения документа. ${err.message}`);
    }
  }

  @boundMethod
  private async getLayerVectorTable() {
    const { dataset, tableName } = this.props.entity as CrgVectorLayer;
    try {
      const vectorTable = await getVectorTable(dataset, tableName);
      this.setVectorTable(vectorTable);
      this.openDialog();
    } catch (error) {
      const err = error as AxiosError;
      Toast.warn(`Ошибка получения набора данных. ${err.message}`);
      services.logger.warn(`Ошибка получения набора данных. ${err.message}`);
    }
  }

  @action.bound
  private openSelectProjectionDialog() {
    this.selectProjectionDialogOpen = true;
  }

  @action.bound
  private closeSelectProjectionDialog() {
    this.selectProjectionDialogOpen = false;

    this.props.onClose();
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

  @action.bound
  private openImportShapeDialog() {
    this.importShapeDialogOpen = true;
    this.props.onClose();
  }

  @action.bound
  private closeImportShapeDialog() {
    this.importShapeDialogOpen = false;
  }

  @action
  private setGeometryType(geometryType?: GeometryType) {
    this.geometryType = geometryType;
  }

  @action
  private setSchema(schema: Schema) {
    this.schema = schema;
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
  }

  @action.bound
  private deleteLayer() {
    const layer = this.props.entity as CrgLayer;
    currentProject.deleteLayer(layer);

    if (layer.type === CrgLayerType.VECTOR || (layer.type && isVectorFromFile(layer.type))) {
      communicationService.layerUpdated.emit({ type: 'delete', data: layer as CrgVectorLayer });
    }
  }

  @action.bound
  private setRasterDocument(document?: LibraryRecord) {
    this.rasterDocument = document;
  }

  @action.bound
  private setVectorTable(vectorTable?: VectorTable) {
    this.vectorTable = vectorTable;
  }

  @action.bound
  private openLayerEditDialog() {
    this.layerEditDialogOpen = true;
    this.props.onClose();
  }

  @action.bound
  private closeLayerEditDialog() {
    this.layerEditDialogOpen = false;
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }
}
