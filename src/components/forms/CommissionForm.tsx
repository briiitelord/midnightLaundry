import { useState, useEffect } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PAYPAL_ME_BASE_URL } from '../../config/paymentConfig';

export default function CommissionForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiry_type: 'personal' as 'personal' | 'business_licensing' | 'creative_pursuit',
    project_description: '',
    budget_range: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  
  const paypalLink = PAYPAL_ME_BASE_URL
    ? `${PAYPAL_ME_BASE_URL.replace(/\/+$/, '')}/222.00`
    : '';

  // Check for payment completion on mount and when URL changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('paid') === 'true') {
      setPaymentComplete(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase
      .from('commission_inquiries')
      .insert([formData]);

    if (!error) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setPaymentComplete(false);
        setFormData({
          name: '',
          email: '',
          inquiry_type: 'personal',
          project_description: '',
          budget_range: '',
        });
      }, 3000);
    }

    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 mx-auto text-emerald-600 mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Inquiry Submitted!
        </h3>
        <p className="text-gray-600">
          briiite will review your request and get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Commission Custom Work
      </h3>

      {paypalLink && (
        <div className="mb-6">
          <a
            href={paypalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-colors font-semibold"
          >
            Pay $222 Commission Deposit via PayPal
          </a>
          {!paymentComplete && (
            <p className="mt-3 text-sm text-amber-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Payment required to submit your commission inquiry
            </p>
          )}
          {paymentComplete && (
            <p className="mt-3 text-sm text-emerald-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Payment received! You can now submit your inquiry.
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Type of Inquiry
          </label>
          <select
            value={formData.inquiry_type}
            onChange={(e) => setFormData({ ...formData, inquiry_type: e.target.value as any })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          >
            <option value="personal">Personal</option>
            <option value="business_licensing">Business Licensing</option>
            <option value="creative_pursuit">Creative Pursuit</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Project Description
          </label>
          <textarea
            required
            rows={6}
            value={formData.project_description}
            onChange={(e) => setFormData({ ...formData, project_description: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
            placeholder="Tell us about your project and what you're looking for..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Budget Range (Optional)
          </label>
          <input
            type="text"
            value={formData.budget_range}
            onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="e.g., $500-$1000"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !paymentComplete}
          className={`w-full px-6 py-4 text-white rounded-lg transition-all font-semibold text-lg flex items-center justify-center space-x-2 ${
            paymentComplete
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'bg-gray-400 cursor-not-allowed'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>{paymentComplete ? 'Submit Inquiry' : 'Complete Payment First'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
