import { DatesProvider, DateTimePicker, DateValue } from '@mantine/dates';

interface DateTimePickerProps {
  timezone?: string;
  label?: string;
  placeholder?: string;
  defaultValue?: Date | string;
  onChange: (date: Date | null) => void;
  value: string | Date;
  [key: string]: any;
}

const CustomDataAndTime = ({
  timezone = 'Pakistan/Islamabad',
  label,
  placeholder,
  defaultValue,
  onChange,
  value,
  ...restProps
}: DateTimePickerProps) => {
  return (
    <DatesProvider settings={{ timezone }}>
      <DateTimePicker
        label={label}
        placeholder={placeholder}
        defaultValue={new Date(defaultValue ? defaultValue : '')}
        value={new Date(value ? value : '')}
        onChange={(date: DateValue) => onChange(date)}
        {...restProps}
      />
    </DatesProvider>
  );
};

export default CustomDataAndTime;
