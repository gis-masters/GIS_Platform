import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Badge, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip } from '@mui/material';
import { Map, MapOutlined, SaveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { FileConnection, FileInfo } from '../../../services/data/files/files.models';
import { isTifFile } from '../../../services/data/files/files.util';
import { PropertyType, SimpleSchema } from '../../../services/data/schema/schema.models';
import { CoverageTransparentColorEntry } from '../../../services/geoserver/coverages/coverages.model';
import { getTransparentColor, updateTransparentColor } from '../../../services/geoserver/coverages/coverages.service';
import { Button } from '../../Button/Button';
import { ConnectionsToProjects } from '../../ConnectionsToProjects/ConnectionsToProjects';
import { FormDialog } from '../../FormDialog/FormDialog';
import { IconButton } from '../../IconButton/IconButton';
import { MapSettingsOutlined } from '../../Icons/MapSettingsOutlined';

import '!style-loader!css-loader!sass-loader!../Connections/Files-Connections.scss';
import '!style-loader!css-loader!sass-loader!../EditLayer/Files-EditLayer.scss';

const cnFilesConnections = cn('Files', 'Connections');
const cnFilesEditLayer = cn('Files', 'EditLayer');

interface ConnectionsProps {
  file: FileInfo;
  connections: FileConnection[];
}

const fileInfoSchema: SimpleSchema = {
  properties: [
    {
      name: 'transparentColor',
      title: 'Убрать фон',
      wellKnownRegex: 'color',
      description: 'Указанный цвет фона не будет отображаться на карте. Белый цвет: #FFFFFF, черный цвет: #000000',
      propertyType: PropertyType.STRING
    }
  ]
};

interface RasterLayerInfo {
  transparentColor: string;
}

@observer
export class FilesConnections extends Component<ConnectionsProps> {
  @observable private connectionsListDialogOpen = false;
  @observable private editRasterLayerDialogOpen = false;
  @observable private transparentColor: string = '';

  constructor(props: ConnectionsProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount(): Promise<void> {
    await this.updateTransparentColor();
  }

  async componentDidUpdate(): Promise<void> {
    await this.updateTransparentColor();
  }

  render() {
    const { connections, file } = this.props;

    return (
      <>
        <Tooltip title='Подключено в проекты'>
          <span>
            <IconButton onClick={this.openConnectionsListDialog} size='small'>
              <Badge
                badgeContent={connections.length}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                color='default'
              >
                {this.connectionsListDialogOpen ? <Map fontSize='small' /> : <MapOutlined fontSize='small' />}
              </Badge>
            </IconButton>
          </span>
        </Tooltip>

        <Dialog open={this.connectionsListDialogOpen} onClose={this.closeConnectionsListDialog}>
          <DialogTitle>Проекты, в которые подключен файл: {file.title}</DialogTitle>
          <DialogContentText className={cnFilesEditLayer()}>
            <Tooltip title='Настройки растрового слоя'>
              <span>
                <IconButton onClick={this.openEditRasterLayerDialog} size='small'>
                  <MapSettingsOutlined fontSize='small' />
                </IconButton>
              </span>
            </Tooltip>
          </DialogContentText>
          <DialogContent className={cnFilesConnections(null, ['scroll'])}>
            <ConnectionsToProjects type='list' connections={connections} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeConnectionsListDialog}>Закрыть</Button>
          </DialogActions>
        </Dialog>

        <FormDialog
          open={this.editRasterLayerDialogOpen}
          schema={fileInfoSchema}
          actionFunction={this.update}
          value={{ transparentColor: this.transparentColor || '' }}
          actionButtonProps={{ startIcon: <SaveOutlined />, children: 'Сохранить' }}
          onClose={this.closeEditRasterLayerDialog}
          title='Настройки растрового слоя'
        />
      </>
    );
  }

  @action.bound
  private openConnectionsListDialog() {
    this.connectionsListDialogOpen = true;
  }

  @action.bound
  private closeConnectionsListDialog() {
    this.connectionsListDialogOpen = false;
  }

  @action.bound
  private openEditRasterLayerDialog() {
    this.editRasterLayerDialogOpen = true;
  }

  @action.bound
  private closeEditRasterLayerDialog() {
    this.editRasterLayerDialogOpen = false;
    this.setTransparentColor('');
  }

  @action.bound
  private setTransparentColor(transparentColor: string) {
    this.transparentColor = transparentColor;
  }

  private async updateTransparentColor() {
    const layer = this.props.connections[0].layer;
    if (!isTifFile(this.props.file) || !layer?.tableName || !layer?.nativeCRS || !layer.dataset) {
      return;
    }

    const response = await getTransparentColor(layer.dataset, layer.tableName + '__' + layer.nativeCRS.split(':')[1]);
    const entry = response?.coverage?.parameters?.entry;

    if (Array.isArray(entry)) {
      this.setTransparentColor((entry.at(-1) as unknown as CoverageTransparentColorEntry).string[1]);
    }

    if (entry && !Array.isArray(entry)) {
      this.setTransparentColor(entry.string[1]);
    }
  }

  @boundMethod
  private async update(value: RasterLayerInfo) {
    const layer = this.props.connections[0].layer;
    if (!layer?.tableName || !layer.dataset || !layer.nativeCRS) {
      throw new Error('Ошибка сохранения. Не найден слой, набор данных tableName или система координат ');
    }

    await updateTransparentColor(
      layer.dataset,
      layer.tableName + '__' + layer.nativeCRS.split(':')[1],
      value.transparentColor
    );
  }
}
