import React, { ChangeEvent, FC, useCallback } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { MenuItem, Paper, Popover, Select, SelectChangeEvent, Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { debounce } from 'lodash';
import { HexColorPicker } from 'react-colorful';

import { FontProperties } from '../../services/map/labels/map-labels.models';
import { IconButton } from '../IconButton/IconButton';
import { FormatBold } from '../Icons/FormatBold';
import { FormatColorText } from '../Icons/FormatColorText';
import { FormatItalic } from '../Icons/FormatItalic';

import '!style-loader!css-loader!sass-loader!./LabelStylesSettings.scss';

type LabelStylesSettingsState = {
  anchorEl: HTMLButtonElement | null;
  setAnchorEl(event: React.MouseEvent<HTMLButtonElement> | null): void;
};

type LaLabelStylesSettingsProps = {
  fontProperties: FontProperties;
  onChange(fontProperties: FontProperties): void;
  value?: string;
  handleChangeValue?: (value: string) => void;
};

const fontSizes = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40];

const cnLabelStylesSettings = cn('LabelStylesSettings');

export const LabelStylesSettings: FC<LaLabelStylesSettingsProps> = observer(
  ({ fontProperties, value, onChange, handleChangeValue }) => {
    const { anchorEl, setAnchorEl } = useLocalObservable(
      (): LabelStylesSettingsState => ({
        anchorEl: null,
        setAnchorEl(event: React.MouseEvent<HTMLButtonElement> | null) {
          this.anchorEl = event ? event.currentTarget : event;
        }
      })
    );

    const handleColorClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e);
      },
      [setAnchorEl]
    );
    const handleCloseColorPicker = useCallback(() => {
      setAnchorEl(null);
    }, [setAnchorEl]);

    const handleColorChange = useCallback(
      debounce((newColor: string) => {
        onChange({ ...fontProperties, fontColor: newColor });
      }, 200),
      [fontProperties]
    );

    const handleBoldChange = useCallback(() => {
      onChange({ ...fontProperties, isBold: !fontProperties.isBold });
    }, [fontProperties, onChange]);

    const handleItalicChange = useCallback(() => {
      onChange({ ...fontProperties, isItalic: !fontProperties.isItalic });
    }, [fontProperties, onChange]);

    const handleFontSizeChange = useCallback(
      (e: SelectChangeEvent) => {
        onChange({ ...fontProperties, fontSize: Number(e.target.value) });
      },
      [fontProperties, onChange]
    );

    const handleTextFieldChange = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (handleChangeValue) {
          handleChangeValue(e.target.value);
        }
      },
      [handleChangeValue]
    );

    return (
      <>
        <div className={cnLabelStylesSettings('Properties')}>
          <Tooltip title='Жирный'>
            <IconButton checked={fontProperties.isBold} onClick={handleBoldChange}>
              <FormatBold />
            </IconButton>
          </Tooltip>
          <Tooltip title='Курсив'>
            <IconButton checked={fontProperties.isItalic} onClick={handleItalicChange}>
              <FormatItalic />
            </IconButton>
          </Tooltip>
          <Tooltip title='Цвет шрифта'>
            <IconButton className={cnLabelStylesSettings('FontColor')} onClick={handleColorClick} checked={!!anchorEl}>
              <FormatColorText stroke={fontProperties.fontColor} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Размер шрифта' placement='top'>
            <Select
              className={cnLabelStylesSettings('FontSize')}
              value={String(fontProperties.fontSize)}
              variant='standard'
              onChange={handleFontSizeChange}
            >
              {fontSizes.map((size, idx) => (
                <MenuItem key={idx} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </Tooltip>
        </div>
        <div className={cnLabelStylesSettings('Example')}>
          {(!!value || value === '') && (
            <textarea
              className={cnLabelStylesSettings('ExampleContent')}
              style={{
                fontWeight: fontProperties.isBold ? 700 : 400,
                fontStyle: fontProperties.isItalic ? 'italic' : 'normal',
                fontSize: fontProperties.fontSize,
                color: fontProperties.fontColor
              }}
              onChange={handleTextFieldChange}
              value={value}
            />
          )}

          {!value && (
            <Paper
              className={cnLabelStylesSettings('ExampleUnchangeable')}
              style={{
                fontWeight: fontProperties.isBold ? 700 : 400,
                fontStyle: fontProperties.isItalic ? 'italic' : 'normal',
                fontSize: fontProperties.fontSize,
                color: fontProperties.fontColor
              }}
            >
              Текст надписи
            </Paper>
          )}
        </div>
        <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={handleCloseColorPicker}>
          <HexColorPicker
            color={fontProperties.fontColor}
            className={cnLabelStylesSettings('HexColorPicker')}
            onChange={handleColorChange}
          />
        </Popover>
      </>
    );
  }
);
