import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { StyleRuleExtended } from '../../../stores/PrintSettings.store';

const cnSelectLegendImg = cn('SelectLegend', 'Img');

interface SelectLegendImgProps {
  rowData: StyleRuleExtended;
}

export const SelectLegendImg: FC<SelectLegendImgProps> = ({ rowData }) => (
  <img className={cnSelectLegendImg()} src={rowData.legend} />
);
