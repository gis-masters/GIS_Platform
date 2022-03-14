import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Lookup-List.scss';

const cnLookupList = cn('Lookup', 'List');

interface LookupListProps {
  multiple: boolean;
  numerous: boolean;
  editable: boolean;
}

export const LookupList: FC<LookupListProps> = ({ multiple, numerous, editable, children }) => (
  <div className={cnLookupList({ multiple, numerous, editable }, ['scroll'])}>{children}</div>
);
