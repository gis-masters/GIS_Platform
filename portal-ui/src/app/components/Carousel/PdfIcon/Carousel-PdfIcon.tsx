import React, { FC } from 'react';
import { PictureAsPdfOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Carousel-PdfIcon.scss';

const cnCarousel = cn('Carousel');

export const CarouselPdfIcon: FC = () => <PictureAsPdfOutlined className={cnCarousel('PdfIcon')} />;
