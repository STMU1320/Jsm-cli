import { request, config } from 'utils';

export const getLocation = (params: any) => request.get('http://restapi.amap.com/v3/ip', params);
export const getWeather = (params: any) => request.get('http://restapi.amap.com/v3/weather/weatherInfo', params);
