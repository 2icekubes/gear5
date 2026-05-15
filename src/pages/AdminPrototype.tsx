import { useMemo, useState } from 'react';
import { Icon } from '../components/common/Icon';

type AdminScreen =
  | 'home'
  | 'trips'
  | 'trip-details'
  | 'assign-driver'
  | 'change-time'
  | 'passes'
  | 'assign-passes'
  | 'negative-riders'
  | 'riders'
  | 'rider-profile'
  | 'driver-logins'
  | 'issues';

type Tone = 'green' | 'amber' | 'red' | 'navy' | 'muted';

const stops = [
  'ESI Hospital - Budge Budge',
  'Bata More',
  'Usha Factory',
  'Jalkhura Bus Stop',
  'Jolkol',
  'Benepukur',
  'Rampur Bumper',
  'Gopalpur',
  'Sarkarpool',
  'Jinjira Bazar',
  'CESC Limited - Taratala',
  'Nicco Park',
  'Wipro',
  'DLF 1',
  'DLF 2',
  'TCS Geetanjali Bus Stop',
  'Ecospace Entry Gate',
];

const riders = [
  {
    id: 'RID-1422',
    name: 'Rohit Verma',
    phone: '+91 98745 11220',
    company: 'Wipro',
    department: 'Product Ops',
    pickup: 'Bata More',
    drop: 'Ecospace Entry Gate',
    balance: -3,
    validity: '30 Jun 2026',
    booking: 'Today Morning - Booked',
    lastRide: 'Today Morning',
  },
  {
    id: 'RID-1187',
    name: 'Priya Singh',
    phone: '+91 98311 40587',
    company: 'DLF 2',
    department: 'Finance',
    pickup: 'CESC Limited - Taratala',
    drop: 'DLF 2',
    balance: 6,
    validity: '30 Jun 2026',
    booking: 'Today Morning - Waiting',
    lastRide: 'Yesterday Evening',
  },
  {
    id: 'RID-1064',
    name: 'Ankit Sharma',
    phone: '+91 90070 55142',
    company: 'TCS',
    department: 'Engineering',
    pickup: 'Bata More',
    drop: 'TCS Geetanjali Bus Stop',
    balance: 0,
    validity: '30 Jun 2026',
    booking: 'No booking today',
    lastRide: '14 May 2026',
  },
  {
    id: 'RID-1638',
    name: 'Sayan Das',
    phone: '+91 97481 99230',
    company: 'Ecospace',
    department: 'Support',
    pickup: 'Jinjira Bazar',
    drop: 'Ecospace Entry Gate',
    balance: -1,
    validity: '28 May 2026',
    booking: 'Today Evening - Booked',
    lastRide: 'Today Morning',
  },
];

const trips = [
  {
    id: 'M-0700',
    type: 'Morning',
    route: 'ESI Hospital - Budge Budge → Ecospace',
    startTime: '07:00 AM',
    driver: 'Not Assigned',
    vehicle: 'WB-19-1234',
    booked: 18,
    capacity: 22,
    boarded: 0,
    available: 4,
    status: 'Needs Driver',
    currentStop: '',
    nextStop: 'ESI Hospital - Budge Budge',
    delay: '',
  },
  {
    id: 'M-0730',
    type: 'Morning',
    route: 'ESI Hospital - Budge Budge → Ecospace',
    startTime: '07:30 AM',
    driver: 'Raju Das',
    vehicle: 'WB-19-5678',
    booked: 18,
    capacity: 22,
    boarded: 14,
    available: 4,
    status: 'Running',
    currentStop: 'CESC Limited - Taratala',
    nextStop: 'Nicco Park',
    delay: '+6 min',
  },
  {
    id: 'M-0800',
    type: 'Morning',
    route: 'ESI Hospital - Budge Budge → Ecospace',
    startTime: '08:00 AM',
    driver: 'Amit Shaw',
    vehicle: 'WB-20-7789',
    booked: 21,
    capacity: 22,
    boarded: 0,
    available: 1,
    status: 'Starts Soon',
    currentStop: '',
    nextStop: 'Bata More',
    delay: '',
  },
  {
    id: 'E-1820',
    type: 'Evening',
    route: 'Ecospace Entry Gate → ESI Hospital - Budge Budge',
    startTime: '06:20 PM',
    driver: 'Souvik Mondal',
    vehicle: 'WB-19-2506',
    booked: 19,
    capacity: 22,
    boarded: 0,
    available: 3,
    status: 'Ready',
    currentStop: '',
    nextStop: 'Ecospace Entry Gate',
    delay: '',
  },
];

