import React, { Component, createRef } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Projects-Header.scss';

const cnProjectsHeader = cn('Projects', 'Header');

@observer
export class ProjectsHeader extends Component {
  private ref = createRef<HTMLDivElement>();
  private intersectionObserver: IntersectionObserver;
  @observable private stuck = false;

  constructor(props: Record<never, unknown>) {
    super(props);

    this.intersectionObserver = new IntersectionObserver(
      ([e]) => {
        this.setStuck(e.intersectionRatio < 1);
      },
      { threshold: [1] }
    );
  }

  componentDidMount() {
    this.intersectionObserver.observe(this.ref.current);
  }

  componentWillUnmount() {
    this.intersectionObserver.disconnect();
  }

  render() {
    return (
      <div className={cnProjectsHeader({ stuck: this.stuck })} ref={this.ref}>
        {this.props.children}
      </div>
    );
  }

  @action
  private setStuck(stuck: boolean) {
    this.stuck = stuck;
  }
}
