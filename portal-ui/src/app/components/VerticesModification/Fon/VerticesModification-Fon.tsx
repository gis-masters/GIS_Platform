import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import './VerticesModification-Fon.scss';

const cnVerticesModificationFon = cn('VerticesModification', 'Fon');
export const VerticesModificationFon: FC = () => <div className={cnVerticesModificationFon()} />;
