import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ListItemIcon, Menu, MenuItem } from '@material-ui/core';
import { AddCircle, Delete, Edit, ListAlt, Unarchive } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';

import { sidebars } from '../../../stores/Sidebars.store';
import { currentProject } from '../../../stores/CurrentProject.store';
import { CrgLayer, CrgLayersGroup, CrgLayerType, TreeItemPayload } from '../../../services/crg/projects.models';
import { schemaService } from '../../../services/crg/schema.service';
import { exportService } from '../../../services/crg/export.service';
import {
  isFeaturesCreateAllowed,
  isLayerExportAllowed,
  isLayersManagementAllowed
} from '../../../services/crg/permissions.service';
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

  async componentDidMount() {
    await this.fetchPermissions();
  }

  render() {
    const { open, x, y, onClose, anchor, entity, isGroup, editMode } = this.props;
    const isVectorLayer = !isGroup && (entity as CrgLayer).type === CrgLayerType.VECTOR;

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

          {!editMode && isVectorLayer && (
            <MenuItem onClick={this.openAttributeTable}>
              <ListItemIcon>
                <ListAlt />
              </ListItemIcon>
              Открыть таблицу атрибутов
            </MenuItem>
          )}

          {!editMode && isVectorLayer && this.featuresCreateAllowed && (
            <MenuItem onClick={this.addFeature}>
              <ListItemIcon>
                <AddCircle />
              </ListItemIcon>
              Добавить объект
            </MenuItem>
          )}

          {!editMode && isVectorLayer && this.layerExportAllowed && (
            <MenuItem onClick={this.export}>
              <ListItemIcon>
                <Unarchive />
              </ListItemIcon>
              Экспорт ESRI Shape-файл
            </MenuItem>
          )}

          {!isGroup && editMode && this.layersDeleteAllowed && (
            <MenuItem onClick={this.deleteLayer}>
              <ListItemIcon>
                <Delete />
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
      </>
    );
  }

  private async fetchPermissions() {
    const { entity, isGroup } = this.props;

    if (isGroup) {
      return;
    }

    const allowed = await Promise.all([
      isFeaturesCreateAllowed(entity as CrgLayer),
      isLayerExportAllowed(entity as CrgLayer),
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
  private async export() {
    const { entity, onClose } = this.props;
    const { dataset, internalName, schemaId } = entity as CrgLayer;

    await exportService.exportAsShape([{ dataset, table: internalName, schemaId }]);
    sidebars.openInfo();

    onClose();
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
  private editGroup(title: string) {
    this.props.entity.title = title;
  }

  @action.bound
  private async deleteGroup() {
    currentProject.deleteGroup(this.props.entity as CrgLayersGroup);
  }

  @action.bound
  private async deleteLayer() {
    const layer = this.props.entity as CrgLayer;
    currentProject.deleteLayer(layer);
  }
}
