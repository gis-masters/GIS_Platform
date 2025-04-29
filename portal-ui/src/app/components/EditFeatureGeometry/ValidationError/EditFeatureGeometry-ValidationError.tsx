import React, { FC, useCallback } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { SvgIconComponent } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { makeGeometryValid } from '../../../services/data/geometryValidation/geometryValidation.service';
import { editFeatureStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { isEditFeaturesData } from '../../../services/util/typeGuards/isEditFeaturesData';
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
    if (editFeatureStore.editFeaturesData?.features) {
      try {
        const currentFeature = { ...editFeatureStore.editFeaturesData?.features[0], id: null };
        const feature = await makeGeometryValid(currentFeature);
        const data = {
          ...editFeatureStore.editFeaturesData,
          features: [{ ...feature, id: editFeatureStore.editFeaturesData?.features[0].id }]
        };

        if (isEditFeaturesData(data)) {
          editFeatureStore.setGeometryValidationErrorMessage(null);

          if (data.features[0].geometry) {
            editFeatureStore.setEditFeaturesData(data);
          }

          editFeatureStore.setPristineFromGeometryFix(true);
          editFeatureStore.setGeometryValidationError(false);
          editFeatureStore.setPristine(false);
        }
      } catch (error) {
        const err = error as AxiosError<{ errors: Record<string, unknown>[]; message?: string }>;
        editFeatureStore.setGeometryValidationErrorMessage(
          err.response?.data.message || 'Ошибка при сохранении объекта'
        );
        editFeatureStore.setGeometryValidationError(true);

        setShowButton(false);
      }
    }
  }, [setShowButton]);

  return (
    <div className={cnEditFeatureGeometryValidationError()}>
      <div className={cnEditFeatureGeometryValidationError('Message')}>
        {editFeatureStore.geometryValidationErrorMessage}
      </div>
      {showButton && (
        <Button className={cnEditFeatureGeometryValidationError('Button')} onClick={fixGeometry} color='error'>
          Исправить
        </Button>
      )}
    </div>
  );
});
