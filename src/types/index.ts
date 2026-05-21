export type Direction = 'morning' | 'evening';
export type RideStatus = 'available' | 'full' | 'cancelled';
export type BookingStatus = 'confirmed' | 'boarded' | 'cancelled';

export interface Stop {
  id: string;
  name: string;
  area: string;
  landmark: string;
  kind: 'home' | 'office' | 'transit';
  latitude?: number;
  longitude?: number;
  morningTime?: string;
}

export interface Route {
  id: string;
  direction: Direction;
  name: string;
  stopIds: string[];
}

export interface RideOption {
  id: string;
  routeId: string;
  shuttleCode: string;
  shuttleName: string;
  vehicleNumber: string;
  driverName: string;
  driverMobile: string;
  departureTime: string;
  pickupStopId: string;
  dropStopId: string;
  etaToPickupMinutes: number;
  availableSeats: number;
  status: RideStatus;
}

export interface Rider {
  id: string;
  name: string;
  company: string;
  defaultPickupStopId: string;
  defaultDropStopId: string;
  packageRides: number;
}

export interface Booking {
  id: string;
  rideId: string;
  riderId: string;
  pickupStopId: string;
  dropStopId: string;
  seats: number;
  departureTime: string;
  qrCodeValue: string;
  driverOtp: string;
  status: BookingStatus;
  createdAt: string;
  cancellationCutoff: string;
  shuttleCode: string;
  vehicleNumber: string;
  driverName: string;
  driverMobile: string;
  etaToPickupMinutes: number;
}
