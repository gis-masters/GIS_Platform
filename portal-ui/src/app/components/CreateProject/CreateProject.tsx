import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { PlaylistAdd } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../services/communication.service';
import { CrgProject, NewCrgProject } from '../../services/gis/projects/projects.models';
import { projectsService } from '../../services/gis/projects/projects.service';
import { FormDialog } from '../FormDialog/FormDialog';
import { IconButton } from '../IconButton/IconButton';
import { crgProjectSchema } from '../ProjectActions/ProjectActions';

const cnCreateProject = cn('CreateProject');

interface CreateProjectProps {
  onCreate(project: CrgProject): void;
}

@observer
export class CreateProject extends Component<CreateProjectProps> {
  @observable private dialogOpen = false;

  constructor(props: CreateProjectProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <Tooltip title='Создать проект'>
          <IconButton className={cnCreateProject()} onClick={this.openDialog}>
            <PlaylistAdd />
          </IconButton>
        </Tooltip>
        <FormDialog<CrgProject>
          title='Создание нового проекта'
          className={cnCreateProject('Dialog')}
          open={this.dialogOpen}
          value={{}}
          schema={crgProjectSchema}
          onClose={this.closeDialog}
          closeWithConfirm
          actionFunction={this.create}
          actionButtonProps={{ children: 'Создать' }}
        />
      </>
    );
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  @boundMethod
  private async create(project: NewCrgProject) {
    const newProject = await projectsService.create(project);

    communicationService.projectUpdated.emit({ type: 'create', data: newProject });

    this.props.onCreate(newProject);
  }
}
