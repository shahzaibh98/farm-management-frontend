import React from 'react';
import { Text as MantineText, TextProps } from '@mantine/core';

interface CustomTextProps extends TextProps {
  children: React.ReactNode;
  [key: string]: any; // Index signature for additional props
}

const CustomText: React.FC<CustomTextProps> = ({ children, ...rest }) => {
  return <MantineText {...rest}>{children}</MantineText>;
};

export default CustomText;
