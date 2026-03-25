import { Link, useParams } from 'react-router';
import { Calendar, MapPin, Users, Clock, Award, ArrowLeft } from 'lucide-react';
import { events } from '../data/events';

export function EventDetail() {
  const { id } = useParams();
  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-2">Event Not Found</h2>
          <p className="text-slate-400 mb-6">The event you're looking for doesn't exist.</p>
          <Link
            to="/events"
            className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:from-violet-600 hover:to-fuchsia-600 transition-all"
          >
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'upcoming':
        return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
      case 'past':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className={`relative h-80 bg-gradient-to-br ${event.gradient} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center justify-center">
          <div className="text-9xl">{event.icon}</div>
        </div>
        <Link
          to="/events"
          className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Events</span>
        </Link>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    event.type === 'online' 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {event.type === 'online' ? '🌐 Online Event' : '🚶 Walk-in Event'}
                  </span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white">{event.title}</h1>
                <p className="text-xl text-slate-400">{event.description}</p>
              </div>

              {/* About Section */}
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4">About This Event</h2>
                <p className="text-slate-300 leading-relaxed">{event.fullDescription}</p>
              </div>

              {/* What You'll Learn/Get */}
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">What You'll Get</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: '📚', text: 'Comprehensive learning materials' },
                    { icon: '🎁', text: 'Event swag and goodies' },
                    { icon: '🤝', text: 'Networking opportunities' },
                    { icon: '📜', text: 'Certificate of attendance' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="text-2xl">{item.icon}</div>
                      <span className="text-slate-300">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Event Details Card */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm sticky top-24">
                <h3 className="text-xl font-bold text-white mb-6">Event Details</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-violet-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-400">Date & Time</div>
                      <div className="text-white font-medium">{event.date}</div>
                      <div className="text-slate-300 text-sm">{event.time}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-violet-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-400">Location</div>
                      <div className="text-white font-medium">{event.location}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-violet-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-400">Attendees</div>
                      <div className="text-white font-medium">
                        {event.attendees} / {event.capacity}
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                          style={{ width: `${(event.attendees / event.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-violet-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-400">Category</div>
                      <div className="text-white font-medium">{event.category}</div>
                    </div>
                  </div>
                </div>

                {/* Register Buttons */}
                <div className="space-y-3">
                  <Link
                    to={`/register/${event.id}`}
                    className="block w-full px-6 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-center font-semibold hover:from-violet-600 hover:to-fuchsia-600 transition-all transform hover:scale-105 shadow-lg shadow-violet-500/50"
                  >
                    {event.type === 'online' ? '🌐 Register for Online Event' : '🚶 Register for Walk-in'}
                  </Link>
                  
                  {event.type === 'walkin' && (
                    <Link
                      to={`/register/${event.id}`}
                      className="block w-full px-6 py-3 rounded-xl border border-white/20 text-white text-center font-medium hover:bg-white/5 transition-all"
                    >
                      💻 Join Online Instead
                    </Link>
                  )}
                </div>

                {/* Info */}
                <div className="mt-6 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <div className="flex gap-3">
                    <div className="text-2xl">ℹ️</div>
                    <div className="text-sm text-violet-300">
                      You'll receive a confirmation email with event details and QR code after registration.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
