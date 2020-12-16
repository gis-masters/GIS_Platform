import React, { Component, createRef } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { currentUser } from '../../../stores/CurrentUser.store';

import { ProjectsFilter } from '../Filter/Projects-Filter';
import { ProjectsSortBy } from '../SortBy/Projects-SortBy';
import { ProjectsSortOrder } from '../SortOrder/Projects-SortOrder';
import { ProjectsAdd } from '../Add/Projects-Add';

import '!style-loader!css-loader!sass-loader!./Projects-Header.scss';

const cnProjectsHeader = cn('Projects', 'Header');

@observer
export class ProjectsHeader extends Component {
  private ref = createRef<HTMLDivElement>();
  private intersectionObserver: IntersectionObserver;
  @observable private stuck = false;

  constructor(props: {}) {
    super(props);

    this.intersectionObserver = new IntersectionObserver(
      ([e]) => {
        this.setStuck(e.intersectionRatio < 1);
      },
      { threshold: [1] }
    );
  }

  async componentDidMount() {
    this.intersectionObserver.observe(this.ref.current);
  }

  componentWillUnmount() {
    this.intersectionObserver.disconnect();
  }

  render() {
    return (
      <div className={cnProjectsHeader({ stuck: this.stuck })} ref={this.ref}>
        <ProjectsFilter />
        <ProjectsSortBy />
        <ProjectsSortOrder />
        {currentUser.isAdmin && <ProjectsAdd />}
      </div>
    );
  }

  @action
  private setStuck(stuck: boolean) {
    this.stuck = stuck;
  }
}
