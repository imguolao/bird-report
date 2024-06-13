import type {
  QueryMessage,
  ResponseMessage,
  Province,
  City,
  District,
} from './index';

export async function getProvince() {
  return new Promise<Province[]>((resolve, reject) => {
    try {
      function receiver({ data }: MessageEvent<ResponseMessage<Province[]>>) {
        window.removeEventListener('message', receiver);
        const { data: provinces, type } = data;
        if (type === 'province') {
          resolve(provinces);
        }
      }
  
      window.addEventListener('message', receiver);
      window.parent.postMessage({
        type: 'province',
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
      function receiver({ data }: MessageEvent<ResponseMessage<City[]>>) {
        window.removeEventListener('message', receiver);
        const { data: cities, type } = data;
        if (type === 'city') {
          resolve(cities);
        }
      }
  
      window.addEventListener('message', receiver);
      window.parent.postMessage({
        type: 'city',
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
      function receiver({ data }: MessageEvent<ResponseMessage<District[]>>) {
        window.removeEventListener('message', receiver);
        const { data: districts, type } = data;
        if (type === 'district') {
          resolve(districts);
        }
      }
  
      window.addEventListener('message', receiver);
      window.parent.postMessage({
        type: 'district',
        params: [cityCode],
      } as QueryMessage<'district'>, '*');
    } catch (e) {
      reject(e);
    }
  });
}
