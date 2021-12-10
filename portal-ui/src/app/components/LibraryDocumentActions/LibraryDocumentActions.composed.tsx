import { compose } from '@bem-react/core';

import { LibraryDocumentActions as Presenter } from './LibraryDocumentActions';
import { asMenu } from './_as/LibraryDocumentActions_as_menu';

export const LibraryDocumentActions = compose(asMenu)(Presenter);
