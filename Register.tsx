import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { events } from '../data/events';

export function Register() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find((e) => e.id === id);
  const [submitted, setSubmitted] = useState(false);
  const [attendanceType, setAttendanceType] = useState<'online' | 'walkin'>(event?.type || 'online');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-2">Event Not Found</h2>
          <p className="text-slate-400 mb-6">The event you're trying to register for doesn't exist.</p>
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:from-violet-600 hover:to-fuchsia-600 transition-all"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="max-w-2xl w-full mx-auto px-6">
          <div className="p-12 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-sm text-center space-y-6">
            <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 mb-4">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Registration Successful!
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              You're all set for <span className="text-white font-semibold">{event.title}</span>. 
              A confirmation email has been sent to your inbox with all the event details and your unique QR code.
            </p>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Event:</span>
                <span className="text-white font-medium">{event.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Date:</span>
                <span className="text-white font-medium">{event.date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Time:</span>
                <span className="text-white font-medium">{event.time}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Type:</span>
                <span className="text-white font-medium capitalize">{attendanceType}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => navigate('/events')}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:from-violet-600 hover:to-fuchsia-600 transition-all"
              >
                Browse More Events
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-all"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Register for{' '}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              {event.title}
            </span>
          </h1>
          <p className="text-slate-400 text-lg">
            Fill out the form below to secure your spot at this amazing event.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Additional Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Organization/School *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                    placeholder="Your school or organization"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Role/Year Level *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                  >
                    <option value="" className="bg-slate-900">Select your role/year</option>
                    <option value="grade11" className="bg-slate-900">Grade 11</option>
                    <option value="grade12" className="bg-slate-900">Grade 12</option>
                    <option value="college1" className="bg-slate-900">1st Year College</option>
                    <option value="college2" className="bg-slate-900">2nd Year College</option>
                    <option value="college3" className="bg-slate-900">3rd Year College</option>
                    <option value="college4" className="bg-slate-900">4th Year College</option>
                    <option value="professional" className="bg-slate-900">Professional</option>
                    <option value="other" className="bg-slate-900">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Attendance Type */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Attendance Type</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setAttendanceType('online')}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    attendanceType === 'online'
                      ? 'border-violet-500 bg-violet-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="text-3xl mb-3">🌐</div>
                  <div className="font-bold text-white mb-1">Online</div>
                  <div className="text-sm text-slate-400">Join virtually from anywhere</div>
                </button>
                <button
                  type="button"
                  onClick={() => setAttendanceType('walkin')}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    attendanceType === 'walkin'
                      ? 'border-violet-500 bg-violet-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="text-3xl mb-3">🚶</div>
                  <div className="font-bold text-white mb-1">Walk-in</div>
                  <div className="text-sm text-slate-400">Attend in person at the venue</div>
                </button>
              </div>
            </div>

            {/* Special Requirements */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Special Requirements (Optional)
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all resize-none"
                placeholder="Dietary restrictions, accessibility needs, etc."
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:from-violet-600 hover:to-fuchsia-600 transition-all transform hover:scale-105 shadow-xl shadow-violet-500/50"
          >
            Complete Registration
          </button>
        </form>
      </div>
    </div>
  );
}
