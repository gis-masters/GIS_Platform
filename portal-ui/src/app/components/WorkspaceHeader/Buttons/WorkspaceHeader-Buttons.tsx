import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { BugReport, BugReportOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Pages, route } from '../../../stores/Route.store';
import { sidebars } from '../../../stores/Sidebars.store';
import { CalculatorButton } from '../../CalculatorButton/CalculatorButton';
import { CopyUrlButton } from '../../CopyUrlButton/CopyUrlButton';
import { ExportGmlButton } from '../../ExportGmlButton/ExportGmlButton';
import { HelpToggler } from '../../HelpToggler/HelpToggler';
import { NotificationsToggler } from '../../NotificationsToggler/NotificationsToggler';
import { PrintMapButton } from '../../PrintMapButton/PrintMapButton';
import { RunningOutOfSpace } from '../../RunningOutOfSpace/RunningOutOfSpace';
import { SearchInProject } from '../../SearchInProject/SearchInProject';
import { User } from '../../User/User';

import '!style-loader!css-loader!sass-loader!./WorkspaceHeader-Buttons.scss';

const cnWorkspaceHeaderButtons = cn('WorkspaceHeader', 'Buttons');

@observer
export class WorkspaceHeaderButtons extends Component {
  render() {
    return (
      <div className={cnWorkspaceHeaderButtons()}>
        {route.data.page === Pages.MAP && <SearchInProject />}
        {route.data.page === Pages.DATA_MANAGEMENT && <CalculatorButton />}
        <CopyUrlButton inHeader />
        {route.data.page === Pages.MAP && <PrintMapButton />}
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
        <RunningOutOfSpace />
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
