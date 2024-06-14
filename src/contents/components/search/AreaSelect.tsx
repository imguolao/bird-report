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
  onSelectChange?: (districtCode: District | undefined) => void;
}) {
  const { onSelectChange, cityCode, ...restProps } = props;
  const [district, setDistrict] = useState<District["district_code"] | undefined>();
  const [districts, setDistricts] = useState<District[]>([]);
  const handleSelect = (districtCode: string | undefined) => {
    const d = districts.find(item => item.district_code === districtCode);
    setDistrict(districtCode);
    onSelectChange?.(d);
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
  onSelectChange?: (city: City | undefined) => void;
}) {
  const { provinceCode, onSelectChange, ...restProps } = props;
  const [cities, setCities] = useState<City[]>([]);
  const [city, setCity] = useState<City["city_code"] | undefined>();
  const handleSelect = (cityCode: string | undefined) => {
    const c = cities.find(item => item.city_code === cityCode);
    setCity(cityCode);
    onSelectChange?.(c);
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
  province?: Province;
  onSelectChange?: (province: Province | undefined) => void;
}) {
  const { province, onSelectChange, ...restProps } = props;
  const [provinceCode, setProvinceCode] = useState<Province['province_code'] | undefined>(province?.province_code);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const handleSelectChange = (provinceCode: string | undefined) => {
    const p = provinces.find(item => item.province_code === provinceCode);
    setProvinceCode(provinceCode);
    onSelectChange?.(p);
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
      selectedKey={provinceCode}
      onSelectionChange={key => handleSelectChange(key as string)}>
      {provinces.map(({ province_code, province_name }) => (
        <AutocompleteItem key={province_code}>
          {province_name}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  )
}

export type Area = {
  province?: Province;
  city?: City;
  district?: District;
}

export default function AreaSelect(props: ComponentProps<'div'> & {
  area?: Area,
  onSelectChange?: (area: Area) => void;
}) {
  const { area: propsArea, onSelectChange, ...restProps } = props;
  const [area, setArea] = useState<Area>(propsArea ?? {});
  const handleDistrictSelect = (district: District | undefined) => {
    const newArea = {
      ...area,
      district,
    };
    setArea(newArea);
    onSelectChange?.(newArea);
  }

  const handleCitySelect = (city: City | undefined) => {
    const newArea = {
      province: area.province,
      city,
    };
    setArea(newArea);
    onSelectChange?.(newArea);
  }

  const handleProvinceSelect = (province: Province | undefined) => {
    const newArea = { province };
    setArea(newArea);
    onSelectChange?.(newArea);
  }

  return (
    <Field label="区域" {...restProps}>
      <ProvinceSelect
        className="w-[200px] mr-[10px]"
        province={area.province} 
        onSelectChange={handleProvinceSelect} 
      />
      <CitySelect
        className="w-[200px] mr-[10px]"
        provinceCode={area.province?.province_code} 
        onSelectChange={handleCitySelect} 
      />
      <DistrictSelect
        className="w-[200px]"
        cityCode={area.city?.city_code} 
        onSelectChange={handleDistrictSelect} 
      />
    </Field>
  )
}
