import { createElement, FC, ReactNode } from 'react';

interface FunctionProps {
  name: string;
  children?: ReactNode;
}

export const OgcFunction: FC<FunctionProps> = ({ name, children }) => createElement('ogc:Function', { name }, children);
