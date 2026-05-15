import { type ReactNode, useState } from 'react';

type TripStatus = 'Not Started' | 'Online' | 'Upcoming' | 'Completed';
type Screen = 'assigned' | 'details' | 'active';
type Sheet = 'date' | 'delay' | 'announce' | null;

const driver = {
  name: 'Sanjay',
  vehicleNumber: 'WB 19 M 2506',
};

const trips = [
  {
    id: 'G5-MRN-2506-0730',
    type: 'Morning',
    from: 'ESI Hospital - Budge Budge',
    to: 'Ecospace',
    startTime: '07:30 AM',
    riders: 18,
    stops: 32,
    distance: '31.8 km',
    vehicle: 'WB 19 M 2506',
    status: 'Not Started' as TripStatus,
    routeHealth: 'On Time',
  },
  {
    id: 'G5-EVE-2506-1820',
    type: 'Evening',
    from: 'Ecospace Entry Gate',
    to: 'ESI Hospital - Budge Budge',
    startTime: '06:20 PM',
    riders: 20,
    stops: 33,
    distance: '32.4 km',
    vehicle: 'WB 19 M 2506',
    status: 'Upcoming' as TripStatus,
    routeHealth: 'On Time',
  },
];

const activeTripState = {
  currentStop: 'Bata More',
  nextStop: 'Jinjira Bazar',
  upcomingStop: 'Nicco Park',
  boarded: 3,
  expectedAtCurrentStop: 4,
  waitTimer: '00:45',
  nextStopEta: '07:48 AM',
  nextStopRidersWaiting: 3,
};

const currentStopRiders = [
  { name: 'Arjun S.', status: 'Boarded' },
  { name: 'Priya M.', status: 'Boarded' },
  { name: 'Rohan D.', status: 'Boarded' },
  { name: 'Ananya P.', status: 'Waiting' },
];

const nextStopRiders = [
  { name: 'Deb S.', stop: 'Jinjira Bazar', status: 'Waiting' },
  { name: 'Neha K.', stop: 'Jinjira Bazar', status: 'Waiting' },
  { name: 'Sayan B.', stop: 'Jinjira Bazar', status: 'Waiting' },
];

const riderRows = [
  { name: 'Arjun S.', stop: 'Bata More', status: 'Boarded' },
  { name: 'Priya M.', stop: 'Bata More', status: 'Waiting' },
  { name: 'Rohan D.', stop: 'Jinjira Bazar', status: 'Waiting' },
  { name: 'Neha K.', stop: 'Nicco Park', status: 'No Show' },
  { name: 'Sayan B.', stop: 'Nicco Park', status: 'Manual Override' },
];

const stopTimeline = [
  { stop: 'ESI Hospital - Budge Budge', time: '07:20 AM', note: 'Trip Start - 18 Riders', state: 'current' },
  { stop: 'Bata More', time: '07:27 AM', note: '2 Riders', state: 'next' },
  { stop: 'Jinjira Bazar', time: '07:48 AM', note: '3 Riders', state: 'next' },
  { stop: 'Nicco Park', time: '07:58 AM', note: '5 Riders', state: 'next' },
  { stop: 'Ecospace', time: '08:45 AM', note: 'Drop Point', state: 'next' },
];

const fullStopTimeline = [
  ...stopTimeline.slice(0, 2),
  { stop: 'Usha Factory', time: '07:34 AM', note: 'No pickup required', state: 'empty' },
  { stop: 'Akra Station Road', time: '07:38 AM', note: '1 Rider', state: 'next' },
  ...stopTimeline.slice(2, 3),
  { stop: 'Tarantala Crossing', time: '07:52 AM', note: '2 Riders', state: 'next' },
  { stop: 'Behala Tram Depot', time: '07:56 AM', note: '1 Rider', state: 'next' },
  ...stopTimeline.slice(3, 4),
  { stop: 'College More', time: '08:08 AM', note: '4 Riders', state: 'next' },
  { stop: 'Ecospace Entry Gate', time: '08:38 AM', note: 'Drop sequence', state: 'next' },
  ...stopTimeline.slice(4),
];

