import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { MenuItem } from '@mui/material';
import { GetAppOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { MapAction } from '../../services/map/map.models';
import { mapStore } from '../../stores/Map.store';
import { organizationSettings } from '../../stores/OrganizationSettings.store';
import { ExportGeoPackageDialog } from '../ExportGeoPackageDialog/ExportGeoPackageDialog';
import { ExportGmlDialog } from '../ExportGmlDialog/ExportGmlDialog';
import { MenuIconButton } from '../MenuIconButton/MenuIconButton';

const cnExportGmlMenu = cn('ExportGmlMenu');

@observer
export class ExportGmlMenu extends Component {
  @observable private exportGmlDialogOpen = false;
  @observable private exportGeopackageDialogOpen = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    const disabled = !mapStore.allowedActions.includes(MapAction.EXPORT_GML);

    return (
      <>
        <MenuIconButton className={cnExportGmlMenu()} icon={<GetAppOutlined />} color='inherit' disabled={disabled}>
          <MenuItem onClick={this.openExportGeopackageDialog}>Экспорт в GeoPackage</MenuItem>
          {organizationSettings.downloadGml && (
            <MenuItem onClick={this.openExportGmlDialog}>Экспорт в GML по 10 приказу</MenuItem>
          )}
        </MenuIconButton>

        <ExportGmlDialog open={this.exportGmlDialogOpen} onClose={this.closeExportGmlDialog} />
        <ExportGeoPackageDialog open={this.exportGeopackageDialogOpen} onClose={this.closeExportGeopackageDialog} />
      </>
    );
  }

  @action.bound
  private openExportGmlDialog() {
    this.exportGmlDialogOpen = true;
  }

  @action.bound
  private closeExportGmlDialog() {
    this.exportGmlDialogOpen = false;
  }

  @action.bound
  private openExportGeopackageDialog() {
    this.exportGeopackageDialogOpen = true;
  }

  @action.bound
  private closeExportGeopackageDialog() {
    this.exportGeopackageDialogOpen = false;
  }
}
