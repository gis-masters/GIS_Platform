import React from 'react';
import { StoryFn } from '@storybook/react';

import { TextBadge } from '../TextBadge/TextBadge';
import { Carousel } from './Carousel';

export default {
  title: 'Carousel',
  component: Carousel
};

const Template: StoryFn<typeof Carousel> = args => <Carousel {...args} />;

export const Standard = Template.bind({});
Standard.args = {
  open: true,
  images: [
    {
      file: { id: '1', size: 666, title: '1.jpg' },
      title: (
        <>
          90:12:043e30301:6443
          <TextBadge id='501' />
        </>
      ),
      subTitle: 'FileName22.jpg'
    },
    {
      file: { id: '2', size: 666, title: '2.jpg' },
      title: (
        <>
          90:12:043e30301:641
          <TextBadge id='502' />
        </>
      ),
      subTitle: 'FileName3.jpg'
    },
    {
      file: { id: '3', size: 666, title: '3.jpg' },
      title: (
        <>
          90:12:043e30301:642
          <TextBadge id='503' />
        </>
      ),
      subTitle: 'FileName4.jpg'
    },
    {
      file: { id: 'недоступная картинка', size: 666, title: 'недоступная картинка.jpg' },
      title: (
        <>
          90:12:043e30301:649
          <TextBadge id='504' />
        </>
      ),
      subTitle: 'FileName5.jpg'
    },
    {
      file: { id: '5', size: 666, title: '5.jpg' },
      title: (
        <>
          90:12:043e30301:645
          <TextBadge id='50e3e35' />
        </>
      ),
      subTitle: 'FileName6.jpg'
    },
    {
      file: { id: '6', size: 666, title: '6.jpg' },
      title: (
        <>
          90:12:043e30301:646
          <TextBadge id='506' />
        </>
      ),
      subTitle: 'FileName6.jpg'
    }
  ]
};

export const Pdf = Template.bind({});
Pdf.args = {
  open: true,
  images: [
    {
      file: { id: '1', size: 666, title: '1.jpg' },
      title: (
        <>
          90:12:043e30e3e3301:645
          <TextBadge id='502125' />
        </>
      ),
      subTitle: 'FileName1.jpg'
    },
    {
      file: { id: 'pdf2', size: 666, title: 'pdf2.pdf' },
      title: (
        <>
          90:12e3:043e30e3301:647
          <TextBadge id='5212105' />
        </>
      ),
      subTitle: 'pdf2.pdf'
    },
    {
      file: { id: '2', size: 666, title: '2.jpg' },
      title: (
        <>
          90:12:043e30e3e3301:645
          <TextBadge id='514' />
        </>
      ),
      subTitle: 'FileName2.jpg'
    },
    {
      file: { id: 'pdf3', size: 666, title: 'pdf3.pdf' },
      title: (
        <>
          90:12e3:043e30e3301:647
          <TextBadge id='515' />
        </>
      ),
      subTitle: 'pdf3.pdf'
    }
  ]
};

export const onePDF = Template.bind({});
onePDF.args = {
  open: true,
  images: [
    {
      file: { id: 'pdf2', size: 666, title: 'pdf2.pdf' },
      title: (
        <>
          90:12e3:043e30e3301:647
          <TextBadge id='5212105' />
        </>
      ),
      subTitle: 'pdf2.pdf'
    }
  ]
};

export const oneJPG = Template.bind({});
oneJPG.args = {
  open: true,
  images: [
    {
      file: { id: '1', size: 666, title: '1.jpg' },
      title: (
        <>
          90:12:043e30301:6443
          <TextBadge id='501' />
        </>
      ),
      subTitle: 'FileName2.jpg'
    }
  ]
};

export const Empty = Template.bind({});
Empty.args = {
  open: true,
  images: []
};
