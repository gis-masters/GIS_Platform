import React, { FC, Fragment } from 'react';

import { PointSymbolizer } from '../../PointSymbolizer/PointSymbolizer';
import { SvgParameter } from '../../SvgParameter/SvgParameter';
import { Rule } from '../../Rule/Rule';
import { Graphic } from '../../Graphic/Graphic';
import { Mark } from '../../Mark/Mark';
import { WellKnownName } from '../../WellKnownName/WellKnownName';
import { Fill } from '../../Fill/Fill';
import { Size } from '../../Size/Size';
import { CustomRuleProps } from '../CustomRule';

export const CustomRuleTypePoint: FC<CustomRuleProps> = ({ rule, type, bare }) => {
  if (type !== 'point') {
    throw new Error('Ошибка: некорректный тип стиля');
  }

  const Wrapper = bare ? Fragment : Rule;

  return (
    <Wrapper>
      <PointSymbolizer>
        <Graphic>
          <Mark>
            <WellKnownName>{rule.markType}</WellKnownName>
            <Fill>{rule.markColor && <SvgParameter name='fill'>{rule.markColor}</SvgParameter>}</Fill>
          </Mark>
          <Size>{rule.markSize}</Size>
        </Graphic>
      </PointSymbolizer>
    </Wrapper>
  );
};
