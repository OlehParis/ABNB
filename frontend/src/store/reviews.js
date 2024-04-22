import { csrfFetch } from "./csrf";
// import { fetchSpotByID } from "./spots";

export const loadReviewData = (reviewsArr) => ({
  type: 'LOAD_REVIEW_DATA',
  payload: reviewsArr,
})

export const fetchCreateRaviewById = (review) => ({
  type: "FETCH_CREATE_REVIEW_BYID",
  payload: review,
});
export const fetchDeleteReview = (reviewId) => ({
  type: "FETCH_DELETE_REVIEW",
  payload: reviewId,
});

export const deleteReview = (reviewId ) => {
 
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


  };
};

const initialState = {};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_CREATE_REVIEW_BYID": {
      return {
        ...state,
        [action.payload.id]: action.payload
      };
    }
    case "FETCH_DELETE_REVIEW":{
        const newState = { ...state };
        delete newState[action.payload];
        return newState;
        }
    case 'LOAD_REVIEW_DATA' :{
      const newState = {...state};
      action.payload.map((rev) => {
        newState[rev.id] = rev
        
      })
      return newState;
    }
    default:
      return state;
  }
};

export default reviewReducer;
