import { useState } from 'react';
import { Gift, X, Heart, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PAYPAL_ME_BASE_URL } from '../../config/paymentConfig';

export default function GiftBucketWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    sender_name: 'Anonymous',
    sender_email: '',
    amount: '',
    payment_method: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const suggestedAmounts = [5, 10, 25, 50, 100];
  const paypalBase = PAYPAL_ME_BASE_URL ? PAYPAL_ME_BASE_URL.replace(/\/+$/, '') : '';
  const paypalAmount = parseFloat(formData.amount || '0');
  const paypalLink = paypalBase && paypalAmount > 0 ? `${paypalBase}/${paypalAmount.toFixed(2)}` : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase
      .from('gifts')
      .insert([{
        sender_name: formData.sender_name === 'Anonymous' ? null : formData.sender_name,
        sender_email: formData.sender_email || null,
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method || null,
        message: formData.message || null,
      }]);

    if (!error) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          sender_name: 'Anonymous',
          sender_email: '',
          amount: '',
          payment_method: '',
          message: '',
        });
        setIsOpen(false);
      }, 2500);
    }

    setSubmitting(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-600 text-white rounded-full shadow-2xl hover:shadow-amber-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 group"
      >
        <Gift className="w-7 h-7 group-hover:scale-110 transition-transform" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-6rem)]">
            <div className="bg-gradient-to-r from-amber-500 to-yellow-600 p-6 sticky top-0 z-20">
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors focus:outline-none"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center space-x-3">
                <Gift className="w-8 h-8 text-white" />
                <div>
                  <h3 className="text-2xl font-bold text-white">Gift Bucket</h3>
                  <p className="text-amber-100 text-sm mt-1">
                    Support briiite's creative work
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh] sm:max-h-[calc(100vh-14rem)]">
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 mx-auto text-emerald-600 mb-4" />
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Thank You!
                  </h4>
                  <p className="text-gray-600">
                    Your support means the world to briiite.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Amount
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {suggestedAmounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                          className={`
                            px-3 py-2 rounded-lg font-semibold text-sm transition-all
                            ${
                              formData.amount === amount.toString()
                                ? 'bg-amber-500 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                          `}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Custom Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                        $
                      </span>
                      <input
                        type="number"
                        required
                        min="1"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <select
                      required
                      value={formData.payment_method}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    >
                      <option value="">Select payment method</option>
                      <option value="paypal">PayPal</option>
                      <option value="cashapp">CashApp</option>
                      <option value="venmo">Venmo</option>
                      <option value="crypto">Cryptocurrency</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.sender_name}
                      onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="Anonymous"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
                      placeholder="Leave a note for briiite..."
                    />
                  </div>

                  {formData.payment_method === 'paypal' && paypalLink && (
                    <a
                      href={paypalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-center block"
                    >
                      Pay with PayPal
                    </a>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5" />
                        <span>Send Gift</span>
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    If you pay now, submit this form to record your gift.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
