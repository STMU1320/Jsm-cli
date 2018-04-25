import { parseUrl } from './toolFunc';

const { publicPath } = require('../../config.json');

// 请求和路由相关配置
export const __DEV__ = process.env.NODE_ENV !== 'production';
export const API_HOST = __DEV__ ? `//${location.host}` : `//${location.host}${publicPath}` ;
export const API_VERSION = '/api/';
export const BASE_ROUTE_PATH = __DEV__ ? '/' : publicPath;

export function getApiUrl (url: string) {
  let apiPrefix = API_VERSION;
  const queryObj = parseUrl(url);
  // 判断是否querystring 是否带有mock参数，如有则代理api到本地mock服务器
  const mock = Object.prototype.hasOwnProperty.call(queryObj, 'mock');
  if (mock) {
    url = url.replace(/mock(=\w+)?/, '');
    url.endsWith('?') && ( url = url.slice(0, -1));
    if (__DEV__) {
      apiPrefix = '/mock/';
    }
  }
  return `${API_HOST}${apiPrefix}${url}`;
}


// 地图相关配置
export const AMAPKEYS = '3971c66498e2f1473ea5279e2ef76a74';
