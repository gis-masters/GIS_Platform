import React, { FC } from 'react';

import { CustomStyleDescription } from '../../../styles.models';

import { PolygonSymbolizer } from '../../PolygonSymbolizer/PolygonSymbolizer';
import { SvgParameter } from '../../SvgParameter/SvgParameter';
import { Stroke } from '../../Stroke/Stroke';
import { Fill } from '../../Fill/Fill';
import { Rule } from '../../Rule/Rule';

export const CustomRuleTypePolygon: FC<CustomStyleDescription> = ({ rule, type }) => {
  if (type !== 'polygon') {
    throw new Error('Ошибка: некорректный тип стиля');
  }

  return (
    <Rule>
      <PolygonSymbolizer>
        <Fill>
          <SvgParameter name='fill'>{rule.fillColor}</SvgParameter>
        </Fill>
        <Stroke>
          <SvgParameter name='stroke'>{rule.strokeColor}</SvgParameter>
          <SvgParameter name='stroke-width'>{rule.strokeWidth}</SvgParameter>
          {rule.strokeDashArray && (
            <SvgParameter name='stroke-dasharray'>{rule.strokeDashArray.join(' ')}</SvgParameter>
          )}
        </Stroke>
      </PolygonSymbolizer>
    </Rule>
  );
};
