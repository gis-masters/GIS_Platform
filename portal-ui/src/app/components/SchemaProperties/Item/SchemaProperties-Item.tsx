import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { Icon, ListItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import {
  EditOffOutlined,
  HelpOutline,
  VisibilityOffOutlined,
  Check,
  FormatListBulleted,
  AccessAlarm,
  Article,
  ContactMail,
  AttachFile,
  LooksOneOutlined,
  Pin,
  SquareFoot,
  Abc,
  Http,
  PersonOutline,
  PersonSearch,
  Fingerprint,
  SvgIconComponent
} from '@mui/icons-material';

import { PropertySchema, PropertyType } from '../../../services/data/schema/schema.models';
import { SchemaPropertiesItemIcons } from '../ItemIcons/SchemaProperties-ItemIcons';

import '!style-loader!css-loader!sass-loader!../ItemIcon/SchemaProperties-ItemIcon.scss';
import '!style-loader!css-loader!sass-loader!../PrimaryText/SchemaProperties-PrimaryText.scss';

const getTypeIcon = (type: PropertyType): [SvgIconComponent, string] => {
  const icons: Partial<Record<PropertyType, [SvgIconComponent, string]>> = {
    [PropertyType.BOOL]: [Check, 'Логическое'],
    [PropertyType.CHOICE]: [FormatListBulleted, 'Выбор'],
    [PropertyType.DATETIME]: [AccessAlarm, 'Дата'],
    [PropertyType.DOCUMENT]: [Article, 'Документ'],
    [PropertyType.FIAS]: [ContactMail, 'Адрес'],
    [PropertyType.FILE]: [AttachFile, 'Файл'],
    [PropertyType.FLOAT]: [LooksOneOutlined, 'Число (дробное)'],
    [PropertyType.GEOMETRY]: [SquareFoot, 'Геометрия'],
    [PropertyType.INT]: [Pin, 'Число (целое)'],
    [PropertyType.STRING]: [Abc, 'Строка'],
    [PropertyType.URL]: [Http, 'Ссылка'],
    [PropertyType.USER]: [PersonOutline, 'Пользователь'],
    [PropertyType.USER_ID]: [PersonSearch, 'Идентификатор пользователя'],
    [PropertyType.UUID]: [Fingerprint, 'Уникальный идентификатор']
  };

  return icons[type] || [HelpOutline, type];
};

interface SchemaPropertiesItemProps {
  propertySchema: PropertySchema;
}

const cnSchemaPropertiesItem = cn('SchemaProperties', 'Item');
const cnSchemaPropertiesItemIcon = cn('SchemaProperties', 'ItemIcon');
const cnSchemaPropertiesPrimaryText = cn('SchemaProperties', 'PrimaryText');

export const SchemaPropertiesItem: FC<SchemaPropertiesItemProps> = ({ propertySchema }) => {
  const { name, title, propertyType, description, hidden, readOnly, required } = propertySchema;
  const [TypeIcon, typeText] = getTypeIcon(propertyType);

  return (
    <ListItem className={cnSchemaPropertiesItem()}>
      <ListItemIcon>
        <Tooltip title={typeText}>
          <TypeIcon />
        </Tooltip>
      </ListItemIcon>
      <ListItemText classes={{ primary: cnSchemaPropertiesPrimaryText() }} primary={title} secondary={name} />
      <SchemaPropertiesItemIcons>
        {description && (
          <Tooltip title={description}>
            <HelpOutline fontSize='small' className={cnSchemaPropertiesItemIcon()} color='action' />
          </Tooltip>
        )}
        {hidden && (
          <Tooltip title='Cкрытое'>
            <VisibilityOffOutlined fontSize='small' className={cnSchemaPropertiesItemIcon()} color='action' />
          </Tooltip>
        )}
        {readOnly && (
          <Tooltip title='Только для чтения'>
            <EditOffOutlined fontSize='small' className={cnSchemaPropertiesItemIcon()} color='action' />
          </Tooltip>
        )}
        {required && (
          <Tooltip title='Обязательное'>
            <Icon className={cnSchemaPropertiesItemIcon()} color='action'>
              *
            </Icon>
          </Tooltip>
        )}
      </SchemaPropertiesItemIcons>
    </ListItem>
  );
};
