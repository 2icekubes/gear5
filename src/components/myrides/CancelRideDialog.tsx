import { canCancelBooking } from '../../lib/bookingRules';
import { formatTime } from '../../lib/formatters';
import type { Booking } from '../../types';
import { AppButton } from '../common/AppButton';

export function CancelRideDialog({ booking, onClose, onConfirm }: { booking: Booking; onClose: () => void; onConfirm: () => void }) {
  const allowed = canCancelBooking(booking);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="cancel-title">
      <div className="modal-card">
        <h2 id="cancel-title">Cancel ride?</h2>
        <p>
          Cancellation is available until {formatTime(booking.cancellationCutoff)}. {allowed ? 'Your ride package balance will be restored.' : 'The cutoff has passed for this booking.'}
        </p>
        <div className="modal-actions">
          <AppButton variant="ghost" onClick={onClose}>
            Keep ride
          </AppButton>
          <AppButton variant="danger" onClick={onConfirm} disabled={!allowed}>
            Cancel ride
          </AppButton>
        </div>
      </div>
    </div>
  );
}
