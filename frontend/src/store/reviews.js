import { csrfFetch } from "./csrf";

export const fetchCreateRaviewById = (review) => ({
  type: "FETCH_CREATE_REVIEW_BYID",
  payload: review,
});
export const fetchDeleteReview = (reviewId) => ({
  type: "FETCH_DELETE_REVIEW",
  payload: reviewId,
});

export const deleteReview = (reviewId) => {
  console.log(reviewId, "reviw id line 28");
  return async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      dispatch(fetchDeleteReview(reviewId));
    }
  };
};

export const fetchSpotReview = (spot) => {
  return async (dispatch) => {
    const spotId = spot.spotId;
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(spot),
    });
    if (!response.ok) {
      throw new Error("Failed to create spot");
    }
    const data = await response.json();
    dispatch(fetchCreateRaviewById(data));

    console.log(data, "data for, 105");
  };
};

const initialState = {};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_CREATE_REVIEW_BYID":
      return {
        ...state,
        ...action.payload,
      };
    case "FETCH_DELETE_REVIEW":
        const newState = { ...state };
        delete newState[action.payload];
        return newState;

    default:
      return state;
  }
};

export default reviewReducer;