const drivers = [
  { name: 'Raju Das', phone: '+91 98310 22045', status: 'Available', assignment: 'None', last: 'Last trip completed' },
  { name: 'Amit Shaw', phone: '+91 99031 77126', status: 'Available', assignment: 'Nearby', last: 'Reached Taratala depot' },
  { name: 'Souvik Mondal', phone: '+91 97480 11661', status: 'Already Assigned', assignment: 'Evening 06:20 PM', last: 'Unavailable' },
  { name: 'Milan Roy', phone: '+91 90515 33202', status: 'Offline', assignment: 'None', last: 'Offline for 18 min' },
];

const loginCandidates = [
  { name: 'Nirmal Paul', id: 'LOGIN-2281', phone: '+91 98301 77041', source: 'OTP login', status: 'Rider profile exists' },
  { name: 'Farhan Ali', id: 'LOGIN-2294', phone: '+91 89100 44219', source: 'OTP login', status: 'Ready to convert' },
  { name: 'Kabir Bose', id: 'LOGIN-2310', phone: '+91 90070 66213', source: 'Admin invite', status: 'Needs license' },
];

const issues = [
  { title: 'Driver not online', detail: 'Morning · Bata More → DLF 2', meta: 'Trip starts in 12 mins', priority: 'High', tone: 'amber' as Tone },
  { title: 'Negative pass balance', detail: '8 riders need regularization', meta: 'Pending Allocation queue', priority: 'Medium', tone: 'amber' as Tone },
  { title: 'QR/manual override used', detail: 'Sayan Das boarded at Jinjira Bazar', meta: 'Needs review', priority: 'Medium', tone: 'navy' as Tone },
  { title: 'Trip delayed', detail: 'Morning · ESI Hospital - Budge Budge → Ecospace', meta: '+6 min near Taratala', priority: 'Low', tone: 'green' as Tone },
];

type Trip = (typeof trips)[number];
type Rider = (typeof riders)[number];

const navItems: { key: AdminScreen; label: string; icon: Parameters<typeof Icon>[0]['name'] }[] = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'trips', label: 'Trips', icon: 'bus' },
  { key: 'passes', label: 'Passes', icon: 'coupon' },
  { key: 'riders', label: 'Riders', icon: 'users' },
  { key: 'issues', label: 'Issues', icon: 'alert' },
];

export function AdminPrototype() {
  const [screen, setScreen] = useState<AdminScreen>('home');
  const [tripMode, setTripMode] = useState<'Morning' | 'Evening'>('Morning');
  const [selectedTrip, setSelectedTrip] = useState(trips[1]);
  const [selectedRider, setSelectedRider] = useState(riders[0]);
  const [selectedDriver, setSelectedDriver] = useState('Amit Shaw');

  const visibleTrips = useMemo(() => trips.filter((trip) => trip.type === tripMode), [tripMode]);

  const openTrip = (trip = selectedTrip) => {
    setSelectedTrip(trip);
    setScreen('trip-details');
  };

  const openRider = (rider = selectedRider) => {
    setSelectedRider(rider);
    setScreen('rider-profile');
  };

  return (
    <div className="admin-stage">
      <main className="admin-shell">
        {screen === 'home' && <HomeScreen onNavigate={setScreen} onOpenTrip={openTrip} />}
        {screen === 'trips' && (
          <TripsScreen
            tripMode={tripMode}
            onTripMode={setTripMode}
            tripList={visibleTrips}
            onOpenTrip={openTrip}
            onNavigate={setScreen}
          />
        )}
        {screen === 'trip-details' && <TripDetailsScreen trip={selectedTrip} onNavigate={setScreen} />}
        {screen === 'assign-driver' && (
          <AssignDriverScreen
            trip={selectedTrip}
            selectedDriver={selectedDriver}
            onSelect={setSelectedDriver}
            onNavigate={setScreen}
          />
        )}
        {screen === 'change-time' && <ChangeTimeScreen trip={selectedTrip} onNavigate={setScreen} />}
        {screen === 'passes' && <PassesScreen onNavigate={setScreen} onOpenRider={openRider} />}
        {screen === 'assign-passes' && <AssignPassesScreen rider={selectedRider} onNavigate={setScreen} />}
        {screen === 'negative-riders' && <NegativePassRidersScreen onNavigate={setScreen} onOpenRider={openRider} />}
        {screen === 'riders' && <RiderSearchScreen onNavigate={setScreen} onOpenRider={openRider} />}
        {screen === 'rider-profile' && <RiderProfileScreen rider={selectedRider} onNavigate={setScreen} />}
        {screen === 'driver-logins' && <DriverLoginsScreen onNavigate={setScreen} />}
        {screen === 'issues' && <IssuesScreen onNavigate={setScreen} />}
        <AdminBottomNav active={screen} onNavigate={setScreen} />
      </main>
    </div>
  );
}

