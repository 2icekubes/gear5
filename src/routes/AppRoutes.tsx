import { Navigate, Route, Routes } from 'react-router-dom';
import { MobileShell } from '../components/layout/MobileShell';
import { AdminPrototype } from '../pages/AdminPrototype';
import { BookingSuccessPage } from '../pages/BookingSuccessPage';
import { ConfirmRidePage } from '../pages/ConfirmRidePage';
import { DriverPrototype } from '../pages/DriverPrototype';
import { HomePage } from '../pages/HomePage';
import { LiveRidePage } from '../pages/LiveRidePage';
import { MyRideDetailsPage } from '../pages/MyRideDetailsPage';
import { MyRidePage } from '../pages/MyRidePage';
import { ProfilePage } from '../pages/ProfilePage';
import { RoleSwitchPage } from '../pages/RoleSwitchPage';
import { RideOptionsPage } from '../pages/RideOptionsPage';
import { RidePackPage } from '../pages/RidePackPage';
import { SearchPage } from '../pages/SearchPage';
import { SuperadminPrototype } from '../pages/SuperadminPrototype';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleSwitchPage />} />
      <Route path="/rider" element={<MobileShell><HomePage /></MobileShell>} />
      <Route path="/search" element={<MobileShell><SearchPage /></MobileShell>} />
      <Route path="/rides" element={<MobileShell><RideOptionsPage /></MobileShell>} />
      <Route path="/ride-pack" element={<MobileShell><RidePackPage /></MobileShell>} />
      <Route path="/confirm/:rideId" element={<MobileShell><ConfirmRidePage /></MobileShell>} />
      <Route path="/success" element={<MobileShell><BookingSuccessPage /></MobileShell>} />
      <Route path="/myride" element={<MobileShell><MyRidePage /></MobileShell>} />
      <Route path="/myride/details" element={<MobileShell><MyRideDetailsPage /></MobileShell>} />
      <Route path="/live" element={<MobileShell><LiveRidePage /></MobileShell>} />
      <Route path="/profile" element={<MobileShell><ProfilePage /></MobileShell>} />
      <Route path="/driver" element={<DriverPrototype />} />
      <Route path="/admin" element={<AdminPrototype />} />
      <Route path="/superadmin" element={<SuperadminPrototype />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
