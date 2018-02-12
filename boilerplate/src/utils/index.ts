import * as moment from 'moment';
import history from './history';
import * as config from './config';
import * as reg from './reg';
import request from './request';
import { isEmpty, objToString, getToken } from './toolFunc';

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
  request
};
