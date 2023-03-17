import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import { DocumentLibrary, LibraryRecord } from '../../../services/data/docLibrary/docLibrary.models';
import { ContentType, Schema } from '../../../services/data/schema/schema.models';
import { MenuIconButton } from '../../MenuIconButton/MenuIconButton';

import { CreateLibraryRecordItem } from '../Item/CreateLibraryRecord-Item.composed';

const cnCreateLibraryRecordButton = cn('CreateLibraryRecord', 'Button');

interface CreateLibraryRecordButtonProps {
  icon: ReactNode;
  contentTypes: ContentType[];
  schema: Schema;
  library: DocumentLibrary;
  parent: LibraryRecord | undefined;
  onCreate(record: LibraryRecord, isFolder: boolean): void;
}

export const CreateLibraryRecordButton: FC<CreateLibraryRecordButtonProps> = ({
  icon,
  contentTypes,
  schema,
  library,
  parent,
  onCreate
}) => (
  <MenuIconButton className={cnCreateLibraryRecordButton()} icon={icon} keepMounted>
    {contentTypes.map((contentType, i) => (
      <CreateLibraryRecordItem
        contentType={contentType}
        schema={schema}
        library={library}
        parent={parent}
        key={i}
        onCreate={onCreate}
      />
    ))}
  </MenuIconButton>
);
