import { createElement, type FC, type ReactNode } from 'react';

interface SldFunctionProps {
  name: string;
  children?: ReactNode;
}

export const SldFunction: FC<SldFunctionProps> = ({ name, children }) => createElement('Function', { name }, children);
