import React, { Component } from 'react';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Checkbox } from '@mui/material';
import { cn } from '@bem-react/classname';

import { CrgGroup } from '../../../services/auth/groups/groups.models';

const cnOrgActionsUserGroupCheck = cn('OrgActions', 'UserGroupCheck');

interface OrgActionsUserGroupCheckProps {
  group: CrgGroup;
  selectedList: CrgGroup[];
}

@observer
export class OrgActionsUserGroupCheck extends Component<OrgActionsUserGroupCheckProps> {
  constructor(props: OrgActionsUserGroupCheckProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return <Checkbox className={cnOrgActionsUserGroupCheck()} checked={this.selected} onChange={this.handleChange} />;
  }

  @computed
  private get selected(): boolean {
    const { group, selectedList } = this.props;

    return selectedList.includes(group);
  }

  @action.bound
  private handleChange(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    const { group, selectedList } = this.props;

    if (checked) {
      selectedList.push(group);
    } else {
      selectedList.splice(selectedList.indexOf(group), 1);
    }
  }
}
