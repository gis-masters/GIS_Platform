import React, { FC } from 'react';

import { CustomStyleDescription } from '../../../styles.models';

import { PointSymbolizer } from '../../PointSymbolizer/PointSymbolizer';
import { SvgParameter } from '../../SvgParameter/SvgParameter';
import { Rule } from '../../Rule/Rule';
import { Graphic } from '../../Graphic/Graphic';
import { Mark } from '../../Mark/Mark';
import { WellKnownName } from '../../WellKnownName/WellKnownName';
import { Fill } from '../../Fill/Fill';
import { Size } from '../../Size/Size';

export const CustomRuleTypePoint: FC<CustomStyleDescription> = ({ rule, type }) => {
  if (type !== 'point') {
    throw new Error('Ошибка: некорректный тип стиля');
  }

  return (
    <Rule>
      <PointSymbolizer>
        <Graphic>
          <Mark>
            <WellKnownName>{rule.markType}</WellKnownName>
            <Fill>{rule.markColor && <SvgParameter name='fill'>{rule.markColor}</SvgParameter>}</Fill>
          </Mark>
          <Size>{rule.markSize}</Size>
        </Graphic>
      </PointSymbolizer>
    </Rule>
  );
};
