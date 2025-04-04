interface LandRecordOptions {
  area?: number | null;
  cad_num?: string;
  cost_application_date?: string;
  cost_approvement_date?: string;
  cost_determination_date?: string;
  cost_index?: number;
  cost_registration_date?: string;
  cost_value?: number;
  declared_area?: number | null;
  determination_couse?: string;
  land_record_category_type?: string;
  land_record_reg_date?: string;
  land_record_subtype?: string;
  land_record_type?: string;
  ownership_type?: string;
  permitted_use_established_by_document?: string;
  quarter_cad_number?: string;
  readable_address?: string;
  specified_area?: number;
}

export interface NspdProperties {
  cadastralDistrictsCode?: number;
  category?: number;
  categoryName?: string;
  descr?: string;
  externalKey?: string;
  interactionId?: number;
  label?: string;
  options?: LandRecordOptions;
}

const isOptionalString = (value: unknown): boolean => value === undefined || typeof value === 'string';

const isOptionalNumber = (value: unknown): boolean => value === undefined || typeof value === 'number';

const isOptionalNullableNumber = (value: unknown): boolean =>
  value === undefined || value === null || typeof value === 'number';

export function isNspdProperties(value: unknown): value is NspdProperties {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const props = value as NspdProperties;

  const numberProps = [props.cadastralDistrictsCode, props.category, props.interactionId];
  const stringProps = [props.categoryName, props.descr, props.externalKey, props.label];

  return (
    numberProps.every(isOptionalNumber) &&
    stringProps.every(isOptionalString) &&
    (props.options === undefined ||
      (typeof props.options === 'object' && props.options !== null && isLandRecordOptions(props.options)))
  );
}

function isLandRecordOptions(value: unknown): value is LandRecordOptions {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const opts = value as LandRecordOptions;

  // Группируем свойства по типам для более компактной проверки
  const stringProps = [
    opts.cad_num,
    opts.cost_application_date,
    opts.cost_approvement_date,
    opts.cost_determination_date,
    opts.cost_registration_date,
    opts.determination_couse,
    opts.land_record_category_type,
    opts.land_record_reg_date,
    opts.land_record_subtype,
    opts.land_record_type,
    opts.ownership_type,
    opts.permitted_use_established_by_document,
    opts.quarter_cad_number,
    opts.readable_address
  ];

  const nullableNumberProps = [opts.area, opts.declared_area];

  return stringProps.every(isOptionalString) && nullableNumberProps.every(isOptionalNullableNumber);
}
