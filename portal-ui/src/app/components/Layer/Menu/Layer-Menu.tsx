import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core';
import { ListAlt, AddCircle, Unarchive, Delete } from '@material-ui/icons';

import { sideBarManager, ActionType, SidebarType } from '../../../services/side-bar-manager.service';
import { CrgLayer, CrgGroup } from '../../../services/crg/projects.models';
import { schemaService } from '../../../services/crg/schema.service';
import { layersService } from '../../../services/geoserver/layers.service';
import { exportService } from '../../../services/crg/export.service';
import { isReadAllowed, isCreateAllowed, isExportAllowed, isDeleteAllowed } from '../../../services/util/permissions';
import { EditFeatureMode } from '../../edit-feature/edit-feature.component';
import { ViewFeaturesData } from '../../view-features/view-features.component';
import { Button } from '../../Button/Button';

import { LayerTransparency } from '../Transparency/Layer-Transparency';

interface LayerMenuProps {
  entity: CrgLayer | CrgGroup;
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

  constructor (props: LayerMenuProps) {
    super(props);

    this.fetchSchema();

    this.openAttributeTable = this.openAttributeTable.bind(this);
    this.addFeature = this.addFeature.bind(this);
    this.export = this.export.bind(this);
    this.openDeleteDialog = this.openDeleteDialog.bind(this);
    this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
    this.deleteLayer = this.deleteLayer.bind(this);
    this.deleteDialogKeyHandler = this.deleteDialogKeyHandler.bind(this);
  }

  render () {
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

          {!isGroup && isReadAllowed(entity as CrgLayer) && (
            <MenuItem onClick={this.openAttributeTable}>
              <ListItemIcon>
                <ListAlt />
              </ListItemIcon>
              Открыть таблицу атрибутов
            </MenuItem>
          )}

          {!isGroup && isCreateAllowed(entity as CrgLayer) && (
            <MenuItem onClick={this.addFeature}>
              <ListItemIcon>
                <AddCircle />
              </ListItemIcon>
              Добавить объект
            </MenuItem>
          )}

          {!isGroup && isExportAllowed(entity as CrgLayer) && (
            <MenuItem onClick={this.export}>
              <ListItemIcon>
                <Unarchive />
              </ListItemIcon>
              Экспорт ESRI Shape-файл
            </MenuItem>
          )}

          {!isGroup && isDeleteAllowed(entity as CrgLayer) && (
            <MenuItem onClick={this.openDeleteDialog}>
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              Удалить слой
            </MenuItem>
          )}
        </Menu>

        <Dialog open={this.deleteDialogOpen} onKeyDown={this.deleteDialogKeyHandler}>
          <DialogContent>
            <DialogContentText>
              Удалить слой "{entity.title}"?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.deleteLayer} color='primary' variant='outlined'>
              Удалить
            </Button>
            <Button onClick={this.closeDeleteDialog} variant='outlined'>
              Отмена
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  private openAttributeTable () {
    const { entity, onClose } = this.props;

    sideBarManager.do({
      target: SidebarType.ATTRIBUTES,
      action: ActionType.OPEN,
      data: entity
    });

    onClose();
  }

  private async fetchSchema() {
    const { entity, isGroup } = this.props;

    if (isGroup) {
      return;
    }

    return await schemaService.getSchema((entity as CrgLayer).schemaId);
  }

  private async addFeature () {
    const { entity, onClose } = this.props;
    const emptyFeature = await schemaService.getEmptyFeature(entity as CrgLayer);

    sideBarManager.do({
      target: SidebarType.FEATURES, action: ActionType.OPEN,
      data: {
        features: [emptyFeature],
        mode: EditFeatureMode.single,
        layer: entity,
        isNew: true
      } as ViewFeaturesData
    });

    onClose();
  }

  private async export () {
    const { entity, onClose } = this.props;
    const { internalName } = entity as CrgLayer;

    await exportService.export({format: 'ESRI Shapefile', layers: [internalName]});
    sideBarManager.do({target: SidebarType.INFO, action: ActionType.OPEN});

    onClose();
  }

  private deleteLayer () {
    layersService.deleteLayer(this.props.entity as CrgLayer);
    this.closeDeleteDialog();
    sideBarManager.do({target: SidebarType.ATTRIBUTES, action: ActionType.CLOSE});
  }

  @action
  openDeleteDialog () {
    this.deleteDialogOpen = true;
    this.props.onClose();
  }

  @action
  private closeDeleteDialog () {
    this.deleteDialogOpen = false;
  }

  private deleteDialogKeyHandler (e: React.KeyboardEvent<HTMLDivElement>) {
    e.preventDefault();

    if (e.key === 'Enter') {
      this.deleteLayer();
    }
    if (e.key === 'Escape') {
      this.closeDeleteDialog();
    }
  }
}
