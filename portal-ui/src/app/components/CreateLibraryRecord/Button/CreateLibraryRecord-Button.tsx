import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import { Library, LibraryRecord } from '../../../services/data/library/library.models';
import { ContentType } from '../../../services/data/schema/schema.models';
import { MenuIconButton } from '../../MenuIconButton/MenuIconButton';
import { CreateLibraryRecordItem } from '../Item/CreateLibraryRecord-Item.composed';

const cnCreateLibraryRecordButton = cn('CreateLibraryRecord', 'Button');

interface CreateLibraryRecordButtonProps {
  icon: ReactNode;
  contentTypes: ContentType[];
  library: Library;
  parent: LibraryRecord | undefined;
  onCreate(record: LibraryRecord, isFolder: boolean): void;
}

export const CreateLibraryRecordButton: FC<CreateLibraryRecordButtonProps> = ({
  icon,
  contentTypes,
  library,
  parent,
  onCreate
}) => (
  <MenuIconButton className={cnCreateLibraryRecordButton()} icon={icon} keepMounted>
    {contentTypes.map((contentType, i) => (
      <CreateLibraryRecordItem
        contentType={contentType}
        library={library}
        parent={parent}
        key={i}
        onCreate={onCreate}
      />
    ))}
  </MenuIconButton>
);