export function DriverPrototype() {
  const [screen, setScreen] = useState<Screen>('assigned');
  const [selectedTrip, setSelectedTrip] = useState(trips[0]);
  const [tripStatus, setTripStatus] = useState<TripStatus>('Not Started');
  const [morningCompleted, setMorningCompleted] = useState(false);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [toast, setToast] = useState('');
  const [showSOS, setShowSOS] = useState(false);
  const [showEndTrip, setShowEndTrip] = useState(false);
  const [showRiders, setShowRiders] = useState(false);
  const [showRouteMap, setShowRouteMap] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const closeSheet = () => setSheet(null);
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  };

  const openTripDetails = (trip: (typeof trips)[number]) => {
    setSelectedTrip(trip);
    setTripStatus(morningCompleted && trip.id === trips[0].id ? 'Completed' : trip.status);
    setScreen('details');
  };

  const startTrip = () => {
    setTripStatus('Online');
    setScreen('active');
  };

  const completeTrip = () => {
    setShowEndTrip(false);
    setMorningCompleted(true);
    setTripStatus('Completed');
    setScreen('assigned');
  };

  return (
    <div className="driver-stage">
      <main className="driver-shell">
        {screen === 'assigned' && (
          <AssignedTripsScreen
            completed={morningCompleted}
            onDateTap={() => setSheet('date')}
            onOpenTrip={openTripDetails}
            onRiders={() => setShowRiders(true)}
            onRoute={() => setShowRouteMap(true)}
          />
        )}

        {screen === 'details' && (
          <TripDetailsScreen
            trip={selectedTrip}
            status={tripStatus}
            onBack={() => setScreen('assigned')}
            onGoOnline={() => setTripStatus('Online')}
            onStartTrip={startTrip}
            onRiders={() => setShowRiders(true)}
            onRoute={() => setShowRouteMap(true)}
            onDelay={() => setSheet('delay')}
            onSOS={() => setShowSOS(true)}
          />
        )}

        {screen === 'active' && (
          <ActiveTripConsole
            trip={selectedTrip}
            onDelay={() => setSheet('delay')}
            onSOS={() => setShowSOS(true)}
            onAnnounce={() => setSheet('announce')}
            onEndTrip={() => setShowEndTrip(true)}
            onRiders={() => setShowRiders(true)}
            onRoute={() => setShowRouteMap(true)}
            onScan={() => setShowScanner(true)}
          />
        )}
      </main>

      {sheet === 'date' && <DateBottomSheet onClose={closeSheet} />}
      {sheet === 'delay' && <DelayBottomSheet onClose={closeSheet} onSelect={(message) => notify(message)} />}
      {sheet === 'announce' && <AnnouncementSheet onClose={closeSheet} onSelect={(message) => notify(message)} />}
      {showSOS && <SOSConfirmModal onClose={() => setShowSOS(false)} />}
      {showEndTrip && <EndTripConfirmModal onClose={() => setShowEndTrip(false)} onConfirm={completeTrip} />}
      {showRiders && <RiderListModal onClose={() => setShowRiders(false)} onNotify={notify} />}
      {showRouteMap && <RouteMapModal onClose={() => setShowRouteMap(false)} />}
      {showScanner && <QRScannerModal onClose={() => setShowScanner(false)} />}
      {toast && <div className="driver-toast">{toast}</div>}
    </div>
  );
}

function AssignedTripsScreen({
  completed,
  onDateTap,
  onOpenTrip,
  onRiders,
  onRoute,
}: {
  completed: boolean;
  onDateTap: () => void;
  onOpenTrip: (trip: (typeof trips)[number]) => void;
  onRiders: () => void;
  onRoute: () => void;
}) {
  return (
    <section className="driver-page driver-page--nav">
      <DriverHeader title={`Good Morning!! ${driver.name}`} />
      <h1 className="driver-title">Assigned Trips</h1>
      <DateSelector onTap={onDateTap} />
      <div className="assigned-list">
        {trips.map((trip, index) => (
          <AssignedTripCard
            key={trip.id}
            trip={{ ...trip, status: completed && index === 0 ? 'Completed' : trip.status }}
            isNext={(index === 0 && !completed) || (index === 1 && completed)}
            isLocked={index === 0 ? completed : !completed}
            onTap={() => {
              if ((index === 0 && !completed) || (index === 1 && completed)) onOpenTrip(trip);
            }}
          />
        ))}
      </div>
      <BottomNavigation active="Trips" onRiders={onRiders} onRoute={onRoute} />
    </section>
  );
}

