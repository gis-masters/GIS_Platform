import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { PropertyEnumeration } from '../../../services/crg/schema.models';

import '!style-loader!css-loader!sass-loader!./SelectOktmo-Caption.scss';

const cnSelectOktmoCaption = cn('SelectOktmo', 'Caption');

interface SelectOktmoCaptionProps {
  item?: PropertyEnumeration;
}

export const SelectOktmoCaption: FC<SelectOktmoCaptionProps> = ({ item }) => (
  <span className={cnSelectOktmoCaption({ empty: !item })}>
    {item ? `${item.title} (${item.value})` : 'Не выбрано'}
  </span>
);
