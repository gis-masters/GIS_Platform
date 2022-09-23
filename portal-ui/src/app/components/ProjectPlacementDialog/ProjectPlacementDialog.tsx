import React, { Component } from 'react';
import { AxiosError } from 'axios';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { action, observable, makeObservable } from 'mobx';
import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';

import { Toast } from '../Toast/Toast';
import { services } from '../../services/services';
import { sidebars } from '../../stores/Sidebars.store';
import { isDxfFile } from '../../services/data/files.util';
import { FileInfo } from '../../services/data/files.service';
import { CoordinateAxesXY } from '../Icons/CoordinateAxesXY';
import { CoordinateAxesYX } from '../Icons/CoordinateAxesYX';
import { CrgProject } from '../../services/gis/projects.models';
import { SelectProjection } from '../SelectProjection/SelectProjection';
import { placeDxf, placeGml } from '../../services/data/file-placement.service';
import { defaultProjection } from '../../services/geoserver/projections.service';
import { SelectProjectsDialog } from '../SelectProjectDialog/SelectProjectDialog';

import '!style-loader!css-loader!sass-loader!./ProjectPlacementDialog.scss';

const cnProjectPlacementDialog = cn('ProjectPlacementDialog');

interface ProjectPlacementDialogProps {
  fileInfo: FileInfo;
  open: boolean;
  onClose(): void;
}

@observer
export class ProjectPlacementDialog extends Component<ProjectPlacementDialogProps> {
  @observable private addFormBusy = false;
  @observable private invertedCoordinates = false;
  @observable private selectedCrs = defaultProjection.id;

  constructor(props: ProjectPlacementDialogProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { open, onClose, fileInfo } = this.props;

    return (
      <SelectProjectsDialog
        className={cnProjectPlacementDialog()}
        open={open}
        onClose={onClose}
        onSelect={this.onProjectSelected}
        actionButtonLabel='Разместить в выбранном проекте'
        additionalAction={
          isDxfFile(fileInfo) ? (
            <SelectProjection
              className={cnProjectPlacementDialog('SelectProjection')}
              value={this.selectedCrs}
              onChange={this.onProjectionSelected}
            />
          ) : (
            <Tooltip title='В GML файле могут содержаться координаты в разных системах. Если в результате импорта ориентация и расположение импортированных объектов на карте отличаются от ожидаемых — попробуйте разместить GML файл заново, выбрав другой режим с помощью этого переключателя.'>
              <ToggleButtonGroup
                size='small'
                value={this.invertedCoordinates ? 'xy' : 'yx'}
                exclusive
                onChange={this.handleCoordinatesInversionSwitcherChange}
              >
                <ToggleButton value='xy'>
                  <Tooltip title='X — восток, Y — север (ENU)' placement='left'>
                    <span>
                      <CoordinateAxesXY fontSize='small' />
                    </span>
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value='yx'>
                  <Tooltip title='X — север, Y — восток (NED)' placement='right'>
                    <span>
                      <CoordinateAxesYX fontSize='small' />
                    </span>
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </Tooltip>
          )
        }
      />
    );
  }

  @action.bound
  private async onProjectSelected([project]: CrgProject[]) {
    const { fileInfo } = this.props;

    await this.place(fileInfo, project.id);
  }

  @action.bound
  private onProjectionSelected(crs: string) {
    this.selectedCrs = crs;
  }

  @action.bound
  private setFormBusy(busy: boolean) {
    this.addFormBusy = busy;
  }

  private async place(fileInfo: FileInfo, projectId: number) {
    if (this.addFormBusy) {
      return;
    }

    this.setFormBusy(true);

    try {
      await (isDxfFile(this.props.fileInfo)
        ? placeDxf(fileInfo, projectId, this.selectedCrs)
        : placeGml(fileInfo, projectId, this.invertedCoordinates));

      this.props.onClose();
      sidebars.openInfo();
    } catch (error) {
      const err = error as AxiosError<{ errors: Record<string, unknown>[]; message?: string }>;
      if (err.response?.status === 400) {
        const message = err.response?.data?.message;
        services.logger.error(message, error);
        Toast.error({ message, details: (error as Error).message });
      } else {
        throw error;
      }
    } finally {
      this.setFormBusy(false);
    }
  }

  @action.bound
  private handleCoordinatesInversionSwitcherChange(e: React.MouseEvent<HTMLElement, MouseEvent>, value: string) {
    this.invertedCoordinates = value === 'xy';
  }
}
