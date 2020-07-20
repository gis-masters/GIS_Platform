import React, { Component } from 'react';
import { computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Checkbox } from '@material-ui/core';

import { CrgGroup } from '../../../services/crg/groups.service';

const cnOrgActionsUserGroupCheck = cn('OrgActions', 'UserGroupCheck');

interface OrgActionsUserGroupCheckProps {
  group: CrgGroup;
  selectedList: CrgGroup[];
}

@observer
export class OrgActionsUserGroupCheck extends Component<OrgActionsUserGroupCheckProps> {
  render() {
    return <Checkbox className={cnOrgActionsUserGroupCheck()} checked={this.selected} onChange={this.changeHandler} />;
  }

  @computed
  private get selected(): boolean {
    const { group, selectedList } = this.props;

    return selectedList.includes(group);
  }

  @action.bound
  private changeHandler(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    const { group, selectedList } = this.props;

    if (checked) {
      selectedList.push(group);
    } else {
      selectedList.splice(selectedList.indexOf(group), 1);
    }
  }
}
