import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@material-ui/core';
import { BugReport, GetApp } from '@material-ui/icons';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Pages } from '../../../app-routing.module';
import { route } from '../../../stores/Route.store';
import { sidebars } from '../../../stores/Sidebars.store';
import { communicationService } from '../../../services/communication.service';
import { Platform, getEnvironment } from '../../../services/environment';
import { NotificationsToggler } from '../../NotificationsToggler/NotificationsToggler';
import { ActionType } from '../../export/export-dilog/export-dialog.component';
import { PrintButton } from '../../PrintButton/PrintButton';
import { HelpToggler } from '../../HelpToggler/HelpToggler';
import { User } from '../../User/User';

import '!style-loader!css-loader!sass-loader!./WorkspaceHeader-Buttons.scss';

const cnWorkspaceHeaderButtons = cn('WorkspaceHeader', 'Buttons');

@observer
export class WorkspaceHeaderButtons extends Component {
  @observable private platform: Platform = 'simf';

  async componentDidMount() {
    const { platform } = await getEnvironment();
    this.setPlatform(platform);
  }

  render() {
    return (
      <div className={cnWorkspaceHeaderButtons()}>
        {route.data.page === Pages.MAP && <PrintButton />}

        {route.data.page === Pages.MAP && this.platform === 'conv' && (
          <Tooltip title='Проверка ошибок по приказу'>
            <IconButton onClick={this.handleBugsClick} color='inherit'>
              <BugReport />
            </IconButton>
          </Tooltip>
        )}

        {route.data.page === Pages.MAP && this.platform === 'conv' && (
          <Tooltip title='Выгрузка GML'>
            <IconButton onClick={this.handleExportClick} color='inherit'>
              <GetApp />
            </IconButton>
          </Tooltip>
        )}

        <HelpToggler />
        <NotificationsToggler />
        <User />
      </div>
    );
  }

  @action
  private setPlatform(platform: Platform) {
    this.platform = platform;
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