function AdminHeader({ title, greeting, onBack }: { title: string; greeting?: string; onBack?: () => void }) {
  return (
    <header className={`admin-header ${onBack ? 'admin-header--with-back' : 'admin-header--root'}`}>
      {onBack && <button className="admin-icon-button" onClick={onBack} aria-label="Back">‹</button>}
      <div>
        {greeting && <span>{greeting}</span>}
        <h1>{title}</h1>
      </div>
      <button className="admin-icon-button" aria-label="Search"><Icon name="search" /></button>
    </header>
  );
}

function HomeScreen({ onNavigate, onOpenTrip }: { onNavigate: (screen: AdminScreen) => void; onOpenTrip: (trip: Trip) => void }) {
  return (
    <section className="admin-page">
      <AdminHeader title="Home" greeting="Good morning, Admin" />
      <div className="admin-search"><Icon name="search" /><span>Search rider, driver, vehicle, issue</span></div>
      <div className="admin-metric-grid">
        {[
          ['Morning Trips', '4'],
          ['Evening Trips', '3'],
          ['Total Bookings', '126'],
          ['Active Riders', '122'],
          ['Negative Pass Riders', '8'],
          ['Issues', '5'],
        ].map(([label, value]) => <MetricCard key={label} label={label} value={value} />)}
      </div>
      <SectionTitle title="Today's Trips" action="View all" onTap={() => onNavigate('trips')} />
      {trips.slice(1, 4).map((trip) => <TripCard key={trip.id} trip={trip} compact onOpen={() => onOpenTrip(trip)} onNavigate={onNavigate} />)}
      <SectionTitle title="Urgent Issues" action="Open" onTap={() => onNavigate('issues')} />
      <div className="admin-card-stack">
        {issues.slice(0, 3).map((issue) => <IssueCard key={issue.title} issue={issue} onNavigate={onNavigate} />)}
      </div>
      <SectionTitle title="Quick Actions" />
      <div className="admin-action-grid">
        <QuickAction icon="coupon" label="Assign Pass" onClick={() => onNavigate('assign-passes')} />
        <QuickAction icon="search" label="Search Rider" onClick={() => onNavigate('riders')} />
        <QuickAction icon="edit" label="Convert Login" onClick={() => onNavigate('driver-logins')} />
        <QuickAction icon="bus" label="View Trips" onClick={() => onNavigate('trips')} />
        <QuickAction icon="alert" label="View Issues" onClick={() => onNavigate('issues')} />
      </div>
    </section>
  );
}

