import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { MenuItem, TextField } from '@material-ui/core';
import { cn } from '@bem-react/classname';

import { allProjects } from '../../../stores/AllProjects.store';
import { CrgProject } from '../../../services/crg/projects.models';

import '!style-loader!css-loader!sass-loader!./Projects-SortBy.scss';

const cnProjectsSortBy = cn('Projects', 'SortBy');

@observer
export class ProjectsSortBy extends Component {
  componentWillUnmount() {
    allProjects.setSortBy('createdAt');
  }

  render() {
    return (
      <TextField
        label='Сортировать по'
        value={allProjects.sortBy}
        className={cnProjectsSortBy()}
        onChange={this.handleChange}
        select
      >
        <MenuItem value='createdAt'>По-умолчанию</MenuItem>
        <MenuItem value='name'>Названию</MenuItem>
        <MenuItem value='layersCount'>Количеству слоёв</MenuItem>
      </TextField>
    );
  }

  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    allProjects.setSortBy(e.target.value as keyof CrgProject);
  }
}
