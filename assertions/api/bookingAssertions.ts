import { APIResponse, expect } from '@playwright/test';
import { Booking, CreateBookingResponse } from '../../test-data/api/bookingData';

export async function expectBookingCreated(response: APIResponse, expectedBooking: Booking): Promise<CreateBookingResponse> {
  expect(response.status(), 'POST /booking should return 200 OK').toBe(200);

  const body: CreateBookingResponse = await response.json();
  expect(Number.isInteger(body.bookingid), 'bookingid should be an integer').toBe(true);
  expect(body.bookingid, 'bookingid should be a positive number').toBeGreaterThan(0);
  expectBookingToMatch(body.booking, expectedBooking);

  return body;
}

export async function expectBookingRetrieved(response: APIResponse, expectedBooking: Booking): Promise<void> {
  expect(response.status(), 'GET /booking/{id} should return 200 OK').toBe(200);

  const body: Booking = await response.json();
  expectBookingToMatch(body, expectedBooking);
}

/**
 * Checks each field individually so a failure points to the exact field,
 * then checks the whole object to catch any unexpected extra fields.
 */
export function expectBookingToMatch(actual: Booking, expected: Booking): void {
  expect(actual.firstname, 'firstname').toBe(expected.firstname);
  expect(actual.lastname, 'lastname').toBe(expected.lastname);
  expect(actual.totalprice, 'totalprice').toBe(expected.totalprice);
  expect(actual.depositpaid, 'depositpaid').toBe(expected.depositpaid);
  expect(actual.bookingdates.checkin, 'bookingdates.checkin').toBe(expected.bookingdates.checkin);
  expect(actual.bookingdates.checkout, 'bookingdates.checkout').toBe(expected.bookingdates.checkout);
  expect(actual.additionalneeds, 'additionalneeds').toBe(expected.additionalneeds);
  expect(actual, 'booking should contain exactly the submitted fields').toStrictEqual(expected);
}
