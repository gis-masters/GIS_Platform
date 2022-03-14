import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import '!style-loader!css-loader!sass-loader!./Lookup-Name.scss';

const cnLookupName = cn('Lookup', 'Name');

interface LookupNameProps extends IClassNameProps {
  numerous: boolean;
}

export const LookupName: FC<LookupNameProps> = ({ className, numerous, children }) => (
  <span className={cnLookupName({ numerous }, [className])}>{children}</span>
);
