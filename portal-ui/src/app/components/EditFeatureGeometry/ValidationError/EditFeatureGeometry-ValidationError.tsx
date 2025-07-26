import React, { FC, useCallback } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { SvgIconComponent } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { makeGeometryValid } from '../../../services/data/geometryValidation/geometryValidation.service';
import { editFeatureStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { Button } from '../../Button/Button';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-ValidationError.scss';

const cnEditFeatureGeometryValidationError = cn('EditFeatureGeometryValidationError');

interface EditFeatureGeometryValidationErrorProps {
  Icon?: SvgIconComponent;
}

interface ValidationErrorButton {
  showButton: boolean;
  setShowButton: (showButton: boolean) => void;
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
          editFeatureStore.setGeometry(validWfsFeature.geometry);
          editFeatureStore.setPristine(false);
          editFeatureStore.setGeometryErrorMessage(null);
          editFeatureStore.setPristineFromGeometryFix(false);
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
