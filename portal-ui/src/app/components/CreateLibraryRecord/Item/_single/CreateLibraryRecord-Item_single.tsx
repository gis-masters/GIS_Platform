import React from 'react';
import { withBemMod } from '@bem-react/core';

import {
  CreateLibraryRecordItemProps,
  cnCreateLibraryRecordItem,
  CreateLibraryRecordItemBase
} from '../CreateLibraryRecord-Item.base';
import { CreateLibraryRecordItemSingleButton } from '../../ItemSingleButton/CreateLibraryRecord-ItemSingleButton';

export const withSingle = withBemMod<CreateLibraryRecordItemProps, CreateLibraryRecordItemProps>(
  cnCreateLibraryRecordItem(),
  { single: true },
  () => props => <CreateLibraryRecordItemBase {...props} ButtonComponent={CreateLibraryRecordItemSingleButton} />
);
