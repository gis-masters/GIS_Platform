import React from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { cn } from '@bem-react/classname';

import type { OccupiedStorage } from '../../services/auth/organizations/organizations.models';
import { PropertyType, SimpleSchema } from '../../services/data/schema/schema.models';
import { generateRandomId } from '../../services/util/randomId';
import { organizationSettings } from '../../stores/OrganizationSettings.store';
import { Form } from '../Form/Form';

import '!style-loader!css-loader!sass-loader!./OrganizationInfoStorageForm.scss';

const cnOrganizationInfoStorageForm = cn('OrganizationInfoStorageForm');

const storageFormSchema: SimpleSchema = {
  properties: [
    {
      name: 'allocated',
      title: 'Занято памяти',
      required: true,
      readOnly: true,
      propertyType: PropertyType.STRING
    },
    {
      name: 'totalFiles',
      title: 'Размещено файлов',
      required: true,
      readOnly: true,
      propertyType: PropertyType.STRING
    }
  ]
};

const defaultValue: OccupiedStorage = {
  allocated: '',
  totalFiles: 0
};

export const OrganizationInfoStorageForm: React.FC = observer(() => {
  const state = useLocalObservable(() => ({
    get storageFormValue() {
      return organizationSettings.occupiedStorageInfo || defaultValue;
    }
  }));

  const htmlIdStorageForm = generateRandomId();

  return (
    <Form<OccupiedStorage>
      id={htmlIdStorageForm}
      className={cnOrganizationInfoStorageForm(null, ['scroll'])}
      readonly
      schema={storageFormSchema}
      value={state.storageFormValue || defaultValue}
    />
  );
});
