import type { Booking } from '../../types';
import { getBookingShuttleCode } from '../../lib/bookings';
import { getDriverOtp } from '../../lib/formatters';

export function QRPassCard({ booking }: { booking: Booking }) {
  const otp = booking.driverOtp || getDriverOtp(booking.id);

  return (
    <section className="qr-card">
      <div>
        <p className="eyebrow">Boarding pass</p>
        <h2>{getBookingShuttleCode(booking)}</h2>
      </div>
      <div className="qr-card__code" aria-label={`QR code value ${booking.qrCodeValue}`}>
        {Array.from({ length: 49 }).map((_, index) => (
          <span key={index} className={(index + booking.id.length) % 3 === 0 ? 'is-dark' : ''} />
        ))}
      </div>
      <p className="mono">{booking.qrCodeValue}</p>
      <div className="otp-box">
        <small>Driver OTP</small>
        <strong>{otp}</strong>
      </div>
    </section>
  );
}
