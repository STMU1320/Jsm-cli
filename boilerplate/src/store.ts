import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { rootReducers, rootSagas } from './model';
import { Function } from 'core-js/library/web/timers';

const win: any = window;
win.addEventListener('error', (err: any) => {
  console.log(err);
});

const middlewares: any = [];
const sagaMiddleware = createSagaMiddleware();

const storeEnhancers = compose(
  applyMiddleware(...middlewares, sagaMiddleware),
  (win && win.devToolsExtension) ? win.devToolsExtension() : (f: Function) => f
);


export default function configureStore(initialState = {}) {
  const store = createStore(rootReducers, initialState, storeEnhancers);
  sagaMiddleware.run(rootSagas as any);
  if (module.hot) {
    module.hot.accept(() => {
      const model = require('./model');
      store.replaceReducer(model.rootReducers);
    });
  }
  return store;
}
