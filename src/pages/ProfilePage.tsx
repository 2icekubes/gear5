import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { stopById } from '../data/stops';
import { rider } from '../data/user';
import { useRideStore } from '../store/rideStore';

export function ProfilePage() {
  const rides = useRideStore((state) => state.packageRidesRemaining);

  return (
    <div className="page">
      <Header title="More" subtitle="Rider profile and app settings." />
      <section className="profile-card">
        <div className="avatar">AS</div>
        <h2>{rider.name}</h2>
        <p>{rider.company} · {rider.id}</p>
      </section>
      <section className="card">
        <dl className="receipt">
          <div><dt>Package rides</dt><dd>{rides}</dd></div>
          <div><dt>Seat limit</dt><dd>2 per booking</dd></div>
          <div><dt>Saved home</dt><dd>{stopById(rider.defaultPickupStopId).name}</dd></div>
          <div><dt>Saved office</dt><dd>{stopById(rider.defaultDropStopId).name}</dd></div>
        </dl>
      </section>
      <section className="list-card">
        <button className="menu-row">Edit route preferences<span>›</span></button>
        <button className="menu-row">Notification settings<span>›</span></button>
        <button className="menu-row">Ride history<span>›</span></button>
        <Link className="menu-row" to="/live">Support<span>›</span></Link>
      </section>
    </div>
  );
}
