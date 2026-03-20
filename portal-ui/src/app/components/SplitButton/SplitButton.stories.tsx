import React from 'react';
import { MenuItem } from '@mui/material';
import { PublishOutlined } from '@mui/icons-material';
import { type StoryFn } from '@storybook/react';

import { SplitButton } from './SplitButton';

export default {
  title: 'SplitButton',
  component: SplitButton
};

const menu = (
  <>
    <MenuItem>Сохранить черновик</MenuItem>
    <MenuItem>Запланировать публикацию</MenuItem>
    <MenuItem>Экспортировать</MenuItem>
  </>
);

const LABEL = 'Опубликовать';

const Template: StoryFn<typeof SplitButton> = args => <SplitButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: LABEL,
  menu
};

export const Primary = Template.bind({});
Primary.args = {
  children: LABEL,
  color: 'primary',
  menu
};

export const WithStartIcon = Template.bind({});
WithStartIcon.args = {
  children: LABEL,
  color: 'primary',
  startIcon: <PublishOutlined />,
  menu
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: LABEL,
  color: 'primary',
  disabled: true,
  menu
};

export const CustomTooltip = Template.bind({});
CustomTooltip.args = {
  children: 'Сохранить',
  color: 'primary',
  moreActionsTooltip: 'Варианты сохранения',
  menu: (
    <>
      <MenuItem>Сохранить как PDF</MenuItem>
      <MenuItem>Сохранить как DOCX</MenuItem>
      <MenuItem>Сохранить как ODT</MenuItem>
    </>
  )
};
