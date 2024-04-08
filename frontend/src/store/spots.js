export const fetchSpotsSuccess = (spots) => ({
  type: "FETCH_SPOTS_SUCCESS",
  payload: spots,
});


export const fetchSpots = () => {
  return async (dispatch) => {
    const response = await fetch("/api/spots");
    if (!response.ok) {
      throw new Error("Failed to fetch spots");
    }
    const data = await response.json();
    console.log('fetch', data)
    dispatch(fetchSpotsSuccess(data));
  };

};

const initialState = {
  data: [],
 
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_SPOTS_SUCCESS":
      return {
        ...state,
        data: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};

export default spotsReducer;
