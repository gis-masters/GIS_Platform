import React, { type FC } from 'react';
import { PictureAsPdfOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import './Carousel-PdfIcon.scss';

const cnCarousel = cn('Carousel');

export const CarouselPdfIcon: FC = () => <PictureAsPdfOutlined className={cnCarousel('PdfIcon')} />;
