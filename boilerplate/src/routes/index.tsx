import * as React from 'react';
import { Router, Route, Switch, Link, Redirect } from 'react-router-dom';
import { history, isEmpty } from 'utils';
import { Loading } from 'components';

import Bundle from './Bundle';
const Welcome = require('bundle-loader?lazy&name=welcome!./Welcome');
const Detail = require('bundle-loader?lazy&name=detail!./Detail');

interface DynamicRouterProps {
  Component: any;
  routes: Array<Object>;
  attr: any;
}

const createComponent = (C: any) => (props: any) => {
  return (
    <Bundle load={C}>
      {(C: any) => (C ? <C {...props} /> : <Loading />)}
    </Bundle>
  );
};

const DynamicRouter: any = ({ Component, routes, ...attr }: DynamicRouterProps) => (
  <Route {...attr} render={props => {
    return isEmpty(routes) ? <Component {...props} /> :
      <Component {...props} >
        <Switch>
          {routes.map((route: any, i: number) => (
            <DynamicRouter key={route.path} {...route} />
          ))}
        </Switch>
      </Component>;
  }} />
);

const appRoutes = [
  {
    path: '/',
    Component: createComponent(Welcome),
    exact: true
  },
  {
    path: '/detail',
    Component: createComponent(Detail)
  },
  {
    path: '*',
    Component: () => <span>404</span>
  }
];

export default () => (
  <Router history={history}>
    <Switch>
    {appRoutes.map((route: any, i) => (
      <DynamicRouter key={route.path} {...route} />
    ))}
  </Switch>
  </Router>
);
