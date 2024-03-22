import React from 'react';
import { Checkbox } from '@mantine/core';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  [key: string]: any;
}

const CustomCheckbox = ({ checked, onChange, ...rest }: CheckboxProps) => {
  return (
    <Checkbox
      checked={checked}
      onChange={event => onChange(event.currentTarget.checked)}
      {...rest}
    />
  );
};

export default CustomCheckbox;