function TripsScreen({
  tripMode,
  onTripMode,
  tripList,
  onOpenTrip,
  onNavigate,
}: {
  tripMode: 'Morning' | 'Evening';
  onTripMode: (mode: 'Morning' | 'Evening') => void;
  tripList: Trip[];
  onOpenTrip: (trip: Trip) => void;
  onNavigate: (screen: AdminScreen) => void;
}) {
  return (
    <section className="admin-page">
      <AdminHeader title="Trips" />
      <div className="admin-segmented">
        {(['Morning', 'Evening'] as const).map((mode) => (
          <button key={mode} className={tripMode === mode ? 'is-active' : ''} onClick={() => onTripMode(mode)}>{mode}</button>
        ))}
      </div>
      <div className="admin-control-row">
        <button><Icon name="calendar" /> Today, 15 May</button>
        <button><Icon name="more" /> Filter</button>
      </div>
      <div className="admin-search admin-search--large"><Icon name="search" /><span>Search route, driver, vehicle, status</span></div>
      <div className="admin-strip-metrics">
        {[
          ['Total Trips', '4'],
          ['Running', '1'],
          ['Not Started', '2'],
          ['Completed', '1'],
          ['Needs Attention', '2'],
        ].map(([label, value]) => <MetricCard key={label} label={label} value={value} mini />)}
      </div>
      {tripList.map((trip) => <TripCard key={trip.id} trip={trip} onOpen={() => onOpenTrip(trip)} onNavigate={onNavigate} />)}
    </section>
  );
}

function TripDetailsScreen({ trip, onNavigate }: { trip: Trip; onNavigate: (screen: AdminScreen) => void }) {
  return (
    <section className="admin-page admin-page--sticky">
      <AdminHeader title="Trip Details" onBack={() => onNavigate('trips')} />
      <div className="admin-hero-card">
        <div className="admin-card-top">
          <span>{trip.type}</span>
          <StatusPill label={trip.status} tone={statusTone(trip.status)} />
        </div>
        <h2>{trip.route}</h2>
        <p>{stops.slice(0, 5).join(' · ')} · ... · Ecospace Entry Gate</p>
      </div>
      <InfoGrid
        items={[
          ['Start Time', trip.startTime],
          ['Driver', trip.driver === 'Not Assigned' ? 'Not Assigned' : 'Raju Das'],
          ['Vehicle', trip.vehicle],
          ['Capacity', '22 seats'],
          ['Bookings', `${trip.booked} / ${trip.capacity}`],
          ['Boarded', `${trip.boarded} / ${trip.capacity}`],
          ['Current Stop', trip.currentStop || 'Not started'],
          ['Next Stop', trip.nextStop],
          ['Delay', trip.delay || 'On time'],
          ['Status', trip.status],
        ]}
      />
      <div className="admin-action-grid admin-action-grid--three">
        <QuickAction icon="users" label="Assign Driver" onClick={() => onNavigate('assign-driver')} />
        <QuickAction icon="eta" label="Change Time" onClick={() => onNavigate('change-time')} />
        <QuickAction icon="support" label="Mark Issue" onClick={() => onNavigate('issues')} />
      </div>
      <SectionTitle title="Booked Riders" action="View all" />
      <div className="admin-card-stack">
        {[
          ['Ankit Sharma', 'Bata More', 'Booked'],
          ['Priya Singh', 'CESC Limited - Taratala', 'Waiting'],
          ['Rohit Verma', 'Nicco Park', 'Upcoming'],
        ].map(([name, stop, status]) => <MiniRow key={name} title={name} meta={`${stop} · ${status}`} />)}
      </div>
      <div className="admin-sticky-actions">
        <button><Icon name="phone" /> Call Driver</button>
        <button><Icon name="support" /> Message Riders</button>
        <button><Icon name="more" /> More</button>
      </div>
    </section>
  );
}

