import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { TextField } from '@material-ui/core';

import { projectsList } from '../../../stores/ProjectsList.store';

import '!style-loader!css-loader!sass-loader!./Projects-Filter.scss';

const cnProjectsFilter = cn('Projects', 'Filter');

@observer
export class ProjectsFilter extends Component {
  componentWillUnmount() {
    projectsList.setNameFilter('');
  }

  render() {
    return (
      <TextField
        label='Поиск по названию'
        value={projectsList.nameFilter}
        className={cnProjectsFilter()}
        onChange={this.handleChange}
        InputProps={{
          startAdornment: ' '
        }}
      />
    );
  }

  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    projectsList.setNameFilter(e.target.value);
  }
}
