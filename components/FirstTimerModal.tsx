import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

interface FirstTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 1 | 2 | 3;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  visitDate: string;
  howYouHeard: string;
  previousChurch: string;
  isBornAgain: string;
  isWaterBaptized: string;
  maritalStatus: string;
  spouseName: string;
  numberOfChildren: string;
  prayerRequest: string;
  wantFollowUp: string;
}

const initialForm: FormData = {
  firstName: '', lastName: '', email: '', phone: '',
  dateOfBirth: '', gender: '',
  address: '', city: '', state: '',
  visitDate: '', howYouHeard: '', previousChurch: '',
  isBornAgain: '', isWaterBaptized: '',
  maritalStatus: '', spouseName: '', numberOfChildren: '',
  prayerRequest: '', wantFollowUp: '',
};

const STEPS = [
  { number: 1, label: 'Personal' },
  { number: 2, label: 'Background' },
  { number: 3, label: 'Follow-up' },
];

const inputClass =
  'w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-300 transition-all text-sm';

const labelClass = 'block text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1';

const selectClass =
  'w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-300 transition-all text-sm appearance-none';

export const FirstTimerModal: React.FC<FirstTimerModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleNext = () => {
    if (step < 3) setStep((step + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const { error } = await supabase.from('first_timers').insert([{
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      phone: form.phone,
      date_of_birth: form.dateOfBirth,
      gender: form.gender,
      address: form.address,
      city: form.city,
      state: form.state,
      visit_date: form.visitDate,
      how_you_heard: form.howYouHeard,
      previous_church: form.previousChurch,
      is_born_again: form.isBornAgain,
      is_water_baptized: form.isWaterBaptized,
      marital_status: form.maritalStatus,
      spouse_name: form.spouseName,
      number_of_children: form.numberOfChildren,
      prayer_request: form.prayerRequest,
      want_follow_up: form.wantFollowUp,
    }]);
    if (error) {
      alert('Something went wrong. Please try again.');
      console.error(error);
    } else {
      setSubmitted(true);
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    setStep(1);
    setForm(initialForm);
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="bg-white rounded-t-2xl px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="text-gray-900 font-bold text-xl leading-tight">First Timer Registration</h2>
              <p className="text-gray-400 text-xs mt-0.5">RCCG The Ambassadors</p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-all mt-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!submitted && (
            <>
              <div className="flex justify-between mt-4 mb-2">
                {STEPS.map((s) => (
                  <span
                    key={s.number}
                    className={`text-xs font-semibold transition-all ${
                      step === s.number ? 'text-red-500' : step > s.number ? 'text-gray-400' : 'text-gray-300'
                    }`}
                  >
                    {s.number}. {s.label}
                  </span>
                ))}
                <span className="text-xs text-gray-300 font-medium">Step {step} of 3</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${step === 1 ? 33 : step === 2 ? 66 : 100}%` }}
                />
              </div>
            </>
          )}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 bg-gray-50">

          {submitted ? (
            <div className="text-center py-10 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-xl mb-1">Welcome, {form.firstName}! 🎉</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                  We're so glad you're here. Someone from our team will reach out to you soon.
                </p>
              </div>
              <div className="mt-2 bg-red-50 border border-red-100 rounded-xl px-5 py-4 text-left w-full">
                <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-1">What's Next</p>
                <p className="text-gray-600 text-sm">Expect a warm welcome call or message within 48 hours. We'd love to connect with you!</p>
              </div>
              <button
                onClick={handleClose}
                className="mt-2 bg-red-500 text-white font-bold py-3 px-10 rounded-xl hover:bg-red-600 transition-all text-sm"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-gray-400 text-sm mb-2">Please tell us a little about yourself.</p>

                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={form.firstName}
                      onChange={set('firstName')}
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Date of Birth *</label>
                      <input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Gender *</label>
                      <div className="relative">
                        <select value={form.gender} onChange={set('gender')} className={selectClass}>
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Phone Number *</label>
                      <input type="tel" placeholder="08012345678" value={form.phone} onChange={set('phone')} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Email Address *</label>
                      <input type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Home Address *</label>
                    <input type="text" placeholder="Enter your full home address" value={form.address} onChange={set('address')} className={inputClass} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>City</label>
                      <input type="text" placeholder="Lagos" value={form.city} onChange={set('city')} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>State</label>
                      <input type="text" placeholder="Lagos State" value={form.state} onChange={set('state')} className={inputClass} />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-4">
                  <p className="text-gray-400 text-sm mb-2">Help us understand your faith journey.</p>

                  <div>
                    <label className={labelClass}>Date of First Visit *</label>
                    <input type="date" value={form.visitDate} onChange={set('visitDate')} className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>How Did You Hear About Us?</label>
                    <div className="relative">
                      <select value={form.howYouHeard} onChange={set('howYouHeard')} className={selectClass}>
                        <option value="">Select one</option>
                        <option value="friend">Friend / Family</option>
                        <option value="social_media">Social Media</option>
                        <option value="online_search">Online Search</option>
                        <option value="flyer">Flyer / Poster</option>
                        <option value="tv_radio">TV / Radio</option>
                        <option value="drove_by">Drove By</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Previous Church (if any)</label>
                    <input type="text" placeholder="Name of previous church" value={form.previousChurch} onChange={set('previousChurch')} className={inputClass} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Are You Born Again?</label>
                      <div className="relative">
                        <select value={form.isBornAgain} onChange={set('isBornAgain')} className={selectClass}>
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                          <option value="not_sure">Not Sure</option>
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</div>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Water Baptized?</label>
                      <div className="relative">
                        <select value={form.isWaterBaptized} onChange={set('isWaterBaptized')} className={selectClass}>
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-gray-400 text-sm mb-2">Almost done! A few more details.</p>

                  <div>
                    <label className={labelClass}>Marital Status</label>
                    <div className="relative">
                      <select value={form.maritalStatus} onChange={set('maritalStatus')} className={selectClass}>
                        <option value="">Select</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</div>
                    </div>
                  </div>

                  {form.maritalStatus === 'married' && (
                    <div>
                      <label className={labelClass}>Spouse's Name</label>
                      <input type="text" placeholder="Spouse full name" value={form.spouseName} onChange={set('spouseName')} className={inputClass} />
                    </div>
                  )}

                  <div>
                    <label className={labelClass}>Number of Children</label>
                    <div className="relative">
                      <select value={form.numberOfChildren} onChange={set('numberOfChildren')} className={selectClass}>
                        <option value="">Select</option>
                        <option value="0">None</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4+">4 or more</option>
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Would You Like a Follow-up Call?</label>
                    <div className="flex gap-3">
                      {['Yes, please', 'No, thanks'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setForm(prev => ({ ...prev, wantFollowUp: opt }))}
                          className={`flex-1 py-2.5 rounded-lg text-sm font-bold border transition-all ${
                            form.wantFollowUp === opt
                              ? 'bg-red-500 border-red-500 text-white'
                              : 'bg-white border-gray-200 text-gray-400 hover:border-red-300'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Prayer Request / Message (Optional)</label>
                    <textarea
                      placeholder="Share anything you'd like us to pray with you about..."
                      value={form.prayerRequest}
                      onChange={set('prayerRequest')}
                      rows={3}
                      className={inputClass + ' resize-none'}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="px-6 py-4 border-t border-gray-100 bg-white rounded-b-2xl flex-shrink-0 flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm hover:border-gray-300 hover:text-gray-700 transition-all"
              >
                ← Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={step === 1 && (!form.firstName || !form.phone)}
                className="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-xl hover:bg-red-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 text-sm"
              >
                {isLoading ? 'Submitting...' : 'Submit ✓'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FirstTimerModal;
