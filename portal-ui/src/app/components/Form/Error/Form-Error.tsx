import React, { FC } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

const cnForm = cn('Form-Error');

import '!style-loader!css-loader!sass-loader!./Form-Error.scss';

export const FormError: FC<IClassNameProps> = ({ children }) => <div className={cnForm()}>{children}</div>;
