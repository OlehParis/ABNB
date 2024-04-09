import { csrfFetch } from "./csrf";

export const fetchSpotsSuccess = (spot) => ({
    type: "FETCH_SPOT_BYID",
    payload: spot,
  });

  export const fetchSpot = (spotId) => {

    return async (dispatch) => {
      const response = await csrfFetch(`/api/spots/${spotId}`);
      const res2 = await csrfFetch (`/api/spots/${spotId}/reviews`)
     
      if (!response.ok) {
        throw new Error("Failed to fetch spots");
      }
      if(!res2.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data1 = await response.json();
      const data2 = await res2.json()
      const data = {
        ...data1,
        reviews: data2,
      };
      dispatch(fetchSpotsSuccess(data));
    };
  
  };

  const initialState = {
    data: [],
   
  };
  const spotReducer = (state = initialState, action) => {
    switch (action.type) {
      case "FETCH_SPOT_BYID":
        return {
          ...state,
          data: action.payload,
          
        };
  
      default:
        return state;
    }
  };
  
  export default spotReducer;