function TripDetailsScreen({
  trip,
  status,
  onBack,
  onGoOnline,
  onStartTrip,
  onRiders,
  onRoute,
  onDelay,
  onSOS,
}: {
  trip: (typeof trips)[number];
  status: TripStatus;
  onBack: () => void;
  onGoOnline: () => void;
  onStartTrip: () => void;
  onRiders: () => void;
  onRoute: () => void;
  onDelay: () => void;
  onSOS: () => void;
}) {
  return (
    <section className="driver-page driver-page--details">
      <div className="driver-topbar">
        <button className="icon-button" onClick={onBack} aria-label="Back">
          <BackIcon />
        </button>
        <strong>Trip Details</strong>
        <button className="icon-button" aria-label="Help">
          <HeadsetIcon />
        </button>
      </div>
      <TripDetailsCard trip={trip} status={status} />
      <TripStatusCard status={status} onGoOnline={onGoOnline} onStartTrip={onStartTrip} />
      <StopTimeline />
      <TripDetailsActions onRoute={onRoute} onRiders={onRiders} onDelay={onDelay} onSOS={onSOS} />
    </section>
  );
}

function ActiveTripConsole({
  trip,
  onDelay,
  onSOS,
  onAnnounce,
  onEndTrip,
  onRiders,
  onRoute,
  onScan,
}: {
  trip: (typeof trips)[number];
  onDelay: () => void;
  onSOS: () => void;
  onAnnounce: () => void;
  onEndTrip: () => void;
  onRiders: () => void;
  onRoute: () => void;
  onScan: () => void;
}) {
  return (
    <section className="driver-page driver-page--active">
      <div className="active-header">
        <div>
          <span>Trip Active</span>
          <strong>{trip.type} Route</strong>
        </div>
        <div>
          <small>Vehicle</small>
          <b>{driver.vehicleNumber}</b>
        </div>
        <StatusBadge label="On Time" tone="success" />
      </div>

      <button className="route-strip-button" onClick={onRoute}>
        <MovingRouteStrip />
      </button>

      <CurrentStopCard />

      <div className="boarding-row">
        <WaitTimerCard />
        <QRScannerAction onTap={onScan} />
      </div>

      <NextBoardingCard />

      <div className="active-action-grid">
        <QuickActionTile label="Delay" icon="!" onTap={onDelay} />
        <QuickActionTile label="SOS" icon="SOS" tone="danger" onTap={onSOS} />
        <QuickActionTile label="Announce" icon="))" onTap={onAnnounce} />
        <QuickActionTile label="End Trip" icon="End" tone="muted" onTap={onEndTrip} />
      </div>

      <button className="rider-list-link" onClick={onRiders}>
        View rider list
      </button>
    </section>
  );
}

function DriverHeader({ title }: { title: string }) {
  return (
    <header className="driver-header">
      <button className="icon-button" aria-label="Menu">
        <MenuIcon />
      </button>
      <strong>{title}</strong>
      <div className="driver-header__icons">
        <button className="icon-button" aria-label="Notifications">
          <BellIcon />
        </button>
        <button className="profile-dot" aria-label="Profile">
          S
        </button>
      </div>
    </header>
  );
}

function BellIcon() {
  return (
    <svg className="driver-bell-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 6-2.5 7-2.5 8.5h17C20.5 15 18 14 18 8Z" />
      <path d="M14.2 19a2.4 2.4 0 0 1-4.4 0" />
    </svg>
  );
}

function DateSelector({ onTap }: { onTap: () => void }) {
  return (
    <button className="date-selector" onClick={onTap}>
      <CalendarIcon />
      <strong>Today, 15 May 2026</strong>
      <ChevronDownIcon />
    </button>
  );
}

