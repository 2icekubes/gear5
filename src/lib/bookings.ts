import { rideById } from '../data/rides';
import type { Booking } from '../types';

export const getVisibleBookings = (bookings: Booking[], legacyBooking: Booking | null) => {
  if (bookings.length > 0) return bookings.filter((booking) => booking.status !== 'cancelled');
  return legacyBooking && legacyBooking.status !== 'cancelled' ? [legacyBooking] : [];
};

export const getNextRideBooking = (bookings: Booking[]) => {
  const visible = bookings.filter((booking) => booking.status === 'confirmed' || booking.status === 'boarded');
  const boarded = visible.find((booking) => booking.status === 'boarded');
  if (boarded) return boarded;
  return [...visible].sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime())[0] ?? null;
};

export const getBookingShuttleCode = (booking: Booking) => (booking.rideId === 'morning-0715' || booking.shuttleCode === 'G5-214' ? 'G5-2506' : booking.shuttleCode);

export const getBookingVehicle = (booking: Booking) => {
  if (booking.rideId === 'morning-0715' || booking.vehicleNumber === 'WB19M1691') return 'WB19M2506';
  return booking.vehicleNumber || rideById(booking.rideId)?.vehicleNumber || getBookingShuttleCode(booking);
};

export const getBookingDriverName = (booking: Booking) => {
  if (booking.rideId === 'morning-0715' || booking.driverName === 'Sanjay Das') return 'Kartik';
  return booking.driverName || rideById(booking.rideId)?.driverName || 'Driver';
};

export const getBookingDriverMobile = (booking: Booking) => {
  if (booking.rideId === 'morning-0715' || booking.driverMobile === '+919831234567') return '+91 8013451832';
  return booking.driverMobile || rideById(booking.rideId)?.driverMobile || '+91 9800000000';
};

export const getBookingEtaLabel = (booking: Booking) => {
  if (booking.status === 'boarded') return 'On ride';
  const minutes = booking.etaToPickupMinutes ?? rideById(booking.rideId)?.etaToPickupMinutes;
  return typeof minutes === 'number' ? `${minutes} min` : '--';
};
