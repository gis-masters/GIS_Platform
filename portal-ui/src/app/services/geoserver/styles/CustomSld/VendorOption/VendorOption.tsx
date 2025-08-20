import { createElement, FC } from 'react';

interface VendorOptionProps {
  name: string;
  children: string | number;
}

export const VendorOption: FC<VendorOptionProps> = ({ name, children }) =>
  createElement('VendorOption', { name }, children);
