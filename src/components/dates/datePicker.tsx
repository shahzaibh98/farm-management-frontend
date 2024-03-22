import { DatePickerInput } from '@mantine/dates';

interface CustomDatePickerProps {
  type: 'single' | 'multiple' | 'range';
  label?: string;
  placeholder?: string;
  value: Date | Date[] | [Date | null, Date | null];
  onChange: (value: Date | Date[] | [Date | null, Date | null]) => void;
  [key: string]: any;
}

const CustomDatePicker = ({
  type,
  label,
  placeholder,
  value,
  onChange,
  ...restProps
}: CustomDatePickerProps) => {
  const handleValueChange = (
    newValue: Date | Date[] | [Date | null, Date | null]
  ) => {
    onChange(newValue);
  };

  return (
    <>
      {type === 'single' && (
        <DatePickerInput
          label={label}
          placeholder={placeholder}
          value={value as Date | null}
          onChange={handleValueChange as (value: Date | null) => void}
          {...restProps}
        />
      )}
      {type === 'multiple' && (
        <DatePickerInput
          type="multiple"
          label={label}
          placeholder={placeholder}
          value={value as Date[]}
          onChange={handleValueChange as (value: Date[]) => void}
          {...restProps}
        />
      )}
      {type === 'range' && (
        <DatePickerInput
          type="range"
          label={label}
          placeholder={placeholder}
          value={value as [Date | null, Date | null]}
          onChange={
            handleValueChange as (value: [Date | null, Date | null]) => void
          }
          {...restProps}
        />
      )}
    </>
  );
};

export default CustomDatePicker;
