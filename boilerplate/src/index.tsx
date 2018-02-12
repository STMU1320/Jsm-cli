import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { __DEV__ } from 'utils/config';
import configerStore from './store';
import App from './routes';
import './theme/base.less';
const { render } = ReactDOM;
const rootEl = document.getElementById('app');
const store = configerStore();
const renderToDOM = (AppContainer?: new () => React.Component<any, any>, AppComponent = App) => {
  if (AppContainer) {
    render(
      <AppContainer>
        <Provider store={store}>
          <AppComponent />
        </Provider>
      </AppContainer>,
      rootEl
    );
  } else {
    render(<Provider store={store}><App /></Provider>, rootEl);
  }
};

renderToDOM();

if (__DEV__ && module.hot) {
  const { AppContainer } = require<any>('react-hot-loader');

  module.hot.accept('./routes/index', () => {
    const NextApp = require<any>('./routes/index').default;
    renderToDOM(AppContainer, NextApp);
  });
}
