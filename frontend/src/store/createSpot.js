// import { csrfFetch } from "./csrf";

// export const fetchCreateSpot = (spot) => ({
//   type: "FETCH_CREATE_SPOT",
//   payload: spot,
// });

// export const fetchAddSpotImage = (img) => ({
//   type:"FETCH_ADD_SPOT_IMAGE",
//   payload: img,
// })

// export const fetchNewSpot = (spot) => {
//     return async (dispatch) => {

//         try {
//           const response = await csrfFetch('/api/spots', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(spot),
//           });
    
//           if (!response.ok) {
//             throw new Error('Failed to create spot');
//           } 
//           const data = await response.json();
//           console.log("fetch", data);
//           dispatch(fetchCreateSpot(data));
         
//         } catch (error) {
//             const data = await error.json()
//           console.error('An error occurred while fetching new spot:', data);
//         }
//       };
// };
// export const fetchAddSpotImageThunk = (spotId, imgData) => {

// return async (dispatch) => {

//   try {
//     const response2 = await csrfFetch(`/api/spots/${spotId}/images`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(imgData),
//     });

//     if (!response2.ok) {
//       throw new Error('Failed to create spot');
//     } 
//     const data = await response2.json();
//     console.log("fetch images", data);
//     dispatch(fetchAddSpotImage(data));
    
//   } catch (error) {
//       const data = await error.json()
//     console.error('An error occurred while fetching new spot:', data);
//   }
// };

// }

// const initialState = {
//   data: [],
// };

// const newSpotReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case "FETCH_CREATE_SPOT":
//       return {
//         ...state,
//         data: action.payload,
//       };
//     case "FETCH_ADD_SPOT_IMAGE":
//       return {
//         ...state,
//         data: action.payload,
//       };
//     default:
//       return state;
//   }
// };

// export default newSpotReducer;
