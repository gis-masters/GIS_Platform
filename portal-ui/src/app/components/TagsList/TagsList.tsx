import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Stack } from '@mui/material';
import { cn } from '@bem-react/classname';

import { TagsListItem } from './Item/TagsList-Item';

import '!style-loader!css-loader!sass-loader!./TagsList.scss';

const cnTagsList = cn('TagsList');

interface TagsListProps {
  tags: string[];
}

export const TagsList: FC<TagsListProps> = observer(({ tags }) => (
  <Stack className={cnTagsList()} direction='row'>
    {tags.map((tag, idx) => (
      <TagsListItem key={idx} value={tag} />
    ))}
  </Stack>
));