function AssignDriverScreen({
  trip,
  selectedDriver,
  onSelect,
  onNavigate,
}: {
  trip: Trip;
  selectedDriver: string;
  onSelect: (name: string) => void;
  onNavigate: (screen: AdminScreen) => void;
}) {
  const isReplacement = trip.driver !== 'Not Assigned';
  return (
    <section className="admin-page">
      <AdminHeader title="Assign Driver" onBack={() => onNavigate('trip-details')} />
      <TripSummary trip={trip} />
      <SectionTitle title={isReplacement ? 'Current Driver' : 'Current Driver'} />
      <div className="admin-card">
        <strong>{isReplacement ? trip.driver : 'Not Assigned'}</strong>
        <p>{isReplacement ? 'Available for replacement audit' : 'This trip needs a driver before start.'}</p>
      </div>
      <SectionTitle title="Drivers" />
      {drivers.map((driver) => {
        const disabled = driver.status !== 'Available';
        return (
          <div className={`admin-driver-card ${selectedDriver === driver.name ? 'is-selected' : ''} ${disabled ? 'is-disabled' : ''}`} key={driver.name}>
            <div>
              <strong>{driver.name}</strong>
              <span>{driver.phone}</span>
              <p>{driver.assignment} · {driver.last}</p>
            </div>
            <StatusPill label={driver.status} tone={driver.status === 'Available' ? 'green' : 'amber'} />
            <button className="admin-circle-button"><Icon name="phone" /></button>
            <button disabled={disabled} onClick={() => onSelect(driver.name)}>{selectedDriver === driver.name ? 'Selected' : 'Select'}</button>
          </div>
        );
      })}
      {isReplacement && (
        <>
          <SectionTitle title="Replacement Reason" />
          <div className="admin-select-card">
            <span>Driver delayed</span>
            <small>Required for audit log</small>
          </div>
          <InfoGrid items={[['Current Driver', trip.driver], ['New Driver', selectedDriver], ['Audit', 'Assignment log will be created']]} />
        </>
      )}
      <button className="admin-primary" onClick={() => onNavigate('trip-details')}>{isReplacement ? 'Replace Driver' : 'Assign Driver'}</button>
    </section>
  );
}

function ChangeTimeScreen({ trip, onNavigate }: { trip: Trip; onNavigate: (screen: AdminScreen) => void }) {
  return (
    <section className="admin-page">
      <AdminHeader title="Change Slot Timing" onBack={() => onNavigate('trip-details')} />
      <TripSummary trip={trip} />
      <InfoGrid items={[['Current Start Time', trip.startTime], ['New Start Time', '07:15 AM'], ['Reason', 'Traffic delay'], ['Notify riders', 'Yes'], ['Notify driver', 'Yes']]} />
      <SectionTitle title="Preview" />
      <div className="admin-preview-card">
        <MiniRow title="Old Time" meta={trip.startTime} />
        <MiniRow title="New Time" meta="07:15 AM" />
        <MiniRow title="Difference" meta="+15 minutes" />
        <MiniRow title="Affected riders" meta="18" />
        <MiniRow title="Assigned driver" meta={trip.driver === 'Not Assigned' ? 'Not assigned' : trip.driver} />
      </div>
      <div className="admin-rule-note">
        This changes only today's trip instance. Master schedules, route paths, and stop order stay with Superadmin Web.
      </div>
      <button className="admin-primary" onClick={() => onNavigate('trip-details')}>Confirm Time Change</button>
    </section>
  );
}

function PassesScreen({ onNavigate, onOpenRider }: { onNavigate: (screen: AdminScreen) => void; onOpenRider: (rider: Rider) => void }) {
  return (
    <section className="admin-page">
      <AdminHeader title="Passes" />
      <div className="admin-metric-grid admin-metric-grid--two">
        {[
          ['Active Riders', '122'],
          ['Zero Pass Riders', '14'],
          ['Negative Balance Riders', '8'],
          ['Expiring This Week', '11'],
        ].map(([label, value]) => <MetricCard key={label} label={label} value={value} />)}
      </div>
      <div className="admin-action-grid">
        <QuickAction icon="coupon" label="Assign Passes" onClick={() => onNavigate('assign-passes')} />
        <QuickAction icon="alert" label="Negative Queue" onClick={() => onNavigate('negative-riders')} />
      </div>
      <SectionTitle title="Negative Balance Queue" action="All" onTap={() => onNavigate('negative-riders')} />
      {riders.filter((rider) => rider.balance < 0).map((rider) => <RiderCard key={rider.id} rider={rider} onOpen={() => onOpenRider(rider)} onNavigate={onNavigate} />)}
      <SectionTitle title="Recent Pass Activity" />
      <div className="admin-card-stack">
        <MiniRow title="Monthly Allocation" meta="Priya Singh · +20 · Ledger entry created" />
        <MiniRow title="Regularization" meta="Rohit Verma · +20 · Final balance 17" />
      </div>
    </section>
  );
}

