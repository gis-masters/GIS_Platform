import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { cn } from '@bem-react/classname';

import { allProjects } from '../../../stores/AllProjects.store';

import '!style-loader!css-loader!sass-loader!./Projects-Filter.scss';

const cnProjectsFilter = cn('Projects', 'Filter');

@observer
export class ProjectsFilter extends Component {
  componentWillUnmount() {
    allProjects.setNameFilter('');
  }

  render() {
    return (
      <TextField
        label='Фильтр по названию'
        variant='standard'
        value={allProjects.nameFilter}
        className={cnProjectsFilter()}
        onChange={this.handleChange}
        InputProps={{
          startAdornment: ' '
        }}
      />
    );
  }

  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    allProjects.setNameFilter(e.target.value);
  }
}
