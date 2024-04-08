
export const fetchSpotsSuccess = (spot) => ({
    type: "FETCH_SPOT_BYID",
    payload: spot,
  });

  export const fetchSpot = (spotId) => {

    return async (dispatch) => {
      const response = await fetch(`/api/spots/${spotId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch spots");
      }
      const data = await response.json();
   
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
