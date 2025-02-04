import React, { FC, PropsWithChildren } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Documents-NameInner.scss';

const cnDocumentsNameInner = cn('Documents', 'NameInner');

interface DocumentsNameInnerProps extends PropsWithChildren {
  deleted?: boolean;
}

export const DocumentsNameInner: FC<DocumentsNameInnerProps> = ({ children, deleted }) => (
  <span className={cnDocumentsNameInner({ status: deleted ? 'deleted' : undefined })}>{children}</span>
);
