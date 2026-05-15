import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { rideById } from '../data/rides';
import { rider } from '../data/user';
import { getCancellationCutoff } from '../lib/bookingRules';
import { getDriverOtp } from '../lib/formatters';
import type { Booking, Direction } from '../types';

interface RideStore {
  selectedDirection: Direction;
  pickupStopId: string;
  dropStopId: string;
  activeBooking: Booking | null;
  bookings: Booking[];
  packageRidesRemaining: number;
  recentPairs: string[];
  setSelectedDirection: (direction: Direction) => void;
  setPickup: (stopId: string) => void;
  setDrop: (stopId: string) => void;
  setRoutePair: (pickupStopId: string, dropStopId: string) => void;
  swapStops: () => void;
  createBooking: (rideId: string, seats: number) => Booking | null;
  cancelBooking: (bookingId: string) => void;
  cancelActiveBooking: () => void;
  markBookingBoarded: (bookingId: string) => void;
}

export const useRideStore = create<RideStore>()(
  persist(
    (set, get) => ({
      selectedDirection: 'morning',
      pickupStopId: rider.defaultPickupStopId,
      dropStopId: rider.defaultDropStopId,
      activeBooking: null,
      bookings: [],
      packageRidesRemaining: rider.packageRides,
      recentPairs: [],
      setSelectedDirection: (direction) => set({ selectedDirection: direction }),
      setPickup: (pickupStopId) => set({ pickupStopId }),
      setDrop: (dropStopId) => set({ dropStopId }),
      setRoutePair: (pickupStopId, dropStopId) =>
        set((state) => ({
          pickupStopId,
          dropStopId,
          recentPairs: [`${pickupStopId}:${dropStopId}`, ...state.recentPairs.filter((pair) => pair !== `${pickupStopId}:${dropStopId}`)].slice(0, 4),
        })),
      swapStops: () => set((state) => ({ pickupStopId: state.dropStopId, dropStopId: state.pickupStopId })),
      createBooking: (rideId, seats) => {
        const ride = rideById(rideId);
        // ensure we operate on latest state
        let state = get();
        // basic validation
        if (!ride || ride.status !== 'available' || seats < 1 || seats > 2) return null;

        // If there is an existing active booking, cancel it first (modify flow).
        if (state.activeBooking) {
          // calling the cancel helper will refund seats back to package balance
          get().cancelActiveBooking();
          state = get();
        }

        // after possible cancellation, ensure package balance
        if (state.packageRidesRemaining < seats) return null;

        const id = `${Date.now().toString(36)}-${ride.id}`;
        const booking: Booking = {
          id,
          rideId: ride.id,
          riderId: rider.id,
          pickupStopId: state.pickupStopId,
          dropStopId: state.dropStopId,
          seats,
          departureTime: ride.departureTime,
          qrCodeValue: `GEAR5-RIDE-${id}`,
          driverOtp: getDriverOtp(id),
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          cancellationCutoff: getCancellationCutoff(ride.departureTime),
          shuttleCode: ride.shuttleCode,
          vehicleNumber: ride.vehicleNumber,
          driverName: ride.driverName,
          driverMobile: ride.driverMobile,
          etaToPickupMinutes: ride.etaToPickupMinutes,
        };
        // append booking and set as activeBooking
        set((s) => ({ activeBooking: booking, bookings: [...s.bookings, booking], packageRidesRemaining: s.packageRidesRemaining - seats }));
        return booking;
      },
      cancelBooking: (bookingId) =>
        set((state) => {
          const booking = state.bookings.find((item) => item.id === bookingId) ?? (state.activeBooking?.id === bookingId ? state.activeBooking : null);
          return {
            activeBooking: state.activeBooking?.id === bookingId ? null : state.activeBooking,
            bookings: state.bookings.filter((item) => item.id !== bookingId),
            packageRidesRemaining: booking ? state.packageRidesRemaining + booking.seats : state.packageRidesRemaining,
          };
        }),
      cancelActiveBooking: () =>
        set((state) => ({
          activeBooking: null,
          bookings: state.activeBooking ? state.bookings.filter((booking) => booking.id !== state.activeBooking?.id) : state.bookings,
          packageRidesRemaining: state.activeBooking ? state.packageRidesRemaining + state.activeBooking.seats : state.packageRidesRemaining,
        })),
      markBookingBoarded: (bookingId) =>
        set((state) => ({
          activeBooking: state.activeBooking?.id === bookingId ? { ...state.activeBooking, status: 'boarded' } : state.activeBooking,
          bookings: state.bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: 'boarded' } : booking)),
        })),
    }),
    {
      name: 'gear5-myrides-state',
      partialize: (state) => ({
        selectedDirection: state.selectedDirection,
        pickupStopId: state.pickupStopId,
        dropStopId: state.dropStopId,
        activeBooking: state.activeBooking,
        bookings: state.bookings,
        packageRidesRemaining: state.packageRidesRemaining,
        recentPairs: state.recentPairs,
      }),
    },
  ),
);
