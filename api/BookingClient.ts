import { APIRequestContext, APIResponse } from '@playwright/test';
import { Booking } from '../test-data/api/bookingData';

/**
 * Thin wrapper around Playwright's request fixture for the /booking endpoints.
 * Returns the raw APIResponse so tests can assert on status codes and bodies.
 */
export class BookingClient {
  private readonly bookingPath = '/booking';

  constructor(private readonly request: APIRequestContext) {}

  async createBooking(booking: Booking): Promise<APIResponse> {
    return this.request.post(this.bookingPath, { data: booking });
  }

  async getBooking(bookingId: number): Promise<APIResponse> {
    return this.request.get(`${this.bookingPath}/${bookingId}`);
  }
}
