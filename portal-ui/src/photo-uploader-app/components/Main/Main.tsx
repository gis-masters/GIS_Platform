import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

const cnMain = cn('Main');

export const Main: FC = () => <main className={cnMain()}>PhotUploader-Main Component</main>;
