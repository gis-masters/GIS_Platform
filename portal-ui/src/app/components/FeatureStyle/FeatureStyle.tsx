import React, { FC, useCallback } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@mui/material';
import { EditOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { Feature } from 'ol';

import { FontProperties } from '../../services/map/labels/map-labels.models';
import { mapLabelsService } from '../../services/map/labels/map-labels.service';
import {
  convertFromRGBAToHEX,
  getFeatureFontPropertiesByString,
  getFeatureFontString,
  getFeatureStringValue
} from '../../services/map/labels/map-labels.util';
import { createStyle } from '../../services/map/styles/map-styles';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { LabelStylesSettings } from '../LabelStylesSettings/LabelStylesSettings';

type FeatureStyleState = {
  isDialogOpen: boolean;
  text: string;
  fontProperties: FontProperties;
  setDialogOpen(isOpen: boolean): void;
  setText(text: string): void;
  setFontProperties(fontProperties: FontProperties): void;
};

type FeatureStyleProps = {
  feature: Feature;
};

const cnFeatureStyle = cn('FeatureStyle');

export const FeatureStyle: FC<FeatureStyleProps> = observer(({ feature }) => {
  const value = getFeatureStringValue(feature);
  const { font, fontColor, textAlign } = getFeatureFontString(feature);
  const hexFontColor = convertFromRGBAToHEX(fontColor);
  const { isBold, isItalic, fontSize } = getFeatureFontPropertiesByString(font);

  const { isDialogOpen, text, fontProperties, setDialogOpen, setText, setFontProperties } = useLocalObservable(
    (): FeatureStyleState => ({
      isDialogOpen: false,
      text: value,
      fontProperties: {
        isBold,
        isItalic,
        fontSize,
        fontColor: hexFontColor,
        textAlign
      },
      setDialogOpen(isOpen: boolean): void {
        this.isDialogOpen = isOpen;
      },
      setText(this: FeatureStyleState, text: string): void {
        this.text = text;
      },
      setFontProperties(this: FeatureStyleState, fontProperties: FontProperties): void {
        this.fontProperties = fontProperties;
      }
    })
  );

  const handleClick = useCallback(() => {
    setDialogOpen(!isDialogOpen);
  }, [isDialogOpen, setDialogOpen]);

  const handleChangeProperties = useCallback(
    (fontProperties: FontProperties) => {
      setFontProperties(fontProperties);
    },
    [setFontProperties]
  );

  const handleCloseDialog = useCallback(() => {
    mapLabelsService.removeLabelToolbox();
  }, []);

  const handleSaveClick = useCallback(() => {
    const properties = feature.getProperties();
    feature.setProperties({
      ...properties,
      text,
      textProperties: { ...fontProperties }
    });
    feature.setStyle(createStyle(feature));
    setDialogOpen(false);
    handleCloseDialog();
    mapLabelsService.saveToStorages();
  }, [feature, fontProperties, handleCloseDialog, setDialogOpen, text]);

  const handleCancelClick = useCallback(() => {
    setDialogOpen(false);
    handleCloseDialog();
  }, [handleCloseDialog, setDialogOpen]);

  const handleChangeValue = useCallback((value: string) => setText(value), [setText]);

  return (
    <>
      <Tooltip title='Редактировать'>
        <IconButton className={cnFeatureStyle('Button')} onClick={handleClick} size='small' checked={isDialogOpen}>
          <EditOutlined />
        </IconButton>
      </Tooltip>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Настройка аннотации</DialogTitle>
        <DialogContent>
          <LabelStylesSettings
            fontProperties={fontProperties}
            onChange={handleChangeProperties}
            value={text}
            handleChangeValue={handleChangeValue}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveClick} color='primary'>
            Сохранить
          </Button>
          <Button onClick={handleCancelClick}>Отмена</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
