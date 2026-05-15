import type { RideOption } from '../types';

export const MAX_SEATS_PER_BOOKING = 2;

export const getCancellationCutoff = (departureTime: string) =>
  new Date(new Date(departureTime).getTime() - 30 * 60000).toISOString();

export const canCancelBooking = (booking: { cancellationCutoff: string }, now = new Date()) => now.getTime() < new Date(booking.cancellationCutoff).getTime();

export const canConfirmBooking = (ride: RideOption | undefined, packageRides: number, seats: number) => {
  if (!ride) return false;
  return ride.status === 'available' && packageRides >= seats && seats >= 1 && seats <= MAX_SEATS_PER_BOOKING;
};
