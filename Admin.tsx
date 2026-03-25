import { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  TrendingUp, 
  UserPlus,
  Eye,
  Edit,
  Trash2,
  Download
} from 'lucide-react';
import { events } from '../data/events';

export function Admin() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'attendees' | 'analytics'>('dashboard');

  const stats = [
    {
      label: 'Total Events',
      value: '156',
      change: '+12%',
      trend: 'up',
      icon: Calendar,
      gradient: 'from-violet-500 to-fuchsia-500',
    },
    {
      label: 'Total Attendees',
      value: '25,432',
      change: '+18%',
      trend: 'up',
      icon: Users,
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      label: 'Active Events',
      value: '24',
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'New Registrations',
      value: '1,234',
      change: '+24%',
      trend: 'up',
      icon: UserPlus,
      gradient: 'from-amber-500 to-orange-500',
    },
  ];

  const recentAttendees = [
    { name: 'John Doe', email: 'john@example.com', event: 'Tech Innovation Summit', date: '2026-04-15', status: 'confirmed' },
    { name: 'Jane Smith', email: 'jane@example.com', event: 'Web Development Workshop', date: '2026-03-28', status: 'confirmed' },
    { name: 'Mike Johnson', email: 'mike@example.com', event: 'AI & ML Bootcamp', date: '2026-04-22', status: 'pending' },
    { name: 'Sarah Williams', email: 'sarah@example.com', event: 'Career Fair 2026', date: '2026-05-05', status: 'confirmed' },
    { name: 'Chris Brown', email: 'chris@example.com', event: 'Design Thinking Workshop', date: '2026-03-10', status: 'confirmed' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'upcoming':
        return 'bg-violet-500/20 text-violet-400';
      case 'past':
        return 'bg-slate-500/20 text-slate-400';
      case 'confirmed':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-slate-950/50 border-r border-white/10 sticky top-16">
          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <LayoutDashboard className="w-5 h-5 text-violet-400" />
                <h2 className="font-bold text-white text-lg">Admin Panel</h2>
              </div>
              <p className="text-sm text-slate-400">Event Management Dashboard</p>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard size={20} />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'events'
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Calendar size={20} />
                Events
              </button>
              <button
                onClick={() => setActiveTab('attendees')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'attendees'
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users size={20} />
                Attendees
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <TrendingUp size={20} />
                Analytics
              </button>

              <div className="pt-6 mt-6 border-t border-white/10">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 font-medium transition-all">
                  <Settings size={20} />
                  Settings
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-slate-400">Welcome back! Here's what's happening with your events.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className={`text-sm font-semibold ${
                          stat.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                      <div className="text-sm text-slate-400 mb-1">{stat.label}</div>
                      <div className="text-3xl font-bold text-white">{stat.value}</div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Events */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Recent Events</h2>
                    <button className="text-violet-400 hover:text-violet-300 text-sm font-medium">
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {events.slice(0, 4).map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                      >
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${event.gradient} flex items-center justify-center text-2xl`}>
                          {event.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium truncate">{event.title}</h3>
                          <p className="text-sm text-slate-400">{event.date}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Registrations */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Recent Registrations</h2>
                    <button className="text-violet-400 hover:text-violet-300 text-sm font-medium">
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {recentAttendees.slice(0, 4).map((attendee, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold">
                          {attendee.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium truncate">{attendee.name}</h3>
                          <p className="text-sm text-slate-400 truncate">{attendee.event}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(attendee.status)}`}>
                          {attendee.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Events View */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Events Management</h1>
                  <p className="text-slate-400">Manage all your events in one place</p>
                </div>
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:from-violet-600 hover:to-fuchsia-600 transition-all">
                  Create Event
                </button>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Event</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Date</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Category</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Attendees</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Status</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event) => (
                        <tr key={event.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${event.gradient} flex items-center justify-center text-xl`}>
                                {event.icon}
                              </div>
                              <div>
                                <div className="text-white font-medium">{event.title}</div>
                                <div className="text-sm text-slate-400">{event.location}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-300">{event.date}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-400">
                              {event.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-300">
                            {event.attendees} / {event.capacity}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                              {event.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                <Eye size={18} />
                              </button>
                              <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                <Edit size={18} />
                              </button>
                              <button className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Attendees View */}
          {activeTab === 'attendees' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Attendees Management</h1>
                  <p className="text-slate-400">View and manage all event registrations</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-all">
                  <Download size={20} />
                  Export Data
                </button>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Name</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Email</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Event</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Date</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Status</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAttendees.map((attendee, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-all">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold">
                                {attendee.name.charAt(0)}
                              </div>
                              <span className="text-white font-medium">{attendee.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-300">{attendee.email}</td>
                          <td className="px-6 py-4 text-slate-300">{attendee.event}</td>
                          <td className="px-6 py-4 text-slate-300">{attendee.date}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(attendee.status)}`}>
                              {attendee.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                <Eye size={18} />
                              </button>
                              <button className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Analytics View */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Analytics & Insights</h1>
                <p className="text-slate-400">Track performance and engagement metrics</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Chart Placeholders */}
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6">Event Registrations Over Time</h3>
                  <div className="h-64 rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-white/10 flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-violet-400 mx-auto mb-2" />
                      <p className="text-slate-400">Chart visualization</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6">Category Distribution</h3>
                  <div className="h-64 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-white/10 flex items-center justify-center">
                    <div className="text-center">
                      <Calendar className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
                      <p className="text-slate-400">Chart visualization</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6">Attendance Rate</h3>
                  <div className="h-64 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-white/10 flex items-center justify-center">
                    <div className="text-center">
                      <Users className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                      <p className="text-slate-400">Chart visualization</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6">Popular Events</h3>
                  <div className="space-y-4">
                    {events.slice(0, 5).map((event, index) => (
                      <div key={event.id} className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-violet-400">#{index + 1}</div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{event.title}</div>
                          <div className="text-sm text-slate-400">{event.attendees} attendees</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
