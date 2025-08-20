import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Lookup-List.scss';

const cnLookupList = cn('Lookup', 'List');

interface LookupListProps extends ChildrenProps {
  numerous: boolean;
  multiple?: boolean;
  editable?: boolean;
}

export const LookupList: FC<LookupListProps> = ({ multiple, numerous, editable, children }) => (
  <div className={cnLookupList({ multiple, numerous, editable }, ['scroll'])}>{children}</div>
);
