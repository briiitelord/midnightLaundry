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
  const [commissionCode, setCommissionCode] = useState('');
  const [codeValidated, setCodeValidated] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [validatingCode, setValidatingCode] = useState(false);
  const [usesRemaining, setUsesRemaining] = useState(0);
  
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

  const validateCommissionCode = async (code: string) => {
    if (!code || code.length !== 8) {
      setCodeError('Code must be 8 digits');
      setCodeValidated(false);
      return;
    }

    setValidatingCode(true);
    setCodeError('');

    try {
      const { data, error } = await supabase
        .from('commission_codes')
        .select('*')
        .eq('code', code)
        .single();

      if (error || !data) {
        setCodeError('Invalid commission code');
        setCodeValidated(false);
      } else if (data.uses_remaining <= 0) {
        setCodeError('This code has been fully used');
        setCodeValidated(false);
      } else if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setCodeError('This code has expired');
        setCodeValidated(false);
      } else {
        setCodeValidated(true);
        setUsesRemaining(data.uses_remaining);
        setCodeError('');
        setPaymentComplete(true); // Auto-approve payment for valid code
      }
    } catch (error) {
      setCodeError('Error validating code');
      setCodeValidated(false);
    } finally {
      setValidatingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const insertData = {
      ...formData,
      commission_code: codeValidated ? commissionCode : null,
      is_free_commission: codeValidated,
    };

    const { error } = await supabase
      .from('commission_inquiries')
      .insert([insertData]);

    if (!error && codeValidated) {
      // Decrement code usage
      await supabase
        .from('commission_codes')
        .update({ 
          uses_remaining: usesRemaining - 1,
          last_used_at: new Date().toISOString(),
        })
        .eq('code', commissionCode);
    }

    if (!error) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setPaymentComplete(false);
        setCodeValidated(false);
        setCommissionCode('');
        setUsesRemaining(0);
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

      {/* Commission Code Section */}
      <div className="mb-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-purple-600">✨</span>
          Have a Master File Commission Code?
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Enter your 8-digit code to activate free commission requests (no payment required)
        </p>
        
        <div className="flex gap-3">
          <input
            type="text"
            maxLength={8}
            value={commissionCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ''); // Only digits
              setCommissionCode(value);
              if (value.length === 8) {
                validateCommissionCode(value);
              } else {
                setCodeValidated(false);
                setCodeError('');
              }
            }}
            className={`flex-1 px-4 py-3 border-2 rounded-lg font-mono text-lg tracking-wider focus:ring-2 focus:ring-purple-500 transition-colors ${
              codeValidated 
                ? 'border-green-500 bg-green-50' 
                : codeError 
                ? 'border-red-500 bg-red-50' 
                : 'border-purple-300'
            }`}
            placeholder="12345678"
          />
          <button
            type="button"
            onClick={() => validateCommissionCode(commissionCode)}
            disabled={commissionCode.length !== 8 || validatingCode}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {validatingCode ? 'Validating...' : 'Validate'}
          </button>
        </div>

        {codeError && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {codeError}
          </p>
        )}

        {codeValidated && (
          <div className="mt-3 bg-green-100 border border-green-300 rounded-lg p-3">
            <p className="text-sm text-green-800 flex items-center gap-2 font-semibold">
              <CheckCircle className="w-5 h-5" />
              Valid Code! {usesRemaining} free {usesRemaining === 1 ? 'commission' : 'commissions'} remaining
            </p>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-3">
          Commission codes are provided with Master File license purchases
        </p>
      </div>

      {paypalLink && !codeValidated && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-gray-300"></div>
            <span className="text-sm text-gray-500 font-medium">OR</span>
            <div className="h-px flex-1 bg-gray-300"></div>
          </div>
          
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
              Payment required if not using a commission code
            </p>
          )}
          {paymentComplete && !codeValidated && (
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
          disabled={submitting || (!paymentComplete && !codeValidated)}
          className={`w-full px-6 py-4 text-white rounded-lg transition-all font-semibold text-lg flex items-center justify-center space-x-2 ${
            paymentComplete || codeValidated
              ? 'bg-forest bg-cover border-2 border-forest-800 hover:opacity-90 shadow-lg'
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
              <span>
                {codeValidated 
                  ? `Submit Free Commission (${usesRemaining} remaining)` 
                  : paymentComplete 
                  ? 'Submit Inquiry' 
                  : 'Enter Code or Complete Payment First'}
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
