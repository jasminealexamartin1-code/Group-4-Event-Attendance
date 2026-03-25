import { Target, Zap, Users, Heart, TrendingUp, Shield } from 'lucide-react';

export function About() {
  const values = [
    {
      icon: Target,
      title: 'Mission Driven',
      description: 'Streamlining event management to create seamless experiences for everyone.',
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      icon: Zap,
      title: 'Innovation First',
      description: 'Leveraging cutting-edge technology to solve real-world attendance challenges.',
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      icon: Users,
      title: 'Community Focused',
      description: 'Building connections and fostering collaboration through events.',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      icon: Heart,
      title: 'User Centric',
      description: 'Designing with empathy and prioritizing user experience in every feature.',
      gradient: 'from-rose-500 to-pink-600',
    },
  ];

  const team = [
    { name: 'Alex Rivera', role: 'Founder & CEO', avatar: '👨‍💼', gradient: 'from-violet-500 to-fuchsia-500' },
    { name: 'Sarah Chen', role: 'Head of Product', avatar: '👩‍💻', gradient: 'from-cyan-500 to-blue-500' },
    { name: 'Marcus Johnson', role: 'Lead Developer', avatar: '👨‍🔬', gradient: 'from-emerald-500 to-teal-500' },
    { name: 'Emily Davis', role: 'UX Designer', avatar: '👩‍🎨', gradient: 'from-amber-500 to-orange-500' },
    { name: 'David Kim', role: 'Marketing Director', avatar: '👨‍💼', gradient: 'from-pink-500 to-rose-500' },
    { name: 'Lisa Wang', role: 'Customer Success', avatar: '👩‍💼', gradient: 'from-indigo-500 to-purple-500' },
  ];

  const milestones = [
    { year: '2024', title: 'Foundation', description: 'EvenTrack was founded with a vision to revolutionize event management.' },
    { year: '2025', title: 'Growth', description: 'Reached 10,000+ active users and 1,000+ events managed.' },
    { year: '2026', title: 'Expansion', description: 'Launched advanced analytics and multi-platform integration.' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-block px-4 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-semibold">
              ABOUT US
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white">
              Transforming Events Through{' '}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Technology
              </span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              We're on a mission to make event attendance tracking simple, efficient, and engaging for 
              organizers and attendees alike. Our platform brings together innovation, reliability, and 
              user experience to create the ultimate event management solution.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white">Our Story</h2>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  EvenTrack was born from a simple observation: event management shouldn't be complicated. 
                  Too often, organizers struggled with cumbersome systems, while attendees faced confusing 
                  registration processes.
                </p>
                <p>
                  We set out to change that. Our team of passionate developers, designers, and event 
                  professionals came together to build a platform that puts user experience first. 
                  Every feature, every design decision, and every line of code is crafted with one goal: 
                  making events better for everyone.
                </p>
                <p>
                  Today, EvenTrack powers thousands of events worldwide, from small workshops to large-scale 
                  conferences. But we're just getting started.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 backdrop-blur-sm">
                    <TrendingUp className="w-8 h-8 text-violet-400 mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">150+</div>
                    <div className="text-sm text-slate-400">Active Events</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-white/10 backdrop-blur-sm">
                    <Users className="w-8 h-8 text-cyan-400 mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">25K+</div>
                    <div className="text-sm text-slate-400">Happy Users</div>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-white/10 backdrop-blur-sm">
                    <Shield className="w-8 h-8 text-emerald-400 mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">99.9%</div>
                    <div className="text-sm text-slate-400">Uptime</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-white/10 backdrop-blur-sm">
                    <Heart className="w-8 h-8 text-amber-400 mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">4.9/5</div>
                    <div className="text-sm text-slate-400">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-white/5 to-transparent">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold mb-4">
              OUR VALUES
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">What We Stand For</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Our core values guide every decision we make and shape the culture of our team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                >
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${value.gradient} mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-semibold mb-4">
              OUR JOURNEY
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Milestones & Achievements</h2>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg">
                    {milestone.year}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-gradient-to-b from-violet-500 to-transparent mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                    <p className="text-slate-400">{milestone.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-white/5 to-transparent">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-sm font-semibold mb-4">
              OUR TEAM
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Meet the People Behind EvenTrack</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A diverse team of passionate individuals dedicated to transforming event management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center group"
              >
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {member.avatar}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                <p className="text-slate-400 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 backdrop-blur-sm overflow-hidden text-center space-y-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/30 rounded-full blur-3xl" />
            
            <div className="relative">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Want to Join Our Journey?
              </h2>
              <p className="text-slate-300 text-lg mb-8">
                We're always looking for talented individuals who share our passion for creating exceptional event experiences.
              </p>
              <a
                href="mailto:careers@eventrack.com"
                className="inline-block px-8 py-4 rounded-xl bg-white text-violet-600 font-semibold hover:bg-slate-100 transition-all transform hover:scale-105 shadow-xl"
              >
                View Open Positions
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
