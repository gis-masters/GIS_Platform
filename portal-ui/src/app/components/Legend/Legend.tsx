import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { RuleWithLegend } from '../../services/crg/projects.models';

import '!style-loader!css-loader!sass-loader!./Legend.scss';

const cnLegend = cn('Legend');

interface LegendProps {
  rules: RuleWithLegend[];
}

export const Legend: FC<LegendProps> = ({ rules }) => (
  <div className={cnLegend()}>
    {rules.map(({ legend, title }, i) => (
      <div className={cnLegend('Rule')} key={i}>
        <img src={legend} className={cnLegend('Img')} />
        <div className={cnLegend('Title')}>
          {title}
        </div>
      </div>
    ))}
  </div>
);
