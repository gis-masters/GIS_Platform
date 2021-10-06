import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { BugReport, BugReportOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { User } from '../../User/User';
import { route } from '../../../stores/Route.store';
import { Pages } from '../../../app-routing.module';
import { sidebars } from '../../../stores/Sidebars.store';
import { PrintButton } from '../../PrintButton/PrintButton';
import { HelpToggler } from '../../HelpToggler/HelpToggler';
import { ExportGmlButton } from '../../ExportGmlButton/ExportGmlButton';
import { NotificationsToggler } from '../../NotificationsToggler/NotificationsToggler';
import { CopyUrlButton } from '../../CopyUrlButton/CopyUrlButton';

import '!style-loader!css-loader!sass-loader!./WorkspaceHeader-Buttons.scss';

const cnWorkspaceHeaderButtons = cn('WorkspaceHeader', 'Buttons');

@observer
export class WorkspaceHeaderButtons extends Component {
  render() {
    return (
      <div className={cnWorkspaceHeaderButtons()}>
        <CopyUrlButton inHeader />
        {route.data.page === Pages.MAP && <PrintButton />}
        {route.data.page === Pages.MAP && (
          <Tooltip title='Проверка ошибок по приказу'>
            <IconButton onClick={this.handleBugsClick} color='inherit'>
              {sidebars.bugReportOpen ? <BugReport /> : <BugReportOutlined />}
            </IconButton>
          </Tooltip>
        )}

        {route.data.page === Pages.MAP && <ExportGmlButton />}

        <HelpToggler />
        <NotificationsToggler />
        <User />
      </div>
    );
  }

  @boundMethod
  private handleBugsClick() {
    if (sidebars.bugReportOpen) {
      sidebars.closeBugReport();
    } else {
      sidebars.openBugReport();
    }
  }
}
