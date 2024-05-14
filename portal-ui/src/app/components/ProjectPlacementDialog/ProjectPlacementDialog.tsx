import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Breakpoint } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { communicationService } from '../../services/communication.service';
import {
  placeFile,
  placeFileWithProjection,
  placeGml
} from '../../services/data/file-placement/file-placement.service';
import { FileInfo } from '../../services/data/files/files.models';
import { isNeedDefineProjection, isTifFile } from '../../services/data/files/files.util';
import { LibraryRecord } from '../../services/data/library/library.models';
import { ProcessResponse } from '../../services/data/processes/processes.models';
import { awaitProcess } from '../../services/data/processes/processes.service';
import { Projection } from '../../services/data/projection/projection.models';
import { getCrsFromProjection } from '../../services/data/projection/projection.util';
import { CrgProject } from '../../services/gis/projects/projects.models';
import { services } from '../../services/services';
import { organizationSettings } from '../../stores/OrganizationSettings.store';
import { sidebars } from '../../stores/Sidebars.store';
import { CoordinateAxes } from '../CoordinateAxes/CoordinateAxes';
import { Link } from '../Link/Link';
import { SelectProjectsDialog } from '../SelectProjectDialog/SelectProjectDialog';
import { SelectProjection } from '../SelectProjection/SelectProjection';
import { Toast } from '../Toast/Toast';

import '!style-loader!css-loader!sass-loader!./ProjectPlacementDialog.scss';

const cnProjectPlacementDialog = cn('ProjectPlacementDialog');

interface ProjectPlacementDialogProps {
  fileInfo: FileInfo;
  open: boolean;
  document?: LibraryRecord;
  maxWidth?: Breakpoint;
  fullWidth?: boolean;
  onClose(): void;
}

@observer
export class ProjectPlacementDialog extends Component<ProjectPlacementDialogProps> {
  @observable private addFormBusy = false;
  @observable private invertedCoordinates = false;
  @observable private projection?: Projection;

  constructor(props: ProjectPlacementDialogProps) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    const projection = organizationSettings.orgDefaultProjection;

    if (projection) {
      this.setSelectedProjection(projection);
    }
  }

  render() {
    const { open, onClose, maxWidth, fullWidth, fileInfo } = this.props;

    return (
      <SelectProjectsDialog
        className={cnProjectPlacementDialog()}
        open={open}
        onClose={onClose}
        onSelect={this.onProjectSelected}
        actionButtonLabel='Разместить в выбранном проекте'
        loading={this.addFormBusy}
        maxWidth={maxWidth}
        fullWidth={fullWidth}
        additionalAction={
          !isTifFile(fileInfo) &&
          (isNeedDefineProjection(fileInfo) ? (
            <SelectProjection onSelect={this.setSelectedProjection} fullWidth />
          ) : (
            <CoordinateAxes onSelect={this.handleSelect} invertedCoordinates={this.invertedCoordinates} />
          ))
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
  private setSelectedProjection(proj: Projection) {
    this.projection = proj;
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
          await placeFile(this.props.fileInfo, { crs: 'EPSG:28406', mode: 'full' }, project, this.props.document);
          communicationService.fileConnectionsUpdated.emit({ type: 'update', data: [this.props.fileInfo] });

          Toast.success(
            <>
              Файл {this.props.fileInfo.title} успешно размещен в проекте{' '}
              {<Link href={`/projects/${project.id}/map`}>{project.name}</Link>}
            </>
          );
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
      if (!this.projection) {
        Toast.error('Отсутствует проекция необходимая для размещения файла в проекте');
        this.setFormBusy(false);

        return;
      }

      try {
        const process = await (isNeedDefineProjection(this.props.fileInfo)
          ? placeFileWithProjection(fileInfo, project.id, getCrsFromProjection(this.projection))
          : placeGml(fileInfo, project.id, this.invertedCoordinates));

        void this.waitForProcess(process);

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

  private async waitForProcess(response: ProcessResponse): Promise<void> {
    const process = await awaitProcess(Number(response._links.process.href.split('/').at(-1)));

    if (process) {
      communicationService.fileConnectionsUpdated.emit({ type: 'update', data: [this.props.fileInfo] });
    }
  }
}
