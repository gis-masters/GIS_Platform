import React, { Component } from 'react';
import { ListItemButton, ListItemText } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { OrganizationsListItemInfo } from '../../../services/auth/auth.service';

const cnLoginFormOrgSelectListItem = cn('LoginForm', 'OrgSelectListItem');

interface LoginFormOrgSelectListItemProps {
  organization: OrganizationsListItemInfo;
  onClick(orgId: number): void;
}

export class LoginFormOrgSelectListItem extends Component<LoginFormOrgSelectListItemProps> {
  render() {
    const { organization } = this.props;

    return (
      <ListItemButton className={cnLoginFormOrgSelectListItem()} onClick={this.handleClick}>
        <ListItemText primary={organization.name} />
      </ListItemButton>
    );
  }

  @boundMethod
  private handleClick() {
    const { organization, onClick } = this.props;
    onClick(organization.id);
  }
}
