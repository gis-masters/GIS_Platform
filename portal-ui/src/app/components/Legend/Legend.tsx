import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { StyleRule } from '../../services/geoserver/styles/styles.models';

import '!style-loader!css-loader!sass-loader!./Legend.scss';

const cnLegend = cn('Legend');

interface LegendProps extends IClassNameProps {
  rules: StyleRule[];
  forPrint?: boolean;
  resolution?: number;
  resize?: number;
  cleanDuplicates?: boolean;
}

export const Legend: FC<LegendProps> = ({ rules, forPrint, resolution, className, resize = 1, cleanDuplicates }) => {
  const rulesTitlesRegistry: { [key: string]: boolean } = {};

  return (
    <div
      className={cnLegend({ forPrint }, [className])}
      style={{ '--LegendResolution': resolution, '--LegendResize': resize }}
    >
      {(cleanDuplicates
        ? rules.filter(({ title }) => {
            if (rulesTitlesRegistry[title]) {
              return false;
            }
            rulesTitlesRegistry[title] = true;

            return true;
          })
        : rules
      ).map(({ legend, title }: StyleRule, i) => (
        <div className={cnLegend('Rule')} key={i}>
          <img src={legend} className={cnLegend('Img')} />
          <div className={cnLegend('Title')}>{title}</div>
        </div>
      ))}
    </div>
  );
};
