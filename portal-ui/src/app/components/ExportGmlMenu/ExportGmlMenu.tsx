import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { MenuItem, Tooltip } from '@mui/material';
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
        <Tooltip disableInteractive title='Экспорт данных'>
          <span>
            <MenuIconButton className={cnExportGmlMenu()} color='inherit' disabled={disabled} icon={<GetAppOutlined />}>
              <MenuItem onClick={this.openExportGeopackageDialog}>Выгрузить в GeoPackage</MenuItem>
              {organizationSettings.downloadGml && (
                <MenuItem onClick={this.openExportGmlDialog}>Выгрузить в GML (Приказ 10)</MenuItem>
              )}
            </MenuIconButton>
          </span>
        </Tooltip>

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