function AssignPassesScreen({ rider, onNavigate }: { rider: Rider; onNavigate: (screen: AdminScreen) => void }) {
  const add = 20;
  return (
    <section className="admin-page">
      <AdminHeader title="Assign Passes" onBack={() => onNavigate('passes')} />
      <div className="admin-profile-strip">
        <div className="admin-avatar">{initials(rider.name)}</div>
        <div>
          <strong>{rider.name}</strong>
          <span>{rider.id} · {rider.company}</span>
          <p>Current Balance: {rider.balance} passes</p>
        </div>
      </div>
      <InfoGrid
        items={[
          ['Passes to Add', `+${add}`],
          ['Validity Start Date', '15 May 2026'],
          ['Validity End Date', '30 Jun 2026'],
          ['Reason', rider.balance < 0 ? 'Regularization' : 'Monthly Allocation'],
          ['Notes', 'Admin adjustment after validation'],
        ]}
      />
      <SectionTitle title="Preview" />
      <div className="admin-preview-card admin-preview-card--orange">
        <MiniRow title="Current Balance" meta={`${rider.balance}`} />
        <MiniRow title="Passes Being Added" meta={`+${add}`} />
        <MiniRow title="Final Balance" meta={`${rider.balance + add}`} />
      </div>
      <div className="admin-rule-note">Negative balances are cleared first. Every assignment creates a ledger entry.</div>
      <button className="admin-primary" onClick={() => onNavigate('passes')}>Assign Passes</button>
    </section>
  );
}

function NegativePassRidersScreen({ onNavigate, onOpenRider }: { onNavigate: (screen: AdminScreen) => void; onOpenRider: (rider: Rider) => void }) {
  return (
    <section className="admin-page admin-page--sticky">
      <AdminHeader title="Negative Pass Riders" onBack={() => onNavigate('passes')} />
      <div className="admin-segmented admin-segmented--scroll">
        {['All', '-1 Only', '-2 or lower', 'Expired Validity'].map((tab, index) => <button key={tab} className={index === 0 ? 'is-active' : ''}>{tab}</button>)}
      </div>
      {riders.filter((rider) => rider.balance < 0).map((rider) => <RiderCard key={rider.id} rider={rider} onOpen={() => onOpenRider(rider)} onNavigate={onNavigate} />)}
      <div className="admin-rule-note">Bulk assignment is available here for simple mobile regularization. CSV upload stays on Superadmin Web.</div>
      <div className="admin-sticky-actions">
        <button>Select all</button>
        <button><Icon name="coupon" /> Bulk Assign Passes</button>
      </div>
    </section>
  );
}

function RiderSearchScreen({ onNavigate, onOpenRider }: { onNavigate: (screen: AdminScreen) => void; onOpenRider: (rider: Rider) => void }) {
  return (
    <section className="admin-page">
      <AdminHeader title="Riders" />
      <div className="admin-search admin-search--large"><Icon name="search" /><span>Search by name, phone, rider ID, pickup stop, route</span></div>
      {riders.map((rider) => <RiderCard key={rider.id} rider={rider} onOpen={() => onOpenRider(rider)} onNavigate={onNavigate} />)}
    </section>
  );
}

