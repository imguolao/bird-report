import AreaSelect, { type Area } from './AreaSelect';
import DateSelect from './DateSelect';

export default function MultipleSearch() {
  return (
    <div>
      <AreaSelect className="mb-[10px]" />
      <DateSelect />
    </div>
  );
}
