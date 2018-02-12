import * as ExampleApi from 'api/example';

export default {
  namespace: 'welcome',
  state: {
    loading: false,
    description: '',
    weatherLive: {}
  },

  effects: {
    *getWeather({ call, put, all }: any, { payload }: any) {
      try {
        yield put({ type: 'welcome/save', payload: { loading: true } });
        const location = yield call(ExampleApi.getLocation, payload);
        const { lives } = yield call(ExampleApi.getWeather, { ...payload, city: location.adcode });
        yield put({
          type: 'welcome/save',
          payload: { weatherLive: lives[0] }
        });
      } catch (error) {
        console.log(error);
      } finally {
        yield put({  type: 'welcome/save', payload: { loading: false } });
      }
    }
  },

  reducers: {
    save(state: any, { payload }: any) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
