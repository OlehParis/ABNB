import { csrfFetch } from "./csrf";

export const postBooking = (bookings) => ({
  type: "POST_BOOKING",
  payload: bookings,
});

export const getBookings = (bookings) => ({
  type: "GET_BOOKINGS",
  payload: bookings,
});

export const fetchBookings = (bookings) => {
    return async (dispatch) => {
        const response = await csrfFetch(`/api/spots/${bookings}/bookings`);
        const { Bookings } = await response.json(); // Destructure the Bookings array
      
     
        if (!response.ok) {
            throw new Error("Failed to fetch bookings");
        }

        // Normalize the bookings array into an object indexed by booking ID
        const normalizedBookings = Bookings.reduce((acc, booking) => {
            acc[booking.id] = booking; // Use booking.id as the key
            return acc;
        }, {});
        console.log(normalizedBookings)
        dispatch(getBookings(normalizedBookings));
    };
};


export const fetchBooking = (bookings) => {
  return async (dispatch) => {
    const spotId = bookings.spotId;
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookings),
    });
    if (!response.ok) {
      // Extract error message from response body if available
      let errorMessage = "Failed to create booking";
      let conflictDetails = null; // Initialize conflict details

      // Await response.json() to get the actual response body
      const errorData = await response.json();
      console.error("Error data from backend:", errorData);

      if (errorData.message) {
        errorMessage = errorData.message;
      }
      if (errorData.errors) {
        conflictDetails = errorData.errors;
      }

      throw new Error(errorMessage, conflictDetails);
    }

    const data = await response.json();

    dispatch(postBooking(data));
  };
};

const initialState = {};

const bookingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "POST_BOOKING": {
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    }
    case "GET_BOOKINGS": {
        return {
          ...state,
          ...action.payload,
        };
      }
    default:
      return state;
  }
};

export default bookingsReducer;
