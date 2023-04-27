import { compose } from '@bem-react/core';

import { CreateLibraryRecordItemBase } from './CreateLibraryRecord-Item.base';
import { withSingle } from './_single/CreateLibraryRecord-Item_single';

export const CreateLibraryRecordItem = compose(withSingle)(CreateLibraryRecordItemBase);
