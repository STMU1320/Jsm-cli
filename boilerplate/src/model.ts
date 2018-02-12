import { combineReducers } from 'redux';
import * as sagaEffects from 'redux-saga/effects';
import welcomeModel from './routes/Welcome/model';
import detailModel from './routes/Detail/model';

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

const rootReducers = combineReducers({
  welcome: createReducer(welcomeModel),
  detail: createReducer(detailModel)
});

const rootSagas = function *rootSaga() {
  yield sagaEffects.fork(createSagas(welcomeModel));
  yield sagaEffects.fork(createSagas(detailModel));
};

export {
  rootReducers,
  rootSagas
};

