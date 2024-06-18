import React, { FC, Fragment } from 'react';

import { LABEL_PROPERTY_DEFAULT } from '../../../styles.models';
import { CustomLabel } from '../../CustomLabel/CustomLabel';
import { ElseFilter } from '../../ElseFilter/ElseFilter';
import { Fill } from '../../Fill/Fill';
import { Graphic } from '../../Graphic/Graphic';
import { Mark } from '../../Mark/Mark';
import { PointSymbolizer } from '../../PointSymbolizer/PointSymbolizer';
import { Rule } from '../../Rule/Rule';
import { Size } from '../../Size/Size';
import { Stroke } from '../../Stroke/Stroke';
import { SvgParameter } from '../../SvgParameter/SvgParameter';
import { WellKnownName } from '../../WellKnownName/WellKnownName';
import { CustomRuleProps } from '../CustomRule';

export const CustomRuleTypePoint: FC<CustomRuleProps> = ({ rule, type, bare }) => {
  if (type !== 'point') {
    throw new Error('Ошибка: некорректный тип стиля');
  }

  const Wrapper = bare ? Fragment : Rule;

  return (
    <Wrapper>
      <ElseFilter />

      <PointSymbolizer>
        <Graphic>
          <Mark>
            <WellKnownName>{rule.markType}</WellKnownName>
            <Fill>{rule.markColor && <SvgParameter name='fill'>{rule.markColor}</SvgParameter>}</Fill>
            <Stroke>
              <SvgParameter name='stroke'>{rule.strokeColor}</SvgParameter>
              <SvgParameter name='stroke-width'>{rule.strokeWidth}</SvgParameter>
            </Stroke>
          </Mark>
          <Size>{rule.markSize}</Size>
        </Graphic>
      </PointSymbolizer>

      {rule.labelProperty && rule.labelProperty !== LABEL_PROPERTY_DEFAULT && (
        <CustomLabel labelProperty={rule.labelProperty} />
      )}
    </Wrapper>
  );
};
