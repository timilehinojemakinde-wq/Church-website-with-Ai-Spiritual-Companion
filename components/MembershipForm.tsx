import React, { useState } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface MembershipFormProps {
  onClose: () => void;
}

const departments = [
  'Choir / Levites',
  'Ushering',
  'Media & Communications',
  'Children Ministry',
  'Youth Ministry',
  'Prayer Band',
  'Evangelism',
  'Technical Team',
  'Protocol',
  'Women Fellowship',
  'Men Fellowship',
  'No Department Yet',
];

const howFound = [
  'Friend or Family Member',
  'Social Media',
  'Google Search',
  'Walked Past the Church',
  'Church Programme / Outreach',
  'Other',
];

const MembershipForm: React.FC<MembershipFormProps> = ({ onClose }) => {
  const [step, setStep] = useState<'form' | 'terms' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [membershipNumber, setMembershipNumber] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    gender: '',
    phone: '',
    email: '',
    home_address: '',
    occupation: '',
    marital_status: '',
    department_interest: '',
    how_they_found_church: '',
    year_they_joined_church: new Date().getFullYear().toString(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Please select your gender';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.home_address.trim()) newErrors.home_address = 'Home address is required';
    if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required';
    if (!formData.marital_status) newErrors.marital_status = 'Please select marital status';
    if (!formData.department_interest) newErrors.department_interest = 'Please select a department';
    if (!formData.how_they_found_church) newErrors.how_they_found_church = 'Please tell us how you found us';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = () => {
    if (validate()) {
      setStep('terms');
    }
  };

  const generateMembershipNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `RCCG-AMB-${year}-${random}`;
  };

  const handleFinalSubmit = async () => {
    if (!agreedToTerms) return;
    setIsLoading(true);

    const membership_number = generateMembershipNumber();

    try {
      const { error } = await supabase
        .from('members')
        .insert([{
          ...formData,
          membership_number,
          is_approved: false,
        }]);

      if (error) {
        console.error('Error saving member:', error);
        alert('Something went wrong. Please try again.');
        setIsLoading(false);
        return;
      }

      setMembershipNumber(membership_number);
      setStep('success');
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-rccg-red/30 transition-all ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 focus:border-rccg-red'
    }`;

  const selectClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-rccg-red/30 transition-all appearance-none ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 focus:border-rccg-red'
    }`;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-3xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Membership Registration</h2>
            <p className="text-xs text-gray-500 mt-0.5">RCCG The Ambassadors</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* STEP 1 — FORM */}
        {step === 'form' && (
          <div className="p-6 space-y-5">

            {/* Progress */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex-1 h-1.5 bg-rccg-red rounded-full"></div>
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full"></div>
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full"></div>
              <span className="text-xs text-gray-400 ml-1">Step 1 of 2</span>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Full Name *</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={inputClass('full_name')}
              />
              {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
            </div>

            {/* Date of Birth + Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Date of Birth *</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className={inputClass('date_of_birth')}
                />
                {errors.date_of_birth && <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={selectClass('gender')}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
              </div>
            </div>

            {/* Phone + Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="08012345678"
                  className={inputClass('phone')}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className={inputClass('email')}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Home Address */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Home Address *</label>
              <textarea
                name="home_address"
                value={formData.home_address}
                onChange={handleChange}
                placeholder="Enter your full home address"
                rows={2}
                className={inputClass('home_address')}
              />
              {errors.home_address && <p className="text-red-500 text-xs mt-1">{errors.home_address}</p>}
            </div>

            {/* Occupation + Marital Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Occupation *</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="e.g. Teacher, Engineer"
                  className={inputClass('occupation')}
                />
                {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Marital Status *</label>
                <select
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleChange}
                  className={selectClass('marital_status')}
                >
                  <option value="">Select status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Divorced">Divorced</option>
                </select>
                {errors.marital_status && <p className="text-red-500 text-xs mt-1">{errors.marital_status}</p>}
              </div>
            </div>

            {/* Department Interest */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Department Interest *</label>
              <select
                name="department_interest"
                value={formData.department_interest}
                onChange={handleChange}
                className={selectClass('department_interest')}
              >
                <option value="">Select a department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department_interest && <p className="text-red-500 text-xs mt-1">{errors.department_interest}</p>}
            </div>

            {/* How They Found Church */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">How Did You Find Us? *</label>
              <select
                name="how_they_found_church"
                value={formData.how_they_found_church}
                onChange={handleChange}
                className={selectClass('how_they_found_church')}
              >
                <option value="">Select an option</option>
                {howFound.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.how_they_found_church && <p className="text-red-500 text-xs mt-1">{errors.how_they_found_church}</p>}
            </div>

            {/* Year Joined */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Year You Joined / Are Joining *</label>
              <input
                type="number"
                name="year_they_joined_church"
                value={formData.year_they_joined_church}
                onChange={handleChange}
                min="1990"
                max={new Date().getFullYear()}
                className={inputClass('year_they_joined_church')}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleFormSubmit}
              className="w-full py-4 bg-rccg-red text-white font-bold text-sm uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all shadow-lg mt-4"
            >
              Continue to Terms & Agreement →
            </button>
          </div>
        )}

        {/* STEP 2 — TERMS */}
        {step === 'terms' && (
          <div className="p-6">

            {/* Progress */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex-1 h-1.5 bg-rccg-red rounded-full"></div>
              <div className="flex-1 h-1.5 bg-rccg-red rounded-full"></div>
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full"></div>
              <span className="text-xs text-gray-400 ml-1">Step 2 of 2</span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">Terms & Data Consent</h3>
            <p className="text-sm text-gray-500 mb-4">Please read carefully before submitting your registration.</p>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 max-h-60 overflow-y-auto text-sm text-gray-700 leading-relaxed space-y-3 mb-6">
              <p className="font-bold text-gray-900">Data Collection & Usage Agreement</p>
              <p>By registering as a member of RCCG The Ambassadors, you consent to the collection and use of your personal information as described below:</p>
              <p><strong>1. Information Collected:</strong> We collect your name, date of birth, gender, contact details, address, occupation, marital status, and department preference.</p>
              <p><strong>2. Purpose of Data:</strong> Your information will be used solely for church administration, membership records, pastoral care, department coordination, and church growth planning and reporting.</p>
              <p><strong>3. Data Security:</strong> Your personal data is stored securely and will not be sold, shared, or disclosed to any third party outside of the church leadership without your explicit consent.</p>
              <p><strong>4. Communication:</strong> We may contact you via email or phone for church-related communications including service announcements, birthday wishes, and pastoral follow-ups.</p>
              <p><strong>5. Your Rights:</strong> You have the right to request access to your data, request corrections, or request deletion of your data at any time by contacting the church administration.</p>
              <p><strong>6. Membership Number:</strong> Upon registration, a unique membership number will be generated and sent to your email address for your records.</p>
              <p className="font-bold text-gray-900">By ticking the checkbox below, you confirm that you have read, understood, and agreed to these terms.</p>
            </div>

            {/* Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer mb-6">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 accent-rccg-red"
              />
              <span className="text-sm text-gray-700">
                I have read and agree that my personal data can be used by RCCG The Ambassadors for church administration, growth planning, and pastoral purposes.
              </span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('form')}
                className="flex-1 py-3 border border-gray-300 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-all"
              >
                ← Go Back
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={!agreedToTerms || isLoading}
                className="flex-1 py-3 bg-rccg-red text-white font-bold text-sm rounded-xl hover:bg-red-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Registration'
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — SUCCESS */}
        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to the Family! 🎉</h3>
            <p className="text-gray-500 text-sm mb-6">Your membership registration has been received successfully.</p>

            <div className="bg-rccg-red/5 border border-rccg-red/20 rounded-2xl p-5 mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Your Membership Number</p>
              <p className="text-2xl font-bold text-rccg-red tracking-wider">{membershipNumber}</p>
              <p className="text-xs text-gray-400 mt-2">Please save this number for your records</p>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              A confirmation will be sent to <strong>{formData.email}</strong> shortly. Welcome to RCCG The Ambassadors!
            </p>

            <button
              onClick={onClose}
              className="w-full py-3 bg-rccg-red text-white font-bold text-sm rounded-xl hover:bg-red-700 transition-all"
            >
              Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default MembershipForm;
