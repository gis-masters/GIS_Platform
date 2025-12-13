import React, { type FC } from 'react';
import { observer } from 'mobx-react';
import { Container, Divider } from '@mui/material';
import { cn } from '@bem-react/classname';

import { OrganizationInfoDetailForm } from '../OrganizationInfoDetailForm/OrganizationInfoDetailForm';
import { OrganizationInfoStorageForm } from '../OrganizationInfoStorageForm/OrganizationInfoStorageForm';

import './OrganizationInfo.scss';

const cnOrganizationInfo = cn('OrganizationInfo');

export const OrganizationInfo: FC = observer(() => {
  return (
    <Container className={cnOrganizationInfo()} maxWidth='md'>
      <h1 className={cnOrganizationInfo('Title')}>Данные об организации</h1>

      <OrganizationInfoStorageForm />

      <Divider />

      <OrganizationInfoDetailForm />
    </Container>
  );
});
