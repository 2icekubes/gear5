import { Link, useNavigate } from 'react-router-dom';
import { AppButton } from '../components/common/AppButton';
import { Icon } from '../components/common/Icon';
import { StatusPill } from '../components/common/StatusPill';
import heroRouteUrl from '../assets/final-hero.webp';
import { rideOptions } from '../data/rides';
import { stopById } from '../data/stops';
import { rider } from '../data/user';
import { getBookingEtaLabel, getBookingVehicle, getNextRideBooking, getVisibleBookings } from '../lib/bookings';
import { formatDate, formatTime } from '../lib/formatters';
import { useRideStore } from '../store/rideStore';

export function HomePage() {
  const navigate = useNavigate();
  const { selectedDirection, pickupStopId, dropStopId, activeBooking, bookings, setSelectedDirection, setRoutePair, swapStops } = useRideStore();
  const firstMorning = rideOptions.find((ride) => ride.routeId.includes('morning'));
  const firstEvening = rideOptions.find((ride) => ride.routeId.includes('evening'));
  const pickup = stopById(pickupStopId);
  const drop = stopById(dropStopId);
  const visibleBookings = getVisibleBookings(bookings, activeBooking);
  const nextBooking = getNextRideBooking(visibleBookings);
  const shortStopName = (stopId: string) => stopById(stopId).name.replace(' Bus Stop', '');

  const openRides = (direction: 'morning' | 'evening') => {
    setSelectedDirection(direction);
    setRoutePair(direction === 'morning' ? rider.defaultPickupStopId : rider.defaultDropStopId, direction === 'morning' ? rider.defaultDropStopId : rider.defaultPickupStopId);
    navigate('/rides');
  };

  return (
    <div className="page home-page">
      <section className="hero-panel">
        <img className="hero-panel__image" src={heroRouteUrl} alt="" aria-hidden="true" />
        <div className="hero-panel__copy">
          <p className="brand-wordmark">GEAR5</p>
          <h1>Ikuzo!! Sencho.</h1>
          <p className="hero-panel__greeting">Good Morning, {rider.name.split(' ')[0]}!!</p>
        </div>
      </section>

      <section className="commute-grid" aria-label="Usual commute">
        <button className={`commute-card ${selectedDirection === 'morning' ? 'is-active' : ''}`} onClick={() => openRides('morning')}>
          <Icon name="sun" className="commute-card__icon commute-card__icon--sun" />
          <Icon name="chevronRight" className="commute-card__chevron" />
          <span className="commute-card__title">Book Morning Ride</span>
          <small>{shortStopName(rider.defaultPickupStopId)} - {shortStopName(rider.defaultDropStopId)}</small>
          <strong>{firstMorning ? formatTime(firstMorning.departureTime) : 'No rides'}</strong>
        </button>
        <button className={`commute-card commute-card--teal ${selectedDirection === 'evening' ? 'is-active' : ''}`} onClick={() => openRides('evening')}>
          <Icon name="moon" className="commute-card__icon commute-card__icon--moon" />
          <Icon name="chevronRight" className="commute-card__chevron" />
          <span className="commute-card__title">Book Evening Ride</span>
          <small>{shortStopName(rider.defaultDropStopId)} - {shortStopName(rider.defaultPickupStopId)}</small>
          <strong>{firstEvening ? formatTime(firstEvening.departureTime) : 'No rides'}</strong>
        </button>
      </section>

      <section className="card route-card">
        <div className="section-title">
          <div>
            <p className="eyebrow">Plan route</p>
            <h2>Pickup and drop</h2>
          </div>
          <button className="round-button" onClick={swapStops} aria-label="Swap pickup and drop">
            <Icon name="swap" />
          </button>
        </div>
        <Link to="/search?field=pickup" className="route-row">
          <span className="route-dot route-dot--pickup" />
          <div>
            <small>Pickup</small>
            <strong>{pickup.name}</strong>
          </div>
        </Link>
        <Link to="/search?field=drop" className="route-row">
          <span className="route-dot route-dot--drop" />
          <div>
            <small>Drop</small>
            <strong>{drop.name}</strong>
          </div>
        </Link>
        <AppButton onClick={() => navigate('/rides')}>Search shuttles</AppButton>
      </section>

      <section className="next-ride-card">
        <div className="section-title next-ride-card__header">
          <p className="eyebrow">Next ride</p>
          <Link to="/myride" className="see-all-link">SEE ALL &gt;</Link>
        </div>
        {nextBooking ? (
          <div className="next-ride-card__body">
            <div className="next-ride-card__top">
              <Link to="/myride" className="next-ride-card__main">
                <h2>{nextBooking.status === 'boarded' ? 'Ongoing ride' : 'Active booking'}</h2>
                <strong>{formatTime(nextBooking.departureTime)}</strong>
                <span>{formatDate(nextBooking.departureTime)} - {nextBooking.seats} Seat{nextBooking.seats > 1 ? 's' : ''}</span>
                <small>{stopById(nextBooking.pickupStopId).name} &gt; {stopById(nextBooking.dropStopId).name}</small>
              </Link>
              <div className="next-ride-card__side">
                <StatusPill label={nextBooking.status === 'boarded' ? 'Boarded' : 'Confirmed'} tone={nextBooking.status === 'boarded' ? 'teal' : 'green'} />
                <Link className="next-ride-card__qr" to="/myride/details?qr=1" aria-label="Open QR pass">
                  <Icon name="qr" />
                </Link>
              </div>
            </div>
            <div className="tracking-strip">
              <div>
                <small><Icon name="vehicle" /> Vehicle</small>
                <strong>{getBookingVehicle(nextBooking)}</strong>
              </div>
              <div>
                <small><Icon name="eta" /> ETA</small>
                <strong>{getBookingEtaLabel(nextBooking)}</strong>
              </div>
              <Link to="/live" className="tracking-button"><Icon name="tracking" /> Track</Link>
            </div>
          </div>
        ) : (
          <p className="muted">No active booking yet. Pick a commute slot to reserve your seat.</p>
        )}
      </section>
    </div>
  );
}
