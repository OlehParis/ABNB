import { csrfFetch } from "./csrf";

export const getSpotImages = (spotId) => ({
  type: "FETCH_IMAGES",
  payload: spotId,
});

export const fetchImages = (spotId) => {
  return async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/images`)
    if (!res.ok) {
      throw new Error("Failed to fetch spots");
    }
   
    const imagesObj = await res.json();
    
    return  dispatch(getSpotImages({ id: spotId, images: imagesObj }));
  }
}

const initialState = {};

const imagesReducer = (state = initialState, action) => {
    switch(action.type) {
      case "FETCH_IMAGES": {
        const {  images } = action.payload;
        const newState = { ...state }
        images.map((img)=> {
            newState[img.id] = img
        })
        return newState
      }
      default:
        return state; // Return the unchanged state for other action types
    }
  }
  
  export default imagesReducer;


 
