import React, { Component, createRef } from 'react';
import { cn } from '@bem-react/classname';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Icon,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import {
  EditOffOutlined,
  HelpOutline,
  VisibilityOffOutlined,
  Check,
  FormatListBulletedOutlined,
  ArticleOutlined,
  ContactMailOutlined,
  AttachFileOutlined,
  LooksOneOutlined,
  PinOutlined,
  SquareFootOutlined,
  PersonOutline,
  PersonSearchOutlined,
  FingerprintOutlined,
  SvgIconComponent,
  TextFieldsOutlined,
  CalendarMonthOutlined,
  LinkOutlined,
  EditOutlined,
  Edit
} from '@mui/icons-material';
import { observer } from 'mobx-react';
import { action, makeObservable, observable } from 'mobx';

import { PropertySchema, PropertyType } from '../../../services/data/schema/schema.models';
import { EditPropertySchemaForm } from '../../EditPropertySchemaForm/EditPropertySchemaForm';
import { SchemaPropertiesItemIcons } from '../ItemIcons/SchemaProperties-ItemIcons';
import { IconButton } from '../../IconButton/IconButton';

import '!style-loader!css-loader!sass-loader!../ItemIcon/SchemaProperties-ItemIcon.scss';
import '!style-loader!css-loader!sass-loader!../PrimaryText/SchemaProperties-PrimaryText.scss';
import '!style-loader!css-loader!sass-loader!../ItemAccordion/SchemaProperties-ItemAccordion.scss';

const getTypeIcon = (type: PropertyType): [SvgIconComponent, string] => {
  const icons: Partial<Record<PropertyType, [SvgIconComponent, string]>> = {
    [PropertyType.BOOL]: [Check, 'Логическое'],
    [PropertyType.CHOICE]: [FormatListBulletedOutlined, 'Выбор'],
    [PropertyType.DATETIME]: [CalendarMonthOutlined, 'Дата'],
    [PropertyType.DOCUMENT]: [ArticleOutlined, 'Документ'],
    [PropertyType.FIAS]: [ContactMailOutlined, 'Адрес'],
    [PropertyType.FILE]: [AttachFileOutlined, 'Файл'],
    [PropertyType.FLOAT]: [LooksOneOutlined, 'Число (дробное)'],
    [PropertyType.GEOMETRY]: [SquareFootOutlined, 'Геометрия'],
    [PropertyType.INT]: [PinOutlined, 'Число (целое)'],
    [PropertyType.STRING]: [TextFieldsOutlined, 'Строка'],
    [PropertyType.URL]: [LinkOutlined, 'Ссылка'],
    [PropertyType.USER]: [PersonOutline, 'Пользователь'],
    [PropertyType.USER_ID]: [PersonSearchOutlined, 'Идентификатор пользователя'],
    [PropertyType.UUID]: [FingerprintOutlined, 'Уникальный идентификатор']
  };

  return icons[type] || [HelpOutline, type];
};

interface SchemaPropertiesItemProps {
  propertySchema: PropertySchema;
  readonly: boolean;
  onPropertyChange?(newPropertySchema: PropertySchema): void;
}

const cnSchemaPropertiesItem = cn('SchemaProperties', 'Item');
const cnSchemaPropertiesItemAccordion = cn('SchemaProperties', 'ItemAccordion');
const cnSchemaPropertiesItemIcon = cn('SchemaProperties', 'ItemIcon');
const cnSchemaPropertiesPrimaryText = cn('SchemaProperties', 'PrimaryText');

@observer
export class SchemaPropertiesItem extends Component<SchemaPropertiesItemProps> {
  @observable selectedId: string | null | undefined = '';

  private ref = createRef<HTMLButtonElement>();

  constructor(props: SchemaPropertiesItemProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { readonly, propertySchema, onPropertyChange } = this.props;
    const { name, title, propertyType, description, hidden, readOnly, required } = propertySchema;
    const [TypeIcon, typeText] = getTypeIcon(propertyType);

    return (
      <>
        <ListItem className={cnSchemaPropertiesItem()}>
          <ListItemIcon>
            <Tooltip title={typeText}>
              <TypeIcon />
            </Tooltip>
          </ListItemIcon>
          <ListItemText classes={{ primary: cnSchemaPropertiesPrimaryText() }} primary={title} secondary={name} />
          <SchemaPropertiesItemIcons>
            <>
              {description && (
                <Tooltip title={description}>
                  <HelpOutline fontSize='small' className={cnSchemaPropertiesItemIcon()} color='action' />
                </Tooltip>
              )}
              {hidden && (
                <Tooltip title='Скрытое'>
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
            </>

            {!readonly && (
              <Tooltip title='Редактировать'>
                <IconButton size='small' onClick={this.onPropertyChange} name={name} ref={this.ref} color='primary'>
                  {this.selectedId === name ? (
                    <Edit fontSize='small' color='primary' />
                  ) : (
                    <EditOutlined fontSize='small' color='primary' />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </SchemaPropertiesItemIcons>
        </ListItem>

        <Accordion
          className={cnSchemaPropertiesItemAccordion()}
          key={name}
          expanded={this.selectedId === name}
          onChange={this.onPropertyChange}
        >
          <AccordionSummary />
          <AccordionDetails>
            {onPropertyChange && (
              <EditPropertySchemaForm propertySchema={propertySchema} onPropertyChange={onPropertyChange} />
            )}
          </AccordionDetails>
        </Accordion>
      </>
    );
  }

  @action.bound
  private onPropertyChange() {
    const id = this.ref.current?.getAttribute('name');
    this.selectedId = this.selectedId === id ? '' : id;
  }
}
