import type {
  QueryMessage,
  ResponseMessage,
  Province,
  City,
  District,
  TaxonResult,
  WhereQueryParam,
} from './index';
import { type Area } from '../components/search/AreaSelect';
import { type RangeDate } from '../components/search/DateSelect';
import {
  mergeTimeRanges,
  timeKey,
  getMonthsInRange,
  generateMonthArray,
} from '../../utils';

type TaxonParam = {
  area?: Area;
  rangeDate?: RangeDate;
}

export async function getProvince() {
  return new Promise<Province[]>((resolve, reject) => {
    try {
      const key = timeKey();
      function receiver({ data }: MessageEvent<ResponseMessage<Province[]>>) {
        const { data: provinces, type, key: reKey } = data;
        if (type === 'province' && reKey === key) {
          window.removeEventListener('message', receiver);
          resolve(provinces);
        }
      }
  
      window.addEventListener('message', receiver);
      window.parent.postMessage({
        type: 'province',
        key,
        params: [],
      } as QueryMessage<'province'>, '*');
    } catch (e) {
      reject(e);
    }
  });
}

export async function getCity(provinceCode: string) {
  return new Promise<City[]>((resolve, reject) => {
    try {
      const key = timeKey();
      function receiver({ data }: MessageEvent<ResponseMessage<City[]>>) {
        const { data: cities, type, key: reKey } = data;
        if (type === 'city' && reKey === key) {
          window.removeEventListener('message', receiver);
          resolve(cities);
        }
      }
  
      window.addEventListener('message', receiver);
      window.parent.postMessage({
        type: 'city',
        key,
        params: [provinceCode],
      } as QueryMessage<'city'>, '*');
    } catch (e) {
      reject(e);
    }
  });
}

export async function getDistrict(cityCode: string) {
  return new Promise<District[]>((resolve, reject) => {
    try {
      const key = timeKey();
      function receiver({ data }: MessageEvent<ResponseMessage<District[]>>) {
        const { data: districts, type, key: reKey } = data;
        if (type === 'district' && reKey === key) {
          window.removeEventListener('message', receiver);
          resolve(districts);
        }
      }
  
      window.addEventListener('message', receiver);
      window.parent.postMessage({
        type: 'district',
        key,
        params: [cityCode],
      } as QueryMessage<'district'>, '*');
    } catch (e) {
      reject(e);
    }
  });
}

export async function getTaxon(params: TaxonParam[]) {
  const promiseList = normalizeTaxonParams(params).map(param => {
    return new Promise<TaxonResult>((resolve, reject) => {
      try {
        const key = timeKey();
        function receiver({ data }: MessageEvent<ResponseMessage<TaxonResult>>) {
          const { data: taxonResult, type, key: reKey } = data;
          if (type === 'taxon' && reKey === key) {
            window.removeEventListener('message', receiver);
            resolve(taxonResult);
          }
        }
    
        window.addEventListener('message', receiver);
        window.parent.postMessage({
          type: 'taxon',
          key,
          params: [param],
        } as QueryMessage<'taxon'>, '*');
      } catch (e) {
        reject(e);
      }
    });
  });

  return await Promise.all(promiseList);
}

function createTaxonQueryParam(
  area: Area | undefined,
  rangeDate: RangeDate | undefined,
): WhereQueryParam[] | undefined {
  if (!area && !rangeDate) {
    return undefined;
  }

  const province = area?.province?.province_name ?? '';
  const city = area?.city?.city_name ?? '';
  const district = area?.district?.district_name ?? '';
  const startTime = rangeDate?.start ?? '';
  const endTime = rangeDate?.end ?? '';
  const months = rangeDate ? getMonthsInRange(rangeDate) : generateMonthArray();
  return months.map(month => ({
    city,
    ctime: "",
    district,
    endTime,
    mode: 0,
    pointname: "",
    province,
    serial_id: "",
    startTime,
    state: "",
    taxonid: "",
    username: "",
    version: "CH4",
    taxon_month: month,
    outside_type: 0,
    limit: "1500",
    page: "1",
  }));
}

function normalizeTaxonParams(params: TaxonParam[]) {
  const filterParams = params.filter(({ area, rangeDate }) => {
    const hasArea = !!area && !!Object.keys(area).length;
    const hasDate = !!rangeDate;
    return hasArea || hasDate;
  });

  // same location
  const sameLocationMap = filterParams.reduce((result, param) => {
    const { area, rangeDate } = param;
    const key = `${area?.province?.province_code ?? ''}${area?.city?.city_code ?? ''}${area?.district?.district_code ?? ''}`;
    const value = result.get(key) ?? {
      area,
      dates: [],
    };
    rangeDate && value.dates.push(rangeDate);
    result.set(key, value);
    return result;
  }, new Map<string, {
    area: TaxonParam['area'],
    dates: RangeDate[],
  }>());

  Array.from(sameLocationMap.keys()).forEach(key => {
    const { area, dates } = sameLocationMap.get(key)!;
    const mergeDateList = mergeTimeRanges(dates);
    sameLocationMap.set(key, { area, dates: mergeDateList });
  });

  return Array.from(sameLocationMap.values())
    .map(({ area, dates }) => {
      if (dates.length) {
        return dates.reduce((result, rangeDate) => {
          const params = createTaxonQueryParam(area, rangeDate);
          if (params) {
            result.push(...params);
          }
          return result;
        }, [] as WhereQueryParam[]);
      }

      return createTaxonQueryParam(area, undefined);
    })
    .flat()
    .filter((item): item is WhereQueryParam => item !== undefined);
}
