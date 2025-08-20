import React, { FC, Fragment } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { isStyleRuleExtended, StyleRule, StyleRuleExtended } from '../../services/geoserver/styles/styles.models';

import '!style-loader!css-loader!sass-loader!./Legend.scss';

const cnLegend = cn('Legend');

interface LegendPropsBase extends IClassNameProps {
  forPrint?: boolean;
  withoutTitle?: boolean;
  cleanDuplicates?: boolean;
  resolution?: number;
  resize?: number;
}

interface LegendPropsSimple extends LegendPropsBase {
  rules: StyleRule[];
  forPrint?: false;
}

interface LegendPropsPrint extends LegendPropsBase {
  rules: StyleRuleExtended[];
  forPrint: true;
}

type LegendProps = LegendPropsSimple | LegendPropsPrint;

export const Legend: FC<LegendProps> = ({
  rules,
  forPrint,
  resolution,
  className,
  withoutTitle,
  resize = 1,
  cleanDuplicates
}) => {
  const rulesTitlesRegistry: { [key: string]: boolean } = {};
  const filteredRules = cleanDuplicates
    ? rules.filter(({ title }) => {
        if (rulesTitlesRegistry[title]) {
          return false;
        }
        rulesTitlesRegistry[title] = true;

        return true;
      })
    : rules;

  const isMonoRule = (rule: StyleRuleExtended | StyleRule): boolean => {
    return !(filteredRules as StyleRuleExtended[]).some(
      r => isStyleRuleExtended(rule) && r.layerTitle === rule.layerTitle && r !== rule
    );
  };

  if (forPrint) {
    (filteredRules as StyleRuleExtended[]).sort((a, b) => {
      if (a.layerTitle === b.layerTitle) {
        return 0;
      }
      if (isMonoRule(a) && !isMonoRule(b)) {
        return 1;
      }
      if (!isMonoRule(a) && isMonoRule(b)) {
        return -1;
      }

      return a.layerTitle > b.layerTitle ? -1 : 1;
    });
  }

  return (
    <div
      className={cnLegend({ forPrint }, [className])}
      style={{ '--LegendResolution': resolution || '', '--LegendResize': resize }}
    >
      {forPrint && <div className={cnLegend('Title')}>Условные обозначения</div>}

      {filteredRules.map((rule, i) => {
        let layerTitle = '';

        if (forPrint) {
          const currentStyleTitle = rules[i].layerTitle;
          const prevStyleTitle = rules[i - 1]?.layerTitle;
          if (currentStyleTitle !== prevStyleTitle) {
            layerTitle = currentStyleTitle;
          }
        }

        let ruleTitle = rules[i].title;

        if (forPrint && isMonoRule(rules[i])) {
          const currentRule = rules.find(({ name }) => name === rules[i].name);

          if (isStyleRuleExtended(currentRule)) {
            ruleTitle = currentRule.layerTitle;
          }
        }

        return (
          <Fragment key={i}>
            {layerTitle && forPrint && !isMonoRule(rules[i]) && (
              <div className={cnLegend('LayerTitle')}>{layerTitle}</div>
            )}
            {forPrint && isMonoRule(rules[i]) && rules[i - 1] && !isMonoRule(rules[i - 1]) && (
              <div className={cnLegend('LayerTitle')}>Другие</div>
            )}
            <div className={cnLegend('Rule')}>
              <img src={rules[i].legend} className={cnLegend('Img')} />
              {!withoutTitle && <div className={cnLegend('RuleTitle')}>{ruleTitle}</div>}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};
