import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { RuleExtended } from '../../../stores/PrintSettings.store';

const cnSelectLegendImg = cn('SelectLegend', 'Img');

interface SelectLegendImgProps {
  rowData: RuleExtended;
}

export const SelectLegendImg: FC<SelectLegendImgProps> = ({ rowData }) => (
  <img className={cnSelectLegendImg()} src={rowData.legend} />
);
