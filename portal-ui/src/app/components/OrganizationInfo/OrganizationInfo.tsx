import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Container } from '@mui/material';
import { cn } from '@bem-react/classname';

import { OccupiedStorage } from '../../services/auth/organizations/organizations.models';
import { PropertyType, SimpleSchema } from '../../services/data/schema/schema.models';
import { generateRandomId } from '../../services/util/randomId';
import { organizationSettings } from '../../stores/OrganizationSettings.store';
import { Form } from '../Form/Form';

import '!style-loader!css-loader!sass-loader!./OrganizationInfo.scss';

const cnOrganizationInfo = cn('OrganizationInfo');

const schema: SimpleSchema = {
  properties: [
    {
      name: 'allocated',
      title: 'Занято памяти',
      required: true,
      propertyType: PropertyType.STRING
    },
    {
      name: 'totalFiles',
      title: 'Размещено файлов',
      required: true,
      propertyType: PropertyType.STRING
    }
  ]
};

const defaultValue: OccupiedStorage = {
  allocated: '',
  totalFiles: 0
};

@observer
export class OrganizationInfo extends Component {
  @observable private formValue?: OccupiedStorage;

  constructor(props: Record<string, unknown>) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    if (organizationSettings.occupiedStorageInfo) {
      this.setFormValue(organizationSettings.occupiedStorageInfo);
    }
  }

  render() {
    const htmlId = generateRandomId();

    return (
      <Container className={cnOrganizationInfo()} maxWidth='md'>
        <h1 className={cnOrganizationInfo('Title')}>Данные об организации</h1>

        <Form<OccupiedStorage>
          id={htmlId}
          className={cnOrganizationInfo('Form', ['scroll'])}
          readonly
          schema={schema}
          value={this.formValue || defaultValue}
        />
      </Container>
    );
  }

  @action.bound
  private setFormValue(formValue: OccupiedStorage): void {
    formValue.allocated = `${formValue.allocated} из ${organizationSettings.orgSettings?.system?.storageSize} Gb`;

    this.formValue = formValue;
  }
}
