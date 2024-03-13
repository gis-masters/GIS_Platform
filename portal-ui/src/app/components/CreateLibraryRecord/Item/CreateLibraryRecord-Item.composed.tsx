import { HOC, compose } from '@bem-react/core';

import { CreateLibraryRecordItemBase, CreateLibraryRecordItemProps } from './CreateLibraryRecord-Item.base';
import { withSingle } from './_single/CreateLibraryRecord-Item_single';

export const CreateLibraryRecordItem = compose(withSingle as HOC<CreateLibraryRecordItemProps>)(
  CreateLibraryRecordItemBase
);
