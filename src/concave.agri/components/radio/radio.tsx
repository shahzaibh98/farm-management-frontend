import React from 'react';
import { Group, Radio } from '@mantine/core';

interface RadioGroupProps {
  name: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  withAsterisk?: boolean;
  children: React.ReactNode;
  [key: string]: any; // Allow rest props
}
const RadioGroup = ({
  name,
  label,
  description,
  withAsterisk,
  children,
  ...rest
}: RadioGroupProps) => {
  return (
    <Radio.Group
      name={name}
      label={label}
      description={description}
      withAsterisk={withAsterisk}
      {...rest}
    >
      <Group mt="xs">{children}</Group>
    </Radio.Group>
  );
};

export default RadioGroup;