function RiderProfileScreen({ rider, onNavigate }: { rider: Rider; onNavigate: (screen: AdminScreen) => void }) {
  return (
    <section className="admin-page">
      <AdminHeader title="Rider Profile" onBack={() => onNavigate('riders')} />
      <div className="admin-profile-card">
        <div className="admin-avatar">{initials(rider.name)}</div>
        <h2>{rider.name}</h2>
        <p>{rider.id} · {rider.phone}</p>
        <StatusPill label={rider.balance < 0 ? 'Pending Allocation' : 'Active'} tone={rider.balance < 0 ? 'amber' : 'green'} />
      </div>
      <InfoGrid
        items={[
          ['Company / Department', `${rider.company} / ${rider.department}`],
          ['Default Route', 'ESI Hospital - Budge Budge → Ecospace'],
          ['Default Pickup', rider.pickup],
          ['Default Drop', rider.drop],
          ['Pass Balance', `${rider.balance}`],
          ['Pass Validity', rider.validity],
          ["Today's Booking", rider.booking],
          ['Last Ride', rider.lastRide],
        ]}
      />
      <div className="admin-action-grid admin-action-grid--three">
        <QuickAction icon="coupon" label="Assign Passes" onClick={() => onNavigate('assign-passes')} />
        <QuickAction icon="bus" label="Book Ride" onClick={() => undefined} />
        <QuickAction icon="alert" label="Cancel Booking" onClick={() => undefined} />
        <QuickAction icon="more" label="Ledger" onClick={() => undefined} />
        <QuickAction icon="edit" label="Edit Info" onClick={() => undefined} />
        <QuickAction icon="phone" label="Call Rider" onClick={() => undefined} />
      </div>
      <SectionTitle title="Book Ride Preview" />
      <div className="admin-preview-card">
        <MiniRow title="Trip" meta="Morning · ESI Hospital - Budge Budge → Ecospace" />
        <MiniRow title="Pickup / Drop" meta={`${rider.pickup} → ${rider.drop}`} />
        <MiniRow title="Current Pass Balance" meta="0" />
        <MiniRow title="After Booking" meta="-1" />
      </div>
      <div className="admin-rule-note">Booking is allowed at 0 passes. Balance becomes -1 and can be regularized later.</div>
    </section>
  );
}

