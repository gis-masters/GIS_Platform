import React, { FC, SyntheticEvent, useCallback } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs, Tooltip } from '@mui/material';
import {
  Adjust,
  ArchitectureOutlined,
  BuildCircleOutlined,
  CropOutlined,
  LabelOutlined,
  SaveOutlined,
  SettingsSuggestOutlined,
  Straighten
} from '@mui/icons-material';
import { TabContext } from '@mui/lab';
import { cn } from '@bem-react/classname';

import {
  AnnotationsFontProperties,
  AnnotationsType,
  FontProperties
} from '../../services/map/labels/map-labels.models';
import { mapLabelsService } from '../../services/map/labels/map-labels.service';
import { isAnnotationType } from '../../services/util/typeGuards/isAnnotationType';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { LabelStylesSettings } from '../LabelStylesSettings/LabelStylesSettings';
import { TurningPointsCircleSettings } from '../TurningPointsCircleSettings/TurningPointsCircleSettings';

import '!style-loader!css-loader!sass-loader!./AnnotationSettings.scss';

type AnnotationSettingsState = {
  isOpen: boolean;
  selectedAnnotationType: AnnotationsType;
  fontProperties: AnnotationsFontProperties;
  setOpen(isOpen: boolean): void;
  selectAnnotationType(annotationType: AnnotationsType): void;
  setFontProperties(fontProperties: AnnotationsFontProperties): void;
};

const tabs = [
  { title: 'Площадь', value: 'area', element: <CropOutlined /> },
  { title: 'Периметр', value: 'length', element: <ArchitectureOutlined /> },
  { title: 'Поворотные точки', value: 'turningPoints', element: <Adjust /> },
  { title: 'Промеры', value: 'distances', element: <Straighten /> },
  { title: 'Аннотации', value: 'annotations', element: <LabelOutlined /> },
  { title: 'Настройка стиля поворотных точек', value: 'turningPointsSettings', element: <BuildCircleOutlined /> }
];

const cnAnnotationSettings = cn('AnnotationSettings');

export const AnnotationSettings: FC = observer(() => {
  const { isOpen, selectedAnnotationType, fontProperties, setOpen, selectAnnotationType, setFontProperties } =
    useLocalObservable(
      (): AnnotationSettingsState => ({
        isOpen: false,
        fontProperties: { ...mapLabelsService.userLabelsSettings },
        setOpen(this: AnnotationSettingsState, isOpen: boolean): void {
          this.isOpen = isOpen;
        },
        selectedAnnotationType: 'annotations',
        selectAnnotationType(this: AnnotationSettingsState, annotationType: AnnotationsType): void {
          this.selectedAnnotationType = annotationType;
        },
        setFontProperties(this: AnnotationSettingsState, fontProperties: AnnotationsFontProperties): void {
          this.fontProperties = fontProperties;
        }
      })
    );

  const handleOpenClick = useCallback(() => setOpen(!isOpen), [isOpen, setOpen]);
  const handleAnnotationTypeChange = useCallback(
    (event: SyntheticEvent, newValue: string) => {
      if (isAnnotationType(newValue)) {
        selectAnnotationType(newValue);
      }
    },
    [selectAnnotationType]
  );

  const handleChangeFontProperties = useCallback(
    (newProperties: FontProperties) => {
      setFontProperties({ ...fontProperties, [selectedAnnotationType]: newProperties });
    },
    [fontProperties, selectedAnnotationType, setFontProperties]
  );

  const handleCloseDialog = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleSaveClick = useCallback(() => {
    mapLabelsService.setLabelsSettings(fontProperties);
    handleCloseDialog();
  }, [fontProperties, handleCloseDialog]);

  return (
    <>
      <Tooltip title='Настройка стиля создаваемых аннотаций'>
        <IconButton className={cnAnnotationSettings()} onClick={handleOpenClick} size='small'>
          <SettingsSuggestOutlined />
        </IconButton>
      </Tooltip>

      <Dialog open={isOpen} onClose={handleCloseDialog}>
        <DialogTitle align='center'>Настройка стиля новых аннотаций</DialogTitle>
        <DialogContent>
          <TabContext value={selectedAnnotationType}>
            <Tabs value={selectedAnnotationType} onChange={handleAnnotationTypeChange}>
              {tabs.map(({ title, value, element }, idx) => (
                <Tab
                  label={
                    <Tooltip title={title} placement='top'>
                      {element}
                    </Tooltip>
                  }
                  value={value}
                  key={idx}
                />
              ))}
            </Tabs>
          </TabContext>
          <div className={cnAnnotationSettings('SettingsWrap')}>
            {tabs.find(({ value }) => value === selectedAnnotationType)?.title || null}
            {selectedAnnotationType === 'turningPointsSettings' ? (
              <TurningPointsCircleSettings />
            ) : (
              <LabelStylesSettings
                onChange={handleChangeFontProperties}
                fontProperties={fontProperties[selectedAnnotationType]}
              />
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveClick} color='primary' startIcon={<SaveOutlined />}>
            Сохранить
          </Button>
          <Button onClick={handleCloseDialog}>Отмена</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
