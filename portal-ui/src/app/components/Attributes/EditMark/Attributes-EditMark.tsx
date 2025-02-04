import React, { FC } from 'react';
import { EditLocationOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { ViewLocation } from '../../Icons/ViewLocation';

import '!style-loader!css-loader!sass-loader!./Attributes-EditMark.scss';

const cnAttributesEditMark = cn('Attributes', 'EditMark');

interface AttributesEditMarkProps {
  readonly: boolean;
}

export const AttributesEditMark: FC<AttributesEditMarkProps> = ({ readonly }) => {
  const Icon = readonly ? ViewLocation : EditLocationOutlined;

  return <Icon className={cnAttributesEditMark()} color='disabled' fontSize='small' />;
};