function AssignedTripCard({
  trip,
  isNext,
  isLocked,
  onTap,
}: {
  trip: (typeof trips)[number];
  isNext: boolean;
  isLocked: boolean;
  onTap: () => void;
}) {
  return (
    <button className={`assigned-trip-card ${isNext ? 'is-next' : ''} ${isLocked ? 'is-locked' : ''}`} onClick={onTap} disabled={isLocked}>
      <div className="assigned-trip-card__left">
        <StatusBadge label={trip.type} tone={trip.type === 'Morning' ? 'accent' : 'neutral'} />
        <strong>{trip.startTime}</strong>
        <span className="trip-rider-count">
          <RidersIcon /> <b>{trip.riders}</b> <span className="rider-label">Riders</span>
        </span>
      </div>
      <div className="assigned-trip-card__right">
        <div className="compact-route">
          <strong>{trip.from}</strong>
          <span>
            <b aria-hidden="true">-&gt;</b> {trip.to}
          </span>
        </div>
        <div className="trip-metrics">
          <small>{trip.stops} Stops</small>
          <em aria-hidden="true">•</em>
          <small>{trip.distance}</small>
        </div>
        <div className="vehicle-line">
          <BusIcon /> Bus: {trip.vehicle}
        </div>
        <ChevronRightIcon className="trip-card-chevron" />
      </div>
    </button>
  );
}

function MenuIcon() {
  return (
    <svg className="driver-ui-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg className="driver-ui-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="date-chevron-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`driver-ui-icon ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="driver-ui-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="date-selector-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg className="driver-bell-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 13a8 8 0 0 1 16 0" />
      <path d="M4 13v4a2 2 0 0 0 2 2h1v-6H4ZM20 13v4a2 2 0 0 1-2 2h-1v-6h3Z" />
      <path d="M14 21h-3" />
    </svg>
  );
}

function RidersIcon() {
  return (
    <svg className="tiny-inline-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 20v-1.2a3.8 3.8 0 0 0-3.8-3.8H6.8A3.8 3.8 0 0 0 3 18.8V20" />
      <circle cx="9.5" cy="7.5" r="3.5" />
      <path d="M21 20v-1.1a3.6 3.6 0 0 0-2.8-3.5" />
      <path d="M15.7 4.2a3.5 3.5 0 0 1 0 6.6" />
    </svg>
  );
}

function BusIcon() {
  return (
    <svg className="tiny-inline-icon tiny-inline-icon--accent" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="5" width="14" height="12" rx="3" />
      <path d="M8 9h8M8 13h8M8 19v1.5M16 19v1.5" />
      <circle cx="8.5" cy="16" r="1" />
      <circle cx="15.5" cy="16" r="1" />
    </svg>
  );
}

function StatusBadge({ label, tone = 'neutral' }: { label: string; tone?: 'accent' | 'success' | 'danger' | 'neutral' }) {
  return <span className={`driver-status driver-status--${tone}`}>{label}</span>;
}

function TripDetailsCard({ trip, status }: { trip: (typeof trips)[number]; status: TripStatus }) {
  return (
    <article className="trip-hero-panel">
      <div className="trip-hero-kicker">
        <span>{trip.type} Trip</span>
        <b>Trip ID: TRP78921</b>
      </div>
      <h2>
        {trip.from} <b>-&gt;</b> {trip.to}
      </h2>
      <div className="trip-metric-row">
        <MetricItem icon={<CalendarIcon />} value="15 May 2026" label="Friday" />
        <MetricItem icon={<ClockIcon />} value={trip.startTime} label="Start Time" />
        <MetricItem icon={<RidersIcon />} value={String(trip.riders)} label="Riders" />
        <MetricItem icon={<PinIcon />} value={trip.distance} label="Distance" />
      </div>
    </article>
  );
}

function MetricItem({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="trip-metric-item">
      {icon}
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg className="tiny-inline-icon tiny-inline-icon--accent" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="tiny-inline-icon tiny-inline-icon--accent" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s6-5.3 6-11a6 6 0 0 0-12 0c0 5.7 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  );
}

function TripStatusCard({
  status,
  onGoOnline,
  onStartTrip,
}: {
  status: TripStatus;
  onGoOnline: () => void;
  onStartTrip: () => void;
}) {
  const canStartTrip = true;

  return (
    <article className="driver-card-panel status-panel">
      <div className="status-panel-copy">
        <div>
          <span>Trip Status</span>
          <StatusBadge label={status} tone={status === 'Online' ? 'success' : 'neutral'} />
        </div>
        <p>Go online when you are ready and start the trip.</p>
      </div>
      {status === 'Online' ? (
        <>
          <div className="trip-unlock-timer">
            <span>Start unlocks in</span>
            <strong>00:00:00</strong>
            <small>Available at 07:30 AM</small>
          </div>
          <button className="driver-primary-button" onClick={onStartTrip} disabled={!canStartTrip}>
            Start Trip
          </button>
        </>
      ) : (
        <button className="driver-primary-button driver-primary-button--wide" onClick={onGoOnline}>
          <PowerIcon /> Go Online
        </button>
      )}
    </article>
  );
}

