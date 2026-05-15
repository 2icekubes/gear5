import { type ReactNode, useMemo, useState } from 'react';
import { Icon } from '../components/common/Icon';

type SuperadminScreen =
  | 'dashboard'
  | 'routes'
  | 'route-builder'
  | 'schedules'
  | 'trips'
  | 'riders'
  | 'passes'
  | 'drivers'
  | 'vehicles'
  | 'bookings'
  | 'issues'
  | 'notifications'
  | 'reports'
  | 'admins'
  | 'settings';

type Tone = 'green' | 'amber' | 'red' | 'navy' | 'muted' | 'orange' | 'teal';

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

const routes = [
  {
    name: 'Morning: ESI Hospital - Budge Budge -> Ecospace',
    direction: 'ESI Hospital - Budge Budge -> Ecospace',
    type: 'Morning',
    start: 'ESI Hospital - Budge Budge',
    end: 'Ecospace Entry Gate',
    stops: 17,
    startTime: '07:00 AM',
    activeTrips: 4,
    status: 'Active',
    updated: '15 May 2026, 09:12 AM',
  },
  {
    name: 'Evening: Ecospace Entry Gate -> ESI Hospital - Budge Budge',
    direction: 'Ecospace Entry Gate -> ESI Hospital - Budge Budge',
    type: 'Evening',
    start: 'Ecospace Entry Gate',
    end: 'ESI Hospital - Budge Budge',
    stops: 17,
    startTime: '05:30 PM',
    activeTrips: 4,
    status: 'Active',
    updated: '15 May 2026, 09:20 AM',
  },
  {
    name: 'Bata More -> DLF 2',
    direction: 'Bata More -> DLF 2',
    type: 'Custom',
    start: 'Bata More',
    end: 'DLF 2',
    stops: 9,
    startTime: '07:30 AM',
    activeTrips: 1,
    status: 'Draft',
    updated: '14 May 2026, 04:48 PM',
  },
  {
    name: 'Taratala -> DLF 1',
    direction: 'CESC Limited - Taratala -> DLF 1',
    type: 'Custom',
    start: 'CESC Limited - Taratala',
    end: 'DLF 1',
    stops: 6,
    startTime: '08:00 AM',
    activeTrips: 1,
    status: 'Paused',
    updated: '12 May 2026, 11:03 AM',
  },
];

const schedules = [
  ['Morning Weekday Schedule', 'ESI Hospital - Budge Budge -> Ecospace', 'Morning', 'Mon-Fri', '07:00 AM', '30 min before', 'Force Traveller', '22', 'Active'],
  ['Evening Weekday Schedule', 'Ecospace Entry Gate -> ESI Hospital - Budge Budge', 'Evening', 'Mon-Fri', '05:30 PM', '30 min before', 'Force Traveller', '22', 'Active'],
  ['Bata More Express', 'Bata More -> DLF 2', 'Morning', 'Mon-Fri', '07:30 AM', '20 min before', 'Force Traveller', '20', 'Paused'],
  ['Taratala Shuttle', 'Taratala -> DLF 1', 'Morning', 'Tue-Thu', '08:00 AM', '30 min before', 'Force Traveller', '22', 'Draft'],
];

const trips = [
  ['TRP-M-0700', '15 May 2026', 'ESI Hospital - Budge Budge -> Ecospace', 'Morning', '07:00 AM', 'Raju Das', 'WB-19-1234', '22', '18', '14', 'Running', '+6 min'],
  ['TRP-M-0730', '15 May 2026', 'Bata More -> DLF 2', 'Morning', '07:30 AM', 'Amit Shaw', 'WB-02-7788', '20', '19', '0', 'Ready', 'On time'],
  ['TRP-M-0800', '15 May 2026', 'Taratala -> DLF 1', 'Morning', '08:00 AM', 'Unassigned', 'WB-11-5678', '22', '16', '0', 'Needs Driver', 'On time'],
  ['TRP-E-1730', '15 May 2026', 'Ecospace Entry Gate -> ESI Hospital - Budge Budge', 'Evening', '05:30 PM', 'Souvik Mondal', 'Unassigned', '22', '21', '0', 'Needs Vehicle', 'On time'],
  ['TRP-E-1800', '14 May 2026', 'Ecospace Entry Gate -> ESI Hospital - Budge Budge', 'Evening', '06:00 PM', 'Pradip Halder', 'WB-19-1234', '22', '20', '20', 'Completed', 'On time'],
];

const riders = [
  ['Rohit Verma', 'RID-1422', '+91 98745 11220', 'Wipro / Product Ops', 'Bata More', 'Ecospace Entry Gate', 'Morning Route', '-3', '30 Jun 2026', 'Active'],
  ['Priya Singh', 'RID-1187', '+91 98311 40587', 'DLF 2 / Finance', 'CESC Limited - Taratala', 'DLF 2', 'Bata More Express', '6', '30 Jun 2026', 'Active'],
  ['Ankit Sharma', 'RID-1064', '+91 90070 55142', 'TCS / Engineering', 'Bata More', 'TCS Geetanjali Bus Stop', 'Morning Route', '0', '30 Jun 2026', 'Active'],
  ['Suman Das', 'RID-1638', '+91 97481 99230', 'Ecospace / Support', 'Jinjira Bazar', 'Ecospace Entry Gate', 'Morning Route', '-1', '28 May 2026', 'Active'],
  ['Neha Agarwal', 'RID-1731', '+91 89102 33788', 'DLF 1 / HR', 'Jolkol', 'DLF 1', 'Taratala Shuttle', '12', '30 Jun 2026', 'Active'],
  ['Karan Mallick', 'RID-1804', '+91 98300 88116', 'Wipro / Admin', 'Sarkarpool', 'Wipro', 'Morning Route', '2', '24 May 2026', 'Blocked'],
];

