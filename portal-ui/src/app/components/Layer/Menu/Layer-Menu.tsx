import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  ListItemIcon,
  Menu,
  MenuItem
} from '@material-ui/core';
import { AddCircle, Delete, ListAlt, Unarchive } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';

import { sidebars } from '../../../stores/Sidebars.store';
import { CrgLayersGroup, CrgLayer, CrgLayerType } from '../../../services/crg/projects.models';
import { schemaService } from '../../../services/crg/schema.service';
import { deleteLayer } from '../../../services/geoserver/layers.service';
import { exportService } from '../../../services/crg/export.service';
import {
  isCreateAllowed,
  isDeleteAllowed,
  isExportAllowed,
  isReadAllowed
} from '../../../services/crg/permissions.service';
import { EditFeatureMode } from '../../edit-feature/edit-feature.component';
import { Button } from '../../Button/Button';

import { LayerTransparency } from '../Transparency/Layer-Transparency';

interface LayerMenuProps {
  entity: CrgLayer | CrgLayersGroup;
  open: boolean;
  x: number;
  y: number;
  anchor: HTMLElement;
  onClose: () => void;
  isGroup: boolean;
}

@observer
export class LayerMenu extends Component<LayerMenuProps> {
  @observable private deleteDialogOpen = false;
  @observable private readAllowed = false;
  @observable private createAllowed = false;
  @observable private exportAllowed = false;
  @observable private deleteAllowed = false;

  async componentDidMount() {
    await this.handlePermissions();
  }

  render() {
    const { open, x, y, onClose, anchor, entity, isGroup } = this.props;

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

          {!isGroup && (entity as CrgLayer).type === CrgLayerType.VECTOR && this.readAllowed && (
            <MenuItem onClick={this.openAttributeTable}>
              <ListItemIcon>
                <ListAlt />
              </ListItemIcon>
              Открыть таблицу атрибутов
            </MenuItem>
          )}

          {!isGroup && (entity as CrgLayer).type === CrgLayerType.VECTOR && this.createAllowed && (
            <MenuItem onClick={this.addFeature}>
              <ListItemIcon>
                <AddCircle />
              </ListItemIcon>
              Добавить объект
            </MenuItem>
          )}

          {!isGroup && (entity as CrgLayer).type === CrgLayerType.VECTOR && this.exportAllowed && (
            <MenuItem onClick={this.export}>
              <ListItemIcon>
                <Unarchive />
              </ListItemIcon>
              Экспорт ESRI Shape-файл
            </MenuItem>
          )}

          {!isGroup && this.deleteAllowed && (
            <MenuItem onClick={this.openDeleteDialog}>
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              Удалить слой
            </MenuItem>
          )}
        </Menu>

        <Dialog open={this.deleteDialogOpen} onClose={this.closeDeleteDialog}>
          <DialogContent>
            <DialogContentText>Удалить слой "{entity.title}"?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.deleteLayer} color='primary'>
              Удалить
            </Button>
            <Button onClick={this.closeDeleteDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  private async handlePermissions() {
    const { entity, isGroup } = this.props;

    if (isGroup) {
      return;
    }

    const permissions = await Promise.all([
      isReadAllowed(entity as CrgLayer),
      isCreateAllowed(entity as CrgLayer),
      isDeleteAllowed(entity as CrgLayer),
      isExportAllowed(entity as CrgLayer)
    ]);

    this.setPermissions(permissions);
  }

  @action
  private setPermissions([readAllowed, createAllowed, deleteAllowed, exportAllowed]: boolean[]) {
    this.readAllowed = readAllowed;
    this.createAllowed = createAllowed;
    this.deleteAllowed = deleteAllowed;
    this.exportAllowed = exportAllowed;
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

  @boundMethod
  private async deleteLayer() {
    await deleteLayer(this.props.entity as CrgLayer);
    this.closeDeleteDialog();
    sidebars.closeAttributes();
  }

  @action.bound
  private openDeleteDialog() {
    this.deleteDialogOpen = true;
    this.props.onClose();
  }

  @action.bound
  private closeDeleteDialog() {
    this.deleteDialogOpen = false;
  }
}
