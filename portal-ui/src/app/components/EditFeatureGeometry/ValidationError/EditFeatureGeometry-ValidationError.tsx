import React, { type FC, useCallback } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { type SvgIconComponent } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { type AxiosError } from 'axios';

import { makeGeometryValid } from '../../../services/data/geometryValidation/geometryValidation.service';
import { mapDrawService } from '../../../services/map/draw/map-draw.service';
import { editFeatureStore } from '../../../stores/EditFeature.store';
import { Button } from '../../Button/Button';

import './EditFeatureGeometry-ValidationError.scss';

const cnEditFeatureGeometryValidationError = cn('EditFeatureGeometryValidationError');

interface EditFeatureGeometryValidationErrorProps {
  Icon?: SvgIconComponent;
}

interface ValidationErrorButton {
  showButton: boolean;
  setShowButton(showButton: boolean): void;
}

export const EditFeatureGeometryValidationError: FC<EditFeatureGeometryValidationErrorProps> = observer(() => {
  const { showButton, setShowButton } = useLocalObservable(
    (): ValidationErrorButton => ({
      showButton: true,

      setShowButton(this: ValidationErrorButton, showButton: boolean): void {
        this.showButton = showButton;
      }
    })
  );

  const fixGeometry = useCallback(async () => {
    const firstFeature = editFeatureStore.firstFeature;
    if (firstFeature) {
      try {
        const validWfsFeature = await makeGeometryValid(firstFeature);
        if (validWfsFeature.geometry) {
          editFeatureStore.setGeometry(validWfsFeature.geometry, true, 'Исправление геометрии');
          editFeatureStore.setPristine(false);
          editFeatureStore.setGeometryErrorMessage(null);
          editFeatureStore.setPristineFromGeometryFix(false);

          await mapDrawService.syncFeatureGeometryWithMap();
        }
      } catch (error) {
        const err = error as AxiosError<{ errors: Record<string, unknown>[]; message?: string }>;
        editFeatureStore.setGeometryErrorMessage(err.response?.data.message || 'Ошибка при сохранении объекта');

        setShowButton(false);
      }
    }
  }, [setShowButton]);

  return (
    <div className={cnEditFeatureGeometryValidationError()}>
      <div className={cnEditFeatureGeometryValidationError('Message')}>{editFeatureStore.geometryErrorMessage}</div>
      {showButton && (
        <Button className={cnEditFeatureGeometryValidationError('Button')} onClick={fixGeometry} color='error'>
          Исправить
        </Button>
      )}
    </div>
  );
});