function DriverLoginsScreen({ onNavigate }: { onNavigate: (screen: AdminScreen) => void }) {
  return (
    <section className="admin-page">
      <AdminHeader title="Convert Login" onBack={() => onNavigate('home')} />
      <div className="admin-rule-note">Riders are created automatically after first login. Admins can promote a verified login into a driver profile without creating a separate rider record.</div>
      <SectionTitle title="Recent Logins" />
      <div className="admin-card-stack">
        {loginCandidates.map((login) => (
          <article className="admin-rider-card" key={login.id}>
            <div className="admin-avatar">{initials(login.name)}</div>
            <div>
              <strong>{login.name}</strong>
              <span>{login.id} · {login.phone}</span>
              <p>{login.source} · {login.status}</p>
              <small>Driver setup will request license number, default vehicle, and availability.</small>
            </div>
            <div className="admin-card-actions admin-card-actions--inline">
              <button disabled={login.status !== 'Ready to convert'}>Convert to Driver</button>
              <button>View Login</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function IssuesScreen({ onNavigate }: { onNavigate: (screen: AdminScreen) => void }) {
  return (
    <section className="admin-page">
      <AdminHeader title="Issues" />
      <div className="admin-search"><Icon name="search" /><span>Search operational exceptions</span></div>
      {issues.map((issue) => <IssueCard key={issue.title} issue={issue} onNavigate={onNavigate} />)}
    </section>
  );
}

function TripCard({ trip, compact, onOpen, onNavigate }: { trip: Trip; compact?: boolean; onOpen: () => void; onNavigate: (screen: AdminScreen) => void }) {
  return (
    <article className="admin-trip-card">
      <div className="admin-card-top">
        <span>{trip.type} Trip</span>
        <StatusPill label={trip.status} tone={statusTone(trip.status)} />
      </div>
      <h2>{trip.route}</h2>
      <div className="admin-trip-meta">
        <span>Start Time: <b>{trip.startTime}</b></span>
        <span>Driver: <b>{trip.driver}</b></span>
        <span>Vehicle: <b>{trip.vehicle}</b></span>
        <span>Bookings: <b>{trip.booked} / {trip.capacity}</b></span>
        {!compact && <span>Boarded: <b>{trip.boarded}</b></span>}
        {!compact && <span>Available: <b>{trip.available}</b></span>}
        {trip.currentStop && <span>Current Stop: <b>{trip.currentStop}</b></span>}
        {trip.delay && <span>Delay: <b>{trip.delay}</b></span>}
      </div>
      <div className="admin-card-actions">
        {trip.driver === 'Not Assigned' && <button onClick={() => onNavigate('assign-driver')}>Assign Driver</button>}
        <button onClick={() => onNavigate('change-time')}>Change Time</button>
        <button onClick={onOpen}>Details</button>
        <button>View Riders</button>
      </div>
    </article>
  );
}

function RiderCard({ rider, onOpen, onNavigate }: { rider: Rider; onOpen: () => void; onNavigate: (screen: AdminScreen) => void }) {
  return (
    <article className="admin-rider-card">
      <div className="admin-avatar">{initials(rider.name)}</div>
      <div>
        <strong>{rider.name}</strong>
        <span>{rider.id} · {rider.company}</span>
        <p>{rider.phone} · {rider.pickup}</p>
        <small>{rider.booking} · Valid till {rider.validity}</small>
      </div>
      <StatusPill label={`Balance ${rider.balance}`} tone={rider.balance < 0 ? 'amber' : rider.balance === 0 ? 'muted' : 'green'} />
      <div className="admin-card-actions admin-card-actions--inline">
        <button onClick={onOpen}>Profile</button>
        <button>Call</button>
        <button onClick={() => onNavigate('assign-passes')}>Assign Passes</button>
      </div>
    </article>
  );
}

function IssueCard({ issue, onNavigate }: { issue: typeof issues[number]; onNavigate: (screen: AdminScreen) => void }) {
  return (
    <article className="admin-issue-card">
      <div>
        <div className="admin-card-top">
          <strong>{issue.title}</strong>
          <StatusPill label={issue.priority} tone={issue.tone} />
        </div>
        <p>{issue.detail}</p>
        <span>{issue.meta}</span>
      </div>
      <div className="admin-card-actions admin-card-actions--inline">
        {issue.title.includes('Driver') && <button>Call Driver</button>}
        {issue.title.includes('Driver') && <button onClick={() => onNavigate('assign-driver')}>Assign Driver</button>}
        {issue.title.includes('Negative') && <button onClick={() => onNavigate('negative-riders')}>View Riders</button>}
        <button>Mark Resolved</button>
      </div>
    </article>
  );
}

function AdminBottomNav({ active, onNavigate }: { active: AdminScreen; onNavigate: (screen: AdminScreen) => void }) {
  return (
    <nav className="admin-bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.key}
          className={active === item.key || (item.key === 'trips' && ['trip-details', 'assign-driver', 'change-time'].includes(active)) || (item.key === 'passes' && ['assign-passes', 'negative-riders'].includes(active)) || (item.key === 'riders' && ['rider-profile', 'driver-logins'].includes(active)) ? 'is-active' : ''}
          onClick={() => onNavigate(item.key)}
        >
          <Icon name={item.icon} />
          <small>{item.label}</small>
        </button>
      ))}
    </nav>
  );
}

function MetricCard({ label, value, mini }: { label: string; value: string; mini?: boolean }) {
  return (
    <div className={`admin-metric-card ${mini ? 'admin-metric-card--mini' : ''}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function SectionTitle({ title, action, onTap }: { title: string; action?: string; onTap?: () => void }) {
  return (
    <div className="admin-section-title">
      <h2>{title}</h2>
      {action && <button onClick={onTap}>{action}</button>}
    </div>
  );
}

function QuickAction({ icon, label, onClick }: { icon: Parameters<typeof Icon>[0]['name']; label: string; onClick: () => void }) {
  return (
    <button className="admin-quick-action" onClick={onClick}>
      <Icon name={icon} />
      <span>{label}</span>
    </button>
  );
}

function StatusPill({ label, tone }: { label: string; tone: Tone }) {
  return <span className={`admin-pill admin-pill--${tone}`}>{label}</span>;
}

function InfoGrid({ items }: { items: [string, string][] }) {
  return (
    <dl className="admin-info-grid">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function MiniRow({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="admin-mini-row">
      <strong>{title}</strong>
      <span>{meta}</span>
    </div>
  );
}

function TripSummary({ trip }: { trip: Trip }) {
  return (
    <div className="admin-card">
      <span className="admin-kicker">Trip summary</span>
      <h2>{trip.route}</h2>
      <p>{trip.type} · {trip.startTime} · Vehicle {trip.vehicle}</p>
    </div>
  );
}

function statusTone(status: string): Tone {
  if (['Running', 'Ready', 'Completed'].includes(status)) return 'green';
  if (['Needs Driver', 'Needs Vehicle', 'Delayed', 'Starts Soon'].includes(status)) return 'amber';
  if (['Cancelled'].includes(status)) return 'red';
  return 'muted';
}

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2);
}
