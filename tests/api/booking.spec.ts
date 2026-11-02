import { test } from '@playwright/test';
import { BookingClient } from '../../api/BookingClient';
import { newBooking } from '../../test-data/api/bookingData';
import { expectBookingCreated, expectBookingRetrieved } from '../../assertions/api/bookingAssertions';

test.describe('Restful Booker - booking API', () => {
  test('a created booking can be retrieved with exactly the submitted details', async ({ request }) => {
    const bookingClient = new BookingClient(request);

    const createResponse = await bookingClient.createBooking(newBooking);
    const { bookingid } = await expectBookingCreated(createResponse, newBooking);

    const getResponse = await bookingClient.getBooking(bookingid);
    await expectBookingRetrieved(getResponse, newBooking);
  });
});
