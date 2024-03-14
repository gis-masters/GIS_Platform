import { FC, ReactNode, createElement } from 'react';

interface FunctionProps {
  name: string;
  children?: ReactNode;
}

export const Function: FC<FunctionProps> = ({ name, children }) => createElement('Function', { name }, children);
