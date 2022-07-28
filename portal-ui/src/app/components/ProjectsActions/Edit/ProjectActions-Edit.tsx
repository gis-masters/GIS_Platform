import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Edit, EditOutlined, SaveOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { Tooltip } from '@mui/material';

import { communicationService } from '../../../services/communication.service';
import { projectsService } from '../../../services/crg/projects.service';
import { CrgProject } from '../../../services/crg/projects.models';
import { Schema } from '../../../services/crg/schema.models';
import { IconButton } from '../../IconButton/IconButton';
import { FormDialog } from '../../FormDialog/FormDialog';
import { getPatch } from '../../../services/util/patch';
import { TextBadge } from '../../TextBadge/TextBadge';

const cnProjectActionsEdit = cn('ProjectActionsEdit', 'Edit');

interface ProjectActionsProps {
  project: CrgProject;
  schema: Schema<CrgProject>;
}

@observer
export class ProjectActionsEdit extends Component<ProjectActionsProps> {
  @observable private dialogOpen = false;

  render() {
    const { project, schema } = this.props;

    return (
      <>
        <Tooltip title='Редактировать'>
          <IconButton className={cnProjectActionsEdit()} onClick={this.openDialog}>
            {this.dialogOpen ? <Edit /> : <EditOutlined />}
          </IconButton>
        </Tooltip>

        <FormDialog<Partial<CrgProject>>
          open={this.dialogOpen}
          schema={schema as unknown as Schema}
          value={project}
          actionFunction={this.updateDocumentPage}
          actionButtonProps={{ startIcon: <SaveOutlined />, children: 'Сохранить' }}
          onClose={this.closeDialog}
          title={
            <>
              Редактирование проекта
              <TextBadge id={project.id} />
            </>
          }
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
  private async updateDocumentPage(value: CrgProject) {
    await projectsService.update(this.props.project.id, getPatch(value, this.props.project));
    communicationService.projectsUpdated.emit();
  }
}
