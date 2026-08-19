import { GeometryType, type SupportedGeometryType, supportedGeometryTypes } from '../../../geoserver/wfs/wfs.models';
import { isRecordStringUnknown } from '../../../util/typeGuards/isRecordStringUnknown';
import { type PropertyOption, type PropertySchema, PropertyType } from '../schema.models';

const extraGeometryTypeTitles: Partial<Record<GeometryType, string>> = {
  [GeometryType.MULTI_POINT]: 'Мультиточка',
  [GeometryType.LINE_STRING]: 'Линия (одиночная)',
  [GeometryType.POLYGON]: 'Полигон (одиночный)'
};

export function appendIncomingGeometryTypeOption(options: PropertyOption[], geometryType: unknown): PropertyOption[] {
  if (typeof geometryType !== 'string' || !geometryType) {
    return options;
  }

  if (options.some(option => option.value === geometryType)) {
    return options;
  }

  if (!supportedGeometryTypes.includes(geometryType as SupportedGeometryType)) {
    return options;
  }

  return [
    ...options,
    {
      value: geometryType,
      title: extraGeometryTypeTitles[geometryType as GeometryType] ?? geometryType
    }
  ];
}

export function ensureGeometryTypeOption(obj: unknown, property: PropertySchema): Partial<PropertySchema> {
  if (property.propertyType !== PropertyType.CHOICE || !isRecordStringUnknown(obj)) {
    return {};
  }

  const options = appendIncomingGeometryTypeOption(property.options, obj.geometryType);

  if (options === property.options) {
    return {};
  }

  return { options };
}