const loginCandidates = [
  ['LOGIN-2281', 'Nirmal Paul', '+91 98301 77041', 'Rider', 'Created from first OTP login', 'Rider profile active'],
  ['LOGIN-2294', 'Farhan Ali', '+91 89100 44219', 'Driver candidate', 'Created from first OTP login', 'Ready to convert'],
  ['LOGIN-2310', 'Kabir Bose', '+91 90070 66213', 'Driver candidate', 'Admin invited', 'Needs license details'],
];

const passLedger = [
  ['15 May 2026', 'Rohit Verma', 'Superadmin Assigned', '+20', '17', 'REG-0515', 'Meera Sen', 'Regularization'],
  ['15 May 2026', 'Ankit Sharma', 'Ride Booked', '-1', '0', 'TRP-M-0730', 'System', 'Booking confirmed'],
  ['14 May 2026', 'Priya Singh', 'Cancelled Ride Credit', '+1', '6', 'TRP-E-1800', 'System', 'Before cutoff'],
  ['13 May 2026', 'Suman Das', 'Ride Booked', '-1', '-1', 'TRP-M-0700', 'System', 'Zero balance booking'],
];

const drivers = [
  ['Raju Das', '+91 98310 22045', 'WB-DL-44092', 'WB-19-1234', 'Assigned', 'On Trip', '1', '4.7', 'Active'],
  ['Amit Shaw', '+91 99031 77126', 'WB-DL-33018', 'WB-02-7788', 'Available', 'Ready', '1', '4.8', 'Active'],
  ['Souvik Mondal', '+91 97480 11661', 'WB-DL-77200', 'WB-11-5678', 'Assigned', 'Assigned', '1', '4.6', 'Active'],
  ['Pradip Halder', '+91 90515 33202', 'WB-DL-11940', 'Optional', 'Unavailable', 'Offline', '0', '4.4', 'Inactive'],
];

const vehicles = [
  ['WB-19-1234', 'Force Traveller', '22', 'Raju Das', '30 Sep 2026', 'On Trip', 'TRP-M-0700', 'Active'],
  ['WB-02-7788', 'Force Traveller', '20', 'Amit Shaw', '18 Aug 2026', 'Assigned', 'TRP-M-0730', 'Active'],
  ['WB-11-5678', 'Force Traveller', '22', 'Souvik Mondal', '07 Jun 2026', 'Available', '-', 'Active'],
];

const bookings = [
  ['BKG-10041', 'Rohit Verma', 'RID-1422', 'TRP-M-0700', 'Bata More', 'Ecospace Entry Gate', 'Boarded', '-2', '-3', '06:12 AM', '-', 'View'],
  ['BKG-10042', 'Priya Singh', 'RID-1187', 'TRP-M-0730', 'CESC Limited - Taratala', 'DLF 2', 'Confirmed', '7', '6', '06:20 AM', '-', 'View'],
  ['BKG-10043', 'Ankit Sharma', 'RID-1064', 'TRP-M-0730', 'Bata More', 'TCS Geetanjali Bus Stop', 'Admin Booked', '1', '0', '06:42 AM', '-', 'Audit'],
  ['BKG-10044', 'Suman Das', 'RID-1638', 'TRP-E-1730', 'Ecospace Entry Gate', 'Jinjira Bazar', 'Manual Override', '0', '-1', '11:05 AM', '-', 'Review'],
  ['BKG-10045', 'Neha Agarwal', 'RID-1731', 'TRP-E-1800', 'DLF 1', 'Jolkol', 'Cancelled', '12', '12', '10:14 AM', '03:20 PM', 'View'],
];

const issues = [
  ['ISS-2041', 'High', 'Vehicle missing', 'TRP-E-1730', '-', 'Souvik Mondal', 'Open', '15 May, 10:32 AM', 'Operations Admin'],
  ['ISS-2040', 'High', 'Driver not online', 'TRP-M-0800', '-', 'Unassigned', 'In Progress', '15 May, 07:44 AM', 'Trip Admin'],
  ['ISS-2037', 'Medium', 'Negative pass balance', '-', 'Rohit Verma', '-', 'Open', '15 May, 06:12 AM', 'Pass Admin'],
  ['ISS-2035', 'Medium', 'Manual override used', 'TRP-M-0700', 'Suman Das', 'Raju Das', 'Resolved', '14 May, 06:54 PM', 'Operations Admin'],
  ['ISS-2032', 'Low', 'Trip delayed', 'TRP-M-0700', '-', 'Raju Das', 'Open', '15 May, 07:18 AM', 'Operations Admin'],
];

