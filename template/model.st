// import * as ExampleApi from 'api/example';

const defaultState: any = {
  loading: false
};

export default {
  namespace: '<% namespace %>',
  state: defaultState,

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
