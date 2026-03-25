import { Link } from 'react-router';
import { Calendar, Users, TrendingUp, Award, Zap, Shield } from 'lucide-react';

export function Home() {
  const stats = [
    { label: 'Active Events', value: '150+', icon: Calendar },
    { label: 'Registered Users', value: '25K+', icon: Users },
    { label: 'Attendance Rate', value: '94%', icon: TrendingUp },
    { label: 'Satisfaction', value: '4.9/5', icon: Award },
  ];

  const steps = [
    {
      number: '01',
      icon: '🔍',
      title: 'Browse Events',
      description: 'Explore our curated collection of events across different categories and interests.',
    },
    {
      number: '02',
      icon: '📝',
      title: 'Register Easily',
      description: 'Quick and simple registration process. Fill out the form and secure your spot.',
    },
    {
      number: '03',
      icon: '✉️',
      title: 'Get Confirmed',
      description: 'Receive instant confirmation via email with all event details and QR code.',
    },
    {
      number: '04',
      icon: '🎉',
      title: 'Attend & Enjoy',
      description: 'Show up and make the most of your event experience. Network, learn, and grow.',
    },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Register for events in seconds with our streamlined process.',
      gradient: 'from-yellow-400 to-orange-500',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with industry-standard security measures.',
      gradient: 'from-emerald-400 to-cyan-500',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join thousands of attendees and build meaningful connections.',
      gradient: 'from-violet-400 to-fuchsia-500',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-500" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-slate-300 font-medium">Live Event Management System</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="text-white">Track Every</span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                Event Experience
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Seamlessly manage event attendance, registrations, and analytics. 
              Your all-in-one platform for creating memorable event experiences.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/events"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:from-violet-600 hover:to-fuchsia-600 transition-all transform hover:scale-105 shadow-lg shadow-violet-500/50"
              >
                Explore Events
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-all backdrop-blur-sm"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group"
                >
                  <Icon className="w-8 h-8 text-violet-400 mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-semibold mb-4">
              HOW IT WORKS
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Get Started in{' '}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Four Simple Steps
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              From discovery to attendance, we've streamlined the entire event experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative p-8 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/10 hover:border-violet-500/50 transition-all group"
              >
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <div className="text-sm font-bold text-violet-400 mb-3">{step.number}</div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold mb-4">
              FEATURES
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                EvenTrack
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                >
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/30 rounded-full blur-3xl" />
            
            <div className="relative text-center space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Ready to Get Started?
              </h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Join thousands of attendees and discover amazing events happening near you.
              </p>
              <Link
                to="/events"
                className="inline-block px-8 py-4 rounded-xl bg-white text-violet-600 font-semibold hover:bg-slate-100 transition-all transform hover:scale-105 shadow-xl"
              >
                Browse Events Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
