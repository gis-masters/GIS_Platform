import React, { type FC, type PropsWithChildren } from 'react';
import { cn } from '@bem-react/classname';

import './Documents-NameInner.scss';

const cnDocumentsNameInner = cn('Documents', 'NameInner');

interface DocumentsNameInnerProps extends PropsWithChildren {
  deleted?: boolean;
}

export const DocumentsNameInner: FC<DocumentsNameInnerProps> = ({ children, deleted }) => (
  <span className={cnDocumentsNameInner({ status: deleted ? 'deleted' : undefined })}>{children}</span>
);
