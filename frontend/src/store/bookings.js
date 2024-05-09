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
    const { Bookings } = await response.json();
    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
    }
    const normalizedBookings = Bookings.reduce((acc, booking) => {
      acc[booking.id] = booking;
      return acc;
    }, {});
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
