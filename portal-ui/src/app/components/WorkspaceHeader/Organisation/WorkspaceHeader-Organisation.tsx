import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { usersService } from '../../../services/crg/users.service';

import '!style-loader!css-loader!sass-loader!./WorkspaceHeader-Organisation.scss';

const cnWorkspaceHeaderOrganisation = cn('WorkspaceHeader', 'Organisation');

@observer
export class WorkspaceHeaderOrganisation extends Component {
  @observable private title: string = '';

  async componentDidMount() {
    const { orgName } = await usersService.getCurrent();
    this.setTitle(orgName);
  }

  render() {
    return <div className={cnWorkspaceHeaderOrganisation()}>{this.title}</div>;
  }

  @action
  private setTitle(title: string) {
    this.title = title;
  }
}
