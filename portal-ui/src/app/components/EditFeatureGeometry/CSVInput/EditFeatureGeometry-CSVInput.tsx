import React, { ChangeEvent, FC, RefObject } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-CSVInput.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryCSVInputProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputRef: RefObject<HTMLInputElement>;
}

export const EditFeatureGeometryCSVInput: FC<EditFeatureGeometryCSVInputProps> = ({ onChange, inputRef }) => (
  <input type='file' onChange={onChange} className={cnEditFeatureGeometry('CSVInput')} ref={inputRef} title='' />
);
