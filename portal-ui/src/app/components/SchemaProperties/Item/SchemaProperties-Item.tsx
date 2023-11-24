import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { Icon, ListItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import {
  EditOffOutlined,
  HelpOutline,
  VisibilityOffOutlined,
  Check,
  FormatListBulletedOutlined,
  AccessAlarmOutlined,
  ArticleOutlined,
  ContactMailOutlined,
  AttachFileOutlined,
  LooksOneOutlined,
  PinOutlined,
  SquareFootOutlined,
  AbcOutlined,
  PersonOutline,
  PersonSearchOutlined,
  FingerprintOutlined,
  SvgIconComponent,
  HttpOutlined
} from '@mui/icons-material';

import { PropertySchema, PropertyType } from '../../../services/data/schema/schema.models';
import { SchemaPropertiesItemIcons } from '../ItemIcons/SchemaProperties-ItemIcons';

import '!style-loader!css-loader!sass-loader!../ItemIcon/SchemaProperties-ItemIcon.scss';
import '!style-loader!css-loader!sass-loader!../PrimaryText/SchemaProperties-PrimaryText.scss';

const getTypeIcon = (type: PropertyType): [SvgIconComponent, string] => {
  const icons: Partial<Record<PropertyType, [SvgIconComponent, string]>> = {
    [PropertyType.BOOL]: [Check, 'Логическое'],
    [PropertyType.CHOICE]: [FormatListBulletedOutlined, 'Выбор'],
    [PropertyType.DATETIME]: [AccessAlarmOutlined, 'Дата'],
    [PropertyType.DOCUMENT]: [ArticleOutlined, 'Документ'],
    [PropertyType.FIAS]: [ContactMailOutlined, 'Адрес'],
    [PropertyType.FILE]: [AttachFileOutlined, 'Файл'],
    [PropertyType.FLOAT]: [LooksOneOutlined, 'Число (дробное)'],
    [PropertyType.GEOMETRY]: [SquareFootOutlined, 'Геометрия'],
    [PropertyType.INT]: [PinOutlined, 'Число (целое)'],
    [PropertyType.STRING]: [AbcOutlined, 'Строка'],
    [PropertyType.URL]: [HttpOutlined, 'Ссылка'],
    [PropertyType.USER]: [PersonOutline, 'Пользователь'],
    [PropertyType.USER_ID]: [PersonSearchOutlined, 'Идентификатор пользователя'],
    [PropertyType.UUID]: [FingerprintOutlined, 'Уникальный идентификатор']
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
