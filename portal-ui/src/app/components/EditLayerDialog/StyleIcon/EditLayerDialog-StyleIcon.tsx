import React, { useState } from 'react';
import { SettingsSuggestOutlined, StyleOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { CUSTOM_STYLE_NAME } from '../../../services/geoserver/styles/styles.models';
import { loadLayerStyleRules } from '../../../services/geoserver/styles/styles.service';

import '!style-loader!css-loader!sass-loader!./EditLayerDialog-StyleIcon.scss';

const cnEditLayerDialogStyleIcon = cn('EditLayerDialog', 'StyleIcon');

interface EditLayerDialogStyleIconProps {
  layerComplexName?: string;
  styleName: string;
}

export const EditLayerDialogStyleIcon: React.FC<EditLayerDialogStyleIconProps> = ({ layerComplexName, styleName }) => {
  const [img, setImg] = useState('');
  let Icon = StyleOutlined;

  if (styleName.startsWith('simple_') && !img) {
    void loadLayerStyleRules(styleName, layerComplexName).then(([style]) => setImg(style.legend));
  } else if (styleName === CUSTOM_STYLE_NAME) {
    Icon = SettingsSuggestOutlined;
  }

  return (
    <div className={cnEditLayerDialogStyleIcon()}>
      {img ? <img src={img} alt='' /> : <Icon color='info' fontSize='small' />}
    </div>
  );
};
