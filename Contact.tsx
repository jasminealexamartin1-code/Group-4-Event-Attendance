import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'info@eventrack.com',
      link: 'mailto:info@eventrack.com',
      gradient: 'from-violet-500 to-fuchsia-500',
    },
    {
      icon: Phone,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: MapPin,
      title: 'Address',
      details: '123 Event Street, Tech City, TC 12345',
      link: 'https://maps.google.com',
      gradient: 'from-emerald-500 to-teal-500',
    },
  ];

  const faq = [
    {
      question: 'How do I register for an event?',
      answer: 'Browse our events page, select an event you\'re interested in, and click the registration button. Fill out the form and you\'ll receive a confirmation email.',
    },
    {
      question: 'Can I cancel my registration?',
      answer: 'Yes, you can cancel your registration up to 24 hours before the event. Contact us with your registration details and we\'ll process the cancellation.',
    },
    {
      question: 'Do I need to bring anything to the event?',
      answer: 'You\'ll receive a confirmation email with a QR code. Simply show this QR code at check-in. Some events may have specific requirements which will be mentioned in the confirmation email.',
    },
    {
      question: 'Are virtual events recorded?',
      answer: 'Most virtual events are recorded and made available to registered attendees after the event. Check the event details for specific recording policies.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="inline-block px-4 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-semibold">
              GET IN TOUCH
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white">
              We'd Love to{' '}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Hear From You
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Have questions, feedback, or need assistance? Our team is here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <a
                  key={index}
                  href={info.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group text-center"
                >
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${info.gradient} mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{info.title}</h3>
                  <p className="text-slate-400">{info.details}</p>
                </a>
              );
            })}
          </div>

          {/* Contact Form & FAQ */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Send Us a Message</h2>
                <p className="text-slate-400">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 backdrop-blur-sm text-center space-y-4">
                  <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
                  <p className="text-slate-300">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
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
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:from-violet-600 hover:to-fuchsia-600 transition-all transform hover:scale-105 shadow-xl shadow-violet-500/50 flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* FAQ */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                <p className="text-slate-400">
                  Quick answers to common questions. Can't find what you're looking for? Send us a message!
                </p>
              </div>

              <div className="space-y-4">
                {faq.map((item, index) => (
                  <details
                    key={index}
                    className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <summary className="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                      <span>{item.question}</span>
                      <span className="text-violet-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="text-slate-400 mt-4 leading-relaxed">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Optional) */}
      <section className="py-20 bg-gradient-to-b from-white/5 to-transparent">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Visit Our Office</h2>
            <p className="text-slate-400">
              Drop by for a coffee and chat about your event needs!
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden border border-white/10">
            <div className="h-96 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <div className="text-center space-y-4">
                <MapPin className="w-16 h-16 text-violet-400 mx-auto" />
                <p className="text-slate-400">Interactive Map</p>
                <p className="text-sm text-slate-500">123 Event Street, Tech City, TC 12345</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