const adminUsers = [
  ['Meera Sen', 'meera@gear5.example', 'Superadmin', 'All routes', 'Active', 'Today, 09:42 AM'],
  ['Arindam Roy', '+91 99030 11180', 'Operations Admin', 'Morning Route', 'Active', 'Today, 08:10 AM'],
  ['Puja Ghosh', 'puja@gear5.example', 'Pass Admin', 'All riders', 'Active', 'Yesterday, 06:15 PM'],
  ['Nikhil Jain', '+91 98112 70032', 'Read-only Admin', 'Reports', 'Inactive', '10 May 2026'],
];

const sidebar: { key: SuperadminScreen; label: string; icon: Parameters<typeof Icon>[0]['name'] }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'home' },
  { key: 'routes', label: 'Routes', icon: 'tracking' },
  { key: 'schedules', label: 'Schedules', icon: 'calendar' },
  { key: 'trips', label: 'Trips', icon: 'bus' },
  { key: 'riders', label: 'Riders', icon: 'users' },
  { key: 'passes', label: 'Passes', icon: 'coupon' },
  { key: 'drivers', label: 'Drivers', icon: 'phone' },
  { key: 'vehicles', label: 'Vehicles', icon: 'vehicle' },
  { key: 'bookings', label: 'Bookings', icon: 'qr' },
  { key: 'issues', label: 'Issues', icon: 'alert' },
  { key: 'notifications', label: 'Notifications', icon: 'support' },
  { key: 'reports', label: 'Reports', icon: 'eta' },
  { key: 'admins', label: 'Admin Users', icon: 'edit' },
  { key: 'settings', label: 'Settings', icon: 'more' },
];

