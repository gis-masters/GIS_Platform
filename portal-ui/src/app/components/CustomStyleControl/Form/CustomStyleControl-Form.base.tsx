import { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { Schema } from '../../../services/data/schema/schema.models';
import { CustomStyleDescription } from '../../../services/geoserver/styles/styles.models';

export const cnCustomStyleControlForm = cn('CustomStyleControl', 'Form');

export interface CustomStyleControlFormProps extends IClassNameProps {
  type: CustomStyleDescription['type'];
  value: CustomStyleDescription;
  withIcon?: boolean;
  schema: Schema;
  onChange(style: CustomStyleDescription): void;
}

export const CustomStyleControlFormBase: FC<CustomStyleControlFormProps> = () => {
  throw new Error('Не корректный тип стиля');
};
