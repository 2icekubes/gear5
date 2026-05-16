import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppButton } from '../components/common/AppButton';
import { EmptyState } from '../components/common/EmptyState';
import { Header } from '../components/layout/Header';
import { rideById } from '../data/rides';
import { stopById } from '../data/stops';
import { canConfirmBooking, MAX_SEATS_PER_BOOKING } from '../lib/bookingRules';
import { estimateDropTime, formatDate, formatTime } from '../lib/formatters';
import { useRideStore } from '../store/rideStore';

export function ConfirmRidePage() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const ride = rideById(rideId);
  const { activeBooking, packageRidesRemaining, pickupStopId, dropStopId, createBooking } = useRideStore();
  const [seats, setSeats] = useState(1);
  const [error, setError] = useState('');
  const isDuplicateBooking =
    Boolean(
      activeBooking &&
        activeBooking.rideId === ride?.id &&
        activeBooking.pickupStopId === pickupStopId &&
        activeBooking.dropStopId === dropStopId,
    );
  const allowed = canConfirmBooking(ride, packageRidesRemaining, seats) && !isDuplicateBooking;

  if (!ride) return <EmptyState title="Ride unavailable" body="That shuttle option could not be found." actionLabel="Back to rides" to="/rides" />;

  const confirm = () => {
    if (isDuplicateBooking) {
      setError('You already have an active booking for this slot.');
      return;
    }

    const booking = createBooking(ride.id, seats);
    if (booking) {
      navigate('/success');
    } else {
      setError('Booking could not be completed. Please try again or choose a different ride.');
    }
  };

  return (
    <div className="page page--confirm">
      <Header title="Confirm booking" subtitle={`${formatDate(ride.departureTime)} · ${ride.routeId.includes('morning') ? 'Morning' : 'Evening'} ride`} backTo="/rides" />
      <section className="card confirm-card">
        <div className="big-time">{formatTime(ride.departureTime)}</div>
        <p>{ride.shuttleCode} · {ride.shuttleName}</p>
        <div className="timeline">
          <p><strong>{stopById(pickupStopId).name}</strong><span>{ride.etaToPickupMinutes} min walk to pickup</span></p>
          <p><strong>{stopById(dropStopId).name}</strong><span>Est. drop {estimateDropTime(ride.departureTime)}</span></p>
        </div>
      </section>
      <section className="card">
        <div className="section-title">
          <h2>Seats</h2>
          <div className="stepper">
            <button onClick={() => setSeats(Math.max(1, seats - 1))}>−</button>
            <strong>{seats}</strong>
            <button onClick={() => setSeats(Math.min(MAX_SEATS_PER_BOOKING, seats + 1))}>+</button>
          </div>
        </div>
        <dl className="receipt">
          <div><dt>Package balance</dt><dd>{packageRidesRemaining} rides</dd></div>
          <div><dt>Seats requested</dt><dd>{seats}</dd></div>
          <div><dt>Balance after booking</dt><dd>{Math.max(0, packageRidesRemaining - seats)} rides</dd></div>
          <div><dt>Cancellation cutoff</dt><dd>{formatTime(new Date(new Date(ride.departureTime).getTime() - 30 * 60000).toISOString())}</dd></div>
        </dl>
        {packageRidesRemaining < seats && <p className="warning">Your package balance is below the requested seat count.</p>}
        {error && <p className="warning">{error}</p>}
      </section>
      <div className="confirm-action">
        <AppButton disabled={!allowed} onClick={confirm}>Confirm ride</AppButton>
      </div>
    </div>
  );
}
