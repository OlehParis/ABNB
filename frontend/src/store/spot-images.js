// import { csrfFetch } from "./csrf";

// export const getSpotImages = (spotId) => ({
//   type: "FETCH_SPOT_BYID",
//   payload: spotId,
// });

// export const fetchImages = (spotId) => {
//   return async (dispatch) => {
//     const res = await csrfFetch(`/api/spot-images/${spotId}`)
//     if (!res.ok) {
//       throw new Error("Failed to fetch spots");
//     }
 
//     const imagesObj = await response.json();
//     return dispatch(getSpotImages(imagesObj)); // Corrected dispatch
//   }
// }

// const initialState = {};

// const imagesReducer = (state = initialState, action ) => {
//   switch(action.type) {
//     case "FETCH_SPOT_BYID": {
//       const spotId = action.payload.id;

//       return {
//         ...state,
//         [spotId]: { ...state[spotId], ...action.payload },
//       };
//     }
//     default:
//       return state; // Need to handle other action types or return the state unchanged
//   }
// }

// export default imagesReducer;
