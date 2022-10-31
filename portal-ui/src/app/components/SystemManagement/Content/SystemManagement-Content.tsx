import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Box, Tab, Tabs } from '@mui/material';
import { action, makeObservable, observable } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { organizationSettings } from '../../../stores/OrganizationSettings.store';
import { OrganizationSettings } from '../../OrganizationSettings/OrganizationSettings';

import '!style-loader!css-loader!sass-loader!./SystemManagement-Content.scss';

const cnSystemManagementContent = cn('SystemManagement', 'Content');

@observer
export class SystemManagementContent extends Component {
  @observable private value = 0;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <Box sx={{ width: '100%' }}>
        <Tabs className={cnSystemManagementContent()} onChange={this.changeHandler} value={this.value}>
          {organizationSettings.systemSettings?.map((org, i) => (
            <Tab label={org.id} value={i} key={i} />
          ))}
        </Tabs>

        {organizationSettings.systemSettings?.map((org, i) => (
          <div hidden={this.value !== i} key={i}>
            <OrganizationSettings orgSettings={org} systemManagement />
          </div>
        ))}

        {!organizationSettings.systemSettings.length && <>Нет настроек организаций</>}
      </Box>
    );
  }

  @boundMethod
  private changeHandler(e: React.ChangeEvent, value: number) {
    this.setValue(value);
  }

  @action.bound
  private setValue(value: number) {
    this.value = value;
  }
}
