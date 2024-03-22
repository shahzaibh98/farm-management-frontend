import React from 'react';
import { Group, Radio } from '@mantine/core';

interface CustomRadioGroupProps {
  name: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  withAsterisk?: boolean;
  children: React.ReactNode;
  [key: string]: any; // Allow rest props
}

interface CustomRadioProps {
  value: string;
  label: string;
  [key: string]: any; // Allow rest props
}

const CustomRadioGroup = ({
  name,
  label,
  description,
  withAsterisk,
  children,
  ...rest
}: CustomRadioGroupProps) => {
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

export default CustomRadioGroup;
