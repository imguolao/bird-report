import { useEffect, useState } from 'react';
import {
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
} from '@nextui-org/react';
import { getProvince } from '../../request/iframe_api';
import type {
  Province,
} from '../../request';

export default function AreaSelect() {
  const [province, setProvince] = useState<Province['province_code']>();
  const [provinces, setProvinces] = useState<Province[]>([]);

  useEffect(() => {
    const init = async () => {
      const result = await getProvince();
      setProvinces(result);
    }

    init()
  }, []);

  return (
    <div>
      <div>区域</div>
      <Autocomplete label="省/直辖市"
        selectedKey={province}
        onSelectionChange={key => setProvince(key as string)}>
        {provinces.map(({ province_code, province_name }) => (
          <AutocompleteItem key={province_code}>
            {province_name}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  )
}
