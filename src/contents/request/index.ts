import { IFRAME_ID } from '../const';

type BirdResponse<T = any> = {
  code: number;
  count: number;
  data: T[];
}

export type Province = {
  province_code: string;
  province_name: string;
}

export type City = {
  city_code: string;
  city_name: string;
}

export type District = {
  district_name: string;
  district_code: string;
}

export type WhereQueryParam = {
  city: string;
  ctime: string;
  district: string;
  endTime: string;
  mode: number;
  pointname:string;
  province: string;
  serial_id: string;
  startTime: string;
  state: string;
  taxonid: string;
  username: string;
  version: string
  taxon_month: string;
  outside_type: number;
  limit: string;
  page: string;
}

// const where = {
//   city: "北京市",
//   ctime: "",
//   district: "西城区",
//   endTime: "2024-06-07",
//   mode: 0,
//   pointname: "",
//   province: "北京市",
//   serial_id: "",
//   startTime: "2023-05-07",
//   state: "",
//   taxonid: "",
//   username: "",
//   version: "CH4",
//   taxon_month: "05",
//   outside_type: 0,
//   limit: "1500",
//   page: "1",
// }

type TaxonResponse = {
  code: number;
  count: number;
  data: string;
  requestId: string;
  sign: string;
  timestamp: number;
}

// 英文名称 englishname: "Ruddy Shelduck"
// 拉丁学名 latinname: "Tadorna ferruginea"
// 记录次数 recordcount: 9
// 鸟种编号 taxon_id: 4096
// 科 taxonfamilyname: "鸭科"
// 中文名 taxonname: "赤麻鸭"
// 目 taxonordername: "雁形目"

export type TaxonData = {
  englishname: string;
  latinname: string;
  recordcount: number;
  taxon_id: number;
  taxonfamilyname: string;
  taxonname: string;
  taxonordername: string;
}

export type TaxonResult = {
  code: number,
  count: number,
  data: TaxonData[],
}

export const FetchAPI = {
  province() {
    return new Promise<Province[]>((resolve, reject) => {
      try {
        $.post(window.site.domain + 'front/system/adcode/province', (response: BirdResponse<Province>) => {
          resolve(response.data ?? []);
        });
      } catch (e) {
        reject(e);
      }
    });
  },
  
  city(provinceCode: string) {
    return new Promise<City[]>((resolve, reject) => {
      try {
        $.post(
          window.site.domain + 'front/system/adcode/city',
          {
            province_code: provinceCode
          },
          (response: BirdResponse<City>) => {
            resolve(response.data ?? []);
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  },
  
  district(cityCode: string) {
    return new Promise<District[]>((resolve, reject) => {
      try {
        $.post(
          window.site.domain + 'front/system/adcode/district',
          {
            city_code: cityCode
          },
          ({ data = [] }: BirdResponse<District>) => {
            resolve(data);
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  },
  
  taxon(queryParams: WhereQueryParam) {
    return new Promise<TaxonResult>((resolve, reject) => {
      try {
        $.post(window.site.domain+ 'front/record/activity/taxon', queryParams, (res: TaxonResponse) => {
          const decode_str = window.BIRDREPORT_APIJS.decode(res.data);
          const results = JSON.parse(decode_str);
          resolve({
            code: res.code,
            count: res.count,
            data: results
          });
        });
      } catch (e) {
        reject(e);
      }
    });
  }
};

type QueryApi = typeof FetchAPI;

export type QueryMessage<T extends keyof QueryApi = any> = {
  type: T;
  key: string;
  params: Parameters<QueryApi[T]>
}

export type ResponseMessage<T> = {
  type: string;
  key: string;
  data: T;
}

function sendResponse(type: any, data: any, key: string) {
  const iframe = document.getElementById(IFRAME_ID) as unknown as HTMLIFrameElement;
  iframe.contentWindow?.postMessage({
    type,
    key,
    data,
  }, '*');
}

window.addEventListener('message', async ({ data }) => {
  if (!Object.hasOwn(FetchAPI, data.type)) {
    return;
  }

  // @ts-ignore
  const query = FetchAPI[data.type];
  const response = await query.apply(null, data.params);
  sendResponse(data.type, response, data.key);
});
