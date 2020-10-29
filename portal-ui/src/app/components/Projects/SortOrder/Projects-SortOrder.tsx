import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { projectsList } from '../../../stores/ProjectsList.store';
import { SortOrderButton } from '../../SortOrderButton/SortOrderButton';

const cnProjectsSortOrder = cn('Projects', 'SortOrder');

interface ProjectsSortOrderProps {}

@observer
export class ProjectsSortOrder extends Component<ProjectsSortOrderProps> {
  render() {
    return <SortOrderButton asc={projectsList.sortAsc} onClick={this.handleClick} />;
  }

  @boundMethod
  private handleClick() {
    projectsList.setSortAsc(!projectsList.sortAsc);
  }
}
