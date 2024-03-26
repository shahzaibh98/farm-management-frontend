import React from 'react';
import {
  Text as MantineText,
  TextProps as MantineTextProps,
} from '@mantine/core';

interface TextProps extends MantineTextProps {
  children: React.ReactNode;
  [key: string]: any; // Index signature for additional props
}

const Text: React.FC<TextProps> = ({ children, ...rest }) => {
  return <MantineText {...rest}>{children}</MantineText>;
};

export default Text;
