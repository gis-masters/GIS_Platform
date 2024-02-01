import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { observer } from 'mobx-react';

const cnHeader = cn('PhotoUploader', 'Header');

export const Header: FC = observer(() => <header className={cnHeader()}>Photo Uploader Header ...</header>);
