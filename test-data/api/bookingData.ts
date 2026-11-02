export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds: string;
}

/** Shape of the POST /booking response body. */
export interface CreateBookingResponse {
  bookingid: number;
  booking: Booking;
}

export const newBooking: Booking = {
  firstname: 'Samuel',
  lastname: 'Ubong',
  totalprice: 500,
  depositpaid: true,
  bookingdates: {
    checkin: '2026-11-10',
    checkout: '2026-11-15',
  },
  additionalneeds: 'Breakfast',
};
