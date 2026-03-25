import { useState } from 'react';
import { Link } from 'react-router';
import { Calendar, MapPin, Users, Filter } from 'lucide-react';
import { events } from '../data/events';

export function Events() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  const categories = ['All', 'College', 'SHS', 'Internship'];
  const types = ['All', 'online', 'walkin'];

  const filteredEvents = events.filter((event) => {
    const categoryMatch = selectedCategory === 'All' || event.category === selectedCategory;
    const typeMatch = selectedType === 'All' || event.type === selectedType;
    return categoryMatch && typeMatch;
  });

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'College':
        return 'bg-blue-500/20 text-blue-400';
      case 'SHS':
        return 'bg-amber-500/20 text-amber-400';
      case 'Internship':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative bg-gradient-to-b from-white/5 to-transparent border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="text-center space-y-4">
            <div className="inline-block px-4 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-semibold">
              DISCOVER EVENTS
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              Explore{' '}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Upcoming Events
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Find the perfect event for you. Filter by category, type, and availability.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Filter size={18} />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/50'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="w-px h-6 bg-white/10 hidden sm:block" />

            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                    selectedType === type
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Events Found</h3>
              <p className="text-slate-400">Try adjusting your filters to see more results.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="group block"
                >
                  <div className="h-full rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-violet-500/50 transition-all hover:shadow-xl hover:shadow-violet-500/20 hover:-translate-y-1">
                    {/* Event Thumbnail */}
                    <div className={`h-48 bg-gradient-to-br ${event.gradient} flex items-center justify-center text-6xl group-hover:scale-105 transition-transform`}>
                      {event.icon}
                    </div>

                    {/* Event Content */}
                    <div className="p-6 space-y-4">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
                          {event.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          event.type === 'online' 
                            ? 'bg-cyan-500/20 text-cyan-400' 
                            : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {event.type === 'online' ? '🌐 Online' : '🚶 Walk-in'}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          {event.description}
                        </p>
                      </div>

                      {/* Meta Info */}
                      <div className="space-y-2 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-violet-400" />
                          <span>{event.date} • {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-violet-400" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-violet-400" />
                          <span>{event.attendees} / {event.capacity} attendees</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="pt-2">
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all"
                            style={{ width: `${(event.attendees / event.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
