import React, { ComponentType, FC } from 'react';

import { CustomStyleDescription } from '../../styles.models';

import { CustomRuleTypeLine } from './_type/CustomRule_type_line';
import { CustomRuleTypePoint } from './_type/CustomRule_type_point';
import { CustomRuleTypePolygon } from './_type/CustomRule_type_polygon';

const types: Record<string, ComponentType<CustomStyleDescription>> = {
  line: CustomRuleTypeLine,
  point: CustomRuleTypePoint,
  polygon: CustomRuleTypePolygon
};

export const CustomRule: FC<CustomStyleDescription> = styleDescription => {
  const CustomRuleComponent = types[styleDescription.type];

  if (!CustomRuleComponent) {
    throw new Error('Ошибка: некорректный тип стиля');
  }

  return <CustomRuleComponent {...styleDescription} />;
};