function PowerIcon() {
  return (
    <svg className="button-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v9" />
      <path d="M6.7 6.7a7.5 7.5 0 1 0 10.6 0" />
    </svg>
  );
}

function StopTimeline() {
  const [expanded, setExpanded] = useState(false);
  const visibleStops = expanded ? fullStopTimeline : stopTimeline;

  return (
    <article className={`driver-card-panel route-overview-panel ${expanded ? 'is-expanded' : ''}`}>
      <div className="panel-heading">
        <span>Route Overview</span>
        <button className="all-stops-button" onClick={() => setExpanded((value) => !value)}>
          32 Stops <b>{expanded ? '<<' : '>>'}</b>
        </button>
      </div>
      <div className="stop-timeline">
        {visibleStops.map((item) => (
          <div className={`stop-node stop-node--${item.state}`} key={item.stop}>
            <i />
            <div>
              <strong>{item.stop}</strong>
              <span>{item.note}</span>
            </div>
            <time>{item.time}</time>
          </div>
        ))}
      </div>
    </article>
  );
}

function TripDetailsActions({
  onRoute,
  onRiders,
  onDelay,
  onSOS,
}: {
  onRoute: () => void;
  onRiders: () => void;
  onDelay: () => void;
  onSOS: () => void;
}) {
  return (
    <div className="trip-details-actions">
      <QuickActionTile label="Route Map" icon="Map" onTap={onRoute} />
      <QuickActionTile label="Rider List" icon="Riders" onTap={onRiders} />
      <QuickActionTile label="Delay" icon="Timer" onTap={onDelay} />
      <QuickActionTile label="SOS" icon="Shield" tone="danger" onTap={onSOS} />
    </div>
  );
}

function MovingRouteStrip() {
  return (
    <div className="moving-route-strip">
      <span>Bata More</span>
      <div className="route-track">
        <ForceTravellerIcon />
      </div>
      <span>Jinjira Bazar</span>
      <div className="route-track route-track--short" />
      <span>Nicco Park</span>
      <small>tap for map</small>
    </div>
  );
}

function ForceTravellerIcon() {
  return (
    <div className="force-traveller-icon">
      <BusIcon />
    </div>
  );
}

function CurrentStopCard() {
  return (
    <article className="driver-card-panel current-stop-card">
      <span>Current Stop</span>
      <h2>{activeTripState.currentStop}</h2>
      <BoardingProgressCard />
      <div className="current-rider-chips">
        {currentStopRiders.map((rider) => (
          <span key={rider.name} className={rider.status === 'Boarded' ? 'is-boarded' : ''}>
            {rider.name}
          </span>
        ))}
      </div>
    </article>
  );
}

function BoardingProgressCard() {
  return (
    <div className="boarding-progress-card">
      <div>
        <span>Boarding</span>
        <strong>
          {activeTripState.boarded}/{activeTripState.expectedAtCurrentStop} Boarded
        </strong>
      </div>
      <div>
        <span>Status</span>
        <strong>Boarding in progress</strong>
      </div>
    </div>
  );
}

function WaitTimerCard() {
  return (
    <article className="wait-timer-card">
      <span>Wait Timer</span>
      <strong>{activeTripState.waitTimer}</strong>
      <small>Do not wait indefinitely</small>
    </article>
  );
}

function QRScannerAction({ onTap }: { onTap: () => void }) {
  return (
    <button className="qr-scanner-action" onClick={onTap}>
      <span>Open QR Scanner</span>
      <strong>Scan rider QR</strong>
    </button>
  );
}

