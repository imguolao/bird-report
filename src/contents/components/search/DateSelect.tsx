import { 
  useState,
  type ComponentProps,
} from 'react';
import { 
  DateRangePicker,
  type RangeValue,
  type DateValue,
} from '@nextui-org/react';
import Field from './Field';

export type RangeDate = {
  start: string;
  end: string;
}

export default function DateSelect(props: ComponentProps<'div'> & {
  onSelectChange?: (rangeDate: RangeDate) => void;
}) {
  const { onSelectChange, ...restProps } = props;
  const [value, setValue] = useState<RangeValue<DateValue>>()
  const handleChange = (rangeDate: RangeValue<DateValue>) => {
    setValue(rangeDate);
    onSelectChange?.({
      start: rangeDate.start.toString(),
      end: rangeDate.end.toString(),
    });
  }

  return (
    <Field label="日期" {...restProps}>
      <DateRangePicker
        className="w-[240px]"
        size="sm"
        label="起始日期 - 结束日期"
        value={value}
        onChange={handleChange}
      />
    </Field>
  );
}
