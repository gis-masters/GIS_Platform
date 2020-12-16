import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@material-ui/core';
import { BugReport, BugReportOutlined, GetAppOutlined } from '@material-ui/icons';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { env } from '../../../stores/Env.store';
import { route } from '../../../stores/Route.store';
import { sidebars } from '../../../stores/Sidebars.store';
import { communicationService } from '../../../services/communication.service';
import { Pages } from '../../../app-routing.module';
import { NotificationsToggler } from '../../NotificationsToggler/NotificationsToggler';
import { ActionType } from '../../export/export-dilog/export-dialog.component';
import { PrintButton } from '../../PrintButton/PrintButton';
import { HelpToggler } from '../../HelpToggler/HelpToggler';
import { User } from '../../User/User';

import '!style-loader!css-loader!sass-loader!./WorkspaceHeader-Buttons.scss';

const cnWorkspaceHeaderButtons = cn('WorkspaceHeader', 'Buttons');

@observer
export class WorkspaceHeaderButtons extends Component {
  render() {
    return (
      <div className={cnWorkspaceHeaderButtons()}>
        {route.data.page === Pages.MAP && <PrintButton />}

        {route.data.page === Pages.MAP && env.platform === 'conv' && (
          <Tooltip title='Проверка ошибок по приказу'>
            <IconButton onClick={this.handleBugsClick} color='inherit'>
              {sidebars.bugReportOpen ? <BugReport /> : <BugReportOutlined />}
            </IconButton>
          </Tooltip>
        )}

        {route.data.page === Pages.MAP && env.platform === 'conv' && (
          <Tooltip title='Выгрузка GML'>
            <IconButton onClick={this.handleExportClick} color='inherit'>
              <GetAppOutlined />
            </IconButton>
          </Tooltip>
        )}

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

  @boundMethod
  private handleExportClick() {
    communicationService.gmlDialog.emit({ action: ActionType.OPEN, layers: undefined });
  }
}
