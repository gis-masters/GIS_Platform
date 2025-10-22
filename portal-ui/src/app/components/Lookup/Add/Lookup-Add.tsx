import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../../services/models';

import './Lookup-Add.scss';

const cnLookupAdd = cn('Lookup', 'Add');

interface LookupAddProps extends IClassNameProps, ChildrenProps {
  filled: boolean;
}

export const LookupAdd: FC<LookupAddProps> = ({ children, filled, className }) => (
  <div className={cnLookupAdd({ filled }, [className])}>{children}</div>
);
