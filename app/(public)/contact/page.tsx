'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

const contactDetails = [
    {
        icon: Phone,
        label: 'Call Us',
        value: '+256 772 560 696',
        sub: 'Available 24 hours',
    },
    {
        icon: Mail,
        label: 'Email',
        value: 'info@josephinehaven.com',
        sub: 'We reply within 24 hours',
    },
    {
        icon: MapPin,
        label: 'Location',
        value: 'Seguku, Entebbe Road',
        sub: 'Kampala, Uganda',
    },
    {
        icon: Clock,
        label: 'Availability',
        value: '24 / 7 Concierge',
        sub: 'Always at your service',
    },
];

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production this would post to an API endpoint
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-[#F5F0E6]">
            {/* Hero Banner */}
            <section className="relative bg-[#0F2C23] pt-40 pb-32 overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A05B]/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C9A05B]/3 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="inline-block px-4 py-1.5 rounded-full border border-[#C9A05B]/30 bg-[#C9A05B]/10 text-[#C9A05B] text-xs font-bold tracking-[0.3em] uppercase mb-8 backdrop-blur-md"
                    >
                        Get in Touch
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="text-6xl md:text-7xl lg:text-8xl font-light text-white leading-tight mb-6"
                    >
                        We&apos;d Love to{' '}
                        <span className="italic font-serif text-[#C9A05B]">Hear</span>{' '}
                        From You
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="text-lg text-gray-300 font-light max-w-2xl mx-auto leading-relaxed"
                    >
                        Whether you&apos;re planning a stay, have a question about our suites, or simply want to say hello — our concierge team is always ready.
                    </motion.p>
                </div>
            </section>

            {/* Contact Cards Row */}
            <section className="max-w-7xl mx-auto px-6 -mt-16 mb-20 relative z-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {contactDetails.map((detail, i) => (
                        <motion.div
                            key={detail.label}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: i * 0.1 }}
                            className="bg-white rounded-[28px] p-8 shadow-xl border border-gray-100 hover:border-[#C9A05B]/30 hover:shadow-2xl transition-all duration-500 group"
                        >
                            <div className="w-12 h-12 rounded-full bg-[#0F2C23]/5 flex items-center justify-center mb-6 group-hover:bg-[#C9A05B] transition-colors duration-500">
                                <detail.icon size={20} className="text-[#C9A05B] group-hover:text-white transition-colors duration-500" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#C9A05B] mb-2">{detail.label}</p>
                            <p className="text-[#0F2C23] font-medium text-base mb-1">{detail.value}</p>
                            <p className="text-gray-400 text-sm font-light">{detail.sub}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Main Form + Map Section */}
            <section className="max-w-7xl mx-auto px-6 pb-32">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Inquiry Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9 }}
                        className="lg:col-span-7"
                    >
                        <div className="bg-[#0F2C23] rounded-[40px] p-10 md:p-14 relative overflow-hidden">
                            {/* Decorative glow */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A05B]/10 rounded-full blur-[100px] pointer-events-none" />

                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-light text-white mb-2">Send an Enquiry</h2>
                                <p className="text-gray-400 font-light mb-10">Our team will personally respond within 24 hours.</p>

                                {submitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-16 space-y-6"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-[#C9A05B]/10 border border-[#C9A05B]/30 flex items-center justify-center mx-auto">
                                            <CheckCircle2 size={36} className="text-[#C9A05B]" />
                                        </div>
                                        <h3 className="text-2xl font-light text-white">Message Received!</h3>
                                        <p className="text-gray-400 font-light max-w-sm mx-auto">
                                            Thank you for reaching out. A member of our concierge team will be in touch with you shortly.
                                        </p>
                                        <button
                                            onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                                            className="inline-flex items-center gap-2 text-[#C9A05B] border border-[#C9A05B]/30 px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#C9A05B] hover:text-[#0F2C23] transition-colors"
                                        >
                                            Send Another
                                        </button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                                                <input
                                                    name="name"
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="Jane Doe"
                                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 h-12 px-4 rounded-xl focus:outline-none focus:border-[#C9A05B] transition-colors font-light text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Phone</label>
                                                <input
                                                    name="phone"
                                                    value={form.phone}
                                                    onChange={handleChange}
                                                    placeholder="+256 700 000 000"
                                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 h-12 px-4 rounded-xl focus:outline-none focus:border-[#C9A05B] transition-colors font-light text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email</label>
                                            <input
                                                name="email"
                                                type="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="jane@example.com"
                                                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 h-12 px-4 rounded-xl focus:outline-none focus:border-[#C9A05B] transition-colors font-light text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Subject</label>
                                            <select
                                                name="subject"
                                                value={form.subject}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/10 text-gray-300 h-12 px-4 rounded-xl focus:outline-none focus:border-[#C9A05B] transition-colors font-light text-sm appearance-none"
                                            >
                                                <option value="" className="bg-[#0F2C23]">Select a topic…</option>
                                                <option value="booking" className="bg-[#0F2C23]">Suite Booking</option>
                                                <option value="viewing" className="bg-[#0F2C23]">Arrange a Viewing</option>
                                                <option value="events" className="bg-[#0F2C23]">Events & Dining</option>
                                                <option value="longstay" className="bg-[#0F2C23]">Long Stay Discounts</option>
                                                <option value="other" className="bg-[#0F2C23]">General Enquiry</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Message</label>
                                            <textarea
                                                name="message"
                                                value={form.message}
                                                onChange={handleChange}
                                                rows={5}
                                                placeholder="Tell us how we can help…"
                                                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:border-[#C9A05B] transition-colors font-light text-sm resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="group inline-flex items-center gap-3 bg-[#C9A05B] hover:bg-white text-[#0F2C23] px-8 py-4 rounded-full font-bold text-xs uppercase tracking-[0.2em] transition-all duration-500 mt-4"
                                        >
                                            <Send size={14} />
                                            Send Message
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side: Map + Hours */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9 }}
                        className="lg:col-span-5 space-y-8"
                    >
                        {/* Map Embed Card */}
                        <div className="rounded-[32px] overflow-hidden shadow-2xl bg-white border border-gray-100 aspect-[4/3]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7547316428!2d32.5618!3d0.2717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMCcxOC44Ik4gMzLCsDMzJzQyLjUiRQ!5e0!3m2!1sen!2sug!4v1620000000000!5m2!1sen!2sug"
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: '280px' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Josephine Haven Location"
                            />
                        </div>

                        {/* Hours Card */}
                        <div className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-100 space-y-6">
                            <h3 className="text-xl font-light text-[#0F2C23]">Concierge Hours</h3>
                            <div className="space-y-3 divide-y divide-gray-50">
                                {[
                                    { day: 'Monday – Friday', hours: '8:00 AM – 9:00 PM' },
                                    { day: 'Saturday', hours: '9:00 AM – 8:00 PM' },
                                    { day: 'Sunday', hours: '10:00 AM – 6:00 PM' },
                                    { day: 'Reception / Security', hours: 'Open 24 / 7' },
                                ].map(({ day, hours }) => (
                                    <div key={day} className="flex justify-between pt-3 first:pt-0">
                                        <span className="text-sm text-gray-500 font-light">{day}</span>
                                        <span className="text-sm text-[#0F2C23] font-medium">{hours}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Strip */}
                        <div className="bg-[#C9A05B] rounded-[28px] p-8 text-[#0F2C23] shadow-xl">
                            <h4 className="font-serif text-xl italic mb-2">Prefer to call?</h4>
                            <p className="text-sm font-light mb-5 opacity-80">Our team is always delighted to assist over a direct call.</p>
                            <a href="tel:+256772560696" className="inline-flex items-center gap-2 bg-[#0F2C23] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#0F2C23] transition-all duration-500">
                                <Phone size={14} />
                                +256 772 560 696
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
