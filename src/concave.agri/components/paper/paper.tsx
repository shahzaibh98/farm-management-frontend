import React from 'react';
import {
  Paper as MantinePaper,
  PaperProps as MantinePaperProps,
} from '@mantine/core';

interface PaperProps extends MantinePaperProps {
  children: React.ReactNode;
  [key: string]: any; // Index signature for additional props
}

const Paper: React.FC<PaperProps> = ({ children, ...rest }) => {
  return <MantinePaper {...rest}>{children}</MantinePaper>;
};

export default Paper;
