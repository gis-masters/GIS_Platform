import React, { Component, type ReactNode } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { type Breakpoint } from '@mui/material';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type CrgProject } from '../../services/gis/projects/projects.models';
import { projectsService } from '../../services/gis/projects/projects.service';
import { Role } from '../../services/permissions/permissions.models';
import { allProjects } from '../../stores/AllProjects.store';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';

const cnSelectProjectsTableDialogProps = cn('SelectProjectsTableDialog');

interface SelectProjectsTableDialogProps extends IClassNameProps {
  projects?: CrgProject[];
  open: boolean;
  actionButtonLabel: string;
  loading?: boolean;
  maxWidth?: Breakpoint;
  fullWidth?: boolean;
  additionalAction?: ReactNode;
  onClose(): void;
  onSelect(items: CrgProject[]): void;
}

@observer
export class SelectProjectsTableDialog extends Component<SelectProjectsTableDialogProps> {
  async componentDidMount() {
    await this.init();
  }

  async componentDidUpdate() {
    await this.init();
  }

  private async init() {
    if (!this.props.projects && !allProjects.inited) {
      await projectsService.initAllProjectsStore();
    }
  }

  render() {
    const {
      open,
      projects = this.projects,
      actionButtonLabel,
      className,
      loading,
      additionalAction,
      maxWidth,
      fullWidth,
      onSelect,
      onClose
    } = this.props;

    return (
      <ChooseXTableDialog<CrgProject>
        className={cnSelectProjectsTableDialogProps(null, [className])}
        data={projects}
        title='Выбор проекта'
        cols={[
          {
            field: 'name',
            title: 'Название проекта',
            filterable: true,
            sortable: true
          }
        ]}
        defaultSort={{ asc: true, field: 'name' }}
        secondarySortField='createdAt'
        open={open}
        onClose={onClose}
        onSelect={onSelect}
        loading={loading}
        maxWidth={maxWidth}
        fullWidth={fullWidth}
        single
        additionalAction={additionalAction}
        actionButtonProps={{
          children: actionButtonLabel
        }}
      />
    );
  }

  @computed
  private get projects(): CrgProject[] {
    return allProjects.withoutFolders.filter(({ role }) => role === Role.OWNER);
  }
}
