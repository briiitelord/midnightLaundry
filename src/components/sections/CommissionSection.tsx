import { Briefcase } from 'lucide-react';
import CommissionForm from '../forms/CommissionForm';

export default function CommissionSection() {
  return (
    <div className="space-y-8">
      <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Briefcase className="w-8 h-8 text-emerald-600" />
          <h2 className="text-3xl font-bold text-gray-900">Commission Work</h2>
        </div>
        
        <div className="space-y-4 text-gray-700 mb-8">
          <p className="text-lg">
            Interested in commissioning original work from briiite? Whether it's custom music, written pieces, research collaboration, or a unique creative project, we'd love to hear about your vision.
          </p>
          <p>
            Fill out the form below with details about your project, and briiite will review your inquiry and get back to you with availability and pricing.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <CommissionForm />
        </div>
      </div>
    </div>
  );
}
