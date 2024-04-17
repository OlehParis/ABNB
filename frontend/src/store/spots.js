import { csrfFetch } from "./csrf";
export const fetchSpotByID = (spot) => ({
  type: "FETCH_SPOT_BYID",
  payload: spot,
});

export const fetchSpotsSuccess = (spots) => ({
  type: "FETCH_SPOTS_SUCCESS",
  payload: spots,
  
});

export const fetchCreateSpot = (spot) => ({
  type: "FETCH_CREATE_SPOT",
  payload: spot,
});

export const fetchSpots = () => {
  return async (dispatch) => {
    const response = await fetch("/api/spots");
    if (!response.ok) {
      throw new Error("Failed to fetch spots");
    }
    const data = await response.json();
    const page = data.page
    const size = data.size
    const allSpotsData = { ...data.Spots, page, size }
    // console.log("fetch", allSpotsData);
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
    const spotData = {
      ...spotDetails[0],
      reviews,
    };
//  console.log(spotData, 'line 46')
    dispatch(fetchSpotByID(spotData));
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
    console.log(spot);
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

const initialState = {
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_SPOTS_SUCCESS":
      return {
        ...state, ...action.payload
        
      };

      case "FETCH_SPOT_BYID":
      const spotId = action.payload.id;
      console.log("Spot ID from payload:", spotId); // Log the spotId
      // You can also log the spot object for further verification
      console.log("Spot from payload:", action.payload);

      return {
        ...state,
          ...state.spots,
          [spotId-1]: {...action.payload}
        
      };


    case "FETCH_CREATE_SPOT":
      const existingIndex3 = state.Spots.findIndex(
        (spot) => spot.id === action.payload.id
      );
      if (existingIndex3 !== -1) {
        const updatedSpots = state.Spots.map((spot, index) => {
          if (index === existingIndex3) {
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
