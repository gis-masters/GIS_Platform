import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Carousel } from './Carousel';

export default {
  title: 'Carousel',
  component: Carousel
} as ComponentMeta<typeof Carousel>;

const Template: ComponentStory<typeof Carousel> = args => <Carousel {...args} />;

export const Standard = Template.bind({});
Standard.args = {
  open: true,
  images: [
    { id: '1', size: 666, title: '1.jpg' },
    { id: '2', size: 666, title: '2.jpg' },
    { id: '3', size: 666, title: '3.jpg' },
    { id: '4', size: 666, title: '4.jpg' },
    { id: '5', size: 666, title: '5.jpg' },
    { id: '6', size: 666, title: '6.jpg' }
  ],
  startingImageForPreview: { id: '1', size: 666, title: '1.jpg' }
};

export const Pdf = Template.bind({});
Pdf.args = {
  open: true,
  images: [
    { id: 'pdf1', size: 666, title: 'pdf1.pdf' },
    { id: 'pdf2', size: 666, title: 'pdf2.pdf' },
    { id: '3', size: 666, title: '3.jpg' },
    { id: 'pdf3', size: 666, title: 'pdf3.pdf' }
  ],
  startingImageForPreview: { id: 'pdf1', size: 666, title: 'pdf1.pdf' }
};

export const Empty = Template.bind({});
Empty.args = {
  open: true
};
