import React, { Component } from 'react';
import { AxiosError } from 'axios';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { action, computed, observable } from 'mobx';

import { sidebars } from '../../stores/Sidebars.store';
import { allProjects } from '../../stores/AllProjects.store';
import { services } from '../../services/services';
import { SortParams } from '../../services/util/sortObjects';
import { Role } from '../../services/crg/permissions.models';
import { CrgProject } from '../../services/crg/projects.models';
import { projectsService } from '../../services/crg/projects.service';
import { LibraryRecord } from '../../services/crg/doc-library.service';
import { initImportProcess } from '../../services/crg/processes.service';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';
import { ProjectsAdd } from '../ProjectAdd/ProjectsAdd';
import { XTableColumn } from '../XTable/XTable';
import { Basemap } from '../Icons/Basemap';
import { Button } from '../Button/Button';
import { Toast } from '../Toast/Toast';

const cnImportToProject = cn('ImportToProject');

interface ImportToProjectProps {
  document: LibraryRecord;
}

@observer
export class ImportToProject extends Component<ImportToProjectProps> {
  @observable private dialogOpen = false;
  @observable private addFormBusy = false;
  @observable private addFormOpen = false;
  @observable private addFormErrors: string[] = [];

  private cols: XTableColumn<CrgProject>[] = [
    {
      field: 'name',
      title: 'Название проекта',
      filterable: true,
      sortable: true
    }
  ];

  private sortParams: SortParams<CrgProject> = { asc: true, field: 'name' };

  async componentDidMount() {
    await projectsService.initAllProjectsStore();
  }

  render() {
    return (
      <>
        <Button
          className={cnImportToProject()}
          startIcon={<Basemap />}
          onClick={this.openDialog}
          color='primary'
          children='Разместить в проекте'
        />

        <ChooseXTableDialog<CrgProject>
          title='Выбор проекта'
          data={this.projects}
          cols={this.cols}
          defaultSort={this.sortParams}
          secondarySortField='createdAt'
          open={this.dialogOpen}
          onClose={this.closeDialog}
          onSelect={this.onProjectSelected}
          getRowId={this.getItemId}
          single
          actionButtonProps={{
            children: 'Разместить в выбранном проекте'
          }}
          additionalAction={
            <ProjectsAdd
              className={cnImportToProject('Add')}
              onSubmit={this.onProjectAddSubmit}
              busy={this.addFormBusy}
              onClose={this.closeAddForm}
              onOpen={this.openAddForm}
              open={this.addFormOpen}
              errors={this.addFormErrors}
              onChange={this.onChange}
              buttonProps={{
                color: 'secondary',
                children: 'Разместить в новом проекте'
              }}
            />
          }
        />
      </>
    );
  }

  @computed
  private get projects(): CrgProject[] {
    return allProjects.list.filter(({ role }) => role === Role.OWNER);
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  @action.bound
  private async onProjectSelected([project]: CrgProject[]) {
    const { id, libraryId } = this.props.document;

    await this.doJob(libraryId, id, project.id, project.name, false);
  }

  @action.bound
  private async onProjectAddSubmit(projectName: string) {
    const { id, libraryId } = this.props.document;

    await this.doJob(libraryId, id, undefined, projectName, true);
  }

  private getItemId({ id }: CrgProject): string {
    return String(id);
  }

  @action.bound
  private closeAddForm() {
    this.addFormOpen = false;
  }

  @action.bound
  private openAddForm() {
    this.addFormOpen = true;
  }

  @action.bound
  private onChange() {
    this.setFormErrors([]);
  }

  @action.bound
  private setFormErrors(errors: string[]) {
    this.addFormErrors = errors;
  }

  @action.bound
  private setFormBusy(busy: boolean) {
    this.addFormBusy = busy;
  }

  private async doJob(
    libraryId: string,
    objectId: number,
    projectId: number,
    projectName: string,
    projectIsNew: boolean
  ) {
    if (this.addFormBusy) {
      return;
    }

    this.setFormErrors([]);
    this.setFormBusy(true);

    try {
      await initImportProcess(libraryId, objectId, projectId, projectName, projectIsNew);

      this.closeDialog();
      sidebars.openInfo();
    } catch (error) {
      const err = error as AxiosError<{ errors: Record<string, unknown>[]; message?: string }>;
      if (err.response?.status === 400) {
        const message = err.response?.data?.message;
        services.logger.error(message, error);
        Toast.error({ message: message, details: (error as Error).message });
      } else if (err.response?.status === 409) {
        this.setFormErrors([err?.message]);
      } else if (err.response?.data?.errors) {
        const errors = [];
        err.response?.data?.errors?.forEach(({ message, type }) => {
          if (message) {
            if (type === 'projectName') {
              errors.push(message as string);
            } else {
              services.logger.error(message, error);
              Toast.error({ message, details: (error as Error).message });
            }
          }
        });

        if (!errors.length) {
          errors.push('Не удалось создать проект');
        }

        this.setFormErrors(errors);
      } else {
        throw error;
      }
    } finally {
      this.setFormBusy(false);
    }
  }
}
