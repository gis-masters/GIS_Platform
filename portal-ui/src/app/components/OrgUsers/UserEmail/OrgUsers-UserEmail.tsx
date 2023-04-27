import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { FilterQuery, getFieldFilterValue } from '../../../services/util/filterObjects';
import { Highlight } from '../../Highlight/Highlight';
import { TextBadge } from '../../TextBadge/TextBadge';

import { CrgUserExtended } from '../OrgUsers';

const cnOrgUsersUserEmail = cn('OrgUsers', 'UserEmail');

interface OrgUsersUserEmailProps {
  rowData: CrgUserExtended;
  filterActive: boolean;
  filterParams: FilterQuery;
}

export const OrgUsersUserEmail: FC<OrgUsersUserEmailProps> = ({ rowData, filterActive, filterParams }) => (
  <span className={cnOrgUsersUserEmail()}>
    <Highlight word={getFieldFilterValue(filterParams, 'email')} enabled={filterActive}>
      {rowData.email}
    </Highlight>
    {rowData.login && rowData.login !== rowData.email && ` / ${rowData.login}`}
    <TextBadge id={rowData.id} />
  </span>
);
