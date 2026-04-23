import { type UrlInfo } from '../../../components/Form/Control/_type/Form-Control_type_url';
import { type PropertySchema, type PropertySchemaUrl, PropertyType } from '../../data/schema/schema.models';
import { isArray } from '../typeGuards/isArray';

export function parseUrlValue(value: string, multiple?: boolean, editable?: boolean): UrlInfo[] {
  if (value) {
    try {
      const parsedValue = JSON.parse(value) as UrlInfo | UrlInfo[];

      if (isArray(parsedValue)) {
        return parsedValue;
      }

      if (!parsedValue) {
        return multiple ? [] : [{ url: '', text: '' }];
      }

      if (!isArray(parsedValue)) {
        return [parsedValue];
      }
    } catch {
      // do nothing
    }
  }

  if (!editable) {
    return [];
  }

  return multiple ? [] : [{ url: '', text: '' }];
}

export function getUrlSubFormSchema(field: PropertySchemaUrl): PropertySchema[] {
  return [
    {
      name: 'url',
      title: 'Адрес ссылки',
      propertyType: PropertyType.STRING,
      regex: field.regex,
      wellKnownRegex: (!field.regex && field.wellKnownRegex) || 'url'
    },
    {
      name: 'text',
      title: 'Название',
      propertyType: PropertyType.STRING
    }
  ];
}
