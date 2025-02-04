import React from 'react';
import { withBemMod } from '@bem-react/core';

import { CreateLibraryRecordItemSingleButton } from '../../ItemSingleButton/CreateLibraryRecord-ItemSingleButton';
import {
  cnCreateLibraryRecordItem,
  CreateLibraryRecordItemBase,
  CreateLibraryRecordItemProps
} from '../CreateLibraryRecord-Item.base';

export const withSingle = withBemMod<CreateLibraryRecordItemProps, CreateLibraryRecordItemProps>(
  cnCreateLibraryRecordItem(),
  { single: true },
  () => props => <CreateLibraryRecordItemBase {...props} ButtonComponent={CreateLibraryRecordItemSingleButton} />
);
