import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Chip, Stack } from '@mui/material';
import { cn } from '@bem-react/classname';

import { PropertySchema, PropertyType } from '../../services/data/schema/schema.models';
import { isStringArray } from '../../services/util/typeGuards/isStringArray';
import { Card } from '../Card/Card';
import { CardRow } from '../Card/Row/Card-Row';
import { CardRowTitle } from '../Card/RowTitle/Card-RowTitle';

const cnSpecializationDescription = cn('SpecializationDescription');

export interface SpecializationDescriptionProps {
  property: PropertySchema;
}

export const SpecializationDescription: FC<SpecializationDescriptionProps> = observer(({ property }) => {
  if (property.propertyType !== PropertyType.CUSTOM) {
    throw new Error('Некорректный тип свойства');
  }

  const { tags, description } = property;

  if (!isStringArray(tags)) {
    return;
  }

  return (
    <div className={cnSpecializationDescription()}>
      <Card>
        {!!description && (
          <CardRow>
            <CardRowTitle>Описание специализации:</CardRowTitle>
            {description}
          </CardRow>
        )}
        {!!tags.length && (
          <CardRow>
            <CardRowTitle>Теги специализации:</CardRowTitle>
            <Stack direction='row' spacing={1}>
              {tags.map((tag, idx) => (
                <Chip key={idx} label={tag} variant='outlined' />
              ))}
            </Stack>
          </CardRow>
        )}
      </Card>
    </div>
  );
});
