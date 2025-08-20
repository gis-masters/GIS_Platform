import { createElement, FC } from 'react';

interface SvgParameterProps {
  name: string;
  children: string | number;
}

export const SvgParameter: FC<SvgParameterProps> = ({ name, children }) =>
  createElement('SvgParameter', { name }, children);