export function SuperadminPrototype() {
  const [screen, setScreen] = useState<SuperadminScreen>('dashboard');
  const [passTab, setPassTab] = useState('Overview');

  const activeTitle = useMemo(() => sidebar.find((item) => item.key === screen)?.label || 'Superadmin', [screen]);

  return (
    <div className="superadmin-shell">
      <aside className="superadmin-sidebar">
        <div className="superadmin-brand">
          <span>G5</span>
          <div>
            <strong>Gear5</strong>
            <small>Superadmin Web</small>
          </div>
        </div>
        <nav className="superadmin-nav">
          {sidebar.map((item) => (
            <button
              key={item.key}
              className={screen === item.key || (screen === 'route-builder' && item.key === 'routes') ? 'is-active' : ''}
              onClick={() => setScreen(item.key)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="superadmin-sidebar-card">
          <span>System Status</span>
          <strong>Operational</strong>
          <small>5 open exceptions need review</small>
        </div>
      </aside>

      <main className="superadmin-main">
        <header className="superadmin-topbar">
          <div>
            <span>Commute operations control</span>
            <h1>{screen === 'dashboard' ? 'Superadmin Dashboard' : screen === 'route-builder' ? 'Route Detail / Route Builder' : activeTitle}</h1>
          </div>
          <div className="superadmin-topbar-actions">
            <label className="superadmin-search"><Icon name="search" /><input value="" readOnly placeholder="Search route, rider, trip, driver" /></label>
            <button className="superadmin-icon-button" aria-label="Audit log"><Icon name="eta" /></button>
            <button className="superadmin-primary"><Icon name="edit" /> Create</button>
          </div>
        </header>

        {screen === 'dashboard' && <Dashboard onNavigate={setScreen} />}
        {screen === 'routes' && <RoutesScreen onNavigate={setScreen} />}
        {screen === 'route-builder' && <RouteBuilder onNavigate={setScreen} />}
        {screen === 'schedules' && <SchedulesScreen />}
        {screen === 'trips' && <TripsScreen />}
        {screen === 'riders' && <RidersScreen />}
        {screen === 'passes' && <PassesScreen activeTab={passTab} onTab={setPassTab} />}
        {screen === 'drivers' && <DriversScreen />}
        {screen === 'vehicles' && <VehiclesScreen />}
        {screen === 'bookings' && <BookingsScreen />}
        {screen === 'issues' && <IssuesScreen />}
        {screen === 'notifications' && <NotificationsScreen />}
        {screen === 'reports' && <ReportsScreen />}
        {screen === 'admins' && <AdminUsersScreen />}
        {screen === 'settings' && <SettingsScreen />}
      </main>
    </div>
  );
}

function Dashboard({ onNavigate }: { onNavigate: (screen: SuperadminScreen) => void }) {
  return (
    <div className="superadmin-page">
      <MetricGrid
        items={[
          ['Today\'s Trips', '8', 'Running 3 / Not Started 3 / Completed 2', 'teal'],
          ['Active Routes', '4', '2 weekday master routes', 'green'],
          ['Active Riders', '126', '8 negative / 14 zero pass', 'orange'],
          ['Active Drivers', '4', '1 unavailable', 'green'],
          ['Active Vehicles', '3', '1 needs assignment', 'green'],
          ['Bookings Today', '126', 'Seat utilization 82%', 'teal'],
          ['Open Issues', '5', '2 high priority', 'amber'],
          ['Manual Overrides', '3', 'Audit review pending', 'amber'],
        ]}
      />
      <div className="superadmin-grid superadmin-grid--two">
        <Panel title="Today\'s Operations Overview" action="View trips" onAction={() => onNavigate('trips')}>
          <div className="ops-timeline">
            {trips.slice(0, 4).map((trip) => (
              <div key={trip[0]}>
                <b>{trip[4]}</b>
                <span>{trip[2]}</span>
                <Pill label={trip[10]} tone={toneForStatus(trip[10])} />
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Route Health" action="Open routes" onAction={() => onNavigate('routes')}>
          <RouteHealth />
        </Panel>
      </div>
      <div className="superadmin-grid superadmin-grid--three">
        <Panel title="Pass & Entitlement Summary" action="Manage passes" onAction={() => onNavigate('passes')}>
          <MiniStats stats={[['Negative riders', '8'], ['Zero pass riders', '14'], ['Expiring this week', '11']]} />
        </Panel>
        <Panel title="Driver/Vehicle Readiness" action="Review fleet" onAction={() => onNavigate('vehicles')}>
          <MiniStats stats={[['Drivers available', '2'], ['Vehicles ready', '2'], ['Conflicts', '1']]} />
        </Panel>
        <Panel title="Open Exceptions" action="Open center" onAction={() => onNavigate('issues')}>
          <div className="superadmin-list">
            {issues.slice(0, 3).map((issue) => <MiniLine key={issue[0]} title={`${issue[1]} - ${issue[2]}`} meta={`${issue[0]} / ${issue[6]}`} />)}
          </div>
        </Panel>
      </div>
      <Panel title="Quick Actions">
        <div className="quick-action-row">
          {[
            ['Create Route', 'routes'],
            ['Create Schedule', 'schedules'],
            ['Review New Logins', 'riders'],
            ['Complete Rider Profiles', 'riders'],
            ['Convert Login to Driver', 'drivers'],
            ['Add Vehicle', 'vehicles'],
            ['Bulk Assign Passes', 'passes'],
          ].map(([label, target]) => <button key={label} onClick={() => onNavigate(target as SuperadminScreen)}>{label}</button>)}
        </div>
      </Panel>
    </div>
  );
}

function RoutesScreen({ onNavigate }: { onNavigate: (screen: SuperadminScreen) => void }) {
  return (
    <div className="superadmin-page">
      <Toolbar chips={['All statuses', 'Morning', 'Evening', 'Has active trips']} primary="Create Route" />
      <DataTable
        columns={['Route Name', 'Direction', 'Stops', 'Default Start Time', 'Active Trips', 'Status', 'Last Updated', 'Actions']}
        rows={routes.map((route) => [
          route.name,
          route.direction,
          `${route.stops}`,
          route.startTime,
          `${route.activeTrips}`,
          <Pill label={route.status} tone={route.status === 'Active' ? 'green' : route.status === 'Draft' ? 'amber' : 'muted'} />,
          route.updated,
          <ActionSet actions={['View Route', 'Edit Route', 'Duplicate', 'Deactivate']} onFirst={() => onNavigate('route-builder')} />,
        ])}
      />
      <div className="superadmin-drawer">
        <div>
          <span>Master route control</span>
          <h2>Only Superadmin Web can reorder stops or change route master data.</h2>
        </div>
        <Pill label="Mobile Admin locked" tone="navy" />
      </div>
    </div>
  );
}

function RouteBuilder({ onNavigate }: { onNavigate: (screen: SuperadminScreen) => void }) {
  return (
    <div className="superadmin-page">
      <div className="builder-header">
        <button className="superadmin-secondary" onClick={() => onNavigate('routes')}>Back to Routes</button>
        <div>
          <span>Route Type: Morning / Status: Active</span>
          <h2>ESI Hospital - Budge Budge {'->'} Ecospace</h2>
        </div>
        <button className="superadmin-primary">Save Route</button>
      </div>
      <div className="superadmin-grid builder-layout">
        <Panel title="Linear Stop Sequence" action="Duplicate as evening reverse">
          <div className="route-line-panel">
            {stops.map((stop, index) => (
              <div className="stop-node" key={stop}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{stop}</strong>
                  <small>{pickupTime(index)} / Active / Geofence 120m</small>
                </div>
                <button>Drag</button>
              </div>
            ))}
          </div>
        </Panel>
        <aside className="builder-side">
          <Panel title="Route Details">
            <InfoList
              items={[
                ['Default Start Point', 'ESI Hospital - Budge Budge'],
                ['Default End Point', 'Ecospace Entry Gate'],
                ['Number of Stops', '17'],
                ['Default Start Time', '07:00 AM'],
                ['Direction', 'Morning commute'],
              ]}
            />
          </Panel>
          <Panel title="Builder Warnings">
            <WarningList warnings={['Pickup timings are sequential', 'Route has at least two active stops', 'No duplicate stop detected']} />
          </Panel>
          <Panel title="Stop Actions">
            <div className="side-action-grid">
              {['Add stop', 'Edit stop', 'Remove stop', 'Disable stop', 'Add landmark note', 'Set geofence radius'].map((action) => <button key={action}>{action}</button>)}
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function SchedulesScreen() {
  return (
    <div className="superadmin-page">
      <Toolbar chips={['Route active', 'Mon-Fri', 'Morning', 'Evening']} primary="Create Schedule" />
      <DataTable
        columns={['Schedule Name', 'Route', 'Trip Type', 'Days Active', 'Start Time', 'Booking Cutoff', 'Vehicle Type', 'Capacity', 'Status', 'Actions']}
        rows={schedules.map((row) => [...row.slice(0, 8), <Pill label={row[8]} tone={row[8] === 'Active' ? 'green' : row[8] === 'Paused' ? 'amber' : 'muted'} />, <ActionSet actions={['Edit', 'Pause', 'Duplicate', 'Generate Trips', 'Preview']} />])}
      />
      <div className="superadmin-grid superadmin-grid--two">
        <FormPreview title="Create/Edit Schedule" fields={['Schedule Name', 'Route', 'Trip Type', 'Days of Week', 'Start Time', 'Booking Cutoff', 'Cancellation Cutoff', 'Default Capacity', 'Default Driver optional', 'Default Vehicle optional', 'Active from date', 'Active till date optional', 'Status']} />
        <Panel title="Validation Rules">
          <WarningList warnings={['Route must be active', 'Cutoff cannot be after trip start time', 'Warn if driver or vehicle has conflict', 'Warn if schedule overlaps another schedule']} />
        </Panel>
      </div>
    </div>
  );
}

function TripsScreen() {
  return (
    <div className="superadmin-page">
      <Toolbar chips={['Date range', 'Route', 'Morning / Evening', 'Driver', 'Vehicle', 'Status', 'Needs Attention']} primary="Generate Trips" />
      <DataTable
        columns={['Trip ID', 'Date', 'Route', 'Trip Type', 'Start Time', 'Driver', 'Vehicle', 'Capacity', 'Booked', 'Boarded', 'Status', 'Delay', 'Actions']}
        rows={trips.map((row) => [...row.slice(0, 10), <Pill label={row[10]} tone={toneForStatus(row[10])} />, row[11], <ActionSet actions={['View details', 'Assign driver', 'Assign vehicle', 'Change timing', 'Cancel', 'Audit log']} />])}
      />
      <Panel title="Timing Change Scope">
        <div className="scope-row">
          {['This trip only', 'This and future generated trips', 'Entire recurring schedule'].map((scope) => <button key={scope}>{scope}</button>)}
        </div>
      </Panel>
    </div>
  );
}

function RidersScreen() {
  return (
    <div className="superadmin-page">
      <Toolbar chips={['Active / Inactive / Blocked', 'Route', 'Pickup stop', 'Department', 'Negative balance', 'Expiring validity']} primary="Review New Logins" />
      <DataTable
        columns={['Rider Name', 'Rider ID', 'Phone', 'Company / Department', 'Default Pickup', 'Default Drop', 'Default Route', 'Pass Balance', 'Validity', 'Status', 'Actions']}
        rows={riders.map((row) => [...row.slice(0, 7), <Pill label={row[7]} tone={Number(row[7]) < 0 ? 'amber' : Number(row[7]) === 0 ? 'muted' : 'green'} />, row[8], <Pill label={row[9]} tone={row[9] === 'Active' ? 'green' : 'red'} />, <ActionSet actions={['Edit', 'Deactivate', 'Block', 'Assign passes', 'Ledger', 'History']} />])}
      />
      <div className="superadmin-grid superadmin-grid--two">
        <FormPreview title="Complete Login-Created Rider Profile" fields={['Rider ID', 'Name', 'Phone', 'Email optional', 'Company', 'Department', 'Default route', 'Default pickup stop', 'Default drop stop', 'Status', 'Notes']} />
        <Panel title="New Login Review">
          <MiniLine title="Riders are not manually created" meta="First login creates the base rider identity; admins complete route, company, and pass details." />
          <DataTable compact columns={['Login ID', 'Name', 'Phone', 'Role Intent', 'Status']} rows={loginCandidates.map((login) => [login[0], login[1], login[2], login[3], login[5]])} />
        </Panel>
      </div>
    </div>
  );
}

function PassesScreen({ activeTab, onTab }: { activeTab: string; onTab: (tab: string) => void }) {
  const tabs = ['Overview', 'Assign Passes', 'Bulk Assign', 'Negative Balance', 'Expiring Passes', 'Ledger'];
  return (
    <div className="superadmin-page">
      <div className="superadmin-tabs">
        {tabs.map((tab) => <button key={tab} className={tab === activeTab ? 'is-active' : ''} onClick={() => onTab(tab)}>{tab}</button>)}
      </div>
      <MetricGrid items={[['Total Active Riders', '126', 'Eligible for allocation', 'teal'], ['Passes Assigned', '2,480', 'This cycle', 'green'], ['Zero Pass Riders', '14', 'Booking still allowed', 'muted'], ['Negative Balance Riders', '8', 'Pending Allocation', 'amber'], ['Expiring This Week', '11', 'Validity warning', 'amber'], ['Expired Pass Riders', '6', 'Review required', 'red']]} />
      {activeTab === 'Ledger' ? (
        <DataTable columns={['Date', 'Rider', 'Type', 'Quantity', 'Balance After', 'Trip Reference', 'Added By', 'Remarks']} rows={passLedger} />
      ) : activeTab === 'Negative Balance' ? (
        <DataTable columns={['Rider', 'Rider ID', 'Balance', 'Last Ride Date', 'Validity Status', 'Default Route', 'Actions']} rows={riders.filter((rider) => Number(rider[7]) < 0).map((rider) => [rider[0], rider[1], <Pill label={rider[7]} tone="amber" />, '15 May 2026', 'Valid', rider[6], <ActionSet actions={['Assign passes', 'View ledger']} />])} />
      ) : (
        <div className="superadmin-grid superadmin-grid--two">
          <Panel title="Assign Passes Form">
            <InfoList items={[['Search rider', 'Rohit Verma / RID-1422'], ['Current balance', '-3'], ['Pass quantity', '+20'], ['Validity start', '15 May 2026'], ['Validity end', '30 Jun 2026'], ['Reason', 'Regularization'], ['Preview final balance', '17']]} />
          </Panel>
          <Panel title="Pass Overview">
            <DataTable compact columns={['Rider', 'Balance', 'Validity End', 'Last Assigned By']} rows={riders.slice(0, 5).map((rider) => [rider[0], rider[7], rider[8], 'Meera Sen'])} />
          </Panel>
        </div>
      )}
      <div className="superadmin-rule-note">No payment terms are used. Pass assignment first offsets negative balance and every change creates a ledger entry.</div>
    </div>
  );
}

function DriversScreen() {
  return (
    <div className="superadmin-page">
      <Toolbar chips={['Available', 'Assigned', 'On Trip', 'Offline', 'Unavailable', 'Inactive']} primary="Convert Login to Driver" />
      <DataTable columns={['Driver Name', 'Phone', 'License No.', 'Assigned Vehicle', 'Availability', 'Current Status', 'Active Trips', 'Rating', 'Status', 'Actions']} rows={drivers.map((row) => [...row.slice(0, 4), <Pill label={row[4]} tone={row[4] === 'Available' ? 'green' : row[4] === 'Unavailable' ? 'red' : 'amber'} />, row[5], row[6], row[7], <Pill label={row[8]} tone={row[8] === 'Active' ? 'green' : 'muted'} />, <ActionSet actions={['Edit', 'Deactivate', 'Default vehicle', 'Trip history', 'Issues', 'Call']} />])} />
      <div className="superadmin-grid superadmin-grid--two">
        <FormPreview title="Convert Login to Driver" fields={['Login ID', 'Name', 'Phone', 'Alternate phone', 'License number', 'License validity', 'Address optional', 'Default vehicle optional', 'Status', 'Notes']} />
        <Panel title="Eligible Logins">
          <DataTable compact columns={['Login ID', 'Name', 'Phone', 'Source', 'Status']} rows={loginCandidates.filter((login) => login[3] === 'Driver candidate').map((login) => [login[0], login[1], login[2], login[4], login[5]])} />
        </Panel>
      </div>
    </div>
  );
}

function VehiclesScreen() {
  return (
    <div className="superadmin-page">
      <Toolbar chips={['Available', 'Assigned', 'On Trip', 'Maintenance', 'Inactive']} primary="Add Vehicle" />
      <DataTable columns={['Vehicle Number', 'Vehicle Type', 'Capacity', 'Assigned Driver', 'Fitness/Permit Validity', 'Current Status', 'Active Trip', 'Status', 'Actions']} rows={vehicles.map((row) => [...row.slice(0, 5), <Pill label={row[5]} tone={row[5] === 'Available' ? 'green' : row[5] === 'On Trip' ? 'teal' : 'amber'} />, row[6], <Pill label={row[7]} tone="green" />, <ActionSet actions={['Edit', 'Deactivate', 'Assign driver', 'Trip history', 'Documents']} />])} />
      <FormPreview title="Create/Edit Vehicle" fields={['Vehicle number', 'Vehicle type', 'Seating capacity', 'Default driver optional', 'Permit validity', 'Insurance validity', 'Fitness validity', 'Status', 'Notes']} />
    </div>
  );
}

function BookingsScreen() {
  return (
    <div className="superadmin-page">
      <Toolbar chips={['Date', 'Route', 'Trip type', 'Rider', 'Stop', 'Booking status', 'Pass impact', 'Driver', 'Vehicle']} primary="Export" />
      <DataTable columns={['Booking ID', 'Rider', 'Rider ID', 'Trip', 'Pickup', 'Drop', 'Booking Status', 'Pass Before', 'Pass After', 'Booking Time', 'Cancelled Time', 'Actions']} rows={bookings.map((row) => [...row.slice(0, 6), <Pill label={row[6]} tone={toneForStatus(row[6])} />, ...row.slice(7, 11), <ActionSet actions={['View booking', 'Cancel', 'View rider', 'View trip', 'Export']} />])} />
      <Panel title="Booking Detail Preview">
        <InfoList items={[['Rider', 'Suman Das'], ['Trip', 'TRP-E-1730'], ['Pass transaction', '0 -> -1'], ['QR / boarding status', 'Manual override'], ['Audit trail', 'Driver override used, reason recorded']]} />
      </Panel>
    </div>
  );
}

function IssuesScreen() {
  return (
    <div className="superadmin-page">
      <Toolbar chips={['High', 'Medium', 'Low', 'Open', 'In Progress', 'Resolved', 'Dismissed']} primary="Assign to Admin" />
      <DataTable columns={['Issue ID', 'Priority', 'Type', 'Related Trip', 'Related Rider', 'Related Driver', 'Status', 'Created Time', 'Assigned To', 'Actions']} rows={issues.map((row) => [row[0], <Pill label={row[1]} tone={row[1] === 'High' ? 'red' : row[1] === 'Medium' ? 'amber' : 'muted'} />, ...row.slice(2, 6), <Pill label={row[6]} tone={toneForStatus(row[6])} />, row[7], row[8], <ActionSet actions={['View details', 'Assign', 'Mark resolved', 'Add note']} />])} />
      <Panel title="Issue Timeline / Audit Log">
        <div className="audit-list">
          <MiniLine title="10:32 AM - Vehicle missing" meta="TRP-E-1730 generated a Needs Vehicle exception" />
          <MiniLine title="10:34 AM - Assigned to Operations Admin" meta="Meera Sen assigned follow-up" />
          <MiniLine title="10:40 AM - Note added" meta="Vehicle WB-11-5678 may be released from maintenance" />
        </div>
      </Panel>
    </div>
  );
}

function NotificationsScreen() {
  return (
    <div className="superadmin-page">
      <div className="superadmin-grid superadmin-grid--two">
        <Panel title="Create Notification">
          <InfoList items={[['Audience', 'Riders by route'], ['Route', 'ESI Hospital - Budge Budge -> Ecospace'], ['Trip', 'TRP-M-0700'], ['Stop', 'Bata More'], ['Message title', 'Pickup time changed'], ['Delivery channel', 'App push placeholder'], ['Send mode', 'Send now']]} />
          <button className="superadmin-primary full-width">Send Broadcast</button>
        </Panel>
        <Panel title="Templates">
          <div className="template-grid">
            {['Trip delayed', 'Vehicle changed', 'Driver changed', 'Pickup time changed', 'Trip cancelled', 'Please reach stop early'].map((template) => <button key={template}>{template}</button>)}
          </div>
        </Panel>
      </div>
      <DataTable columns={['Date', 'Audience', 'Message', 'Sent By', 'Delivery Status']} rows={[['15 May, 07:12 AM', 'Riders by trip', 'Trip delayed by 6 minutes', 'Meera Sen', 'Delivered'], ['14 May, 05:02 PM', 'Drivers', 'Evening slot starts at 05:30 PM', 'Arindam Roy', 'Delivered'], ['13 May, 04:20 PM', 'All riders', 'Please reach stop early', 'Meera Sen', 'Scheduled']]} />
    </div>
  );
}

function ReportsScreen() {
  return (
    <div className="superadmin-page">
      <Toolbar chips={['Date range', 'Route', 'Trip type', 'Driver', 'Vehicle', 'Department']} primary="Export CSV" secondary="Export PDF" />
      <div className="report-grid">
        {['Trip Utilization', 'Route Utilization', 'Rider Usage', 'Pass Usage', 'Negative Balance Report', 'No-show Report', 'Driver Performance', 'Vehicle Utilization', 'Manual Override Report', 'Cancellation Report'].map((report, index) => (
          <article className="report-card" key={report}>
            <span>{report}</span>
            <strong>{index % 3 === 0 ? '82%' : index % 3 === 1 ? '126' : '8'}</strong>
            <div className="bar-chart"><i style={{ height: '48%' }} /><i style={{ height: '72%' }} /><i style={{ height: '58%' }} /><i style={{ height: '86%' }} /><i style={{ height: '63%' }} /></div>
          </article>
        ))}
      </div>
    </div>
  );
}

function AdminUsersScreen() {
  const permissions = ['View trips', 'Assign driver', 'Change today\'s slot timing', 'Assign passes', 'Bulk assign passes', 'Book for rider', 'Cancel rider booking', 'Manage routes', 'Manage schedules', 'Manage riders', 'Manage drivers', 'Manage vehicles', 'View reports', 'Export data'];
  return (
    <div className="superadmin-page">
      <Toolbar chips={['Superadmin', 'Operations Admin', 'Pass Admin', 'Trip Admin', 'Read-only Admin']} primary="Add Admin" />
      <DataTable columns={['Name', 'Phone/Email', 'Role', 'Assigned Route/Region', 'Status', 'Last Login', 'Actions']} rows={adminUsers.map((row) => [...row.slice(0, 4), <Pill label={row[4]} tone={row[4] === 'Active' ? 'green' : 'muted'} />, row[5], <ActionSet actions={['Edit', 'Permissions', 'Deactivate']} />])} />
      <Panel title="Permissions Matrix">
        <div className="permission-grid">
          {permissions.map((permission, index) => (
            <label key={permission}>
              <input type="checkbox" checked={index < 7 || index > 11} readOnly />
              <span>{permission}</span>
            </label>
          ))}
        </div>
      </Panel>
      <div className="superadmin-rule-note">Operations Admin on mobile can manage daily operations. Only Superadmin can edit master data and recurring schedules.</div>
    </div>
  );
}

function SettingsScreen() {
  return (
    <div className="superadmin-page">
      <div className="settings-grid">
        <SettingsPanel title="Booking Settings" items={['Booking cutoff before trip start: 30 minutes', 'Cancellation cutoff: 20 minutes', 'Allow booking with zero passes: Yes', 'Allow negative pass balance: Yes', 'Maximum negative balance: 5']} />
        <SettingsPanel title="Pass Settings" items={['Default monthly pass count: 20', 'Default validity period: Calendar month', 'Expiry behavior: Mark expired', 'Expired passes can be used: No', 'Negative balance regularization: Offset first']} />
        <SettingsPanel title="Trip Settings" items={['Allow admin to change today\'s trip time: Yes', 'Allow admin to replace driver: Yes', 'Require reason for driver replacement: Yes', 'Require reason for time change: Yes', 'Notify riders when trip time changes: Yes']} />
        <SettingsPanel title="Notification Settings" items={['Default templates enabled', 'Reminder timing: 20 minutes before start', 'Driver reminder: 30 minutes before start']} />
        <SettingsPanel title="Security Settings" items={['Role permissions: Matrix controlled', 'Audit log retention: 365 days placeholder', 'Settings changes create audit log']} />
      </div>
    </div>
  );
}

function MetricGrid({ items }: { items: [string, string, string, string][] }) {
  return (
    <div className="metric-grid">
      {items.map(([label, value, meta, tone]) => (
        <article className="metric-card" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
          <small>{meta}</small>
          <i className={`metric-card__mark metric-card__mark--${tone}`} />
        </article>
      ))}
    </div>
  );
}

function Panel({ title, action, onAction, children }: { title: string; action?: string; onAction?: () => void; children: ReactNode }) {
  return (
    <section className="superadmin-panel">
      <div className="panel-heading-row">
        <h2>{title}</h2>
        {action && <button onClick={onAction}>{action}</button>}
      </div>
      {children}
    </section>
  );
}

function DataTable({ columns, rows, compact }: { columns: string[]; rows: React.ReactNode[][]; compact?: boolean }) {
  return (
    <div className={`data-table-wrap ${compact ? 'is-compact' : ''}`}>
      <table className="data-table">
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Toolbar({ chips, primary, secondary }: { chips: string[]; primary: string; secondary?: string }) {
  return (
    <div className="superadmin-toolbar">
      <div>{chips.map((chip) => <button key={chip}>{chip}</button>)}</div>
      <span>
        {secondary && <button className="superadmin-secondary">{secondary}</button>}
        <button className="superadmin-primary">{primary}</button>
      </span>
    </div>
  );
}

function Pill({ label, tone }: { label: string; tone: Tone }) {
  return <span className={`superadmin-pill superadmin-pill--${tone}`}>{label}</span>;
}

function ActionSet({ actions, onFirst }: { actions: string[]; onFirst?: () => void }) {
  return (
    <div className="action-set">
      {actions.slice(0, 3).map((action, index) => <button key={action} onClick={index === 0 ? onFirst : undefined}>{action}</button>)}
      {actions.length > 3 && <button>More</button>}
    </div>
  );
}

function InfoList({ items }: { items: [string, string][] }) {
  return (
    <dl className="info-list">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function FormPreview({ title, fields }: { title: string; fields: string[] }) {
  return (
    <Panel title={title}>
      <div className="form-preview">
        {fields.map((field) => <label key={field}><span>{field}</span><input readOnly value="" /></label>)}
      </div>
    </Panel>
  );
}

function SettingsPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <Panel title={title}>
      <div className="settings-list">
        {items.map((item) => <label key={item}><input type="checkbox" checked readOnly /><span>{item}</span></label>)}
      </div>
    </Panel>
  );
}

function RouteHealth() {
  return (
    <div className="route-health">
      {routes.map((route, index) => (
        <div key={route.name}>
          <span>{route.direction}</span>
          <b>{index === 0 ? '96%' : index === 1 ? '91%' : index === 2 ? '78%' : 'Paused'}</b>
          <i style={{ width: index === 3 ? '34%' : `${96 - index * 9}%` }} />
        </div>
      ))}
    </div>
  );
}

function MiniStats({ stats }: { stats: [string, string][] }) {
  return <div className="mini-stat-grid">{stats.map(([label, value]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>;
}

function MiniLine({ title, meta }: { title: string; meta: string }) {
  return <div className="mini-line"><strong>{title}</strong><span>{meta}</span></div>;
}

function WarningList({ warnings }: { warnings: string[] }) {
  return <div className="warning-list">{warnings.map((warning, index) => <div key={warning}><Pill label={index === 0 ? 'Rule' : 'Check'} tone={index === 0 ? 'amber' : 'green'} /><span>{warning}</span></div>)}</div>;
}

function pickupTime(index: number) {
  const minutes = 7 * 60 + index * 5;
  const hour = Math.floor(minutes / 60);
  const minute = String(minutes % 60).padStart(2, '0');
  return `${String(hour).padStart(2, '0')}:${minute} AM`;
}

function toneForStatus(status: string): Tone {
  if (['Running', 'Ready', 'Completed', 'Active', 'Resolved', 'Confirmed', 'Boarded', 'Delivered'].includes(status)) return 'green';
  if (['Needs Driver', 'Needs Vehicle', 'Delayed', 'Open', 'In Progress', 'Manual Override', 'Admin Booked', 'Scheduled'].includes(status)) return 'amber';
  if (['Cancelled', 'High', 'Blocked'].includes(status)) return 'red';
  if (['On Trip'].includes(status)) return 'teal';
  return 'muted';
}