function NextBoardingCard() {
  return (
    <article className="driver-card-panel next-boarding-card">
      <div>
        <span>Next Stop</span>
        <strong>{activeTripState.nextStop}</strong>
        <small>ETA: {activeTripState.nextStopEta}</small>
      </div>
      <div>
        <span>Next Boarding</span>
        <strong>{activeTripState.nextStopRidersWaiting} Riders Waiting</strong>
        <div className="next-rider-chips">
          {nextStopRiders.map((rider) => (
            <span key={rider.name}>{rider.name}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

function QuickActionTile({
  label,
  icon,
  tone = 'neutral',
  onTap,
}: {
  label: string;
  icon: string;
  tone?: 'neutral' | 'danger' | 'muted';
  onTap: () => void;
}) {
  return (
    <button className={`quick-action-tile quick-action-tile--${tone}`} onClick={onTap}>
      <b>
        <ActionGlyph name={icon} />
      </b>
      <span>{label}</span>
    </button>
  );
}

function ActionGlyph({ name }: { name: string }) {
  if (name === 'Map') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m4 6 5-2 6 2 5-2v14l-5 2-6-2-5 2V6Z" />
        <path d="M9 4v14M15 6v14" />
      </svg>
    );
  }
  if (name === 'Riders') return <RidersIcon />;
  if (name === 'Timer') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l3 2M9 2h6" />
      </svg>
    );
  }
  if (name === 'Shield') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }
  if (name === 'SOS') return <span className="action-text-icon">SOS</span>;
  if (name === 'End') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="7" y="7" width="10" height="10" rx="1.5" />
      </svg>
    );
  }
  if (name === '!') return <span className="action-text-icon">!</span>;
  if (name === '))') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 10v4h4l6 4V6l-6 4H4Z" />
        <path d="M17 9a4 4 0 0 1 0 6M20 7a7 7 0 0 1 0 10" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

function DateBottomSheet({ onClose }: { onClose: () => void }) {
  return (
    <BottomSheet title="Select Date" onClose={onClose}>
      {['Today - 2 assigned trips', 'Tomorrow - No trips assigned yet', '18 May - Schedule pending'].map((item) => (
        <button className="sheet-option" key={item} onClick={onClose}>
          {item}
        </button>
      ))}
    </BottomSheet>
  );
}

function DelayBottomSheet({ onClose, onSelect }: { onClose: () => void; onSelect: (message: string) => void }) {
  const options = ['Running 5 mins late', 'Running 10 mins late', 'Traffic delay', 'Breakdown delay'];
  return (
    <BottomSheet title="Delay Reason" onClose={onClose}>
      {options.map((item) => (
        <button
          className="sheet-option"
          key={item}
          onClick={() => {
            onClose();
            onSelect('Delay broadcast sent to riders.');
          }}
        >
          {item}
        </button>
      ))}
    </BottomSheet>
  );
}

function AnnouncementSheet({ onClose, onSelect }: { onClose: () => void; onSelect: (message: string) => void }) {
  return (
    <BottomSheet title="Announce" onClose={onClose}>
      {['Arriving', 'Delayed', 'Leaving Stop', 'Trip Started'].map((item) => (
        <button
          className="sheet-option"
          key={item}
          onClick={() => {
            onClose();
            onSelect('Announcement queued.');
          }}
        >
          {item}
        </button>
      ))}
    </BottomSheet>
  );
}

function RiderListModal({ onClose, onNotify }: { onClose: () => void; onNotify: (message: string) => void }) {
  const orderedRiders = [...riderRows].sort((a, b) => {
    const priority = (status: string) => (status === 'Boarded' ? 2 : status === 'Manual Override' ? 1 : 0);
    return priority(a.status) - priority(b.status);
  });
  const canMarkNoShow = false;

  return (
    <ModalShell title="Rider List" onClose={onClose}>
      <div className="rider-list">
        {orderedRiders.map((rider) => (
          <div className={`rider-row ${rider.stop === activeTripState.currentStop && rider.status !== 'Boarded' ? 'is-current-pending' : ''}`} key={rider.name}>
            <div className="rider-row-main">
              <div>
                <strong>{rider.name}</strong>
                <StatusBadge label={rider.status} tone={rider.status === 'Boarded' ? 'success' : 'neutral'} />
              </div>
              <span>{rider.stop}</span>
            </div>
            <div className="rider-actions">
              <button
                disabled={!canMarkNoShow}
                title="Enabled 1 minute after scheduled stoppage time"
                onClick={() => onNotify(`No Show message sent to ${rider.name}.`)}
              >
                No Show
              </button>
              <button onClick={() => onNotify(`${rider.name} marked for manual boarding.`)}>Manual Boarding</button>
            </div>
          </div>
        ))}
      </div>
    </ModalShell>
  );
}

function SOSConfirmModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell title="Emergency Support" onClose={onClose}>
      <p>Are you sure you want to contact support?</p>
      <div className="confirm-actions">
        <button onClick={onClose}>Cancel</button>
        <button className="danger-hold">Hold to SOS</button>
      </div>
    </ModalShell>
  );
}

function EndTripConfirmModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <ModalShell title="End this trip?" onClose={onClose}>
      <div className="confirm-actions">
        <button onClick={onClose}>Cancel</button>
        <button className="end-confirm" onClick={onConfirm}>
          End Trip
        </button>
      </div>
    </ModalShell>
  );
}

function RouteMapModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell title="Route Map" onClose={onClose} wide>
      <div className="mock-route-map">
        <div className="mock-route-line" />
        <span className="map-pin map-pin--driver">
          <BusIcon />
        </span>
        <span className="map-pin map-pin--current">Bata More</span>
        <span className="map-pin map-pin--next">Jinjira Bazar</span>
        <button>Recenter</button>
      </div>
      <div className="map-meta">
        <strong>ETA to next stop: 07:48 AM</strong>
        <span>Traffic / delay status: On Time</span>
      </div>
    </ModalShell>
  );
}

function QRScannerModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell title="QR Scanner" onClose={onClose}>
      <div className="scanner-frame">
        <div className="scanner-reticle">
          <i />
          <i />
          <i />
          <i />
          <span />
        </div>
      </div>
      <div className="scanner-meta">
        <strong>Ready to scan rider QR</strong>
        <span>Mock scanner only. No real QR validation yet.</span>
      </div>
    </ModalShell>
  );
}

function BottomNavigation({
  active,
  onRiders,
  onRoute,
}: {
  active: 'Trips' | 'Riders' | 'Route' | 'Alerts' | 'Profile';
  onRiders: () => void;
  onRoute: () => void;
}) {
  const items = ['Trips', 'Riders', 'Route', 'Alerts', 'Profile'] as const;
  const icons = {
    Trips: <TripsNavIcon />,
    Riders: <RidersNavIcon />,
    Route: <RouteNavIcon />,
    Alerts: <AlertsNavIcon />,
    Profile: <ProfileNavIcon />,
  };

  return (
    <nav className="driver-bottom-nav">
      {items.map((item) => (
        <button
          key={item}
          className={item === active ? 'is-active' : ''}
          onClick={item === 'Riders' ? onRiders : item === 'Route' ? onRoute : undefined}
        >
          <span>{icons[item]}</span>
          <small>{item}</small>
        </button>
      ))}
    </nav>
  );
}

function TripsNavIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="4" width="14" height="16" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

function RidersNavIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 20v-1.2a3.8 3.8 0 0 0-3.8-3.8H6.8A3.8 3.8 0 0 0 3 18.8V20" />
      <circle cx="9.5" cy="7.5" r="3.5" />
      <path d="M21 20v-1.1a3.6 3.6 0 0 0-2.8-3.5" />
      <path d="M15.7 4.2a3.5 3.5 0 0 1 0 6.6" />
    </svg>
  );
}

function RouteNavIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19c5-11 9 1 14-10" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="9" r="2" />
    </svg>
  );
}

function AlertsNavIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 4 9 16H3L12 4Z" />
      <path d="M12 10v4M12 17h.01" />
    </svg>
  );
}

function ProfileNavIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function BottomSheet({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="driver-overlay" role="presentation">
      <div className="driver-sheet">
        <div className="sheet-header">
          <strong>{title}</strong>
          <button onClick={onClose} aria-label="Close"><CloseIcon /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalShell({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <div className="driver-overlay driver-overlay--center" role="presentation">
      <div className={`driver-modal ${wide ? 'driver-modal--wide' : ''}`}>
        <div className="sheet-header">
          <strong>{title}</strong>
          <button onClick={onClose} aria-label="Close"><CloseIcon /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

