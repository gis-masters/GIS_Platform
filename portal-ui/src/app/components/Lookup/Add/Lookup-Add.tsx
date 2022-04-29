import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import '!style-loader!css-loader!sass-loader!./Lookup-Add.scss';

const cnLookupAdd = cn('Lookup', 'Add');

interface LookupAddProps extends IClassNameProps {
  filled: boolean;
  children: ReactNode;
}

export const LookupAdd: FC<LookupAddProps> = ({ children, filled, className }) => (
  <div className={cnLookupAdd({ filled }, [className])}>{children}</div>
);
