import React, { useState } from 'react';
import { Input, Slider } from '@mui/material';
import { AllInclusive, HomeOutlined, SvgIconComponent, WidthFull, WidthNormal, WidthWide } from '@mui/icons-material';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { cn } from '@bem-react/classname';

import { Breadcrumbs } from './Breadcrumbs';
import { BreadcrumbsItemData } from './Item/Breadcrumbs-Item';

import '!style-loader!css-loader!sass-loader!./Breadcrumbs.stories.scss';

const cnBreadcrumbsStory = cn('BreadcrumbsStory');

export default {
  title: 'Breadcrumbs',
  component: Breadcrumbs
} as ComponentMeta<typeof Breadcrumbs>;

const MIN = 80;
const MAX = 1000;

function minMax(value: number) {
  if (value < MIN) {
    return MIN;
  } else if (value > MAX) {
    return MAX;
  }

  return value;
}

const Template: ComponentStory<typeof Breadcrumbs> = props => {
  const [maxWidth, setMaxWidth] = useState(MAX);
  let Icon: SvgIconComponent = AllInclusive;

  if (maxWidth < 200) {
    Icon = WidthNormal;
  } else if (maxWidth < 500) {
    Icon = WidthWide;
  } else if (maxWidth < 1000) {
    Icon = WidthFull;
  }

  const handleSliderChange = (e: Event, value: number) => {
    setMaxWidth(value);
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
      <div className={cnBreadcrumbsStory('Container')} style={{ maxWidth: maxWidth < MAX && minMax(maxWidth) }}>
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

export const Regular = Template.bind({});
Regular.args = {
  itemsType: 'link',
  items: breadcrumbsItems()
};

export const Small = Template.bind({});
Small.args = {
  itemsType: 'link',
  size: 'small',
  items: breadcrumbsItems()
};

function breadcrumbsItems(): BreadcrumbsItemData[] {
  const libraryRootUrlItems = ['r', 'root', 'lr', 'libraryRoot'];
  const libraryRootPath = JSON.stringify([...libraryRootUrlItems, 'empty', 'empty']);
  const libraryPath = JSON.stringify([...libraryRootUrlItems, 'library', 'dl_default_3', 'empty', 'empty']);
  const folderPath = JSON.stringify([
    ...libraryRootUrlItems,
    'library',
    'dl_default',
    'folder',
    '444',
    'empty',
    'empty'
  ]);
  const docPath = JSON.stringify([
    ...libraryRootUrlItems,
    'library',
    'dl_default',
    'folder',
    '444',
    'doc',
    '8888',
    'empty',
    'empty'
  ]);

  return [
    { title: <HomeOutlined fontSize='inherit' />, url: '/data-management' },
    {
      title: 'Библиотеки документов',
      url: `/data-management?path_dm=${libraryRootPath}`
    },
    {
      title: 'Кратко',
      url: `/data-management?path_dm=${libraryPath}`
    },
    {
      title: 'Длинное название папки №444',
      url: `/data-management?path_dm=${folderPath}`
    },
    {
      title: 'Длинное название документа №8888',
      url: `/data-management?path_dm=${docPath}`
    }
  ];
}
