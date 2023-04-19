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
  UnarchiveOutlined,
  TuneOutlined
} from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';
import { cn } from '@bem-react/classname';

import { EditFeatureMode, sidebars } from '../../../stores/Sidebars.store';
import { currentProject } from '../../../stores/CurrentProject.store';
import {
  CrgLayer,
  CrgLayersGroup,
  CrgLayerType,
  CrgRasterLayer,
  CrgVectorLayer,
  crgLayerSchema
} from '../../../services/gis/layers/layers.models';
import { TreeItemPayload } from '../../../services/gis/projects/projects.models';
import { getLibraryRecord } from '../../../services/data/docLibrary/docLibrary.service';
import { LibraryRecord } from '../../../services/data/docLibrary/docLibrary.models';
import { GeometryType, WfsFeature } from '../../../services/geoserver/wfs/wfs.models';
import { focusToLayer } from '../../../services/geoserver/sidebarActions.service';
import { communicationService } from '../../../services/communication.service';
import { schemaService } from '../../../services/data/schema/schema.service';
import { exportVectorTableAsShape } from '../../../services/data/export/export.service';
import { services } from '../../../services/services';
import {
  isTableExportAllowed,
  isLayersManagementAllowed,
  isUpdateAllowed,
  isShapeImportAllowed
} from '../../../services/data/permissions/permissions.service';
import { ImportOutlined } from '../../Icons/ImportOutlined';
import { ImportXmlDialog } from '../../ImportXmlDialog/ImportXmlDialog';
import { LayersGroupEditDialog } from '../../LayersGroupEditDialog/LayersGroupEditDialog';
import { LibraryDocumentDialog } from '../../LibraryDocumentDialog/LibraryDocumentDialog';
import { getVectorTable } from '../../../services/data/vectorData/vectorData.service';
import { VectorTable } from '../../../services/data/vectorData/vectorData.models';
import { LayerTransparency } from '../Transparency/Layer-Transparency';
import { VectorTableCard } from '../../VectorTableCard/VectorTableCard';
import { Button } from '../../Button/Button';
import { Toast } from '../../Toast/Toast';
import { FormDialog } from '../../FormDialog/FormDialog';
import { TextBadge } from '../../TextBadge/TextBadge';
import { ImportShapeDialog } from '../../ImportShapeDialog/ImportShapeDialog';
import { MenuNestedItem } from '../../MenuNestedItem/MenuNestedItem';
import { getEmptyFeature } from '../../../services/geoserver/wfs/wfs.util';
import { ContentType, PropertyType, Schema } from '../../../services/data/schema/schema.models';
import { getViewChoiceOptions } from '../../Form/Form.utils';

export const cnLayerPropertiesDialog = cn('Layer', 'PropertiesDialog');

