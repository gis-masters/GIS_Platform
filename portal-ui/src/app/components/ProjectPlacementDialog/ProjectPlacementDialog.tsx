import React, { Component } from 'react';
import { AxiosError } from 'axios';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { action, observable, makeObservable } from 'mobx';

import { Toast } from '../Toast/Toast';
import { services } from '../../services/services';
import { sidebars } from '../../stores/Sidebars.store';
import { FileInfo } from '../../services/data/files/files.models';
import { CoordinateAxes } from '../CoordinateAxes/CoordinateAxes';
import { SelectProjection } from '../SelectProjection/SelectProjection';
import { CrgProject } from '../../services/gis/projects/projects.models';
import { isDxfFile, isTifFile } from '../../services/data/files/files.util';
import { communicationService } from '../../services/communication.service';
import { LibraryRecord } from '../../services/data/library/library.models';
import { defaultProjection } from '../../services/geoserver/projections.service';
import { SelectProjectsDialog } from '../SelectProjectDialog/SelectProjectDialog';
import { placeDxf, placeFile, placeGml } from '../../services/data/file-placement/file-placement.service';

import '!style-loader!css-loader!sass-loader!./ProjectPlacementDialog.scss';

const cnProjectPlacementDialog = cn('ProjectPlacementDialog');

interface ProjectPlacementDialogProps {
  fileInfo: FileInfo;
  open: boolean;
  document?: LibraryRecord;
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
        loading={this.addFormBusy}
        additionalAction={
          isDxfFile(fileInfo) || isTifFile(fileInfo) ? (
            <SelectProjection
              className={cnProjectPlacementDialog('SelectProjection')}
              value={this.selectedCrs}
              onChange={this.onProjectionSelected}
            />
          ) : (
            <CoordinateAxes onSelect={this.handleSelect} invertedCoordinates={this.invertedCoordinates} />
          )
        }
      />
    );
  }

  @boundMethod
  private handleSelect(inverted: boolean) {
    this.invertedCoordinates = inverted;
  }

  @action.bound
  private async onProjectSelected([project]: CrgProject[]) {
    const { fileInfo } = this.props;

    await this.place(fileInfo, project);
  }

  @action.bound
  private onProjectionSelected(crs: string) {
    this.selectedCrs = crs;
  }

  @action.bound
  private setFormBusy(busy: boolean) {
    this.addFormBusy = busy;
  }

  private async place(fileInfo: FileInfo, project: CrgProject) {
    if (this.addFormBusy) {
      return;
    }

    this.setFormBusy(true);

    if (isTifFile(this.props.fileInfo)) {
      if (this.props.document) {
        try {
          await placeFile(this.props.fileInfo, { crs: this.selectedCrs, mode: 'full' }, project, this.props.document);
          communicationService.fileConnectionsUpdated.emit({ type: 'update', data: [this.props.fileInfo] });

          Toast.success(`Файл ${this.props.fileInfo.title} успешно размещен в проекте`);
        } catch (error) {
          Toast.error('Не удалось подключить слой');
          services.logger.error('Не удалось подключить слой: ', (error as AxiosError).message);

          return;
        } finally {
          this.setFormBusy(false);
        }
      } else {
        Toast.error({
          message: 'Не удалось подключить слой',
          details: 'Не найден документ содержащий файл для подключения'
        });
      }

      this.props.onClose();
      this.setFormBusy(false);
    } else {
      try {
        await (isDxfFile(this.props.fileInfo)
          ? placeDxf(fileInfo, project.id, this.selectedCrs)
          : placeGml(fileInfo, project.id, this.invertedCoordinates));

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
  }
}
