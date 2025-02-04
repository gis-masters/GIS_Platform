import React, { FC, memo, useCallback } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { MenuItem, Popover, Select, SelectChangeEvent, Tooltip } from '@mui/material';
import { Circle, TripOrigin } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { debounce } from 'lodash';
import { HexColorPicker } from 'react-colorful';

import { CircleProperties } from '../../services/map/labels/map-labels.models';
import { mapLabelsService } from '../../services/map/labels/map-labels.service';
import { isKeyofCircleProperties } from '../../services/util/typeGuards/isKeyOfCircleProperties';
import { IconButton } from '../IconButton/IconButton';

import '!style-loader!css-loader!sass-loader!./TurningPointsCircleSettings.scss';

const pointSizes = [5, 6, 8, 10, 12, 14, 16, 18, 20];

type SelectedColorType = 'fillColor' | 'strokeColor' | null;

type TurningPointsCircleSettingsState = {
  anchorEl: HTMLButtonElement | null;
  selectedColorType: SelectedColorType;
  circleProperties: CircleProperties;
  setAnchorEl(event: React.MouseEvent<HTMLButtonElement> | null): void;
  setSelectedColorType(type: SelectedColorType): void;
  setCircleProperties(circleProperties: CircleProperties): void;
};

const cnTurningPointsCircleSettings = cn('TurningPointsCircleSettings');

const TurningPointsCircleSettingsFC: FC = observer(() => {
  const { anchorEl, selectedColorType, circleProperties, setAnchorEl, setCircleProperties, setSelectedColorType } =
    useLocalObservable(
      (): TurningPointsCircleSettingsState => ({
        anchorEl: null,
        selectedColorType: null,
        circleProperties: mapLabelsService.turningPointsCircleStyles,
        setAnchorEl(event: React.MouseEvent<HTMLButtonElement> | null) {
          this.anchorEl = event ? event.currentTarget : event;
        },
        setSelectedColorType(type: SelectedColorType): void {
          this.selectedColorType = type;
        },
        setCircleProperties(circleProperties: CircleProperties) {
          this.circleProperties = circleProperties;
        }
      })
    );

  const { radius, strokeColor, fillColor } = circleProperties;

  const handleChangeSettings = useCallback(
    (e: SelectChangeEvent<string>) => {
      const { name, value } = e.target;

      if (!isKeyofCircleProperties(name)) {
        return;
      }

      const newCircleStyles: CircleProperties = { ...circleProperties, [name]: value };

      setCircleProperties(newCircleStyles);
      mapLabelsService.setTurningPointsCircleStyles(newCircleStyles);
    },
    [circleProperties, setCircleProperties]
  );

  const handleColorTypeClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const { name } = event.currentTarget;

      if (name !== 'fillColor' && name !== 'strokeColor') {
        return;
      }

      setSelectedColorType(name);
      setAnchorEl(event);
    },
    [setAnchorEl, setSelectedColorType]
  );

  const handleClosePopover = useCallback(() => {
    setAnchorEl(null);
    setSelectedColorType(null);

    mapLabelsService.setTurningPointsCircleStyles(circleProperties);
  }, [circleProperties, setAnchorEl, setSelectedColorType]);
  const handleColorChange = useCallback(
    debounce((newColor: string) => {
      const newCircleProperties = { ...circleProperties, [selectedColorType as string]: newColor };

      setCircleProperties(newCircleProperties);
    }, 200),
    [circleProperties, selectedColorType, setCircleProperties]
  );

  return (
    <div className={cnTurningPointsCircleSettings()}>
      <div className={cnTurningPointsCircleSettings('List')}>
        <Tooltip title='Размер' placement='top'>
          <Select
            className={cnTurningPointsCircleSettings('FontSize')}
            value={radius}
            name='radius'
            variant='standard'
            onChange={handleChangeSettings}
          >
            {pointSizes.map((size, idx) => (
              <MenuItem key={idx} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </Tooltip>
        <Tooltip title='Цвет заливки' placement='top'>
          <IconButton name='fillColor' onClick={handleColorTypeClick} style={{ color: fillColor }} checked>
            <Circle color='inherit' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Цвет обводки' placement='top'>
          <IconButton name='strokeColor' onClick={handleColorTypeClick} style={{ color: strokeColor }} checked>
            <TripOrigin />
          </IconButton>
        </Tooltip>
      </div>
      <div className={cnTurningPointsCircleSettings('ExampleWrap')}>
        <span
          style={{
            background: fillColor,
            borderColor: strokeColor,
            width: `${Number(radius) * 2}px`,
            height: `${Number(radius) * 2}px`
          }}
          className={cnTurningPointsCircleSettings('Example')}
        />
      </div>
      <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={handleClosePopover}>
        <HexColorPicker
          color={selectedColorType === 'fillColor' ? fillColor : strokeColor}
          className={cnTurningPointsCircleSettings('HexColorPicker')}
          onChange={handleColorChange}
        />
      </Popover>
    </div>
  );
});

export const TurningPointsCircleSettings = memo(TurningPointsCircleSettingsFC);
