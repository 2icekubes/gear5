import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppButton } from '../components/common/AppButton';
import { EmptyState } from '../components/common/EmptyState';
import { StatusPill } from '../components/common/StatusPill';
import { Header } from '../components/layout/Header';
import { QRPassCard } from '../components/myrides/QRPassCard';
import { stopById } from '../data/stops';
import { getBookingShuttleCode, getNextRideBooking, getVisibleBookings } from '../lib/bookings';
import { formatDate, formatTime } from '../lib/formatters';
import { useRideStore } from '../store/rideStore';

export function MyRideDetailsPage() {
  const [params] = useSearchParams();
  const { activeBooking, bookings, markBookingBoarded } = useRideStore();
  const booking = getNextRideBooking(getVisibleBookings(bookings, activeBooking));
  const [showQr, setShowQr] = useState(params.get('qr') === '1');
  const routeText = useMemo(() => booking ? `${stopById(booking.pickupStopId).name} -> ${stopById(booking.dropStopId).name}` : '', [booking]);

  if (!booking) return <EmptyState title="No ride details" body="You do not have an active booking right now." actionLabel="Go Home" to="/rider" />;

  return (
    <div className="page">
      <Header title={showQr ? 'QR Pass' : 'Ride details'} subtitle={routeText} backTo="/myride" />
      {showQr && <QRPassCard booking={booking} />}
      <section className="card">
        <div className="section-title">
          <h2>{getBookingShuttleCode(booking)}</h2>
          <StatusPill label={booking.status === 'boarded' ? 'Boarded' : 'Confirmed'} tone={booking.status === 'boarded' ? 'teal' : 'green'} />
        </div>
        <dl className="receipt">
          <div><dt>Time</dt><dd>{formatTime(booking.departureTime)}</dd></div>
          <div><dt>Date</dt><dd>{formatDate(booking.departureTime)}</dd></div>
          <div><dt>Route</dt><dd>{routeText}</dd></div>
          <div><dt>Seats</dt><dd>{booking.seats}</dd></div>
        </dl>
        <AppButton variant="secondary" onClick={() => setShowQr(!showQr)}>{showQr ? 'Hide QR pass' : 'Show QR pass'}</AppButton>
        {booking.status !== 'boarded' && (
          <AppButton variant="ghost" onClick={() => markBookingBoarded(booking.id)}>Simulate driver QR confirmation</AppButton>
        )}
      </section>
    </div>
  );
}
