import React, { FC, useCallback } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Chip, Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./TagsList-Item.scss';

const cnTagsListItem = cn('TagsList', 'Item');

interface TagsListItemProps {
  value: string;
}

interface TagsListItemState {
  over: boolean;
  setOver(over: boolean): void;
}

export const TagsListItem: FC<TagsListItemProps> = observer(({ value }) => {
  const state = useLocalObservable(
    (): TagsListItemState => ({
      over: false,
      setOver(this: TagsListItemState, over: boolean) {
        this.over = over;
      }
    })
  );

  const { over, setOver } = state;

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (over) {
        return;
      }

      const label = e.currentTarget.children[0];

      if (!(label instanceof HTMLElement)) {
        return;
      }

      const overFlow = label.offsetWidth < label.scrollWidth;

      if (!overFlow) {
        return;
      }

      setOver(overFlow);
    },
    [over, setOver]
  );

  const Inner = (
    <Chip size='small' className={cnTagsListItem()} onMouseEnter={handleMouseEnter} label={value} variant='outlined' />
  );

  return <>{over ? <Tooltip title={value}>{Inner}</Tooltip> : Inner}</>;
});
