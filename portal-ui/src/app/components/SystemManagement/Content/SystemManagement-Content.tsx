import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Container } from '@mui/material';
import { action, makeObservable, observable } from 'mobx';
import { cn } from '@bem-react/classname';

import { organizationSettings, OrgSettings } from '../../../stores/OrganizationSettings.store';
import { OrganizationSettings } from '../../OrganizationSettings/OrganizationSettings';
import { ChooseXTableDialog } from '../../ChooseXTableDialog/ChooseXTableDialog';
import { PropertyType } from '../../../services/data/schema.models';
import { XTableColumn } from '../../XTable/XTable.async';
import { Button } from '../../Button/Button';

import '!style-loader!css-loader!sass-loader!./SystemManagement-Content.scss';

const cnSystemManagementContent = cn('SystemManagement', 'Content');

@observer
export class SystemManagementContent extends Component {
  @observable private organization: OrgSettings;
  @observable private dialogOpen = false;

  private cols: XTableColumn<OrgSettings>[] = [
    {
      field: 'id',
      title: 'ID',
      type: PropertyType.INT,
      filterable: true,
      sortable: true
    },
    {
      field: 'name',
      title: 'Название',
      type: PropertyType.STRING,
      filterable: true,
      sortable: true
    }
  ];

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <Container className={cnSystemManagementContent()} maxWidth='md'>
        <Button onClick={this.openDialog} color='primary'>
          Выбрать организацию
        </Button>

        <ChooseXTableDialog<OrgSettings>
          title='Выберите организацию'
          data={organizationSettings.systemSettings}
          cols={this.cols}
          open={this.dialogOpen}
          onClose={this.closeDialog}
          onSelect={this.select}
          selectedItems={this.organization && [this.organization]}
          single
        />

        {this.organization && <OrganizationSettings orgSettings={this.organization} systemManagement />}

        {!organizationSettings.systemSettings.length && <>Нет настроек организаций</>}
      </Container>
    );
  }

  @action.bound
  private select(organizations: OrgSettings[]) {
    const [organization] = organizations;
    this.organization = organization;

    this.closeDialog();
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }
}
