import { compose } from '@bem-react/core';

import { LibraryDocumentActionsItem as Presenter } from './LibraryDocumentActions-Item';
import { asButton } from './_as/LibraryDocumentActions-Item_as_button';
import { asIconButton } from './_as/LibraryDocumentActions-Item_as_iconButton';
import { asMenu } from './_as/LibraryDocumentActions-Item_as_menu';

export const LibraryDocumentActionsItem = compose(asButton, asIconButton, asMenu)(Presenter);
