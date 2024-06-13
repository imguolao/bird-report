import {
  type ComponentProps,
  useEffect,
  useState,
} from 'react';
import {
  type AutocompleteProps,
  Autocomplete,
  AutocompleteItem,
} from '@nextui-org/react';
import { 
  getProvince,
  getCity,
  getDistrict,
} from '../../request/iframe_api';
import type {
  Province,
  City,
  District,
} from '../../request';
import Field from './Field';

function DistrictSelect(props: Omit<AutocompleteProps, 'children'> & {
  cityCode?: string;
  onSelectChange?: (districtCode: string | undefined) => void;
}) {
  const { onSelectChange, cityCode, ...restProps } = props;
  const [district, setDistrict] = useState<District["district_code"] | undefined>();
  const [districts, setDistricts] = useState<District[]>([]);
  const handleSelect = (districtCode: string | undefined) => {
    setDistrict(districtCode);
    onSelectChange?.(districtCode);
  }

  useEffect(() => {
    const asyncEffect = async () => {
      setDistrict(undefined);
      if (!cityCode) {
        districts.length && setDistricts([]);
        return;
      }

      const newDistricts = await getDistrict(cityCode);
      setDistricts(newDistricts);
    }

    asyncEffect();
  }, [cityCode]);

  return (
    <Autocomplete 
      {...restProps}
      size="sm"
      label="区/县"
      selectedKey={district}
      onSelectionChange={key => handleSelect(key as string)}>
      {districts.map(({ district_code, district_name }) => (
        <AutocompleteItem key={district_code}>
          {district_name}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
}

function CitySelect(props: Omit<AutocompleteProps, 'children'> & {
  provinceCode?: string;
  onSelectChange?: (cityCode: string | undefined) => void;
}) {
  const { provinceCode, onSelectChange, ...restProps } = props;
  const [cities, setCities] = useState<City[]>([]);
  const [city, setCity] = useState<City["city_code"] | undefined>();
  const handleSelect = (cityCode: string | undefined) => {
    setCity(cityCode);
    onSelectChange?.(cityCode);
  }

  useEffect(() => {
    const asyncEffect = async () => {
      setCity(undefined);
      if (!provinceCode) {
        cities.length && setCities([]);
        return;
      }

      const newCities = await getCity(provinceCode);
      setCities(newCities);
    }

    asyncEffect();
  }, [provinceCode]);

  return (
    <Autocomplete 
      {...restProps}
      size="sm"
      label="城市"
      selectedKey={city}
      onSelectionChange={key => handleSelect(key as string)}>
      {cities.map(({ city_code, city_name }) => (
        <AutocompleteItem key={city_code}>
          {city_name}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
}

function ProvinceSelect(props: Omit<AutocompleteProps, 'children'> & {
  provinceCode?: string;
  onSelectChange?: (provinceCode: string | undefined) => void;
}) {
  const { provinceCode, onSelectChange, ...restProps } = props;
  const [province, setProvince] = useState<Province['province_code'] | undefined>(provinceCode);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const handleSelect = (provinceCode: string | undefined) => {
    setProvince(provinceCode);
    onSelectChange?.(provinceCode);
  }

  useEffect(() => {
    const asyncEffect = async () => {
      const newProvinces = await getProvince();
      setProvinces(newProvinces);
    }

    asyncEffect()
  }, []);

  return (
    <Autocomplete
      {...restProps}
      size="sm"
      label="省/直辖市"
      selectedKey={province}
      onSelectionChange={key => handleSelect(key as string)}>
      {provinces.map(({ province_code, province_name }) => (
        <AutocompleteItem key={province_code}>
          {province_name}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  )
}

export type Area = {
  provinceCode?: Province['province_code'];
  cityCode?: City['city_code'];
  districtCode?: District['district_code'];
}

export default function AreaSelect(props: ComponentProps<'div'> & {
  onSelectionChange?: (area: Area) => void;
}) {
  const { onSelectionChange, ...restProps } = props;
  const [area, setArea] = useState<Area>({});
  const handleDistrictSelect = (districtCode: string | undefined) => {
    const newArea = {
      ...area,
      districtCode,
    };
    setArea(newArea);
    onSelectionChange?.(newArea);
  }

  const handleCitySelect = (cityCode: string | undefined) => {
    const newArea = {
      provinceCode: area.provinceCode,
      cityCode,
    };
    setArea(newArea);
    onSelectionChange?.(newArea);
  }

  const handleProvinceSelect = (provinceCode: string | undefined) => {
    const newArea = { provinceCode };
    setArea(newArea);
    onSelectionChange?.(newArea);
  }

  return (
    <Field label="区域" {...restProps}>
      <ProvinceSelect
        className="w-[200px] mr-[10px]"
        provinceCode={area.provinceCode} 
        onSelectChange={handleProvinceSelect} 
      />
      <CitySelect
        className="w-[200px] mr-[10px]"
        provinceCode={area.provinceCode} 
        onSelectChange={handleCitySelect} 
      />
      <DistrictSelect
        className="w-[200px]"
        cityCode={area.cityCode} 
        onSelectChange={handleDistrictSelect} 
      />
    </Field>
  )
}
