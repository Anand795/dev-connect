import { GET_PROFILE, PROFILE_ERROR } from "../actions/types";

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {},
};

function profileReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
      break;
    case PROFILE_ERROR:
      return {
        ...state,
        profiles: payload,
        loading: false,
      };
    default:
      return state;
      break;
  }
}

export default profileReducer;
