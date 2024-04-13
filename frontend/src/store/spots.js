import { csrfFetch } from "./csrf";

export const fetchSpotByID = (spot) => ({
  type: "FETCH_SPOT_BYID",
  payload: spot,
});

export const fetchSpotsSuccess = (spots) => ({
  type: "FETCH_SPOTS_SUCCESS",
  payload: spots,
});

export const fetchSpots = () => {
  return async (dispatch) => {
    const response = await csrfFetch("/api/spots");
    if (!response.ok) {
      throw new Error("Failed to fetch spots");
    }
    const data = await response.json();

    dispatch(fetchSpotsSuccess(data));
  };
};

export const fetchSpot = (spotId) => {
  return async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    const res2 = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (!response.ok || !res2.ok) {
      throw new Error("Failed to fetch spots");
    }
    const spotDetails = await response.json();
    const reviews = await res2.json();
    const spotData = {
      ...spotDetails[0],
      reviews,
    };

    dispatch(fetchSpotByID(spotData));
  };
};

const initialState = {
  Spots: [],
  page: 1,
  size: 20,
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_SPOTS_SUCCESS":
      return {
        ...state,
        ...action.payload,
      };
    case "FETCH_SPOT_BYID":
      const existingIndex = state.Spots.findIndex(
        (spot) => spot.id === action.payload.id
      );
      if (existingIndex !== -1) {
        const updatedSpots = state.Spots.map((spot, index) => {
          if (index === existingIndex) {
            return {
              ...spot,
              ...action.payload,
            };
          }
          return spot;
        });
        return {
          ...state,
          Spots: updatedSpots,
        };
      } else {
        return {
          ...state,
          Spots: [...state.Spots, action.payload],
        };
      }

    default:
      return state;
  }
};

export default spotsReducer;
