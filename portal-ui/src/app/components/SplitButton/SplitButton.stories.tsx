import React from 'react';
import { MenuItem } from '@mui/material';
import { PublishOutlined } from '@mui/icons-material';
import { type StoryFn } from '@storybook/react';

import { Toast } from '../Toast/Toast';
import { SplitButton } from './SplitButton';

export default {
  title: 'SplitButton',
  component: SplitButton
};

const LABEL = 'Опубликовать';

function toastMainAction(): void {
  Toast.success('Основное действие');
}

function toastDraft(): void {
  Toast.success('Дополнительное действие');
}

function toastSchedule(): void {
  Toast.info('Другое меню');
}

function toastExport(): void {
  Toast.info('Экспорт');
}

const menu = (
  <>
    <MenuItem onClick={toastDraft}>Сохранить черновик</MenuItem>
    <MenuItem onClick={toastSchedule}>Запланировать публикацию</MenuItem>
    <MenuItem onClick={toastExport}>Экспортировать</MenuItem>
  </>
);

const Template: StoryFn<typeof SplitButton> = args => <SplitButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: LABEL,
  menu,
  onClick: toastMainAction
};

export const Primary = Template.bind({});
Primary.args = {
  children: LABEL,
  color: 'primary',
  menu,
  onClick: toastMainAction
};

export const WithStartIcon = Template.bind({});
WithStartIcon.args = {
  children: LABEL,
  color: 'primary',
  startIcon: <PublishOutlined />,
  menu,
  onClick: toastMainAction
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: LABEL,
  color: 'primary',
  disabled: true,
  menu,
  onClick: toastMainAction
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
