import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AppButton } from '../components/common/AppButton';
import { Header } from '../components/layout/Header';
import { stops } from '../data/stops';
import { rider } from '../data/user';
import { useRideStore } from '../store/rideStore';

export function SearchPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const field = params.get('field') === 'drop' ? 'drop' : 'pickup';
  const [query, setQuery] = useState('');
  const { setPickup, setDrop } = useRideStore();

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = stops.filter((stop) => !normalized || `${stop.name} ${stop.area} ${stop.landmark}`.toLowerCase().includes(normalized));
    return normalized ? matches : matches.slice(0, 25);
  }, [query]);

  const chooseStop = (stopId: string) => {
    if (field === 'pickup') setPickup(stopId);
    else setDrop(stopId);
    navigate('/rider');
  };

  return (
    <div className="page page--with-sticky">
      <Header title={`Choose ${field}`} subtitle="Search stops by name." backTo="/rider" />
      <input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search stop" autoFocus />
      <div className="quick-actions">
        <button onClick={() => chooseStop(rider.defaultPickupStopId)}>Saved Home</button>
        <button onClick={() => chooseStop(rider.defaultDropStopId)}>Saved Office</button>
      </div>
      <section className="list-card">
        {results.map((stop) => (
          <button key={stop.id} className="stop-row" onClick={() => chooseStop(stop.id)}>
            <span className={`stop-kind stop-kind--${stop.kind}`} />
            <div>
              <strong>{stop.name}</strong>
              <p>{[stop.area, stop.morningTime ? `Morning ${stop.morningTime}` : null].filter(Boolean).join(' · ')}</p>
            </div>
          </button>
        ))}
      </section>
      <div className="sticky-action">
        <Link to="/rides">
          <AppButton>Search rides</AppButton>
        </Link>
      </div>
    </div>
  );
}
