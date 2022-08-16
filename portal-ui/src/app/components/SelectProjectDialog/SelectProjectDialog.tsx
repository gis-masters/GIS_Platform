import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { computed } from 'mobx';

import { allProjects } from '../../stores/AllProjects.store';
import { Role } from '../../services/data/permissions.models';
import { CrgProject } from '../../services/gis/projects.models';
import { projectsService } from '../../services/gis/projects.service';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';

const cnSelectProjectDialogProps = cn('SelectProjectDialog');

interface SelectProjectDialogProps {
  projects?: CrgProject[];
  open: boolean;
  actionButtonLabel: string;
  onClose(): void;
  onSelect(items: CrgProject[]): void;
}

@observer
export class SelectProjectsDialog extends Component<SelectProjectDialogProps> {
  async componentDidMount() {
    await projectsService.initAllProjectsStore();
  }

  render() {
    const { open, projects = this.projects, actionButtonLabel, onSelect, onClose } = this.props;

    return (
      <ChooseXTableDialog<CrgProject>
        className={cnSelectProjectDialogProps()}
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
        single
        actionButtonProps={{
          children: actionButtonLabel
        }}
      />
    );
  }

  @computed
  private get projects(): CrgProject[] {
    return allProjects.list.filter(({ role }) => role === Role.OWNER);
  }
}
