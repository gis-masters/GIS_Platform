import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { Edit, EditOutlined, SaveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { SimpleSchema } from '../../../services/data/schema/schema.models';
import { CrgProject } from '../../../services/gis/projects/projects.models';
import { projectsService } from '../../../services/gis/projects/projects.service';
import { getPatch } from '../../../services/util/patch';
import { FormDialog } from '../../FormDialog/FormDialog';
import { IconButton } from '../../IconButton/IconButton';
import { TextBadge } from '../../TextBadge/TextBadge';

const cnProjectActionsEdit = cn('ProjectActions', 'Edit');
const cnProjectActionsEditDialog = cn('ProjectActions', 'EditDialog');

interface ProjectActionsProps {
  project: CrgProject;
  schema: SimpleSchema;
  disabled?: boolean;
  tooltipText?: string;
}

@observer
export class ProjectActionsEdit extends Component<ProjectActionsProps> {
  @observable private dialogOpen = false;

  constructor(props: ProjectActionsProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { project, schema, disabled, tooltipText } = this.props;

    return (
      <>
        <Tooltip title={disabled && tooltipText ? tooltipText : 'Редактировать'}>
          <span>
            <IconButton className={cnProjectActionsEdit()} onClick={this.openDialog} disabled={disabled}>
              {this.dialogOpen ? <Edit /> : <EditOutlined />}
            </IconButton>
          </span>
        </Tooltip>

        <FormDialog<Partial<CrgProject>>
          open={this.dialogOpen}
          className={cnProjectActionsEditDialog()}
          schema={schema}
          value={project}
          actionFunction={this.updateDocumentPage}
          actionButtonProps={{ startIcon: <SaveOutlined />, children: 'Сохранить' }}
          onClose={this.closeDialog}
          closeWithConfirm
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
    await projectsService.update(this.props.project, getPatch(value, this.props.project));
  }
}
