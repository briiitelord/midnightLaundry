import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { PAYPAL_ME_BASE_URL } from '../../config/paymentConfig';

interface PurchaseModalProps {
  track: {
    id: string;
    title: string;
    description: string | null;
    price: number;
  };
  onClose: () => void;
}

export default function PurchaseModal({ track, onClose }: PurchaseModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const buildPayPalLink = () => {
    if (!PAYPAL_ME_BASE_URL) return '';
    
    const base = PAYPAL_ME_BASE_URL.replace(/\/+$/, '');
    const amount = track.price.toFixed(2);
    
    // Build transaction note with track info
    const trackTitle = encodeURIComponent(track.title);
    const trackDesc = track.description 
      ? encodeURIComponent(track.description.substring(0, 50)) 
      : '';
    
    // PayPal.Me format: https://paypal.me/handle/amount?message=reference
    return `${base}/${amount}?message=Music:%20${trackTitle}${trackDesc ? `%20-%20${trackDesc}` : ''}`;
  };

  const handleProceed = () => {
    setIsProcessing(true);
    const link = buildPayPalLink();
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
    // Close modal after a brief delay
    setTimeout(() => {
      onClose();
      setIsProcessing(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Purchase Track</h2>

        {/* Track Details */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 mb-6 border border-emerald-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {track.title}
          </h3>
          {track.description && (
            <p className="text-sm text-gray-700 mb-3 line-clamp-3">
              {track.description}
            </p>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-emerald-700">
              ${track.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Info Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900">
            You will be redirected to PayPal to complete your purchase. Your transaction will include track details for reference.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleProceed}
            disabled={isProcessing}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all font-semibold disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Pay via PayPal'}
          </button>
        </div>
      </div>
    </div>
  );
}
