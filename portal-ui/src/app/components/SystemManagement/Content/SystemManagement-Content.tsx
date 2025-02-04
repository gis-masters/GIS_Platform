import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Container } from '@mui/material';
import { cn } from '@bem-react/classname';

import { organizationsService } from '../../../services/auth/organizations/organizations.service';
import { PropertyType } from '../../../services/data/schema/schema.models';
import { CompositeSettings, organizationSettings } from '../../../stores/OrganizationSettings.store';
import { Button } from '../../Button/Button';
import { ChooseXTableDialog } from '../../ChooseXTableDialog/ChooseXTableDialog';
import { OrganizationSettings } from '../../OrganizationSettings/OrganizationSettings';
import { XTableColumn } from '../../XTable/XTable.models';

import '!style-loader!css-loader!sass-loader!./SystemManagement-Content.scss';

const cnSystemManagementContent = cn('SystemManagement', 'Content');

@observer
export class SystemManagementContent extends Component {
  @observable private organization?: CompositeSettings;
  @observable private dialogOpen = false;

  private cols: XTableColumn<CompositeSettings>[] = [
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

    if (!('__clearAllTestOrganizations' in window)) {
      Object.assign(window, {
        __clearAllTestOrganizations: organizationsService.__clearAllTestOrganizations
      });
    }
  }

  render() {
    return (
      <Container className={cnSystemManagementContent()} maxWidth='md'>
        <Button onClick={this.openDialog} color='primary'>
          Выбрать организацию
        </Button>

        <ChooseXTableDialog<CompositeSettings>
          title='Выберите организацию'
          data={organizationSettings.systemSettings || []}
          cols={this.cols}
          open={this.dialogOpen}
          onClose={this.closeDialog}
          onSelect={this.select}
          selectedItems={this.organization && [this.organization]}
          single
        />

        {this.organization && <OrganizationSettings orgSettings={this.organization} systemManagement />}

        {!organizationSettings.systemSettings?.length && <>Нет настроек организаций</>}
      </Container>
    );
  }

  @action.bound
  private select(organizations: CompositeSettings[]) {
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
