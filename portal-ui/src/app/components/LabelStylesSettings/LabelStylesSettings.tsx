import React, { ChangeEvent, FC, useCallback, useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import {
  ClickAwayListener,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  Select,
  SelectChangeEvent,
  Tooltip
} from '@mui/material';
import {
  FormatAlignCenterOutlined,
  FormatAlignJustifyOutlined,
  FormatAlignLeftOutlined,
  FormatAlignRightOutlined,
  FormatBoldOutlined,
  FormatColorTextOutlined,
  FormatItalicOutlined
} from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { throttle } from 'lodash';
import { HexColorPicker } from 'react-colorful';

import { FontProperties } from '../../services/map/map.models';
import { isTextAlignTypes } from '../../services/util/typeGuards/isTextAlignTypes';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';

import '!style-loader!css-loader!sass-loader!./LabelStylesSettings.scss';

type LabelStylesSettingsState = {
  anchorEl: HTMLButtonElement | null;
  alignMenuOpen: boolean;
  setAnchorEl(event: React.MouseEvent<HTMLButtonElement> | null): void;
  setAlignMenuOpen(open: boolean): void;
};

type LaLabelStylesSettingsProps = {
  fontProperties: FontProperties;
  value: string;
  onChange(fontProperties: FontProperties): void;
  handleChangeValue(value: string): void;
};

const fontSizes = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40];

const cnLabelStylesSettings = cn('LabelStylesSettings');

export const LabelStylesSettings: FC<LaLabelStylesSettingsProps> = observer(
  ({ fontProperties, value, onChange, handleChangeValue }) => {
    const { anchorEl, setAnchorEl, alignMenuOpen, setAlignMenuOpen } = useLocalObservable(
      (): LabelStylesSettingsState => ({
        anchorEl: null,
        alignMenuOpen: false,
        setAnchorEl(event: React.MouseEvent<HTMLButtonElement> | null) {
          this.anchorEl = event ? event.currentTarget : event;
        },
        setAlignMenuOpen(open: boolean): void {
          this.alignMenuOpen = open;
        }
      })
    );

    const ref = useRef(null);

    const handleColorClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e);
      },
      [setAnchorEl]
    );
    const handleClickOutsideHexColorPicker = useCallback(() => {
      setAnchorEl(null);
    }, [setAnchorEl]);

    const handleColorChange = useCallback(
      throttle((newColor: string) => {
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
        handleChangeValue(e.target.value);
      },
      [handleChangeValue]
    );

    // Работает немного некорректно, будет допилино в #2639
    // const handleClickAlignMenu = useCallback(() => {
    //   setAlignMenuOpen(!alignMenuOpen);
    // }, [alignMenuOpen, setAlignMenuOpen]);

    const handleCloseAlignMenu = useCallback(() => {
      setAlignMenuOpen(false);
    }, [setAlignMenuOpen]);

    const handleAlignMenuItemClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { name } = e.currentTarget;
        if (isTextAlignTypes(name)) {
          onChange({ ...fontProperties, textAlign: name });
        }
        handleCloseAlignMenu();
      },
      [fontProperties, handleCloseAlignMenu, onChange]
    );

    return (
      <>
        <div className={cnLabelStylesSettings('Properties')}>
          <Tooltip title='Жирный'>
            <IconButton checked={fontProperties.isBold} onClick={handleBoldChange}>
              <FormatBoldOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title='Курсив'>
            <IconButton checked={fontProperties.isItalic} onClick={handleItalicChange}>
              <FormatItalicOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title='Цвет шрифта'>
            <IconButton
              className={cnLabelStylesSettings('FontColor')}
              style={{ color: fontProperties.fontColor }}
              onClick={handleColorClick}
              checked={!!anchorEl}
            >
              <FormatColorTextOutlined color='inherit' />
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
          {/* Работает немного некорректно, будет допилино в #2639 */}
          {/* <Tooltip title='Выравнивание текста'>
            <IconButton onClick={handleClickAlignMenu} ref={ref}>
              {fontProperties.textAlign === 'left' && <FormatAlignLeftOutlined ref={ref} />}
              {fontProperties.textAlign === 'center' && <FormatAlignCenterOutlined ref={ref} />}
              {fontProperties.textAlign === 'right' && <FormatAlignRightOutlined ref={ref} />}
              {fontProperties.textAlign === 'justify' && <FormatAlignJustifyOutlined ref={ref} />}
            </IconButton>
          </Tooltip> */}
        </div>
        <div className={cnLabelStylesSettings('Example')}>
          <textarea
            style={{
              fontWeight: fontProperties.isBold ? 700 : 400,
              fontStyle: fontProperties.isItalic ? 'italic' : 'normal',
              fontSize: fontProperties.fontSize,
              color: fontProperties.fontColor
            }}
            className={cnLabelStylesSettings('ExampleContent')}
            onChange={handleTextFieldChange}
          >
            {value}
          </textarea>
        </div>
        <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={handleClickOutsideHexColorPicker}>
          <HexColorPicker
            color={fontProperties.fontColor}
            className={cnLabelStylesSettings('HexColorPicker')}
            onChange={handleColorChange}
          />
        </Popover>
        <Popover open={alignMenuOpen} anchorEl={ref.current}>
          <Paper>
            <ClickAwayListener onClickAway={handleCloseAlignMenu}>
              <MenuList autoFocusItem={alignMenuOpen}>
                <MenuItem>
                  <Button name='left' onClick={handleAlignMenuItemClick} variant='text'>
                    <FormatAlignLeftOutlined className={cnLabelStylesSettings('Icon')} /> По левому краю
                  </Button>
                </MenuItem>
                <MenuItem onClick={handleCloseAlignMenu}>
                  <Button name='center' onClick={handleAlignMenuItemClick} variant='text'>
                    <FormatAlignCenterOutlined className={cnLabelStylesSettings('Icon')} />
                    По центру
                  </Button>
                </MenuItem>
                <MenuItem onClick={handleCloseAlignMenu}>
                  <Button name='right' onClick={handleAlignMenuItemClick} variant='text'>
                    <FormatAlignRightOutlined className={cnLabelStylesSettings('Icon')} />
                    По правому краю
                  </Button>
                </MenuItem>
                <MenuItem onClick={handleCloseAlignMenu}>
                  <Button name='justify' onClick={handleAlignMenuItemClick} variant='text'>
                    <FormatAlignJustifyOutlined className={cnLabelStylesSettings('Icon')} />
                    Растянуть
                  </Button>
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popover>
      </>
    );
  }
);
