import React, { useCallback, useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Skeleton } from '@mui/material';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';
import { isEqual } from 'lodash';

import type { OrganizationInformation } from '../../services/auth/organizations/organizations.models';
import { organizationsService } from '../../services/auth/organizations/organizations.service';
import { usersService } from '../../services/auth/users/users.service';
import { PropertyType, SimpleSchema } from '../../services/data/schema/schema.models';
import { generateRandomId } from '../../services/util/randomId';
import { achtung } from '../../services/utility-dialogs.service';
import { organizationSettings } from '../../stores/OrganizationSettings.store';
import { Button } from '../Button/Button';
import { Form } from '../Form/Form';

import '!style-loader!css-loader!sass-loader!./OrganizationInfoDetailForm.scss';

const cnOrganizationInfoDetailForm = cn('OrganizationInfoDetailForm');

const orgDetailFormSchema: SimpleSchema = {
  properties: [
    {
      name: 'name',
      title: 'Название организации',
      required: true,
      minLength: 5,
      propertyType: PropertyType.STRING
    },
    {
      name: 'description',
      title: 'Описание организации',
      display: 'multiline',
      maxLength: 2000,
      propertyType: PropertyType.STRING
    },
    {
      name: 'phone',
      title: 'Телефон организации',
      required: true,
      display: 'phone',
      propertyType: PropertyType.STRING
    }
  ]
};

const defaultOrgDetailValue: OrganizationInformation = {
  name: '',
  description: '',
  phone: ''
};

interface OrganizationDetailState {
  orgDetailFormValue?: OrganizationInformation;
  orgDetailInitialValue?: OrganizationInformation;
  organizationId?: number;
  busy: boolean;
  setOrgDetailFormValue(value?: OrganizationInformation): void;
  setOrgDetailInitialValue(value?: OrganizationInformation): void;
  setOrganizationId(id?: number): void;
  setBusy(busy: boolean): void;
}

export const OrganizationInfoDetailForm: React.FC = observer(() => {
  const state = useLocalObservable(
    (): OrganizationDetailState => ({
      orgDetailFormValue: undefined,
      orgDetailInitialValue: undefined,
      organizationId: undefined,
      busy: false,

      setOrgDetailFormValue(value?: OrganizationInformation) {
        this.orgDetailFormValue = value;
      },
      setOrgDetailInitialValue(value?: OrganizationInformation) {
        this.orgDetailInitialValue = value;
      },
      setOrganizationId(id?: number) {
        this.organizationId = id;
      },
      setBusy(busy: boolean) {
        this.busy = busy;
      }
    })
  );

  const {
    orgDetailFormValue,
    orgDetailInitialValue,
    organizationId,
    busy,
    setOrgDetailFormValue,
    setOrgDetailInitialValue,
    setOrganizationId,
    setBusy
  } = state;

  const save = useCallback(
    async (value: OrganizationInformation) => {
      if (organizationId) {
        setBusy(true);

        try {
          await organizationsService.updateOrganization(organizationId, value);
          setOrgDetailInitialValue({ ...orgDetailInitialValue, ...value });
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          await achtung({
            title: 'Ошибка',
            message: err.response?.data.message || 'Не удалось обновить данные организации'
          });
        } finally {
          await usersService.updateUserOrgInfo();

          setBusy(false);
        }
      }
    },
    [organizationId, setBusy]
  );

  const formChange = useCallback(
    (value: OrganizationInformation) => {
      setOrgDetailFormValue({ ...orgDetailFormValue, ...value });
    },
    [orgDetailFormValue, setOrgDetailFormValue]
  );

  useEffect(() => {
    const getInfo = async () => {
      const org = await organizationsService.getOrganization(organizationSettings.orgSettings?.id || 0);
      setOrganizationId(org.id);

      const orgDetail = {
        name: org.name,
        description: org.description,
        phone: org.phone
      };

      setOrgDetailFormValue(orgDetail);
      setOrgDetailInitialValue(orgDetail);
    };

    void getInfo();
  }, [setOrgDetailFormValue, setOrgDetailInitialValue, setOrganizationId]);

  const htmlIdOrgDetailForm = generateRandomId();

  return orgDetailFormValue ? (
    <Form<OrganizationInformation>
      id={htmlIdOrgDetailForm}
      className={cnOrganizationInfoDetailForm(null, ['scroll'])}
      schema={orgDetailFormSchema}
      value={orgDetailFormValue || defaultOrgDetailValue}
      actionFunction={save}
      onFormChange={formChange}
      auto
      actions={
        <Button
          loading={busy}
          disabled={isEqual(orgDetailInitialValue, orgDetailFormValue)}
          form={htmlIdOrgDetailForm}
          color='primary'
          type='submit'
        >
          Сохранить
        </Button>
      }
    />
  ) : (
    <Skeleton height={24} animation='wave' />
  );
});