const cnLayerMenu = cn('Layer', 'Menu');

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
  @observable private importShapeDialogOpen = false;
  @observable private importShapeAllowed = false;
  @observable private rasterDocument: LibraryRecord;
  @observable private vectorTable: VectorTable;
  @observable private views: ContentType[];
  @observable private dialogOpen = false;
  @observable private layerEditDialog = false;

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
          <MenuItem disableRipple>
            <LayerTransparency entity={entity} />
          </MenuItem>

          {editMode && !isGroup && (
            <MenuItem onClick={this.openLayerEditDialog}>
              <ListItemIcon>
                <TuneOutlined />
              </ListItemIcon>
              Свойства
            </MenuItem>
          )}

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

          {!editMode && (this.isVectorLayer || this.isRasterLayer || this.isVectorFromFileLayer) && (
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

          {!editMode && (this.isVectorFromFileLayer || this.isRasterLayer) && this.isDocumentInfoEnabled && (
            <MenuItem onClick={this.getLayerDocument}>
              <ListItemIcon>
                <FileOpenOutlined />
              </ListItemIcon>
              Информация
            </MenuItem>
          )}

          {!editMode && this.isVectorLayer && this.featuresCreateAllowed && (
            <MenuNestedItem
              parentMenuOpen={open}
              submenu={[
                (this.geometryType === GeometryType.MULTI_POLYGON || this.geometryType === GeometryType.POLYGON) && (
                  <MenuItem key='xml' onClick={this.openImportXmlDialog}>
                    Импорт межевого плана из XML
                  </MenuItem>
                ),
                this.importShapeAllowed && (
                  <MenuItem key='shp' onClick={this.openImportShapeDialog}>
                    Импорт геометрии из Shape-файла
                  </MenuItem>
                )
              ]}
              icon={<ImportOutlined />}
              title='Импорт'
            />
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
          (this.geometryType === GeometryType.MULTI_POLYGON || this.geometryType === GeometryType.POLYGON) && (
            <ImportXmlDialog
              open={this.importXmlDialogOpen}
              onClose={this.closeImportXmlDialog}
              datasetId={(entity as CrgVectorLayer).dataset}
              tableId={(entity as CrgLayer).tableName}
              complexName={(entity as CrgLayer).complexName}
            />
          )}

        {!editMode && this.isVectorLayer && (
          <ImportShapeDialog
            open={this.importShapeDialogOpen}
            onClose={this.closeImportShapeDialog}
            datasetId={(entity as CrgVectorLayer).dataset}
            tableId={(entity as CrgLayer).tableName}
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
          <LibraryDocumentDialog document={this.rasterDocument} open={this.dialogOpen} onClose={this.closeDialog} />
        )}

        {!isGroup && editMode && (
          <FormDialog<Partial<CrgLayer>>
            className={cnLayerPropertiesDialog()}
            open={this.layerEditDialog}
            schema={this.layerSchema}
            value={entity as CrgLayer}
            actionFunction={this.editLayer}
            actionButtonProps={{ children: 'Изменить' }}
            onClose={this.closeLayerEditDialog}
            title={
              <>
                Свойства слоя
                <TextBadge id={entity.id} />
              </>
            }
          />
        )}
      </>
    );
  }

  @computed
  private get layerSchema(): Schema {
    const { entity } = this.props;

    if (this.views && (entity as CrgLayer).type === CrgLayerType.VECTOR) {
      return {
        properties: [
          {
            name: 'view',
            title: 'Представление',
            options: getViewChoiceOptions(this.views),
            defaultValue: '',
            propertyType: PropertyType.CHOICE
          },
          ...crgLayerSchema.properties
        ]
      };
    }

    return crgLayerSchema;
  }

  @computed
  private get isVectorLayer(): boolean {
    const { entity, isGroup } = this.props;

    return !isGroup && (entity as CrgLayer).type === CrgLayerType.VECTOR;
  }

  @computed
  private get isVectorFromFileLayer(): boolean {
    const { entity, isGroup } = this.props;

    return !isGroup && (entity as CrgLayer).type === CrgLayerType.VECTOR_FROM_FILE;
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
  private openAttributeTable() {
    const { entity, onClose } = this.props;

    communicationService.openAttributesBar.emit(entity as CrgVectorLayer);

    onClose();
  }

  @boundMethod
  private async addFeature() {
    const { entity, onClose } = this.props;
    const emptyFeature = (await getEmptyFeature(entity as CrgVectorLayer)) as WfsFeature;
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

    await exportVectorTableAsShape([{ dataset, table: tableName, schemaId }]);
    sidebars.openInfo();

    onClose();
  }

  private async fetchGeometryType() {
    if (this.isVectorLayer) {
      const { schemaId } = this.props.entity as CrgVectorLayer;
      const schema = await schemaService.getSchema(schemaId);

      this.setViews(schema.views);
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
  private setGeometryType(geometryType: GeometryType) {
    this.geometryType = geometryType;
  }

  @action
  private setViews(views: ContentType[]) {
    this.views = views;
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
  private editLayer(layer: Partial<CrgLayer>) {
    (this.props.entity as CrgLayer).title = layer.title;
    (this.props.entity as CrgLayer).maxZoom = layer.maxZoom;
    (this.props.entity as CrgLayer).minZoom = layer.minZoom;
    const view = layer.view || '';
    (this.props.entity as CrgLayer).view = view;
    const styleName: string = view === '' ? view : this.views.find(type => type.id === view)?.styleName;
    (this.props.entity as CrgLayer).styleName = styleName || this.layerSchema.styleName || layer.schemaId;

    communicationService.layerUpdated.emit({ type: 'update', data: this.props.entity as CrgLayer });
  }

  @action.bound
  private deleteGroup() {
    currentProject.deleteGroup(this.props.entity as CrgLayersGroup);
  }

  @action.bound
  private deleteLayer() {
    const layer = this.props.entity as CrgLayer;
    currentProject.deleteLayer(layer);

    if (layer.type === CrgLayerType.VECTOR || layer.type === CrgLayerType.VECTOR_FROM_FILE) {
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
    this.layerEditDialog = true;
    this.props.onClose();
  }

  @action.bound
  private closeLayerEditDialog() {
    this.layerEditDialog = false;
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
