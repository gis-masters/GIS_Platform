import React, { Component } from 'react';
import { AxiosError } from 'axios';
import { observer } from 'mobx-react';
import { action, observable, makeObservable } from 'mobx';

import { Toast } from '../Toast/Toast';
import { services } from '../../services/services';
import { sidebars } from '../../stores/Sidebars.store';
import { CrgProject } from '../../services/gis/projects.models';
import { placeFile } from '../../services/data/file-placement.service';
import { SelectProjectsDialog } from '../SelectProjectDialog/SelectProjectDialog';
import { FileInfo } from '../../services/data/files.service';

interface ProjectPlacementDialogProps {
  fileInfo: FileInfo;
  open: boolean;
  onClose(): void;
}

@observer
export class ProjectPlacementDialog extends Component<ProjectPlacementDialogProps> {
  @observable private addFormBusy = false;
  @observable private addFormOpen = false;

  constructor(props: ProjectPlacementDialogProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { open, onClose } = this.props;

    return (
      <SelectProjectsDialog
        open={open}
        onClose={onClose}
        onSelect={this.onProjectSelected}
        actionButtonLabel='Разместить в выбранном проекте'
      />
    );
  }

  @action.bound
  private async onProjectSelected([project]: CrgProject[]) {
    const { fileInfo } = this.props;

    await this.placement(fileInfo, project.id);
  }

  @action.bound
  private setFormBusy(busy: boolean) {
    this.addFormBusy = busy;
  }

  private async placement(fileInfo: FileInfo, projectId: number) {
    if (this.addFormBusy) {
      return;
    }

    this.setFormBusy(true);

    try {
      await placeFile(fileInfo, projectId);

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
