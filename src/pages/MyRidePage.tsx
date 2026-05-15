import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppButton } from '../components/common/AppButton';
import { EmptyState } from '../components/common/EmptyState';
import { StatusPill } from '../components/common/StatusPill';
import { Header } from '../components/layout/Header';
import { CancelRideDialog } from '../components/myrides/CancelRideDialog';
import { stopById } from '../data/stops';
import { getBookingDriverMobile, getBookingDriverName, getBookingEtaLabel, getBookingShuttleCode, getBookingVehicle, getVisibleBookings } from '../lib/bookings';
import { formatDate, formatTime } from '../lib/formatters';
import { useRideStore } from '../store/rideStore';
import type { Booking } from '../types';

export function MyRidePage() {
  const { activeBooking, bookings, cancelBooking } = useRideStore();
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [expandedDriverId, setExpandedDriverId] = useState<string | null>(null);
  const [callBooking, setCallBooking] = useState<Booking | null>(null);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const upcomingBookings = getVisibleBookings(bookings, activeBooking).sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime());
  const pastRides = ['Mon, 11 May · G5-204', 'Fri, 8 May · G5-501'];

  return (
    <div className="page">
      <Header title="My Rides" />
      <div className="segmented">
        <button className={tab === 'upcoming' ? 'is-active' : ''} onClick={() => setTab('upcoming')}>Upcoming</button>
        <button className={tab === 'past' ? 'is-active' : ''} onClick={() => setTab('past')}>Past</button>
      </div>
      {tab === 'upcoming' && (
        upcomingBookings.length > 0 ? (
          <div className="booking-list">
            {upcomingBookings.map((booking) => (
              <section className="ride-card" key={booking.id}>
                <div className="ride-card__top">
                  <div>
                    <small>{formatDate(booking.departureTime)}</small>
                    <strong>{formatTime(booking.departureTime)}</strong>
                  </div>
                  <div className="myride-side">
                    <StatusPill label={booking.status === 'boarded' ? 'Boarded' : 'Confirmed'} tone={booking.status === 'boarded' ? 'teal' : 'green'} />
                    <Link to="/myride/details?qr=1" className="qr-link">QR</Link>
                  </div>
                </div>
                <Link to="/myride/details" className="booking-summary__main">
                  <span>{getBookingShuttleCode(booking)} · {booking.seats} seat{booking.seats > 1 ? 's' : ''}</span>
                  <small>{stopById(booking.pickupStopId).name} &gt; {stopById(booking.dropStopId).name}</small>
                </Link>
                <button className="mini-tracking-row mini-tracking-row--button" onClick={() => setExpandedDriverId(expandedDriverId === booking.id ? null : booking.id)}>
                  <span>{getBookingVehicle(booking)}</span>
                  <span>ETA {getBookingEtaLabel(booking)}</span>
                </button>
                {expandedDriverId === booking.id && (
                  <div className="driver-card">
                    <div>
                      <small>Driver</small>
                      <strong>{getBookingDriverName(booking)}</strong>
                    </div>
                    <button onClick={() => setCallBooking(booking)}>
                      {getBookingDriverMobile(booking)}
                    </button>
                  </div>
                )}
                <div className="action-row action-row--three">
                  <Link to="/live"><AppButton variant="secondary">Track</AppButton></Link>
                  <Link to="/rides"><AppButton variant="secondary">Modify</AppButton></Link>
                  <AppButton variant="danger" onClick={() => setBookingToCancel(booking)}>Cancel</AppButton>
                </div>
              </section>
            ))}
          </div>
        ) : (
          <EmptyState title="No upcoming ride" body="Reserve a shuttle from Home to see it here." actionLabel="Book a ride" to="/rider" />
        )
      )}
      {tab === 'past' && (
        <section className="past-list">
          <h2>Past rides</h2>
          {pastRides.map((ride) => <p key={ride}>{ride}<span>Completed</span></p>)}
        </section>
      )}
      {bookingToCancel && (
        <CancelRideDialog
          booking={bookingToCancel}
          onClose={() => setBookingToCancel(null)}
          onConfirm={() => {
            cancelBooking(bookingToCancel.id);
            setBookingToCancel(null);
          }}
        />
      )}
      {callBooking && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="call-driver-title">
          <div className="modal-card">
            <h2 id="call-driver-title">Call driver?</h2>
            <p>Call {getBookingDriverName(callBooking)} at {getBookingDriverMobile(callBooking)}.</p>
            <div className="modal-actions">
              <AppButton variant="ghost" onClick={() => setCallBooking(null)}>No</AppButton>
              <a className="app-button app-button--primary" href={`tel:${getBookingDriverMobile(callBooking)}`} onClick={() => setCallBooking(null)}>Yes</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
