import { 
  useState,
  useEffect,
  type ComponentProps,
} from 'react';
import { 
  DateRangePicker,
  type RangeValue,
  type DateValue,
} from '@nextui-org/react';
import {parseDate} from "@internationalized/date";
import Field from './Field';
import type { RangeDate } from '../../../utils';

export type { RangeDate };

export default function DateSelect(props: ComponentProps<'div'> & {
  rangeDate?: RangeDate,
  onSelectChange?: (rangeDate: RangeDate) => void;
}) {
  const { onSelectChange, rangeDate: propsRangeDate, ...restProps } = props;
  const [value, setValue] = useState<RangeValue<DateValue> | undefined>(() => {
    if (propsRangeDate) {
      return {
        start: parseDate(propsRangeDate.start),
        end: parseDate(propsRangeDate.end),
      };
    }
    return undefined;
  });

  const handleChange = (rangeDate: RangeValue<DateValue>) => {
    setValue(rangeDate);
    onSelectChange?.({
      start: rangeDate.start.toString(),
      end: rangeDate.end.toString(),
    });
  }

  useEffect(() => {
    if (propsRangeDate) {
      setValue({
        start: parseDate(propsRangeDate.start),
        end: parseDate(propsRangeDate.end),
      });
    }
  }, [propsRangeDate]);

  return (
    <Field label="日期" {...restProps}>
      <DateRangePicker
        className="w-[240px]"
        size="sm"
        label="起始日期 - 结束日期"
        visibleMonths={2}
        value={value}
        onChange={handleChange}
      />
    </Field>
  );
}
