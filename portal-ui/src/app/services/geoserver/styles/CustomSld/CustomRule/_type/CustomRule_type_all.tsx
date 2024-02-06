import React, { FC } from 'react';

import { Rule } from '../../Rule/Rule';
import { CustomRuleTypeLine } from './CustomRule_type_line';
import { CustomRuleTypePoint } from './CustomRule_type_point';
import { CustomRuleTypePolygon } from './CustomRule_type_polygon';
import { CustomRuleProps } from '../CustomRule';

export const CustomRuleTypeAll: FC<CustomRuleProps> = ({ rule, type }) => {
  if (type !== 'all') {
    throw new Error('Ошибка: некорректный тип стиля');
  }

  const [pointRule, lineRule, polygonRule] = rule;

  return (
    <Rule>
      <CustomRuleTypePoint rule={pointRule} type='point' bare />
      <CustomRuleTypeLine rule={lineRule} type='line' bare />
      <CustomRuleTypePolygon rule={polygonRule} type='polygon' bare />
    </Rule>
  );
};
