import { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { CustomStyleDescription } from '../../../services/geoserver/styles/styles.models';

export const cnCustomStyleControlForm = cn('CustomStyleControlForm');

export interface CustomStyleControlFormProps extends IClassNameProps {
  type: CustomStyleDescription['type'];
  value: CustomStyleDescription;
  onChange: (style: CustomStyleDescription) => void;
}

export const CustomStyleControlFormBase: FC<CustomStyleControlFormProps> = () => {
  throw new Error('Не корректный тип стиля');
};
