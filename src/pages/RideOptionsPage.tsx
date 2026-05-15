import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AppButton } from '../components/common/AppButton';
import { EmptyState } from '../components/common/EmptyState';
import { Icon } from '../components/common/Icon';
import { StatusPill } from '../components/common/StatusPill';
import { Header } from '../components/layout/Header';
import { rideOptions } from '../data/rides';
import { routeForDirection } from '../data/routes';
import { stopById } from '../data/stops';
import { estimateDropTime, formatTime } from '../lib/formatters';
import { useRideStore } from '../store/rideStore';

export function RideOptionsPage() {
  const navigate = useNavigate();
  const { selectedDirection, pickupStopId, dropStopId } = useRideStore();
  const route = routeForDirection(selectedDirection);
  const rides = rideOptions.filter((ride) => ride.routeId === route.id);
  const [selectedRideId, setSelectedRideId] = useState(rides[0]?.id ?? '');
  const selectedRide = rides.find((ride) => ride.id === selectedRideId) ?? rides[0];

  if (!selectedRide) return <EmptyState title="No rides found" body="Try changing your route or commute direction." actionLabel="Edit route" to="/search" />;

  return (
    <div className="page">
      <Header
        title={selectedDirection === 'morning' ? 'Morning Ride' : 'Evening Ride'}
        subtitle={`${stopById(pickupStopId).name} → ${stopById(dropStopId).name}`}
        backTo="/"
      />
      <Link className="route-edit-icon" to="/search" aria-label="Edit route">
        <Icon name="edit" />
      </Link>
      <div className="date-strip">
        {[
          { day: 'Today', date: '15', suffix: 'th', month: 'May' },
          { day: 'Sat', date: '16', suffix: 'th', month: 'May' },
          { day: 'Sun', date: '17', suffix: 'th', month: 'May' },
          { day: 'Mon', date: '18', suffix: 'th', month: 'May' },
          { day: 'Tue', date: '19', suffix: 'th', month: 'May' },
        ].map((item, index) => (
          <button className={index === 0 ? 'is-active' : ''} key={`${item.day}-${item.date}`}>
            {item.day}, {item.date}<sup>{item.suffix}</sup> {item.month}
          </button>
        ))}
      </div>
      <section className="ride-card">
        <div className="ride-route-section">
          <div className="timeline">
            <p><strong>{stopById(pickupStopId).name}</strong><span>{selectedRide.etaToPickupMinutes} min walk to pickup</span></p>
            <p><strong>{stopById(dropStopId).name}</strong><span>Est. arrival {estimateDropTime(selectedRide.departureTime)}</span></p>
          </div>
        </div>
        <div className="ride-slot-section">
          <div className="ride-slot-section__header">
            <span>Time slots</span>
            <small>{selectedRide.shuttleCode}</small>
          </div>
          <div className="time-slot-grid">
            {rides.map((ride) => (
              <button
                className={`time-slot-button ${ride.id === selectedRide.id ? 'is-selected' : ''}`}
                disabled={ride.status !== 'available'}
                key={ride.id}
                onClick={() => setSelectedRideId(ride.id)}
              >
                <strong>{formatTime(ride.departureTime)}</strong>
                <span>{ride.status === 'available' ? `${ride.availableSeats} seats` : 'Full'}</span>
              </button>
            ))}
          </div>
        </div>
        <AppButton disabled={selectedRide.status !== 'available'} onClick={() => navigate(`/confirm/${selectedRide.id}`)}>
          Proceed with ride package
        </AppButton>
      </section>
    </div>
  );
}
