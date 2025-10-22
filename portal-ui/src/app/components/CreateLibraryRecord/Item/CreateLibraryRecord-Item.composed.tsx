import { compose, type HOC } from '@bem-react/core';

import { withSingle } from './_single/CreateLibraryRecord-Item_single';
import { CreateLibraryRecordItemBase, type CreateLibraryRecordItemProps } from './CreateLibraryRecord-Item.base';

export const CreateLibraryRecordItem = compose(withSingle as HOC<CreateLibraryRecordItemProps>)(
  CreateLibraryRecordItemBase
);
