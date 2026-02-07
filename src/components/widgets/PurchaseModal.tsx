import { useState } from 'react';
import { X, AlertCircle, Check, ExternalLink } from 'lucide-react';
import { PAYPAL_ME_BASE_URL } from '../../config/paymentConfig';
import { supabase } from '../../lib/supabase';

interface PurchaseModalProps {
  track: {
    id: string;
    title: string;
    description: string | null;
    price: number;
    category: string;
    license_single_use_price: number | null;
    license_master_file_price: number | null;
  };
  onClose: () => void;
}

type LicenseType = 'single_use' | 'master_file' | null;

export default function PurchaseModal({ track, onClose }: PurchaseModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<LicenseType>(null);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [commissionCode, setCommissionCode] = useState<string | null>(null);

  const isBeat = track.category === 'beat_for_sale';
  const hasLicensing = isBeat && (track.license_single_use_price || track.license_master_file_price);

  const getPrice = () => {
    if (!hasLicensing) return track.price;
    if (selectedLicense === 'single_use') return track.license_single_use_price || 0;
    if (selectedLicense === 'master_file') return track.license_master_file_price || 0;
    return track.price;
  };

  const generateCommissionCode = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const buildPayPalLink = () => {
    if (!PAYPAL_ME_BASE_URL) return '';
    
    const base = PAYPAL_ME_BASE_URL.replace(/\/+$/, '');
    const amount = getPrice().toFixed(2);
    
    const trackTitle = encodeURIComponent(track.title);
    const licenseInfo = selectedLicense === 'single_use' 
      ? '%20-%20Single%20Use%20License'
      : selectedLicense === 'master_file'
      ? '%20-%20Master%20File%20License'
      : '';
    
    return `${base}/${amount}?message=Music:%20${trackTitle}${licenseInfo}`;
  };

  const handleProceed = async () => {
    if (hasLicensing && !selectedLicense) {
      alert('Please select a license type');
      return;
    }

    if (selectedLicense === 'master_file' && (!buyerEmail || !buyerName)) {
      alert('Please enter your email and name for the master file license');
      return;
    }

    setIsProcessing(true);

    // Generate and store commission code if master file purchased
    if (selectedLicense === 'master_file') {
      const code = generateCommissionCode();
      
      const { error } = await supabase
        .from('commission_codes')
        .insert({
          code,
          music_item_id: track.id,
          purchaser_email: buyerEmail,
          purchaser_name: buyerName,
          uses_remaining: 3,
        });

      if (!error) {
        setCommissionCode(code);
      }
    }

    const link = buildPayPalLink();
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }

    // Only close if not showing commission code
    if (selectedLicense !== 'master_file') {
      setTimeout(() => {
        onClose();
        setIsProcessing(false);
      }, 500);
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {commissionCode ? 'Purchase Complete!' : 'Purchase Track'}
        </h2>

        {commissionCode ? (
          /* Show Commission Code */
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-6 border-2 border-emerald-300">
              <div className="flex items-center gap-2 mb-4">
                <Check className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  Master File License Purchased
                </h3>
              </div>
              
              <p className="text-sm text-gray-700 mb-4">
                Your 8-digit commission code has been generated. Save this code to unlock 3 free commission requests!
              </p>

              <div className="bg-white rounded-lg p-4 mb-4 border-2 border-emerald-400">
                <p className="text-xs text-gray-600 mb-1">Your Commission Code:</p>
                <p className="text-3xl font-mono font-bold text-emerald-700 tracking-wider">
                  {commissionCode}
                </p>
              </div>

              <p className="text-sm text-amber-700 mb-4">
                📧 A copy of this code has been sent to: <span className="font-semibold">{buyerEmail}</span>
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 mb-3">
                  <a 
                    href="#commission"
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                      // Navigate to commission section
                      const commissionSection = document.getElementById('commission-section');
                      if (commissionSection) {
                        commissionSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="font-semibold underline hover:text-blue-700"
                  >
                    Commission
                  </a> any additional work here with your code.
                </p>
                <p className="text-xs text-gray-600">
                  Enter this code on the Commission Work page to activate 3 free commission requests.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-semibold"
            >
              Close
            </button>
          </div>
        ) : (
          /* Show Purchase Form */
          <>
            {/* Track Details */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 mb-4 border border-emerald-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {track.title}
              </h3>
              {track.description && (
                <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                  {track.description}
                </p>
              )}
            </div>

            {/* Licensing Options for Beats */}
            {hasLicensing && (
              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Select License Type:</h4>
                
                {/* Single Use License */}
                {track.license_single_use_price && (
                  <button
                    onClick={() => setSelectedLicense('single_use')}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedLicense === 'single_use'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedLicense === 'single_use' 
                            ? 'border-emerald-500 bg-emerald-500' 
                            : 'border-gray-300'
                        }`}>
                          {selectedLicense === 'single_use' && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <h5 className="font-semibold text-gray-900">Single Use Creative License</h5>
                      </div>
                      <span className="text-xl font-bold text-emerald-700">
                        ${track.license_single_use_price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 ml-7">
                      Can be uploaded to DSP but not for additional commercial use (i.e. sync licensing, film licensing, etc.)
                    </p>
                  </button>
                )}

                {/* Master File License */}
                {track.license_master_file_price && (
                  <button
                    onClick={() => setSelectedLicense('master_file')}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedLicense === 'master_file'
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedLicense === 'master_file' 
                            ? 'border-amber-500 bg-amber-500' 
                            : 'border-gray-300'
                        }`}>
                          {selectedLicense === 'master_file' && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <h5 className="font-semibold text-gray-900">Master File License</h5>
                      </div>
                      <span className="text-xl font-bold text-amber-700">
                        ${track.license_master_file_price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 ml-7 mb-2">
                      Full creative and commercial use. Producer and songwriting rights retained by briiite.
                    </p>
                    <div className="ml-7 bg-amber-100 border border-amber-300 rounded p-2">
                      <p className="text-xs text-amber-900 font-semibold">
                        ✨ Includes: 3 Free Commission Requests
                      </p>
                    </div>
                  </button>
                )}

                {/* Buyer Info for Master File */}
                {selectedLicense === 'master_file' && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700">
                      Required for Master File License:
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Email
                      </label>
                      <input
                        type="email"
                        required
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="your@email.com"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        We'll send your commission code to this email
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

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
                disabled={isProcessing || (hasLicensing && !selectedLicense)}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all font-semibold disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : `Pay $${getPrice().toFixed(2)} via PayPal`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
