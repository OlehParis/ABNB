import { csrfFetch } from "./csrf";

export const fetchCreateSpot = (spot) => ({
  type: "FETCH_CREATE_SPOT",
  payload: spot,
});

export const fetchNewSpot = (spot, history) => {
    return async (dispatch) => {
        spot.lat = 23
        spot.lng = 23
        try {
          const response = await csrfFetch('/api/spots', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(spot),
          });
    
          if (!response.ok) {
            throw new Error('Failed to create spot');
          } 
          const data = await response.json();
          console.log("fetch", data);
          dispatch(fetchCreateSpot(data));
         
        } catch (error) {
            const data = await error.json()
          console.error('An error occurred while fetching new spot:', data);
        }
      };
};

const initialState = {
  data: [],
};
const newSpotReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_CREATE_SPOT":
      return {
        ...state,
        data: action.payload,
      };

    default:
      return state;
  }
};

export default newSpotReducer;
