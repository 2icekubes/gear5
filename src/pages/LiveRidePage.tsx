import { Header } from '../components/layout/Header';

export function LiveRidePage() {
  return (
    <div className="page">
      <Header title="Support" subtitle="Live tracking and support surfaces are placeholders." />
      <section className="map-placeholder">
        <div className="route-line" />
        <span className="pin pin--start" />
        <span className="pin pin--end" />
      </section>
      <section className="card copy-card">
        <h2>Need help?</h2>
        <p>Driver contact, chat support, shuttle location, and next-stop updates will connect here once backend services are available.</p>
      </section>
    </div>
  );
}
