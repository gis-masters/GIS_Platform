import React, { type FC } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { BugReport, BugReportOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { MapAction } from '../../../services/map/map.models';
import { mapStore } from '../../../stores/Map.store';
import { organizationSettings } from '../../../stores/OrganizationSettings.store';
import { Pages, route } from '../../../stores/Route.store';
import { sidebars } from '../../../stores/Sidebars.store';
import { CalculatorButton } from '../../CalculatorButton/CalculatorButton';
import { CopyUrlButton } from '../../CopyUrlButton/CopyUrlButton';
import { ExportGmlMenu } from '../../ExportGmlMenu/ExportGmlMenu';
import { HelpToggler } from '../../HelpToggler/HelpToggler';
import { IconButton } from '../../IconButton/IconButton';
import { ImportButton } from '../../ImportButton/ImportButton';
import { NotificationsToggler } from '../../NotificationsToggler/NotificationsToggler';
import { PrintMapButton } from '../../PrintMapButton/PrintMapButton';
import { RunningOutOfSpace } from '../../RunningOutOfSpace/RunningOutOfSpace';
import { SearchInProject } from '../../SearchInProject/SearchInProject';
import { User } from '../../User/User';

import './WorkspaceHeader-Buttons.scss';

const cnWorkspaceHeaderButtons = cn('WorkspaceHeader', 'Buttons');

function handleBugsClick() {
  if (sidebars.bugReportOpen) {
    sidebars.closeBugReport();
  } else {
    sidebars.openBugReport();
  }
}

export const WorkspaceHeaderButtons: FC = observer(() => (
  <div className={cnWorkspaceHeaderButtons()}>
    {route.data.page === Pages.MAP && <SearchInProject />}
    {route.data.page === Pages.DATA_MANAGEMENT && organizationSettings.viewServicesCalculator && <CalculatorButton />}
    <CopyUrlButton inHeader />
    {route.data.page === Pages.MAP && <PrintMapButton />}
    {route.data.page === Pages.MAP && organizationSettings.viewBugReport && (
      <Tooltip title='Проверка ошибок по приказу'>
        <IconButton
          onClick={handleBugsClick}
          color='inherit'
          disabled={!mapStore.allowedActions.includes(MapAction.CHECK_BUGS)}
        >
          {sidebars.bugReportOpen ? <BugReport /> : <BugReportOutlined />}
        </IconButton>
      </Tooltip>
    )}

    {route.data.page === Pages.MAP && (
      <>
        <ImportButton />
        <ExportGmlMenu />
      </>
    )}

    <HelpToggler />
    <NotificationsToggler />
    <RunningOutOfSpace />
    <User />
  </div>
));
