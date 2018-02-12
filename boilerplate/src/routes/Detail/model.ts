// import * as ExampleApi from 'api/example';

export default {
  namespace: 'detail',
  state: {
    loading: false
  },

  effects: {
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
