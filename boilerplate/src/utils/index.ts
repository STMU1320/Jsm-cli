import * as moment from 'moment';
import 'moment-duration-format';
import history from './history';
import * as config from './config';
import * as reg from './reg';
import * as format from './format';
import request from './request';
import { isEmpty, objToString, getToken, parseUrl } from './toolFunc';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

export {
  reg,
  history,
  config,
  moment,
  isEmpty,
  objToString,
  getToken,
  request,
  format,
  parseUrl
};
