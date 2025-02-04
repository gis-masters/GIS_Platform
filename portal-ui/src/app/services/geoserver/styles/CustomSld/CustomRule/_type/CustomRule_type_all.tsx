import React, { FC } from 'react';

import { Rule } from '../../Rule/Rule';
import { CustomRuleProps } from '../CustomRule';
import { CustomRuleTypeLine } from './CustomRule_type_line';
import { CustomRuleTypePoint } from './CustomRule_type_point';
import { CustomRuleTypePolygon } from './CustomRule_type_polygon';

export const CustomRuleTypeAll: FC<CustomRuleProps> = ({ rule, type }) => {
  if (type !== 'all') {
    throw new Error('Ошибка: некорректный тип стиля');
  }

  const [pointRule, lineRule, polygonRule] = rule;

  return (
    <>
      <Rule>
        <CustomRuleTypePolygon rule={polygonRule} type='polygon' bare />
      </Rule>
      <Rule>
        <CustomRuleTypeLine rule={lineRule} type='line' bare />
      </Rule>
      <Rule>
        <CustomRuleTypePoint rule={pointRule} type='point' bare />
      </Rule>
    </>
  );
};
