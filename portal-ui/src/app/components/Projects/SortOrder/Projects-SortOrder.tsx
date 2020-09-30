import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { IconButton, Tooltip } from '@material-ui/core';
import { Sort } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';

import { projectsList } from '../../../stores/ProjectsList.store';

import '!style-loader!css-loader!sass-loader!./Projects-SortOrder.scss';

const cnProjectsSortOrder = cn('Projects', 'SortOrder');

interface ProjectsSortOrderProps {}

@observer
export class ProjectsSortOrder extends Component<ProjectsSortOrderProps> {
  render() {
    return (
      <Tooltip title={projectsList.sortAsc ? 'По возрастанию' : 'По убыванию'}>
        <IconButton className={cnProjectsSortOrder({ asc: projectsList.sortAsc })} onClick={this.handleClick}>
          <Sort />
        </IconButton>
      </Tooltip>
    );
  }

  @boundMethod
  private handleClick() {
    projectsList.setSortAsc(!projectsList.sortAsc);
  }
}
