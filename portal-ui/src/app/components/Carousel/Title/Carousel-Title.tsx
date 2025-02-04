import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Carousel-Title.scss';

const cnCarouselTitle = cn('Carousel', 'Title');

export const CarouselTitle: FC<ChildrenProps> = ({ children }) => <div className={cnCarouselTitle()}>{children}</div>;
