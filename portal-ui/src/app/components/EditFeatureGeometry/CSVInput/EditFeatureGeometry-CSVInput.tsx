import React, { type ChangeEvent, type FC, type RefObject } from 'react';
import { cn } from '@bem-react/classname';

import './EditFeatureGeometry-CSVInput.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryCSVInputProps {
  inputRef: RefObject<HTMLInputElement>;
  onChange(e: ChangeEvent<HTMLInputElement>): void;
}

export const EditFeatureGeometryCSVInput: FC<EditFeatureGeometryCSVInputProps> = ({ onChange, inputRef }) => (
  <input type='file' onChange={onChange} className={cnEditFeatureGeometry('CSVInput')} ref={inputRef} title='' />
);
