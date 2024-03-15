import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { OpenSchemaAction } from '../OpenSchemaAction/OpenSchemaAction';
import { Library } from '../../services/data/library/library.models';

const cnLibraryActions = cn('LibraryActions');

interface LibraryActionsProps {
  library: Library;
}

export const LibraryActions: FC<LibraryActionsProps> = ({ library }) =>
  library && <OpenSchemaAction className={cnLibraryActions()} readonly schema={library.schema} />;
