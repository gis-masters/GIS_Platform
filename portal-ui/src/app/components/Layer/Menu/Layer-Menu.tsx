import React, { Component } from 'react';
import { action, computed, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, ListItemIcon, Menu, MenuItem } from '@mui/material';
import {
  AddCircleOutline,
  CropFree,
  FileOpenOutlined,
  Delete,
  DeleteOutline,
  Edit,
  ListAlt,
  UnarchiveOutlined
} from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { EditFeatureMode, sidebars } from '../../../stores/Sidebars.store';
import { currentProject } from '../../../stores/CurrentProject.store';
import {
  CrgLayer,
  CrgLayersGroup,
  CrgLayerType,
  CrgRasterLayer,
  CrgVectorLayer,
  TreeItemPayload
} from '../../../services/gis/projects.models';
import { getLibraryRecord, LibraryRecord } from '../../../services/data/doc-library.service';
import { GeometryType, WfsFeature } from '../../../services/geoserver/wfs.models';
import { focusToLayer } from '../../../services/geoserver/sidebarActions.service';
import { communicationService } from '../../../services/communication.service';
import { schemaService } from '../../../services/data/schema.service';
import { exportService } from '../../../services/data/export.service';
import { services } from '../../../services/services';
import {
  isFeaturesUpdateAllowed,
  isTableExportAllowed,
  isLayersManagementAllowed
} from '../../../services/data/permissions.service';
import { ImportOutlined } from '../../Icons/ImportOutlined';
import { ImportXmlDialog } from '../../ImportXmlDialog/ImportXmlDialog';
import { LayersGroupEditDialog } from '../../LayersGroupEditDialog/LayersGroupEditDialog';
import { VectorTable, getVectorTable } from '../../../services/data/data.service';
import { LayerTransparency } from '../Transparency/Layer-Transparency';
import { LibraryDocument } from '../../LibraryDocument/LibraryDocument';
import { VectorTableCard } from '../../VectorTableCard/VectorTableCard';
import { Button } from '../../Button/Button';
import { Toast } from '../../Toast/Toast';

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
  @observable private rasterDocument: LibraryRecord;
  @observable private vectorTable: VectorTable;
  @observable private dialogOpen = false;

  constructor(props: LayerMenuProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchGeometryType();
    await this.fetchPermissions();

    this.setLayersDeleteAllowed(isLayersManagementAllowed());
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

          {!editMode && this.isVectorLayer && this.isVectorTableInfoEnabled && (
            <MenuItem onClick={this.getLayerVectorTable}>
              <ListItemIcon>
                <FileOpenOutlined />
              </ListItemIcon>
              Информация
            </MenuItem>
          )}

          {!editMode && this.isRasterLayer && this.isDocumentInfoEnabled && (
            <MenuItem onClick={this.getLayerDocument}>
              <ListItemIcon>
                <FileOpenOutlined />
              </ListItemIcon>
              Информация
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
              datasetId={(entity as CrgVectorLayer).dataset}
              tableId={(entity as CrgLayer).tableName}
              complexName={(entity as CrgLayer).complexName}
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

        {this.rasterDocument && (
          <Dialog open={this.dialogOpen} onClose={this.closeDialog} fullWidth maxWidth='md'>
            <DialogTitle>{entity.title}</DialogTitle>
            <DialogContent>
              <LibraryDocument document={this.rasterDocument} contentOnly />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeDialog}>Закрыть</Button>
            </DialogActions>
          </Dialog>
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
      const { dataset, tableName, schemaId } = this.props.entity as CrgVectorLayer;
      const allowed = await Promise.all([
        isFeaturesUpdateAllowed(dataset, tableName, schemaId),
        isTableExportAllowed(dataset, tableName),
        isLayersManagementAllowed()
      ]);

      this.setPermissions(...allowed);
    }
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

    communicationService.openAttributesBar.emit(entity as CrgVectorLayer);

    onClose();
  }

  @boundMethod
  private async addFeature() {
    const { entity, onClose } = this.props;
    const emptyFeature = (await schemaService.getEmptyFeature(entity as CrgVectorLayer)) as WfsFeature;
    sidebars.openEdit({
      features: [emptyFeature],
      mode: EditFeatureMode.single,
      layer: entity as CrgVectorLayer,
      isNew: true
    });

    onClose();
  }

  @boundMethod
  private async goToLayer() {
    const layer = this.props.entity as CrgVectorLayer;

    await focusToLayer(layer);
    this.props.onClose();
  }

  @boundMethod
  private async export() {
    const { entity, onClose } = this.props;
    const { dataset, tableName, schemaId } = entity as CrgVectorLayer;

    await exportService.exportAsShape([{ dataset, table: tableName, schemaId }]);
    sidebars.openInfo();

    onClose();
  }

  private async fetchGeometryType() {
    if (this.isVectorLayer) {
      const { schemaId } = this.props.entity as CrgVectorLayer;
      const schema = await schemaService.getOldSchema(schemaId);

      this.setGeometryType(schema.geometryType);
    }
  }

  @boundMethod
  private async getLayerDocument() {
    const { libraryId, recordId } = this.props.entity as CrgRasterLayer;
    try {
      const document = await getLibraryRecord(libraryId, recordId);
      this.setRasterDocument(document);
      this.openDialog();
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
  }

  @action.bound
  private deleteLayer() {
    const layer = this.props.entity as CrgLayer;
    currentProject.deleteLayer(layer);
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
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }
}
