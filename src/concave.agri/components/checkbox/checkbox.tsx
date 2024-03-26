import React from 'react';
import { Checkbox as MantineCheckBox } from '@mantine/core';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  [key: string]: any;
}

const Checkbox = ({ checked, onChange, ...rest }: CheckboxProps) => {
  return (
    <MantineCheckBox
      checked={checked}
      onChange={event => onChange(event.currentTarget.checked)}
      {...rest}
    />
  );
};

export default Checkbox;
