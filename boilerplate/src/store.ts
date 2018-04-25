import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import * as sagaEffects from 'redux-saga/effects';

import * as _models from './model';

function createReducer({ namespace = '', reducers, ...options }: any) {
  return function reducer(state = options.state || {}, action: any) {
    const property = namespace && action.type.split(`${namespace}/`)[1];
    if (Object.prototype.hasOwnProperty.call(reducers, property)) {
      return reducers[property](state, action);
    } else {
      return state;
    }
  };
}

function createSagas({ namespace, effects }: any) {
  return function *() {
    for (const key in effects) {
      if (Object.prototype.hasOwnProperty.call(effects, key)) {
        yield sagaEffects.takeEvery(`${namespace}/${key}`, effects[key].bind(effects, sagaEffects));
      }
    }
  };
}

const models: any = _models;

const reducers: any = {};
const sagas: any = [];
const middlewares: any = [];
const sagaMiddleware = createSagaMiddleware();

Object.keys(models).forEach((key: string) => {
  reducers[key] = createReducer(models[key]);
  sagas.push(createSagas(models[key]));
});

const win: any = window;
win.addEventListener('error', (err: any) => {
  console.log(err);
});

const storeEnhancers = compose(
  applyMiddleware(...middlewares, sagaMiddleware),
  (win && win.devToolsExtension) ? win.devToolsExtension() : (f: any) => f
);

export default function configureStore(initialState = {}) {
  const store = createStore(combineReducers(reducers), initialState, storeEnhancers);
  sagas.forEach((saga: any) => sagaMiddleware.run(saga));
  if (module.hot) {
    module.hot.accept(() => {
      const model = require('./model');
      store.replaceReducer(model.rootReducers);
    });
  }
  return store;
}
