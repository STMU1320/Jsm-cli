import createHistory from 'history/createBrowserHistory';

import { BASE_ROUTE_PATH } from './config';

const history: any = createHistory({
  basename: BASE_ROUTE_PATH
});

export default history;

