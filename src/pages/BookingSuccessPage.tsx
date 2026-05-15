import { Link } from 'react-router-dom';
import { AppButton } from '../components/common/AppButton';

export function BookingSuccessPage() {
  return (
    <div className="page success-page">
      <div className="success-mark">✓</div>
      <h1>Ride reserved</h1>
      <p>Your QR pass is ready. Show it to the driver when boarding the shuttle.</p>
      <Link to="/myride"><AppButton>View myRide</AppButton></Link>
      <Link to="/rider"><AppButton variant="secondary">Back to Home</AppButton></Link>
    </div>
  );
}
