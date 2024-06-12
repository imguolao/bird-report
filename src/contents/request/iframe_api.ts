import type {
  QueryMessage,
  ResponseMessage,
  Province,
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
