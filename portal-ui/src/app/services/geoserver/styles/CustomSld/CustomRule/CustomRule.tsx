import React, { ComponentType, FC } from 'react';

import { CustomStyleDescription } from '../../styles.models';
import { CustomRuleTypeAll } from './_type/CustomRule_type_all';
import { CustomRuleTypeLine } from './_type/CustomRule_type_line';
import { CustomRuleTypePoint } from './_type/CustomRule_type_point';
import { CustomRuleTypePolygon } from './_type/CustomRule_type_polygon';

const types: Record<string, ComponentType<CustomStyleDescription>> = {
  line: CustomRuleTypeLine,
  point: CustomRuleTypePoint,
  polygon: CustomRuleTypePolygon,
  all: CustomRuleTypeAll
};

export type CustomRuleProps = CustomStyleDescription & { bare?: boolean };

export const CustomRule: FC<CustomRuleProps> = styleDescription => {
  const CustomRuleComponent = types[styleDescription.type];

  if (!CustomRuleComponent) {
    throw new Error('Ошибка: некорректный тип стиля');
  }

  return <CustomRuleComponent {...styleDescription} />;
};
