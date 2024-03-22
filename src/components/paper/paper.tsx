import React from 'react';
import { Paper as MantinePaper, PaperProps } from '@mantine/core';

interface CustomPaperProps extends PaperProps {
  children: React.ReactNode;
  [key: string]: any; // Index signature for additional props
}

const CustomPaper: React.FC<CustomPaperProps> = ({ children, ...rest }) => {
  return <MantinePaper {...rest}>{children}</MantinePaper>;
};

export default CustomPaper;
