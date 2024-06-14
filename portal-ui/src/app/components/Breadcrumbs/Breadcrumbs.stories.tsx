import React, { useState } from 'react';
import { Input, Slider } from '@mui/material';
import { AllInclusive, HomeOutlined, SvgIconComponent, WidthFull, WidthNormal, WidthWide } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { StoryFn } from '@storybook/react';

import { Breadcrumbs, BreadcrumbsItemData } from './Breadcrumbs';

import '!style-loader!css-loader!sass-loader!./Breadcrumbs.stories.scss';

const cnBreadcrumbsStory = cn('BreadcrumbsStory');

export default {
  title: 'Breadcrumbs',
  component: Breadcrumbs
};

const MIN = 80;
const MAX = 1000;

function minMax(value: number) {
  return Math.max(Math.min(value, MAX), MIN);
}

const Template: StoryFn<typeof Breadcrumbs> = props => {
  const [maxWidth, setMaxWidth] = useState(MAX);
  let Icon: SvgIconComponent = AllInclusive;

  if (maxWidth < MAX * 0.2) {
    Icon = WidthNormal;
  } else if (maxWidth < MAX * 0.5) {
    Icon = WidthWide;
  } else if (maxWidth < MAX) {
    Icon = WidthFull;
  }

  const handleSliderChange = (e: Event, value: number | number[]) => {
    if (typeof value === 'number') {
      setMaxWidth(value);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxWidth(e.target.value === '' ? MAX : Number(e.target.value));
  };

  const handleBlur = () => {
    if (maxWidth < MIN) {
      setMaxWidth(MIN);
    } else if (maxWidth > MAX) {
      setMaxWidth(MAX);
    }
  };

  return (
    <div className={cnBreadcrumbsStory()}>
      <div
        className={cnBreadcrumbsStory('Container')}
        style={{ maxWidth: (maxWidth < MAX && minMax(maxWidth)) || 'none' }}
      >
        <Breadcrumbs {...props} />
      </div>

      <div className={cnBreadcrumbsStory('Settings')}>
        <i>Ширина:</i>
        <Icon color='action' />
        <Slider
          className={cnBreadcrumbsStory('Slider')}
          value={maxWidth}
          onChange={handleSliderChange}
          max={MAX}
          min={MIN}
          step={10}
        />
        <Input
          className={cnBreadcrumbsStory('Input')}
          value={maxWidth === MAX ? '' : maxWidth}
          size='small'
          onChange={handleInputChange}
          onBlur={handleBlur}
          inputProps={{
            step: 10,
            min: MIN,
            max: MAX,
            type: 'number',
            className: cnBreadcrumbsStory('InputControl')
          }}
          endAdornment={maxWidth < MAX && 'px'}
        />
      </div>
    </div>
  );
};

const items: BreadcrumbsItemData[] = [
  { title: <HomeOutlined fontSize='inherit' />, url: '/data-management' },
  {
    title: 'Библиотеки документов',
    url: '#lib'
  },
  {
    title: 'Кратко',
    url: '#folder1'
  },
  {
    title: 'Длинное название папки №444',
    url: '#folder2'
  },
  {
    title: 'Длинное название документа №8888',
    url: '#doc'
  }
];

export const Regular = Template.bind({});
Regular.args = {
  itemsType: 'link',
  items
};

export const Small = Template.bind({});
Small.args = {
  itemsType: 'link',
  size: 'small',
  items
};

export const MenuButtonOnly = Template.bind({});
MenuButtonOnly.args = {
  itemsType: 'link',
  menuButtonOnly: true,
  items
};
