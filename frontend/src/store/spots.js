import { csrfFetch } from "./csrf";

import { loadReviewData } from "./reviews";

export const fetchSpotByID = (spot) => ({
  type: "FETCH_SPOT_BYID",
  payload: spot,
});

export const fetchSpotsSuccess = (spots) => ({
  type: "FETCH_SPOTS_SUCCESS",
  payload: spots,
});

export const DeleteSpot = (spotId) => {
  return {
    type: "FETCH_DELETE_SPOT",
    payload: spotId,
  };
};

export const fetchCreateSpot = (spot) => ({
  type: "FETCH_CREATE_SPOT",
  payload: spot,
});
export const fetchEditSpot = (spot) => ({
  type: "FETCH_EDIT_SPOT",
  payload: spot,
});

export const fetchDeleteSpot = (spotId) => {
  return async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });
    dispatch(DeleteSpot(spotId));
    return response;
  };
};

export const fetchSpots = () => {
  return async (dispatch) => {
    const response = await fetch("/api/spots");
    if (!response.ok) {
      throw new Error("Failed to fetch spots");
    }
    const data = await response.json();
    const page = data.page;
    const size = data.size;
    const allSpotsData = { ...data.Spots, page, size };

    dispatch(fetchSpotsSuccess(allSpotsData));
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
    
    // Extract image data
    const spotImages = spotDetails[0].SpotImages;

    // Normalize image data
    const normalizedImages = Object.fromEntries(
      spotImages.map(image => [image.id, image])
    );

    // Replace spotDetails.SpotImages with normalized image data
    const normalizedSpotDetails = {
      ...spotDetails[0],
      SpotImages: normalizedImages
    };
    
    dispatch(fetchSpotByID(normalizedSpotDetails));
    dispatch(loadReviewData(reviews.Reviews));
  };
};

export const fetchNewSpot = (spot) => {
  return async (dispatch) => {
    const response = await csrfFetch("/api/spots", {
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

    const spotId = data.id;

    const responseImages = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(spot),
    });
    const images = await responseImages.json();

    const newSpotDataWithImg = {
      ...data,
      previewImage: images.url,
      SpotImages: [images],
    };

    dispatch(fetchCreateSpot(newSpotDataWithImg));
    return newSpotDataWithImg;
  };
};

export const fetchEditNewSpot = (spot, spotId) => {
  return async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(spot),
    });
    if (!response.ok) {
      throw new Error("Failed to create spot");
    }
    const data = await response.json();

    // const spotId = data.id;
 

    const responseImages = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(spot),
    });
    const images = await responseImages.json();

    const newSpotDataWithImg = {
      ...data,
      previewImage: images.url,
      SpotImages: [images],
    };

    dispatch(fetchEditSpot(newSpotDataWithImg));
    return newSpotDataWithImg;
  };
};

const initialState = {};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_SPOTS_SUCCESS":{
      let nextState = {};
      Object.entries(action.payload).forEach(([key, value]) => {
        if (key !== "page" && key !== "size") {
          nextState[value.id] = value;
        }
      });
      return {
        ...state,
        ...nextState,
      };}

    case "FETCH_SPOT_BYID":{
      const spotId = action.payload.id;

      return {
        ...state,
        // [spotId]: { ...action.payload }
        [spotId]: { ...state[spotId], ...action.payload },
      };
}
    case "FETCH_CREATE_SPOT":{
      const newSpotId = action.payload.id;
      return {
        ...state,
        [newSpotId]: { ...action.payload },
      };}
    case "FETCH_EDIT_SPOT":{
      const editedSpotId = action.payload.id;
      return {
        ...state,
        [editedSpotId]: { ...action.payload },
      };}
    case "FETCH_DELETE_SPOT":{
      const spotIdToDelete = action.payload;
      const newState = { ...state };
      delete newState[spotIdToDelete];
      return newState;
}
    default:
      return state;
  }
};

export default spotsReducer;
