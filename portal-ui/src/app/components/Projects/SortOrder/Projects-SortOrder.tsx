import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';

import { allProjects } from '../../../stores/AllProjects.store';
import { SortOrderButton } from '../../SortOrderButton/SortOrderButton';

@observer
export class ProjectsSortOrder extends Component {
  render() {
    return <SortOrderButton asc={allProjects.sortAsc} onClick={this.handleClick} />;
  }

  @boundMethod
  private handleClick() {
    allProjects.setSortAsc(!allProjects.sortAsc);
  }
}
