import { Link } from 'react-router-dom';

export function RoleSwitchPage() {
  return (
    <main className="role-switch-stage">
      <section className="role-switch-panel">
        <div>
          <span className="role-switch-kicker">Gear5 Prototype</span>
          <h1>Choose a role</h1>
          <p>Rider, Driver, and mobile Admin are separate clickable prototypes.</p>
        </div>
        <div className="role-switch-actions">
          <Link to="/rider" className="role-card role-card--rider">
            <span>Rider</span>
            <strong>Booking prototype</strong>
            <small>Search, reserve, myRide, QR pass, live tracking</small>
          </Link>
          <Link to="/driver" className="role-card role-card--driver">
            <span>Driver</span>
            <strong>Operator prototype</strong>
            <small>Assigned trips, trip details, active trip console</small>
          </Link>
          <Link to="/admin" className="role-card role-card--admin">
            <span>Admin</span>
            <strong>Daily ops assistant</strong>
            <small>Trips, drivers, passes, riders, and exceptions</small>
          </Link>
          <Link to="/superadmin" className="role-card role-card--superadmin">
            <span>Superadmin Web</span>
            <strong>System control dashboard</strong>
            <small>Routes, schedules, master data, reports, roles, and settings</small>
          </Link>
        </div>
      </section>
    </main>
  );
}
