import { Header } from '../components/layout/Header';
import { useRideStore } from '../store/rideStore';

export function RidePackPage() {
  const rides = useRideStore((state) => state.packageRidesRemaining);

  return (
    <div className="page">
      <Header title="Ride Pack" subtitle="Admin-managed balance for Morning Rides." />
      <section className="balance-hero">
        <small>Available balance</small>
        <strong>{rides} of 15</strong>
        <span>rides</span>
        <p>Valid till 31 May 2026</p>
      </section>
    </div>
  );
}
