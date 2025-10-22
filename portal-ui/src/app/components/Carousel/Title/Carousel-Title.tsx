import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './Carousel-Title.scss';

const cnCarouselTitle = cn('Carousel', 'Title');

export const CarouselTitle: FC<ChildrenProps> = ({ children }) => <div className={cnCarouselTitle()}>{children}</div>;
