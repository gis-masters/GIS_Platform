import React, { Component } from 'react';
import { IconButton } from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { CrgProject } from '../../services/crg/projects.models';
import { projectsService } from '../../services/crg/projects.service';
import { SortParams } from '../../services/util/sortObjects';
import { allProjects } from '../../stores/AllProjects.store';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';
import { FormControlProps } from '../Form/Control/Form-Control';
import { Button } from '../Button/Button';
import { XTableColumn } from '../XTable/XTable';

import { SelectProjectCaption } from './Caption/SelectProject-Caption';

import '!style-loader!css-loader!sass-loader!./SelectProject.scss';

const cnSelectProject = cn('SelectProject');

@observer
export class SelectProject extends Component<FormControlProps> {
  @observable private dialogOpen = false;

  private cols: XTableColumn<CrgProject>[] = [
    {
      field: 'name',
      title: 'Название проекта',
      filtering: true,
      sorting: true
    }
  ];

  private sortParams: SortParams<CrgProject> = { asc: true, field: 'name' };

  async componentDidMount() {
    await projectsService.initAllProjectsStore();
  }

  render() {
    const selectedProject = this.props.fieldValue as CrgProject;

    return (
      <>
        <div className={cnSelectProject({ empty: !selectedProject })}>
          <SelectProjectCaption project={selectedProject} />
          {selectedProject && (
            <IconButton onClick={this.clear} size='small'>
              <Clear />
            </IconButton>
          )}
          <Button onClick={this.openDialog}>Выбрать</Button>
        </div>
        <ChooseXTableDialog<CrgProject>
          title='Выбор проекта'
          items={allProjects.list}
          selectedItems={selectedProject && [selectedProject]}
          cols={this.cols}
          defaultSort={this.sortParams}
          secondarySortField='createdAt'
          open={this.dialogOpen}
          onClose={this.closeDialog}
          onSelect={this.select}
          getRowId={this.getItemId}
          single
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

  @action.bound
  private clear() {
    const { onChange, property } = this.props;
    onChange({ value: undefined, propertyName: property.name });
  }

  @action.bound
  private select([project]: CrgProject[]) {
    const { onChange, property } = this.props;
    onChange({ value: project, propertyName: property.name });
    this.closeDialog();
  }

  private getItemId({ id }: CrgProject): string {
    return String(id);
  }
}
