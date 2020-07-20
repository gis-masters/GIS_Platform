import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { IconButton } from '@material-ui/core';
import { Settings } from '@material-ui/icons';

import { isManagementAllowed } from '../../services/crg/permissions.service';
import { Link } from '../Link/Link';

import '!style-loader!css-loader!sass-loader!./OrgAdminButton.scss';

const cnOrgAdminButton = cn('OrgAdminButton');

export class OrgAdminButton extends Component {
  private managementAllowed = false;

  constructor(props: {}) {
    super(props);

    this.managementAllowed = isManagementAllowed();
  }

  render() {
    if (!this.managementAllowed) {
      return null;
    }

    return (
      <Link className={cnOrgAdminButton()} url='/org-admin'>
        <IconButton className={cnOrgAdminButton()}>
          <Settings />
        </IconButton>
      </Link>
    );
  }
}
